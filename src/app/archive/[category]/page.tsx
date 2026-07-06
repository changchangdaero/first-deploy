// 아카이브 카테고리 화면: "/archive/[category]"에서 해당 카테고리의 하위 카테고리 카드를 보여줍니다.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  buildArchivePath,
  getPublishedCategoryWithSubcategories,
  normalizeRouteSlug,
} from '@/lib/archive';

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categorySlug = normalizeRouteSlug(category);
  const result = await getPublishedCategoryWithSubcategories(categorySlug);

  if (!result) {
    notFound();
  }

  const { category: categoryInfo, subcategories } = result;

  return (
    <main className="portfolio-page">
      <div className="archive-shell">
        <header className="archive-header">
          <div>
            <p className="section-eyebrow">Category</p>
            <h1>{categoryInfo.name}</h1>
          
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
            </Link>
          ))}

          {subcategories.length === 0 && (
            <div className="section-card text-[var(--text-muted)]">
              아직 공개된 하위 카테고리가 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
