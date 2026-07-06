/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { PostListItemWithRelations } from '@/types/post';

type ArchivePostListItemProps = {
  href: string;
  post: PostListItemWithRelations;
};

export default function ArchivePostListItem({
  href,
  post,
}: ArchivePostListItemProps) {
  const thumbnailUrl = post.thumbnail_url?.trim() || null;
  const previewText = post.excerpt?.trim() ?? '';
  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={href} className="archive-post-link">
      <div
        className={`archive-post-layout ${
          thumbnailUrl ? 'has-thumbnail' : 'no-thumbnail'
        }`}
      >
        <div className="archive-post-content">
          <h2 className="archive-post-title">{post.title}</h2>
          {previewText && <p className="archive-post-excerpt">{previewText}</p>}
          <time className="archive-post-date">{formattedDate}</time>
        </div>

        {thumbnailUrl && (
          <div className="archive-post-thumbnail">
            <img src={thumbnailUrl} alt={`${post.title} thumbnail`} loading="lazy" />
          </div>
        )}
      </div>
    </Link>
  );
}
