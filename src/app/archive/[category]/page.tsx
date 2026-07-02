// 아카이브 카테고리 화면: "/archive/[category]"에서 해당 카테고리의 하위 카테고리 카드를 보여줍니다.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  buildArchivePath,
  getCategoryBySlug,
  getPublishedSubcategorySummaries,
  normalizeRouteSlug,
} from '@/lib/archive';
import { formatCountLabel } from '@/lib/count-label';

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categorySlug = normalizeRouteSlug(category);
  const [categoryInfo, subcategories] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPublishedSubcategorySummaries(categorySlug),
  ]);

  if (!categoryInfo) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="archive-shell">
        <header className="archive-header">
          <div>
            <p className="section-eyebrow">Category</p>
            <h1>{categoryInfo.name}</h1>
            <p>이 주제 안에서 이어진 하위 기록을 모았습니다.</p>
          </div>
        </header>

        <section className="archive-grid" aria-label="하위 카테고리">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={buildArchivePath({
                categorySlug: categoryInfo.slug,
                subcategorySlug: subcategory.slug,
              })}
              className="archive-card"
            >
              <h2>{subcategory.name}</h2>
              {subcategory.subtitle && <p>{subcategory.subtitle}</p>}
              <p>{formatCountLabel(subcategory.postCount, 'post')}</p>
            </Link>
          ))}

          {subcategories.length === 0 && (
            <div className="section-card text-[var(--text-muted)]">
              아직 공개된 글이 있는 하위 카테고리가 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
