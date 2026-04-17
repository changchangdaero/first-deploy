import type {
  HandwritingBlockInput,
  HandwritingBlockRow,
} from '@/types/post';

export const HANDWRITING_BLOCK_PATTERN =
  /\{\{HANDWRITING_BLOCK:([a-zA-Z0-9_-]+)\}\}/g;

export function buildHandwritingBlockToken(blockId: string) {
  return `{{HANDWRITING_BLOCK:${blockId}}}`;
}

export function stripHandwritingBlockToken(content: string, blockId: string) {
  const token = buildHandwritingBlockToken(blockId);

  return content
    .replaceAll(`\n${token}\n`, '\n')
    .replaceAll(token, '')
    .replace(/\n{3,}/g, '\n\n');
}

export function parseHandwritingBlocksInput(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) {
    return [] as HandwritingBlockInput[];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('손글씨 블록 데이터를 읽을 수 없습니다.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('손글씨 블록 데이터 형식이 올바르지 않습니다.');
  }

  return parsed.map((item) => normalizeHandwritingBlockInput(item));
}

function normalizeHandwritingBlockInput(value: unknown): HandwritingBlockInput {
  if (!value || typeof value !== 'object') {
    throw new Error('손글씨 블록 데이터 형식이 올바르지 않습니다.');
  }

  const block = value as Partial<HandwritingBlockInput>;

  if (!block.id || typeof block.id !== 'string') {
    throw new Error('손글씨 블록 ID가 필요합니다.');
  }

  if (!Array.isArray(block.strokes)) {
    throw new Error('손글씨 선 데이터가 필요합니다.');
  }

  return {
    id: block.id,
    strokes: block.strokes,
    preview_image_url:
      typeof block.preview_image_url === 'string' && block.preview_image_url.trim()
        ? block.preview_image_url.trim()
        : null,
    width:
      typeof block.width === 'number' && Number.isFinite(block.width)
        ? Math.max(240, Math.round(block.width))
        : 960,
    height:
      typeof block.height === 'number' && Number.isFinite(block.height)
        ? Math.max(180, Math.round(block.height))
        : 540,
  };
}

export function splitContentWithHandwritingBlocks(content: string) {
  const segments: Array<
    | { type: 'markdown'; value: string }
    | { type: 'handwriting'; blockId: string }
  > = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  HANDWRITING_BLOCK_PATTERN.lastIndex = 0;

  while ((match = HANDWRITING_BLOCK_PATTERN.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'markdown',
        value: content.slice(lastIndex, match.index),
      });
    }

    segments.push({
      type: 'handwriting',
      blockId: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'markdown',
      value: content.slice(lastIndex),
    });
  }

  if (segments.length === 0) {
    segments.push({ type: 'markdown', value: content });
  }

  return segments;
}

export function serializeHandwritingBlocks(
  blocks: HandwritingBlockInput[] | HandwritingBlockRow[]
) {
  return JSON.stringify(blocks);
}
