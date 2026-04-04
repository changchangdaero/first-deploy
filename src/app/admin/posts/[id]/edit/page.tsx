import { notFound } from 'next/navigation';
import { updatePostAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import AdminPostForm from '@/components/admin/AdminPostForm';
import { getCategoryTree, getPostWithRelationsById } from '@/lib/archive';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostWithRelationsById(id),
    getCategoryTree(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="mx-auto max-w-7xl">
        <AdminArchiveNav />

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Post
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            포스트 수정
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            제목을 바꾸면 URL도 자동으로 다시 정리됩니다. 본문과 메타 정보는
            저장 후 바로 archive에 반영됩니다.
          </p>
        </div>

        <AdminPostForm
          categories={categories}
          action={updatePostAction}
          submitLabel="수정 완료"
          initialPost={post}
        />
      </div>
    </main>
  );
}
