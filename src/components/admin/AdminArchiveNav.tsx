// 관리자 아카이브 내비게이션: 카테고리, 하위 카테고리, 글 관리 화면에서 쓰는 공통 이동 링크입니다.
import Link from 'next/link';
import { logoutAdminAction } from '@/app/admin/auth-actions';

const navItems = [
  { href: '/admin/categories', label: '카테고리' },
  { href: '/admin/subcategories', label: '서브카테고리' },
  { href: '/admin/posts', label: '포스트' },
];

export default function AdminArchiveNav() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <nav className="flex flex-wrap gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-4 py-2 rounded-full border text-sm hover:bg-gray-50 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={logoutAdminAction}>
        <button
          type="submit"
          className="whitespace-nowrap px-4 py-2 rounded-full border text-sm hover:bg-gray-50 transition"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
