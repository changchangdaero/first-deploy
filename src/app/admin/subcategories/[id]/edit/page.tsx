import { notFound } from 'next/navigation';
import { updateSubcategoryAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { getAllCategories, getSubcategoryById } from '@/lib/archive';

export default async function EditSubcategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subcategory, categories] = await Promise.all([
    getSubcategoryById(id),
    getAllCategories(),
  ]);

  if (!subcategory) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-3xl">
        <AdminArchiveNav />

        <section className="section-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Subcategory
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            서브카테고리 수정
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            이름 또는 상위 카테고리를 바꾸면 URL 슬러그도 자동으로 다시 생성됩니다.
          </p>

          <form action={updateSubcategoryAction} className="mt-8 space-y-6">
            <input type="hidden" name="id" value={subcategory.id} />

            <div>
              <label
                htmlFor="category_id"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                상위 카테고리
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={subcategory.category_id}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                서브카테고리 이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={subcategory.name}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subtitle"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                소제목
              </label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                defaultValue={subcategory.subtitle ?? ''}
                placeholder="예: 융합기초프로그래밍 학기 과제"
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                카드에서 서브카테고리 이름 아래 보조 설명으로 표시됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]">
              같은 카테고리 안에서 슬러그가 겹치면 번호가 붙은 새 URL이 자동으로 생성됩니다.
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
