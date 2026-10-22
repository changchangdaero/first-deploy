// 방문자 통계 API: 공개 사이트에 표시되는 오늘/전체 방문자 카운터를 제공합니다.
import { NextResponse } from 'next/server';
import { getVisitorStats, recordVisitorObservation } from '@/lib/visitors';
import type { VisitorTrackingPayload } from '@/types/visitor';

const fallbackStats = {
  today: 0,
  total: 0,
};

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Visitors GET error:', error);
    return NextResponse.json({
      ...fallbackStats,
      error:
        error instanceof Error
          ? error.message
          : '방문자 통계를 불러오지 못했습니다.',
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VisitorTrackingPayload;
    const visitorId = body.visitorId?.trim() ?? '';

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 명확한 봇은 분석 로그에만 남기고 공개 방문자 카운트에서는 제외합니다.
    const stats = await recordVisitorObservation(request, { ...body, visitorId });
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Visitors POST error:', error);
    return NextResponse.json({
      ...fallbackStats,
      error:
        error instanceof Error
          ? error.message
          : '방문 기록 저장 중 문제가 발생했습니다.',
    });
  }
}
