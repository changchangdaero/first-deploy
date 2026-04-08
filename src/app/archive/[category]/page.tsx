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
      <div className="portfolio-main max-w-4xl">
      <div className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
          Category
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
          {categoryInfo.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          이 카테고리에 속한 서브카테고리 목록입니다.
        </p>
      </div>

      <div className="grid w-full gap-4">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={buildArchivePath({
              categorySlug: categoryInfo.slug,
              subcategorySlug: subcategory.slug,
            })}
            className="section-card transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-heading)]">{subcategory.name}</h2>
            {subcategory.subtitle && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {subcategory.subtitle}
              </p>
            )}
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {formatCountLabel(subcategory.postCount, 'post')}
            </p>
          </Link>
        ))}

        {subcategories.length === 0 && (
          <div className="section-card text-[var(--text-muted)]">
            아직 공개된 글이 있는 서브카테고리가 없습니다.
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
