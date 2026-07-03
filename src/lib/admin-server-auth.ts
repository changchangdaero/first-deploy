// 관리자 서버 인증: Server Components와 Server Actions에서 관리자 세션 쿠키를 확인합니다.
import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
} from '@/lib/admin-auth';

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return false;
  }

  try {
    const expectedSession = await createAdminSessionValue();

    return sessionCookie === expectedSession;
  } catch {
    return false;
  }
}

export async function requireAdminAuthenticated() {
  if (!(await isAdminAuthenticated())) {
    throw new Error('관리자 인증이 필요합니다.');
  }
}
