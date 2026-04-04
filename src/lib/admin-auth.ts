import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function getAdminAccessCode() {
  return process.env.ADMIN_ACCESS_CODE?.trim() ?? '';
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminSessionValue() {
  const accessCode = getAdminAccessCode();

  if (!accessCode) {
    throw new Error('ADMIN_ACCESS_CODE 환경변수가 설정되지 않았습니다.');
  }

  return sha256Hex(`${accessCode}::admin-session`);
}

export function isAdminAccessCodeValid(input: string) {
  const accessCode = getAdminAccessCode();

  if (!accessCode) {
    return false;
  }

  return input.trim() === accessCode;
}

export async function isAdminRequestAuthenticated(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  const expected = await createAdminSessionValue();

  return cookieValue === expected;
}
