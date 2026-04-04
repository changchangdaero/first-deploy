import { NextResponse } from 'next/server';
import { getVisitorStats, recordVisitorVisit } from '@/lib/visitors';

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
    const body = (await request.json()) as { visitorId?: string };
    const visitorId = body.visitorId?.trim() ?? '';

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId가 필요합니다.' },
        { status: 400 }
      );
    }

    const stats = await recordVisitorVisit(visitorId);
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
