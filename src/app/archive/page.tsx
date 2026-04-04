import Link from 'next/link';
import { buildArchivePath, getPublishedCategorySummaries } from '@/lib/archive';
import { formatCountLabel } from '@/lib/count-label';
import PublicAdminEntryLink from '@/components/admin/PublicAdminEntryLink';

export default async function ArchivePage() {
  const categories = await getPublishedCategorySummaries();

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-4xl">
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Archive
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">실습기록</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            카테고리별로 정리한 기술 기록과 실습 노트를 모아둔 공간입니다.
          </p>
        </div>
        <PublicAdminEntryLink />
      </div>

      <div className="grid w-full gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildArchivePath({ categorySlug: category.slug })}
            className="section-card transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-heading)]">{category.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {formatCountLabel(category.subcategoryCount, 'subcategory')} /{' '}
              {formatCountLabel(category.postCount, 'post')}
            </p>
          </Link>
        ))}

        {categories.length === 0 && (
          <div className="section-card text-[var(--text-muted)]">
            아직 공개된 아카이브가 없습니다.
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
