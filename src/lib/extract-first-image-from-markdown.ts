const MARKDOWN_IMAGE_REGEX =
  /!\[[^\]]*]\(\s*(?:<([^>\n]+)>|([^)\s]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/i;

const HTML_IMAGE_REGEX =
  /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>/i;

function normalizeImageUrl(url: string | undefined) {
  const normalized = url?.trim();

  return normalized ? normalized : null;
}

export function extractFirstImageFromMarkdown(content: string): string | null {
  if (!content) {
    return null;
  }

  const markdownMatch = MARKDOWN_IMAGE_REGEX.exec(content);
  const htmlMatch = HTML_IMAGE_REGEX.exec(content);

  if (!markdownMatch && !htmlMatch) {
    return null;
  }

  if (markdownMatch && htmlMatch) {
    return markdownMatch.index <= htmlMatch.index
      ? normalizeImageUrl(markdownMatch[1] ?? markdownMatch[2])
      : normalizeImageUrl(htmlMatch[1] ?? htmlMatch[2] ?? htmlMatch[3]);
  }

  if (markdownMatch) {
    return normalizeImageUrl(markdownMatch[1] ?? markdownMatch[2]);
  }

  return normalizeImageUrl(htmlMatch?.[1] ?? htmlMatch?.[2] ?? htmlMatch?.[3]);
}
