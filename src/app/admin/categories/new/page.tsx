import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { createCategoryAction } from '@/app/admin/archive-actions';

export default function NewCategoryPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-3xl">
        <AdminArchiveNav />

        <section className="section-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Category
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            새 카테고리 생성
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            카테고리 이름만 입력하면 URL용 슬러그는 자동으로 생성됩니다.
          </p>

          <form action={createCategoryAction} className="mt-8 space-y-6">
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
                placeholder="예: 캡스톤디자인2"
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              />
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]">
              같은 이름이 이미 있으면 뒤에 번호를 붙여 고유한 URL을 자동으로 만듭니다.
            </div>

            <button
              type="submit"
              className="rounded-full bg-[var(--text-heading)] px-5 py-3 font-medium text-white transition hover:bg-[var(--accent)]"
            >
              저장
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
