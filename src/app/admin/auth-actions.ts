'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminAccessCodeValid,
} from '@/lib/admin-auth';
import {
  checkAdminLoginRateLimit,
  clearAdminLoginFailures,
  getClientIpFromHeaders,
  recordAdminLoginFailure,
} from '@/lib/admin-login-rate-limit';

export type AdminLoginState = {
  message: string | null;
};

const LOGIN_FAILURE_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginAdminAction(
  _state: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const headerStore = await headers();
  const ip = getClientIpFromHeaders(
    headerStore.get('x-forwarded-for') ?? headerStore.get('x-real-ip')
  );
  const code = formData.get('code')?.toString().trim() ?? '';
  const rateLimit = checkAdminLoginRateLimit(ip);

  if (!rateLimit.allowed) {
    await sleep(LOGIN_FAILURE_DELAY_MS);
    return {
      message: `로그인 시도가 너무 많습니다. ${(Math.ceil(
        rateLimit.retryAfterMs / 60000
      ) || 1)}분 후 다시 시도해주세요.`,
    };
  }

  if (!code) {
    recordAdminLoginFailure(ip);
    await sleep(LOGIN_FAILURE_DELAY_MS);
    return {
      message: '관리자 입장 코드를 입력해주세요.',
    };
  }

  if (!process.env.ADMIN_ACCESS_CODE?.trim()) {
    await sleep(LOGIN_FAILURE_DELAY_MS);
    return {
      message: '서버에 ADMIN_ACCESS_CODE 환경변수가 설정되어 있지 않습니다.',
    };
  }

  if (!isAdminAccessCodeValid(code)) {
    recordAdminLoginFailure(ip);
    await sleep(LOGIN_FAILURE_DELAY_MS);
    return {
      message: '입장 코드가 올바르지 않습니다.',
    };
  }

  const cookieStore = await cookies();
  const sessionValue = await createAdminSessionValue();
  clearAdminLoginFailures(ip);

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  redirect('/admin/posts');
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
