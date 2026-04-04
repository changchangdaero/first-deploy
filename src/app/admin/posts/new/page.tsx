import Link from 'next/link';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import AdminPostForm from '@/components/admin/AdminPostForm';
import { createPostAction } from '@/app/admin/archive-actions';
import { getCategoryTree } from '@/lib/archive';

export default async function NewPostPage() {
  const categories = await getCategoryTree();
  const hasSubcategories = categories.some(
    (category) => category.subcategories.length > 0
  );

  return (
    <main className="portfolio-page">
      <div className="mx-auto max-w-7xl">
        <AdminArchiveNav />

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Post
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            새 포스트 작성
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            메인페이지와 같은 차분한 톤으로 정리된 에디터입니다. 제목 기준 URL은
            자동 생성됩니다.
          </p>
        </div>

        {!hasSubcategories ? (
          <div className="section-card max-w-3xl text-[var(--text-body)]">
            <p>먼저 서브카테고리를 하나 만들어야 포스트를 작성할 수 있습니다.</p>
            <Link
              href="/admin/subcategories/new"
              className="mt-4 inline-flex rounded-full border border-[var(--border-default)] px-4 py-2 text-sm hover:bg-[var(--portfolio-surface-muted)]"
            >
              서브카테고리 만들기
            </Link>
          </div>
        ) : (
          <AdminPostForm
            categories={categories}
            action={createPostAction}
            submitLabel="저장"
          />
        )}
      </div>
    </main>
  );
}
