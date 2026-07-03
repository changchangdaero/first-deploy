// 관리자 카테고리 수정 화면: "/admin/categories/[id]/edit"에서 카테고리 정보를 수정합니다.
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

            <label className="flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4 text-sm text-[var(--text-body)]">
              <input
                type="checkbox"
                name="published"
                defaultChecked={category.published}
                className="mt-1 h-4 w-4 accent-[var(--primary)]"
              />
              <span>
                <span className="block font-semibold text-[var(--text-heading)]">
                  공개 상태로 표시
                </span>
                <span className="mt-1 block text-[var(--text-muted)]">
                  꺼두면 archive 목록과 공개 카테고리 URL에서 숨깁니다.
                </span>
              </span>
            </label>

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
