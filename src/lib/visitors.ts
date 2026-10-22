import 'server-only';

import { createAdminSupabase } from '@/lib/supabase/admin';
import type {
  VisitorClass,
  VisitorStats,
  VisitorTrackingPayload,
  VisitorVisitLog,
} from '@/types/visitor';

const SEOUL_TIME_ZONE = 'Asia/Seoul';
const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KNOWN_BOT_PATTERN = /bot|crawl|spider|slurp|lighthouse|pagespeed|preview|scrap|yeti|daumoa|facebookexternalhit|embedly/i;
const AUTOMATION_PATTERN = /headless|python|curl|wget|axios|node-fetch|go-http|java\/|okhttp|httpclient|phantom|puppeteer|playwright|selenium/i;

type VisitorAssessment = {
  visitorClass: VisitorClass;
  botScore: number;
  reasons: string[];
};

function isMissingVisitLogTable(error: { code?: string; message?: string }) {
  return error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('visitor_visit_logs');
}

export function getTodayInSeoulDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SEOUL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function isValidVisitorId(visitorId: string) {
  return VISITOR_ID_PATTERN.test(visitorId);
}

function cleanText(value: string | null | undefined, maxLength = 120) {
  const normalized = value?.trim().replace(/[\u0000-\u001f\u007f]/g, '') ?? '';
  return normalized ? normalized.slice(0, maxLength) : null;
}

function cleanLandingPath(value: string | undefined) {
  const path = cleanText(value, 300);
  return path?.startsWith('/') && !path.startsWith('//') ? path : '/';
}

function assessVisitor(userAgent: string): VisitorAssessment {
  if (!userAgent) {
    return { visitorClass: 'bot', botScore: 100, reasons: ['user_agent_missing'] };
  }
  if (KNOWN_BOT_PATTERN.test(userAgent)) {
    return { visitorClass: 'bot', botScore: 100, reasons: ['known_bot_user_agent'] };
  }
  if (AUTOMATION_PATTERN.test(userAgent)) {
    return { visitorClass: 'suspected_bot', botScore: 80, reasons: ['automation_user_agent'] };
  }
  if (!/mozilla|chrome|safari|firefox|edg|opera/i.test(userAgent)) {
    return { visitorClass: 'unknown', botScore: 40, reasons: ['unrecognized_user_agent'] };
  }
  return { visitorClass: 'human_likely', botScore: 10, reasons: ['normal_browser_user_agent'] };
}

function getDeviceType(userAgent: string) {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile';
  if (/mozilla|chrome|safari|firefox|edg|opera/i.test(userAgent)) return 'desktop';
  return 'unknown';
}

function getTrafficSource(payload: VisitorTrackingPayload, request: Request) {
  const utmSource = cleanText(payload.utmSource);
  const utmMedium = cleanText(payload.utmMedium);
  const utmCampaign = cleanText(payload.utmCampaign);

  if (utmSource) {
    return {
      referrerHost: null,
      sourceType: 'campaign',
      sourceLabel: utmSource,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  const referrer = cleanText(payload.referrer, 1_000);
  if (!referrer) {
    return {
      referrerHost: null,
      sourceType: 'direct_or_private',
      sourceLabel: '직접 접속 또는 경로 비공개',
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  try {
    const referrerHost = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
    const requestHost = new URL(request.url).hostname.toLowerCase().replace(/^www\./, '');
    if (referrerHost === requestHost) {
      return {
        referrerHost,
        sourceType: 'internal',
        sourceLabel: '사이트 내부 이동',
        utmSource,
        utmMedium,
        utmCampaign,
      };
    }

    const knownSources: Array<[RegExp, string]> = [
      [/(^|\.)google\./, 'Google 검색'],
      [/(^|\.)search\.naver\.com$/, '네이버 검색'],
      [/(^|\.)daum\.net$/, 'Daum 검색'],
      [/(^|\.)github\.com$/, 'GitHub'],
      [/(^|\.)instagram\.com$/, 'Instagram'],
      [/(^|\.)velog\.io$/, 'Velog'],
      [/(^|\.)brunch\.co\.kr$/, 'Brunch'],
    ];
    const knownSource = knownSources.find(([pattern]) => pattern.test(referrerHost));
    return {
      referrerHost,
      sourceType: knownSource ? 'referral' : 'external',
      sourceLabel: knownSource?.[1] ?? referrerHost,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  } catch {
    return {
      referrerHost: null,
      sourceType: 'invalid_referrer',
      sourceLabel: '잘못된 유입 정보',
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const supabase = createAdminSupabase();
  const today = getTodayInSeoulDate();
  const [{ count: todayCount, error: todayError }, { count: totalCount, error: totalError }] = await Promise.all([
    supabase.from('visitor_daily_visits').select('visitor_id', { count: 'exact', head: true }).eq('visit_date', today),
    supabase.from('visitor_daily_visits').select('visitor_id', { count: 'exact', head: true }),
  ]);
  if (todayError) throw new Error(todayError.message);
  if (totalError) throw new Error(totalError.message);
  return { today: todayCount ?? 0, total: totalCount ?? 0 };
}

export async function recordVisitorVisit(visitorId: string) {
  if (!isValidVisitorId(visitorId)) throw new Error('유효하지 않은 visitor id 입니다.');
  const supabase = createAdminSupabase();
  const { error } = await supabase.from('visitor_daily_visits').upsert(
    { visitor_id: visitorId, visit_date: getTodayInSeoulDate(), visited_at: new Date().toISOString() },
    { onConflict: 'visitor_id,visit_date', ignoreDuplicates: false }
  );
  if (error) throw new Error(error.message);
  return getVisitorStats();
}

export async function recordVisitorObservation(
  request: Request,
  payload: VisitorTrackingPayload & { visitorId: string }
) {
  if (!isValidVisitorId(payload.visitorId)) throw new Error('유효하지 않은 visitor id 입니다.');

  const supabase = createAdminSupabase();
  const visitDate = getTodayInSeoulDate();
  const now = new Date().toISOString();
  const userAgent = cleanText(request.headers.get('user-agent'), 500) ?? '';
  const assessment = assessVisitor(userAgent);
  const source = getTrafficSource(payload, request);
  const [{ data: existing, error: existingError }, { count: priorCount, error: priorError }] = await Promise.all([
    supabase.from('visitor_visit_logs').select('visitor_id').eq('visitor_id', payload.visitorId).eq('visit_date', visitDate).maybeSingle(),
    supabase.from('visitor_daily_visits').select('visitor_id', { count: 'exact', head: true }).eq('visitor_id', payload.visitorId).lt('visit_date', visitDate),
  ]);
  if (existingError) {
    if (isMissingVisitLogTable(existingError)) {
      return assessment.visitorClass === 'bot' ? getVisitorStats() : recordVisitorVisit(payload.visitorId);
    }
    throw new Error(existingError.message);
  }
  if (priorError) throw new Error(priorError.message);

  const commonLog = {
    last_visited_at: now,
    visitor_class: assessment.visitorClass,
    bot_score: assessment.botScore,
    classification_reasons: assessment.reasons,
    device_type: getDeviceType(userAgent),
    user_agent: userAgent || null,
  };
  const logResult = existing
    ? await supabase.from('visitor_visit_logs').update(commonLog).eq('visitor_id', payload.visitorId).eq('visit_date', visitDate)
    : await supabase.from('visitor_visit_logs').insert({
        visitor_id: payload.visitorId,
        visit_date: visitDate,
        first_visited_at: now,
        landing_path: cleanLandingPath(payload.landingPath),
        referrer_host: source.referrerHost,
        source_type: source.sourceType,
        source_label: source.sourceLabel,
        utm_source: source.utmSource,
        utm_medium: source.utmMedium,
        utm_campaign: source.utmCampaign,
        is_returning: (priorCount ?? 0) > 0,
        ...commonLog,
      });
  if (logResult.error && logResult.error.code !== '23505') throw new Error(logResult.error.message);

  return assessment.visitorClass === 'bot' ? getVisitorStats() : recordVisitorVisit(payload.visitorId);
}

export async function getAdminVisitorLogs(limit = 250): Promise<VisitorVisitLog[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('visitor_visit_logs')
    .select('*')
    .order('last_visited_at', { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 500));
  if (error) {
    if (isMissingVisitLogTable(error)) return [];
    throw new Error(error.message);
  }
  return (data ?? []) as VisitorVisitLog[];
}
