import Link from 'next/link';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
        >
          메인페이지로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">창민 전용 로그인</h1>
        <p className="text-sm text-gray-600 mb-8">
          저만 들어갈 수 있어요!
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}
