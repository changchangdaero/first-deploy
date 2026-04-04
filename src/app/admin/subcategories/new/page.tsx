import Link from 'next/link';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { createSubcategoryAction } from '@/app/admin/archive-actions';
import { getAllCategories } from '@/lib/archive';

export default async function NewSubcategoryPage() {
  const categories = await getAllCategories();

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-3xl">
        <AdminArchiveNav />

        <section className="section-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Subcategory
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            새 서브카테고리 생성
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            상위 카테고리를 고른 뒤 이름만 입력하면 URL 슬러그는 자동 생성됩니다.
          </p>

          {categories.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] p-6 text-[var(--text-body)]">
              <p>먼저 카테고리를 하나 만들어야 합니다.</p>
              <Link
                href="/admin/categories/new"
                className="mt-4 inline-flex rounded-full border border-[var(--border-default)] px-4 py-2 text-sm hover:bg-white"
              >
                카테고리 만들기
              </Link>
            </div>
          ) : (
            <form action={createSubcategoryAction} className="mt-8 space-y-6">
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
                  className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    카테고리를 선택하세요
                  </option>
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
                  placeholder="예: 웨이퍼 편축 보정"
                  className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                  required
                />
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]">
                같은 카테고리 안에서 이름이 겹치면 번호를 붙여 고유한 URL을 만듭니다.
              </div>

              <button
                type="submit"
                className="rounded-full bg-[var(--text-heading)] px-5 py-3 font-medium text-white transition hover:bg-[var(--accent)]"
              >
                저장
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
