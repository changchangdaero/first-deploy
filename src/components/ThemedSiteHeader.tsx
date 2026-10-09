// 서버용 헤더 래퍼: 쿠키의 테마 값을 읽어 섹션별 헤더 설정과 함께 SiteHeader에 넘깁니다.
import SiteHeader from '@/components/SiteHeader';
import type { HeaderConfig } from '@/data/navigation';
import { getInitialTheme } from '@/lib/theme';

export default async function ThemedSiteHeader({ config }: { config: HeaderConfig }) {
  const initialTheme = await getInitialTheme();
  return <SiteHeader {...config} initialTheme={initialTheme} />;
}
