// 방문자 통계 API: 공개 사이트에 표시되는 오늘/전체 방문자 카운터를 제공합니다.
import { NextResponse } from 'next/server';
import { getVisitorStats, recordVisitorVisit } from '@/lib/visitors';

const fallbackStats = {
  today: 0,
  total: 0,
};

// 검색엔진 크롤러, 링크 미리보기, 자동화 도구는 방문자로 세지 않습니다.
// (User-Agent가 비어 있는 요청도 실제 브라우저가 아니므로 제외합니다.)
const BOT_USER_AGENT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|scrap|yeti|daumoa|facebookexternalhit|embedly|python|curl|wget|axios|node-fetch|go-http|java\/|okhttp|httpclient|phantom|puppeteer|playwright|selenium/i;

function isBotRequest(request: Request) {
  const userAgent = request.headers.get('user-agent')?.trim() ?? '';
  return !userAgent || BOT_USER_AGENT_PATTERN.test(userAgent);
}

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

    // 봇이면 기록하지 않고 현재 통계만 돌려줍니다.
    const stats = isBotRequest(request) ? await getVisitorStats() : await recordVisitorVisit(visitorId);
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
