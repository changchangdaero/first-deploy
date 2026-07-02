/* eslint-disable @next/next/no-img-element */
// 아카이브 글 목록 아이템: 하위 카테고리 안의 클릭 가능한 글 카드이며 썸네일과 요약 대체 로직을 포함합니다.
import Link from 'next/link';
import type { PostWithRelations } from '@/types/post';
import { extractFirstImageFromMarkdown } from '@/lib/extract-first-image-from-markdown';
import { splitContentWithHandwritingBlocks } from '@/lib/handwriting-blocks';

type ArchivePostListItemProps = {
  href: string;
  post: PostWithRelations;
};

const PREVIEW_MAX_LENGTH = 220;

function getPostThumbnailUrl(post: PostWithRelations) {
  const thumbnailUrl = post.thumbnail_url?.trim();

  if (thumbnailUrl) {
    return thumbnailUrl;
  }

  const firstMarkdownImage = extractFirstImageFromMarkdown(post.content);
  const handwritingMap = new Map(
    post.handwritingBlocks.map((block) => [block.id, block])
  );
  const segments = splitContentWithHandwritingBlocks(post.content);

  for (const segment of segments) {
    if (segment.type === 'markdown') {
      const imageUrl = extractFirstImageFromMarkdown(segment.value);

      if (imageUrl) {
        return imageUrl;
      }

      continue;
    }

    const handwritingBlock = handwritingMap.get(segment.blockId);
    const previewImageUrl = handwritingBlock?.preview_image_url?.trim();

    if (previewImageUrl) {
      return previewImageUrl;
    }
  }

  return firstMarkdownImage;
}

function stripMarkdown(content: string) {
  return content
    .replace(/!\[[^\]]*]\((.*?)\)/g, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/^\s{0,3}(#{1,6}|\*|-|\+|>)/gm, ' ')
    .replace(/\*\*|__|\*|_|~~/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPreviewText(post: PostWithRelations) {
  const excerpt = post.excerpt?.trim();

  if (excerpt) {
    return excerpt;
  }

  const plainText = stripMarkdown(post.content);

  if (plainText.length <= PREVIEW_MAX_LENGTH) {
    return plainText;
  }

  return `${plainText.slice(0, PREVIEW_MAX_LENGTH).trimEnd()}...`;
}

function ThumbnailPlaceholder() {
  return <div className="archive-thumbnail-placeholder">Archive</div>;
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
      <div className="archive-post-layout">
        <div>
          <h2>{post.title}</h2>
          {previewText && <p>{previewText}</p>}
          <time className="archive-post-date">{formattedDate}</time>
        </div>

        <div className="archive-thumbnail">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`${post.title} 썸네일`}
              loading="lazy"
            />
          ) : (
            <ThumbnailPlaceholder />
          )}
        </div>
      </div>
    </Link>
  );
}
