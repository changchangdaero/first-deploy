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
