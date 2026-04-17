'use client';

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
} from 'react';
import AdminHandwritingBlockEditor from '@/components/admin/AdminHandwritingBlockEditor';
import MarkdownContent from '@/components/MarkdownContent';
import HandwritingBlockFigure from '@/components/handwriting/HandwritingBlockFigure';
import {
  applyLinkFormat,
  applyWrapFormat,
} from '@/lib/admin-editor-format';
import {
  buildHandwritingBlockToken,
  stripHandwritingBlockToken,
} from '@/lib/handwriting-blocks';
import {
  DEFAULT_HANDWRITING_HEIGHT,
  DEFAULT_HANDWRITING_WIDTH,
  drawHandwritingStrokes,
} from '@/lib/handwriting-render';
import type { HandwritingBlockInput } from '@/types/post';

type AdminMarkdownEditorProps = {
  content: string;
  onChange: (value: string) => void;
  handwritingBlocks: HandwritingBlockInput[];
  onHandwritingBlocksChange: (blocks: HandwritingBlockInput[]) => void;
};

type UploadedImage = {
  src: string;
  alt: string;
  width: string;
  tag: string;
  index: number;
};

const DEFAULT_IMAGE_WIDTH = '720';
const IMAGE_WIDTH_PRESETS = ['320', '480', '720', '960'];

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildImageTag({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: string;
}) {
  const safeAlt = escapeHtml(alt.trim());
  const safeSrc = escapeHtml(src.trim());
  const safeWidth = width.trim();

  if (!safeWidth || safeWidth.toLowerCase() === 'full') {
    return `<img src="${safeSrc}" alt="${safeAlt}" />`;
  }

  return `<img src="${safeSrc}" alt="${safeAlt}" width="${safeWidth}" />`;
}

function parseImages(content: string): UploadedImage[] {
  const regex = /<img\s+([^>]*?)\/?>/gi;
  const matches: UploadedImage[] = [];
  let match: RegExpExecArray | null;
  let imageIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    const attrs = match[1];
    const src = attrs.match(/src="([^"]*)"/i)?.[1] ?? '';
    const alt = attrs.match(/alt="([^"]*)"/i)?.[1] ?? '';
    const width = attrs.match(/width="([^"]*)"/i)?.[1] ?? '';

    if (!src) {
      continue;
    }

    matches.push({
      src,
      alt,
      width,
      tag: match[0],
      index: imageIndex,
    });

    imageIndex += 1;
  }

  return matches;
}

function replaceImageTag(content: string, targetIndex: number, nextTag: string) {
  const regex = /<img\s+([^>]*?)\/?>/gi;
  let imageIndex = 0;

  return content.replace(regex, (tag) => {
    if (imageIndex === targetIndex) {
      imageIndex += 1;
      return nextTag;
    }

    imageIndex += 1;
    return tag;
  });
}

export default function AdminMarkdownEditor({
  content,
  onChange,
  handwritingBlocks,
  onHandwritingBlocksChange,
}: AdminMarkdownEditorProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isImageToolsOpen, setIsImageToolsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeHandwritingBlockId, setActiveHandwritingBlockId] = useState<string | null>(
    null
  );
  const [isSavingHandwriting, setIsSavingHandwriting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const images = useMemo(() => parseImages(content), [content]);
  const selectedImage =
    selectedImageIndex === null
      ? null
      : images.find((image) => image.index === selectedImageIndex) ?? null;
  const activeHandwritingBlock =
    activeHandwritingBlockId === null
      ? null
      : handwritingBlocks.find((block) => block.id === activeHandwritingBlockId) ?? null;

  function rememberSelection() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  }

  function getSelectionSnapshot() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return {
        start: selectionRef.current.start,
        end: selectionRef.current.end,
        scrollTop: 0,
      };
    }

    const isTextareaFocused = document.activeElement === textarea;
    const selection = isTextareaFocused
      ? {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        }
      : selectionRef.current;

    return {
      ...selection,
      scrollTop: textarea.scrollTop,
    };
  }

  function restoreSelection(start: number, end: number, scrollTop: number) {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.setSelectionRange(start, end);
      textarea.scrollTop = scrollTop;
      selectionRef.current = { start, end };
    });
  }

  function preventToolbarBlur(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    rememberSelection();
  }

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current;
    const { start, end, scrollTop } = getSelectionSnapshot();

    if (!textarea) {
      onChange(`${content}${content.endsWith('\n') ? '' : '\n'}${text}`);
      return;
    }

    const next = `${content.slice(0, start)}${text}${content.slice(end)}`;
    onChange(next);

    const cursor = start + text.length;
    restoreSelection(cursor, cursor, scrollTop);
  }

  function applySelectionTransform(
    transform: (params: {
      content: string;
      selectionStart: number;
      selectionEnd: number;
    }) => {
      nextContent: string;
      nextSelectionStart: number;
      nextSelectionEnd: number;
    }
  ) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const { start, end, scrollTop } = getSelectionSnapshot();
    const result = transform({
      content,
      selectionStart: start,
      selectionEnd: end,
    });

    onChange(result.nextContent);

    restoreSelection(
      result.nextSelectionStart,
      result.nextSelectionEnd,
      scrollTop
    );
  }

  function handleWrapFormat(
    prefix: string,
    suffix: string,
    placeholder: string
  ) {
    applySelectionTransform(({ content, selectionStart, selectionEnd }) =>
      applyWrapFormat({
        content,
        selectionStart,
        selectionEnd,
        prefix,
        suffix,
        placeholder,
      })
    );
  }

  function handleUnderlineFormat() {
    rememberSelection();
    handleWrapFormat('<u>', '</u>', '밑줄 텍스트');
  }

  function handleLinkFormat() {
    const url =
      window.prompt('링크 주소를 입력해 주세요.', 'https://example.com')?.trim() ?? '';

    if (!url) {
      return;
    }

    applySelectionTransform(({ content, selectionStart, selectionEnd }) =>
      applyLinkFormat({
        content,
        selectionStart,
        selectionEnd,
        textPlaceholder: '링크 텍스트',
        url,
      })
    );
  }

  async function uploadImage(file: File) {
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? '이미지 업로드에 실패했습니다.');
      }

      const tag = buildImageTag({
        src: result.url,
        alt: file.name,
        width: DEFAULT_IMAGE_WIDTH,
      });

      insertAtCursor(`\n${tag}\n`);
      setIsImageToolsOpen(true);
      setMessage('이미지를 업로드하고 본문에 삽입했습니다.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '이미지 업로드 중 문제가 발생했습니다.'
      );
    } finally {
      setIsUploading(false);
      setIsDragActive(false);
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      rememberSelection();
      void uploadImage(file);
    }

    event.target.value = '';
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.items)
      .filter((item) => item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    rememberSelection();
    void uploadImage(files[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    const hasImage = Array.from(event.dataTransfer.items).some((item) =>
      item.type.startsWith('image/')
    );

    if (!hasImage) {
      return;
    }

    event.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    const file = Array.from(event.dataTransfer.files).find((item) =>
      item.type.startsWith('image/')
    );

    if (!file) {
      setIsDragActive(false);
      return;
    }

    event.preventDefault();
    rememberSelection();
    void uploadImage(file);
  }

  function updateSelectedImage(updater: (image: UploadedImage) => UploadedImage) {
    if (!selectedImage) {
      return;
    }

    const nextImage = updater(selectedImage);
    const nextTag = buildImageTag(nextImage);
    const nextContent = replaceImageTag(content, selectedImage.index, nextTag);

    onChange(nextContent);
  }

  function handleAddHandwritingBlock() {
    rememberSelection();

    const nextBlock: HandwritingBlockInput = {
      id: crypto.randomUUID(),
      strokes: [],
      preview_image_url: null,
      width: DEFAULT_HANDWRITING_WIDTH,
      height: DEFAULT_HANDWRITING_HEIGHT,
    };

    onHandwritingBlocksChange([...handwritingBlocks, nextBlock]);
    insertAtCursor(`\n${buildHandwritingBlockToken(nextBlock.id)}\n`);
    setActiveHandwritingBlockId(nextBlock.id);
    setMessage('손글씨 블록을 본문에 추가했습니다.');
  }

  async function uploadHandwritingPreview(block: HandwritingBlockInput) {
    if (block.strokes.length === 0) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = block.width;
    canvas.height = block.height;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    drawHandwritingStrokes(context, block.strokes, block.width, block.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((value) => resolve(value), 'image/png')
    );

    if (!blob) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', blob, `${block.id}.png`);

    const response = await fetch('/api/admin/handwriting-preview', {
      method: 'POST',
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok) {
      throw new Error(result.error ?? '손글씨 미리보기를 업로드하지 못했습니다.');
    }

    return result.url ?? null;
  }

  async function handleSaveHandwritingBlock(nextBlock: HandwritingBlockInput) {
    setIsSavingHandwriting(true);

    try {
      const previewImageUrl = await uploadHandwritingPreview(nextBlock);
      onHandwritingBlocksChange(
        handwritingBlocks.map((block) =>
          block.id === nextBlock.id
            ? {
                ...nextBlock,
                preview_image_url: previewImageUrl ?? block.preview_image_url,
              }
            : block
        )
      );
      setActiveHandwritingBlockId(null);
      setMessage('손글씨 블록을 저장했습니다.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '손글씨 블록을 저장하지 못했습니다.'
      );
    } finally {
      setIsSavingHandwriting(false);
    }
  }

  function handleRemoveHandwritingBlock(blockId: string) {
    const shouldRemove = window.confirm(
      '손글씨 블록을 삭제하고 본문 토큰도 함께 지울까요?'
    );

    if (!shouldRemove) {
      return;
    }

    onHandwritingBlocksChange(
      handwritingBlocks.filter((block) => block.id !== blockId)
    );
    onChange(stripHandwritingBlockToken(content, blockId));
    setActiveHandwritingBlockId((current) => (current === blockId ? null : current));
  }

  return (
    <section className="space-y-6">
      <div className="section-card overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-heading)]">
              본문 작성
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              기존 마크다운 흐름은 그대로 두고, 손글씨 블록을 필요한 위치에 삽입할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() => handleWrapFormat('**', '**', '굵은 텍스트')}
              className="link-pill"
            >
              굵게
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() => handleWrapFormat('*', '*', '기울임 텍스트')}
              className="link-pill italic"
            >
              기울임
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() =>
                handleWrapFormat(
                  '<span class="text-red">',
                  '</span>',
                  '강조 텍스트'
                )
              }
              className="link-pill text-red-600"
            >
              빨간 글씨
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={handleUnderlineFormat}
              className="link-pill underline"
            >
              밑줄
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() => handleWrapFormat('~~', '~~', '취소선 텍스트')}
              className="link-pill line-through"
            >
              취소선
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={handleLinkFormat}
              className="link-pill"
            >
              링크
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() =>
                insertAtCursor('\n```ts\nconsole.log("example");\n```\n')
              }
              className="link-pill"
            >
              코드 블록
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() =>
                insertAtCursor('\n## 소제목\n내용을 입력해 주세요.\n')
              }
              className="link-pill"
            >
              소제목
            </button>
            <label className="link-pill cursor-pointer">
              {isUploading ? '업로드 중...' : '이미지 업로드'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
                disabled={isUploading}
              />
            </label>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={handleAddHandwritingBlock}
              className="link-pill"
            >
              손글씨 블록 추가
            </button>
            <button
              type="button"
              onMouseDown={preventToolbarBlur}
              onClick={() => setIsImageToolsOpen((isOpen) => !isOpen)}
              className="link-pill"
            >
              이미지 도구
            </button>
          </div>
        </div>

        <div>
          <div
            className={`relative ${
              isDragActive
                ? 'bg-[color:var(--accent-muted)]'
                : 'bg-[var(--portfolio-surface)]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragActive && (
              <div className="pointer-events-none absolute inset-4 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[color:var(--accent-muted)] text-sm font-medium text-[var(--accent)]">
                이미지를 놓으면 바로 업로드됩니다.
              </div>
            )}

            <textarea
              ref={textareaRef}
              id="content"
              name="content"
              value={content}
              placeholder="내용을 입력해 주세요."
              onChange={(event) => {
                onChange(event.target.value);
                selectionRef.current = {
                  start: event.target.selectionStart,
                  end: event.target.selectionEnd,
                };
              }}
              onClick={rememberSelection}
              onMouseUp={rememberSelection}
              onKeyUp={rememberSelection}
              onPaste={handlePaste}
              onSelect={rememberSelection}
              onBlur={rememberSelection}
              className="min-h-[760px] w-full resize-y border-0 bg-transparent px-6 py-5 font-mono text-sm leading-7 text-[var(--text-heading)] outline-none"
              required
            />
          </div>

          {isImageToolsOpen && (
            <div className="space-y-4 border-t border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-6 py-5">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-heading)]">
                  이미지 도구
                </h4>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  업로드한 이미지의 대체 텍스트와 너비를 바로 수정할 수 있습니다.
                </p>
              </div>

              {message && (
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-sm text-[var(--text-body)]">
                  {message}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  삽입한 이미지
                </p>
                {images.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-5 text-sm text-[var(--text-muted)]">
                    아직 삽입한 이미지가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {images.map((image) => (
                      <button
                        key={`${image.src}-${image.index}`}
                        type="button"
                        onClick={() => setSelectedImageIndex(image.index)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                          selectedImageIndex === image.index
                            ? 'border-[var(--text-heading)] bg-[var(--portfolio-surface)]'
                            : 'border-[var(--border-default)] bg-[var(--portfolio-surface)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.src}
                          alt={image.alt || '업로드 이미지'}
                          className="h-14 w-14 rounded-lg border border-[var(--border-default)] object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-[var(--text-heading)]">
                            {image.alt || '이미지'}
                          </span>
                          <span className="block truncate text-xs text-[var(--text-muted)]">
                            너비: {image.width || '원본 비율'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedImage && (
                <div className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
                  <div>
                    <h5 className="text-sm font-semibold text-[var(--text-heading)]">
                      선택한 이미지
                    </h5>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      너비 값은 본문의 HTML 이미지 태그에 다시 반영됩니다.
                    </p>
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt || '선택한 이미지'}
                    className="max-h-48 w-full rounded-lg border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] object-contain"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-heading)]">
                      대체 텍스트
                    </label>
                    <input
                      type="text"
                      value={selectedImage.alt}
                      onChange={(event) =>
                        updateSelectedImage((image) => ({
                          ...image,
                          alt: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-heading)]">
                      너비
                    </label>
                    <input
                      type="number"
                      min="120"
                      max="1600"
                      value={selectedImage.width}
                      onChange={(event) =>
                        updateSelectedImage((image) => ({
                          ...image,
                          width: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)]"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {IMAGE_WIDTH_PRESETS.map((width) => (
                        <button
                          key={width}
                          type="button"
                          onClick={() =>
                            updateSelectedImage((image) => ({
                              ...image,
                              width,
                            }))
                          }
                          className="link-pill"
                        >
                          {width}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage((image) => ({
                            ...image,
                            width: '',
                          }))
                        }
                        className="link-pill"
                      >
                        원본 비율
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-card space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-heading)]">
              손글씨 블록
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              각 블록은 별도 데이터로 저장되고, 본문에서는 토큰으로 참조됩니다.
            </p>
          </div>
          <button type="button" onClick={handleAddHandwritingBlock} className="link-pill">
            손글씨 블록 추가
          </button>
        </div>

        {message && !isImageToolsOpen && (
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-sm text-[var(--text-body)]">
            {message}
          </div>
        )}

        {handwritingBlocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--portfolio-surface)] px-5 py-6 text-sm text-[var(--text-muted)]">
            아직 손글씨 블록이 없습니다. 상단 버튼을 눌러 손글씨 블록을 추가해 보세요.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {handwritingBlocks.map((block) => (
              <div
                key={block.id}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                      블록 토큰
                    </p>
                    <p className="mt-1 font-mono text-sm text-[var(--text-body)]">
                      {buildHandwritingBlockToken(block.id)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveHandwritingBlockId(block.id)}
                      className="link-pill"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveHandwritingBlock(block.id)}
                      className="link-pill"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white">
                  <HandwritingBlockFigure block={block} className="my-0 rounded-none border-0" />
                </div>

                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  선 {block.strokes.length}개 · {block.width} x {block.height}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-card overflow-hidden p-0">
        <div className="border-b border-[var(--border-default)] px-6 py-4">
          <h3 className="text-lg font-semibold text-[var(--text-heading)]">
            미리보기
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            공개 글 상세 페이지와 같은 방식으로 손글씨 블록이 렌더링됩니다.
          </p>
        </div>

        <div className="px-6 py-6">
          <MarkdownContent content={content} handwritingBlocks={handwritingBlocks} />
        </div>
      </div>

      <AdminHandwritingBlockEditor
        block={activeHandwritingBlock}
        isSaving={isSavingHandwriting}
        onClose={() => setActiveHandwritingBlockId(null)}
        onSave={handleSaveHandwritingBlock}
      />
    </section>
  );
}
