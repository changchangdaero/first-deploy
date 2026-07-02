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
