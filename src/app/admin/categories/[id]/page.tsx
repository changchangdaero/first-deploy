// 관리자 카테고리 상세 리다이렉트: "/admin/categories/[id]" 접근 시 해당 수정 화면으로 이동시킵니다.
import { redirect } from 'next/navigation';

export default async function CategoryRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/admin/categories/${id}/edit`);
}
