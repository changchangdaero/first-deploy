import { notFound } from 'next/navigation';
import { updateCategoryAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { getCategoryById } from '@/lib/archive';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-3xl">
        <AdminArchiveNav />

        <section className="section-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Category
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            카테고리 수정
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            이름을 바꾸면 URL 슬러그도 현재 이름 기준으로 다시 정리됩니다.
          </p>

          <form action={updateCategoryAction} className="mt-8 space-y-6">
            <input type="hidden" name="id" value={category.id} />

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                카테고리 이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={category.name}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              />
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]">
              기존 이름과 같은 슬러그가 이미 있다면 자동으로 번호가 붙습니다.
            </div>

            <button
              type="submit"
              className="rounded-full bg-[var(--text-heading)] px-5 py-3 font-medium text-white transition hover:bg-[var(--accent)]"
            >
              수정 완료
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
