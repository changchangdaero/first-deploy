'use client';

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
} from 'react';
import MarkdownContent from '@/components/MarkdownContent';
import {
  applyLinkFormat,
  applyWrapFormat,
} from '@/lib/admin-editor-format';

type AdminMarkdownEditorProps = {
  content: string;
  onChange: (value: string) => void;
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
}: AdminMarkdownEditorProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const images = useMemo(() => parseImages(content), [content]);
  const selectedImage =
    selectedImageIndex === null
      ? null
      : images.find((image) => image.index === selectedImageIndex) ?? null;

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      onChange(`${content}${content.endsWith('\n') ? '' : '\n'}${text}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${content.slice(0, start)}${text}${content.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
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

    const result = transform({
      content,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
    });

    onChange(result.nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        result.nextSelectionStart,
        result.nextSelectionEnd
      );
    });
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

  function handleLinkFormat() {
    const url =
      window.prompt('링크 URL을 입력하세요.', 'https://example.com')?.trim() ?? '';

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
      setMessage('이미지가 업로드되어 본문에 삽입되었습니다.');
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

  return (
    <section className="space-y-6">
      <div className="section-card overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-heading)]">
              본문 작성
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              마크다운과 HTML img 태그를 함께 사용합니다. 이미지 붙여넣기, 드롭, width 조절을 지원합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleWrapFormat('**', '**', '굵은 텍스트')}
              className="link-pill"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => handleWrapFormat('*', '*', '기울임 텍스트')}
              className="link-pill italic"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() =>
                handleWrapFormat(
                  '<span class="text-red">',
                  '</span>',
                  '빨간 글씨'
                )
              }
              className="link-pill text-red-600"
            >
              Red Text
            </button>
            <button
              type="button"
              onClick={() => handleWrapFormat('<u>', '</u>', '밑줄 텍스트')}
              className="link-pill underline"
            >
              Underline
            </button>
            <button
              type="button"
              onClick={() => handleWrapFormat('~~', '~~', '취소선 텍스트')}
              className="link-pill line-through"
            >
              Strikethrough
            </button>
            <button
              type="button"
              onClick={handleLinkFormat}
              className="link-pill"
            >
              Link
            </button>
            <button
              type="button"
              onClick={() =>
                insertAtCursor('\n```ts\nconsole.log("example");\n```\n')
              }
              className="link-pill"
            >
              코드 블록
            </button>
            <button
              type="button"
              onClick={() =>
                insertAtCursor('\n## 소제목\n\n본문 내용을 입력하세요.\n')
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
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div
            className={`relative border-b border-[var(--border-default)] xl:border-b-0 xl:border-r ${
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
              onChange={(event) => onChange(event.target.value)}
              onPaste={handlePaste}
              className="min-h-[620px] w-full resize-y border-0 bg-transparent px-6 py-5 font-mono text-sm leading-7 text-[var(--text-heading)] outline-none"
              required
            />
          </div>

          <aside className="space-y-4 bg-[var(--portfolio-surface-muted)] px-6 py-5">
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-heading)]">
                이미지 도구
              </h4>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                업로드, Ctrl+V 붙여넣기, 드래그 앤 드롭으로 이미지를 넣을 수 있습니다.
              </p>
            </div>

            {message && (
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-sm text-[var(--text-body)]">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                삽입된 이미지
              </p>
              {images.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-5 text-sm text-[var(--text-muted)]">
                  아직 삽입된 이미지가 없습니다.
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
                        alt={image.alt || 'uploaded'}
                        className="h-14 w-14 rounded-lg border border-[var(--border-default)] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[var(--text-heading)]">
                          {image.alt || '이미지'}
                        </span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">
                          width: {image.width || 'full'}
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
                    width는 본문에 {'`<img width="...">`'} 형태로 저장됩니다.
                  </p>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || 'selected'}
                  className="max-h-48 w-full rounded-lg border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] object-contain"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-heading)]">
                    Alt 텍스트
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
                    Width
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
                      full
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className="section-card overflow-hidden p-0">
        <div className="border-b border-[var(--border-default)] px-6 py-4">
          <h3 className="text-lg font-semibold text-[var(--text-heading)]">
            미리보기
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            archive 상세 페이지와 같은 markdown 렌더링 방식을 사용합니다.
          </p>
        </div>

        <div className="px-6 py-6">
          <MarkdownContent content={content} />
        </div>
      </div>
    </section>
  );
}
