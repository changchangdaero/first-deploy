import { notFound } from 'next/navigation';
import { buildArchivePath, getPublishedPostsForSubcategory } from '@/lib/archive';
import ArchivePostListItem from '@/components/archive/ArchivePostListItem';

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  const result = await getPublishedPostsForSubcategory(category, subcategory);

  if (!result) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-4xl">
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {result.category.name}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text-heading)]">
            {result.subcategory.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            이 서브카테고리에 공개된 포스트 목록입니다.
          </p>
        </div>

        <div className="w-full divide-y divide-[var(--border-default)] border-t border-[var(--border-default)]">
          {result.posts.map((post) => (
            <ArchivePostListItem
              key={post.id}
              post={post}
              href={buildArchivePath({
                categorySlug: result.category.slug,
                subcategorySlug: result.subcategory.slug,
                postSlug: post.slug,
              })}
            />
          ))}

          {result.posts.length === 0 && (
            <div className="py-8 text-[var(--text-muted)]">
              아직 공개된 글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
