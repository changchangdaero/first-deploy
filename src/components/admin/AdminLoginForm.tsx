'use client';

// 관리자 로그인 폼: "/admin/login" 접근 코드 화면의 입력 상태와 제출 버튼을 담당합니다.
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
    <form action={formAction} className="mt-6 grid gap-3.5 sm:mt-8 sm:gap-4">
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-semibold text-[var(--text-heading)]"
        >
          관리자 입장 코드
        </label>
        <input
          id="code"
          name="code"
          type="password"
          placeholder="입장 코드를 입력하세요"
          autoComplete="current-password"
          className="w-full rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-2.5 text-[0.95rem] text-[var(--text-heading)] shadow-[var(--shadow-sm)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--accent-ring)] sm:py-3"
          required
        />
      </div>

      {state.message && (
        <div className="rounded-[var(--radius-card)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-700 [html[data-theme='dark']_&]:text-red-200">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-[var(--text-heading)] bg-[var(--text-heading)] px-5 py-2.5 font-bold text-[var(--portfolio-bg)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-ring)] disabled:cursor-wait disabled:opacity-60 sm:min-h-12 sm:py-3"
      >
        {isPending ? '확인 중...' : '로그인'}
      </button>
    </form>
  );
}
