import { extractFirstImageFromMarkdown } from '@/lib/extract-first-image-from-markdown';

const DEFAULT_EXCERPT_MAX_LENGTH = 180;

export function stripPostPreviewText(content: string | null | undefined) {
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

function clampExcerpt(text: string, maxLength = DEFAULT_EXCERPT_MAX_LENGTH) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function buildPostExcerpt({
  excerpt,
  content,
  title,
  maxLength = DEFAULT_EXCERPT_MAX_LENGTH,
}: {
  excerpt?: string | null;
  content: string;
  title?: string;
  maxLength?: number;
}) {
  const source = stripPostPreviewText(excerpt) || stripPostPreviewText(content);
  const fallback = title?.trim() ?? '';
  const previewText = source || fallback;

  return previewText ? clampExcerpt(previewText, maxLength) : null;
}

export function buildPostThumbnailUrl(content: string) {
  return extractFirstImageFromMarkdown(content);
}
