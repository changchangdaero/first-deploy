/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { PostWithRelations } from '@/types/post';
import { extractFirstImageFromMarkdown } from '@/lib/extract-first-image-from-markdown';

type ArchivePostListItemProps = {
  href: string;
  post: PostWithRelations;
};

const PREVIEW_MAX_LENGTH = 220;

function getPostThumbnailUrl(post: PostWithRelations) {
  const thumbnailUrl = post.thumbnail_url?.trim();

  return thumbnailUrl || extractFirstImageFromMarkdown(post.content);
}

function stripMarkdown(content: string | null | undefined) {
  if (!content?.trim()) {
    return '';
  }

  return content
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(
      /!\[[^\]]*]\(\s*(?:<[^>\n]+>|[^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g,
      ' '
    )
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]+)]\((?:[^()]|\([^)]*\))*\)/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/^\s{0,3}(#{1,6}|[-*+]|>)+\s*/gm, ' ')
    .replace(/\*\*|__|\*|_|~~/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPreviewText(post: PostWithRelations) {
  const source = post.excerpt?.trim() ? post.excerpt : post.content;
  const plainText = stripMarkdown(source);

  if (plainText.length <= PREVIEW_MAX_LENGTH) {
    return plainText;
  }

  return `${plainText.slice(0, PREVIEW_MAX_LENGTH).trimEnd()}...`;
}

export default function ArchivePostListItem({
  href,
  post,
}: ArchivePostListItemProps) {
  const thumbnailUrl = getPostThumbnailUrl(post);
  const previewText = getPreviewText(post);
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
          <h2>{post.title}</h2>
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
