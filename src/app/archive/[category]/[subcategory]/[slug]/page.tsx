import { notFound } from 'next/navigation';
import MarkdownContent from '@/components/MarkdownContent';
import { getPublishedPostBySlugs } from '@/lib/archive';

type PageProps = {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;
  const post = await getPublishedPostBySlugs(category, subcategory, slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-main max-w-3xl">
        <header className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {post.category.name} / {post.subcategory.name}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[var(--text-heading)]">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-3 text-lg text-[var(--text-muted)]">
              {post.subtitle}
            </p>
          )}
          <p className="mt-3 text-sm text-[var(--text-faint)]">
            {new Date(post.created_at).toLocaleDateString('ko-KR')}
          </p>
        </header>

        <article className="section-card max-w-none">
          <MarkdownContent content={post.content} />
        </article>
      </div>
    </main>
  );
}
