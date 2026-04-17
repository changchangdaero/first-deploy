'use client';

import { useActionState, useMemo, useState, type ChangeEvent } from 'react';
import AdminMarkdownEditor from '@/components/admin/AdminMarkdownEditor';
import { buildArchivePath } from '@/lib/archive';
import { serializeHandwritingBlocks } from '@/lib/handwriting-blocks';
import { createSlugCandidate } from '@/lib/slug';
import type {
  AdminPostFormState,
  CategoryWithSubcategories,
  HandwritingBlockInput,
  PostWithRelations,
} from '@/types/post';

type PostFormAction = (
  state: AdminPostFormState,
  formData: FormData
) => Promise<AdminPostFormState>;

type AdminPostFormProps = {
  categories: CategoryWithSubcategories[];
  action: PostFormAction;
  submitLabel: string;
  initialPost?: PostWithRelations;
};

const initialState: AdminPostFormState = {
  message: null,
};

const starterMarkdown = '';

export default function AdminPostForm({
  categories,
  action,
  submitLabel,
  initialPost,
}: AdminPostFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialPost?.category.id ?? ''
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    initialPost?.subcategory_id ?? ''
  );
  const [content, setContent] = useState(initialPost?.content ?? starterMarkdown);
  const [handwritingBlocks, setHandwritingBlocks] = useState<HandwritingBlockInput[]>(
    initialPost?.handwritingBlocks ?? []
  );

  const availableSubcategories = useMemo(() => {
    return (
      categories.find((category) => category.id === selectedCategoryId)
        ?.subcategories ?? []
    );
  }, [categories, selectedCategoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const selectedSubcategory = useMemo(
    () =>
      availableSubcategories.find(
        (subcategory) => subcategory.id === selectedSubcategoryId
      ),
    [availableSubcategories, selectedSubcategoryId]
  );

  const generatedSlug = createSlugCandidate(title, 'post');

  const archivePreviewPath =
    selectedCategory && selectedSubcategory
      ? buildArchivePath({
          categorySlug: selectedCategory.slug,
          subcategorySlug: selectedSubcategory.slug,
          postSlug: generatedSlug,
        })
      : null;

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCategoryId(event.target.value);
    setSelectedSubcategoryId('');
  }

  function handleSubcategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedSubcategoryId(event.target.value);
  }

  return (
    <form action={formAction} className="space-y-8">
      {initialPost && <input type="hidden" name="id" value={initialPost.id} />}
      <input
        type="hidden"
        name="handwriting_blocks"
        value={serializeHandwritingBlocks(handwritingBlocks)}
      />

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="section-card space-y-6 xl:sticky xl:top-6 xl:self-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              글 정보
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--text-heading)]">
              {initialPost ? '글 수정' : '새 글 작성'}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              제목을 기준으로 URL 슬러그가 자동 생성됩니다. 카테고리와 메타 정보를 정리한
              뒤 본문을 작성해 주세요.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                제목
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예: Signals and Systems 정리"
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                카테고리
              </label>
              <select
                id="category_id"
                name="category_id"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
                required
              >
                <option value="" disabled>
                  카테고리를 선택해 주세요
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategory_id"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                서브카테고리
              </label>
              <select
                id="subcategory_id"
                name="subcategory_id"
                value={selectedSubcategoryId}
                onChange={handleSubcategoryChange}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm disabled:bg-[var(--portfolio-surface-muted)] disabled:text-[var(--text-faint)]"
                required
                disabled={!selectedCategoryId}
              >
                <option value="" disabled>
                  {selectedCategoryId
                    ? '서브카테고리를 선택해 주세요'
                    : '먼저 카테고리를 선택해 주세요'}
                </option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {!selectedCategoryId && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  카테고리를 선택하면 연결된 서브카테고리를 고를 수 있습니다.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                자동 URL
              </p>
              <p className="mt-2 break-all font-mono text-sm text-[var(--text-body)]">
                {archivePreviewPath ??
                  `/archive/{category}/{subcategory}/${generatedSlug}`}
              </p>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                태그
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={initialPost?.tags.join(', ') ?? ''}
                placeholder="예: signals, notes, theory"
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-[var(--text-heading)]"
              >
                요약
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                defaultValue={initialPost?.excerpt ?? ''}
                className="min-h-[120px] w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-4 py-3 text-[var(--text-heading)] shadow-sm"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-4 py-3 text-sm font-medium text-[var(--text-heading)]">
              <input
                type="checkbox"
                name="published"
                defaultChecked={initialPost?.published ?? true}
              />
              공개 상태로 발행
            </label>
          </div>

          {state.message && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[var(--text-heading)] px-5 py-3 font-medium text-white transition hover:bg-[var(--accent)] disabled:opacity-60"
          >
            {isPending ? '저장 중...' : submitLabel}
          </button>
        </aside>

        <AdminMarkdownEditor
          content={content}
          onChange={setContent}
          handwritingBlocks={handwritingBlocks}
          onHandwritingBlocksChange={setHandwritingBlocks}
        />
      </section>
    </form>
  );
}
