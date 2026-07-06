// 아카이브 첫 화면: "/archive"에서 공개 기술 글의 카테고리 그리드를 보여줍니다.
import Link from 'next/link';

import PublicAdminEntryLink from '@/components/admin/PublicAdminEntryLink';
import { buildArchivePath, getPublishedCategorySummaries } from '@/lib/archive';
import { formatCountLabel } from '@/lib/count-label';

export default async function ArchivePage() {
  const categories = await getPublishedCategorySummaries();

  return (
    <main className="portfolio-page">
      <div className="archive-shell">
        <header className="archive-header">
          <div>
            <p className="section-eyebrow">Archive</p>
            <h1>Field Notes</h1>
            
          </div>
          <PublicAdminEntryLink />
        </header>

        <section className="archive-grid" aria-label="기술 기록 카테고리">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildArchivePath({ categorySlug: category.slug })}
              className="archive-card"
            >
              <h2>{category.name}</h2>
              <p>
                {formatCountLabel(category.subcategoryCount, 'subcategory')} /{' '}
                {formatCountLabel(category.postCount, 'post')}
              </p>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="section-card text-[var(--text-muted)]">
              아직 공개된 기술 기록이 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
