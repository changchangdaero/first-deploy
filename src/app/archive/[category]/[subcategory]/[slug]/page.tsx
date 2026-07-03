// 아카이브 글 상세 화면: 최종 글 URL에서 Markdown 본문과 손글씨 블록을 보여줍니다.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deletePostAction } from '@/app/admin/archive-actions';
import AdminPostDeleteButton from '@/components/admin/AdminPostDeleteButton';
import MarkdownContent from '@/components/MarkdownContent';
import { getAdminPostBySlugs, getPublishedPostBySlugs } from '@/lib/archive';
import { isAdminAuthenticated } from '@/lib/admin-server-auth';

type PageProps = {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;
  const isAdmin = await isAdminAuthenticated();
  const post = isAdmin
    ? await getAdminPostBySlugs(category, subcategory, slug)
    : await getPublishedPostBySlugs(category, subcategory, slug);

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
          {isAdmin && (
            <div className="post-admin-actions" aria-label="관리자 글 관리">
              <span
                className={
                  post.published
                    ? 'admin-status-badge admin-status-badge--published'
                    : 'admin-status-badge admin-status-badge--private'
                }
              >
                {post.published ? '공개' : '비공개'}
              </span>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="post-admin-action"
              >
                수정
              </Link>
              <AdminPostDeleteButton
                action={deletePostAction}
                id={post.id}
                confirmMessage={`"${post.title}" 글을 삭제할까요?`}
              />
            </div>
          )}
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
