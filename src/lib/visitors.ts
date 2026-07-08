// 방문자 통계 데이터 계층: 일별 방문을 기록하고 공개 카운터의 오늘/누적 방문 수치를 읽습니다.
import 'server-only';

import { createAdminSupabase } from '@/lib/supabase/admin';
import type { VisitorStats } from '@/types/visitor';

const SEOUL_TIME_ZONE = 'Asia/Seoul';
const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export async function getVisitorStats(): Promise<VisitorStats> {
  const supabase = createAdminSupabase();
  const today = getTodayInSeoulDate();

  const [{ count: todayCount, error: todayError }, { count: totalCount, error: totalError }] =
    await Promise.all([
      supabase
        .from('visitor_daily_visits')
        .select('visitor_id', { count: 'exact', head: true })
        .eq('visit_date', today),
      supabase
        .from('visitor_daily_visits')
        .select('visitor_id', { count: 'exact', head: true }),
    ]);

  if (todayError) {
    throw new Error(todayError.message);
  }

  if (totalError) {
    throw new Error(totalError.message);
  }

  return {
    today: todayCount ?? 0,
    total: totalCount ?? 0,
  };
}

export async function recordVisitorVisit(visitorId: string) {
  if (!isValidVisitorId(visitorId)) {
    throw new Error('유효하지 않은 visitor id 입니다.');
  }

  const supabase = createAdminSupabase();
  const now = new Date().toISOString();
  const visitDate = getTodayInSeoulDate();

  const { error } = await supabase.from('visitor_daily_visits').upsert(
    {
      visitor_id: visitorId,
      visit_date: visitDate,
      visited_at: now,
    },
    {
      onConflict: 'visitor_id,visit_date',
      ignoreDuplicates: false,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return getVisitorStats();
}
