// 관리자 로그인 화면: "/admin/login"에서 소유자 전용 접근 코드를 입력받습니다.
import Link from 'next/link';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[calc(100vh_-_var(--site-header-height))] items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6">
      <section className="w-[calc(100%_-_32px)] max-w-[360px] overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--portfolio-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:max-w-[420px] [html[data-theme='dark']_&]:shadow-[0_22px_70px_rgba(0,0,0,0.46)]">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm leading-6 text-[var(--text-muted)] no-underline transition hover:text-[var(--primary-dark)] focus-visible:text-[var(--primary-dark)]"
          >
            메인페이지로 돌아가기
          </Link>

          <h1 className="mt-4 text-[1.65rem] font-bold leading-tight text-[var(--text-heading)] sm:text-3xl">
            창민 전용 로그인
          </h1>
          <p className="mt-3 text-[0.9rem] leading-7 text-[var(--text-muted)] sm:text-[0.95rem]">
            저만 들어갈 수 있어요!
          </p>

          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
