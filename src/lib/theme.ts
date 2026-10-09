// 테마 초기값: 쿠키에 저장된 테마를 읽어 서버 렌더링 시점의 라이트/다크 값을 정합니다.
import { cookies } from 'next/headers';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'portfolio-theme';

export async function getInitialTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  return cookieStore.get(THEME_STORAGE_KEY)?.value === 'dark' ? 'dark' : 'light';
}
