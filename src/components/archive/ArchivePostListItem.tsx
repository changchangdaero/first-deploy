/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { PostWithRelations } from '@/types/post';
import { extractFirstImageFromMarkdown } from '@/lib/extract-first-image-from-markdown';

type ArchivePostListItemProps = {
  href: string;
  post: PostWithRelations;
};

const PREVIEW_MAX_LENGTH = 280;

function getPostThumbnailUrl(post: PostWithRelations) {
  const thumbnailUrl = post.thumbnail_url?.trim();

  if (thumbnailUrl) {
    return thumbnailUrl;
  }

  return extractFirstImageFromMarkdown(post.content);
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
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
      Archive
    </div>
  );
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
    <Link
      href={href}
      className="group block rounded-3xl px-2 py-6 transition-colors duration-200 hover:bg-white/70"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-heading)] transition-colors duration-200 group-hover:text-black">
            {post.title}
          </h2>
          {previewText && (
            <p className="mt-3 line-clamp-5 text-base leading-7 text-[var(--text-muted)] sm:line-clamp-3 sm:leading-8">
              {previewText}
            </p>
          )}
          <p className="mt-5 text-sm text-[var(--text-faint)]">{formattedDate}</p>
        </div>

        <div className="w-full shrink-0 sm:w-36 md:w-40">
          {thumbnailUrl ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)]">
              <img
                src={thumbnailUrl}
                alt={`${post.title} 썸네일`}
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          ) : (
            <ThumbnailPlaceholder />
          )}
        </div>
      </div>
    </Link>
  );
}
