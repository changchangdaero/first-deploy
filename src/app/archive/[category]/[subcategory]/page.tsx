// 아카이브 하위 카테고리 화면: "/archive/[category]/[subcategory]"에서 글 목록을 보여줍니다.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildArchivePath, getPublishedPostsForSubcategory } from '@/lib/archive';
import ArchivePostListItem from '@/components/archive/ArchivePostListItem';

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePageParam(page: string | undefined) {
  const parsedPage = Number.parseInt(page ?? '1', 10);

  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category, subcategory } = await params;
  const { page } = await searchParams;
  const result = await getPublishedPostsForSubcategory(category, subcategory, {
    page: parsePageParam(page),
  });

  if (!result) {
    notFound();
  }

  const archivePath = buildArchivePath({
    categorySlug: result.category.slug,
    subcategorySlug: result.subcategory.slug,
  });

  return (
    <main className="portfolio-page">
      <div className="archive-shell">
        <header className="archive-header">
          <div>
            <p className="section-eyebrow">{result.category.name}</p>
            <h1>{result.subcategory.name}</h1>
           
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

          {result.pagination.hasMore && (
            <div className="archive-load-more-wrap">
              <Link
                href={`${archivePath}?page=${result.pagination.page + 1}`}
                className="archive-load-more"
              >
                더 보기
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
