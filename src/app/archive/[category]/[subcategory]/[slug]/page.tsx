// 아카이브 글 상세 화면: 최종 글 URL에서 Markdown 본문과 손글씨 블록을 보여줍니다.
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
    <main className="portfolio-page portfolio-page--post">
      <article className="post-detail">
        <header className="post-header">
          <p className="section-eyebrow">
            {post.category.name} / {post.subcategory.name}
          </p>
          <h1>{post.title}</h1>
          <p className="post-header__description">
            {new Date(post.created_at).toLocaleDateString('ko-KR')}
          </p>
        </header>

        <div className="post-body-shell">
          <div className="post-body-inner">
            <MarkdownContent
              className="post-content"
              content={post.content}
              handwritingBlocks={post.handwritingBlocks}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
