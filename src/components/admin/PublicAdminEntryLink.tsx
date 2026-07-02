// 공개 관리자 진입 링크: 아카이브 화면에서 소유자가 관리자 영역으로 이동하는 작은 바로가기입니다.
import Link from 'next/link';

export default function PublicAdminEntryLink() {
  return (
    <Link
      href="/admin/login"
      className="inline-flex items-center whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm transition hover:border-gray-900 hover:text-gray-900"
    >
      로그인
    </Link>
  );
}
