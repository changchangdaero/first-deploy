import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildArchivePath, getPublishedPostsForSubcategory } from '@/lib/archive';

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

      <div className="w-full space-y-4">
        {result.posts.map((post) => (
          <Link
            key={post.id}
            href={buildArchivePath({
              categorySlug: result.category.slug,
              subcategorySlug: result.subcategory.slug,
              postSlug: post.slug,
            })}
            className="section-card block transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-heading)]">{post.title}</h2>
            {post.excerpt && (
              <p className="mt-2 text-[var(--text-body)]">{post.excerpt}</p>
            )}
            <p className="mt-3 text-sm text-[var(--text-faint)]">
              {new Date(post.created_at).toLocaleDateString('ko-KR')}
            </p>
          </Link>
        ))}

        {result.posts.length === 0 && (
          <div className="section-card text-[var(--text-muted)]">
            아직 공개된 글이 없습니다.
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
