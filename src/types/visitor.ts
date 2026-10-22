// 방문자 통계 타입: 오늘/전체 카운터의 DB 행과 API 응답 데이터 구조입니다.
export type VisitorDailyVisit = {
  visitor_id: string;
  visit_date: string;
  visited_at: string;
};

export type VisitorStats = {
  today: number;
  total: number;
};

export type VisitorClass =
  | 'human_likely'
  | 'bot'
  | 'suspected_bot'
  | 'unknown';

export type VisitorTrackingPayload = {
  visitorId?: string;
  landingPath?: string;
  referrer?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

export type VisitorVisitLog = {
  visitor_id: string;
  visit_date: string;
  first_visited_at: string;
  last_visited_at: string;
  landing_path: string;
  referrer_host: string | null;
  source_type: string;
  source_label: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_type: string;
  is_returning: boolean;
  visitor_class: VisitorClass;
  bot_score: number;
  classification_reasons: string[];
  user_agent: string | null;
};
