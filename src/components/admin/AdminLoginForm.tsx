'use client';

import { useActionState } from 'react';
import { loginAdminAction, type AdminLoginState } from '@/app/admin/auth-actions';

const initialState: AdminLoginState = {
  message: null,
};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-800 mb-2"
        >
          관리자 입장 코드
        </label>
        <input
          id="code"
          name="code"
          type="password"
          placeholder="입장 코드를 입력하세요"
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-gray-900"
          required
        />
      </div>

      {state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {isPending ? '확인 중...' : '로그인'}
      </button>
    </form>
  );
}
