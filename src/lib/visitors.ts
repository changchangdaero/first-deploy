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

  const [{ count: todayCount, error: todayError }, { data, error: totalError }] =
    await Promise.all([
      supabase
        .from('visitor_daily_visits')
        .select('visitor_id', { count: 'exact', head: true })
        .eq('visit_date', today),
      supabase.from('visitor_daily_visits').select('visitor_id'),
    ]);

  if (todayError) {
    throw new Error(todayError.message);
  }

  if (totalError) {
    throw new Error(totalError.message);
  }

  const uniqueVisitors = new Set((data ?? []).map((row) => row.visitor_id));

  return {
    today: todayCount ?? 0,
    total: uniqueVisitors.size,
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
