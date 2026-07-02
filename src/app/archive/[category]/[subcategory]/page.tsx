// 아카이브 하위 카테고리 화면: "/archive/[category]/[subcategory]"에서 글 목록을 보여줍니다.
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
      <div className="archive-shell">
        <header className="archive-header">
          <div>
            <p className="section-eyebrow">{result.category.name}</p>
            <h1>{result.subcategory.name}</h1>
            <p>공개된 기록을 최신순으로 정리했습니다.</p>
          </div>
        </header>

        <section className="archive-list" aria-label="글 목록">
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
        </section>
      </div>
    </main>
  );
}
