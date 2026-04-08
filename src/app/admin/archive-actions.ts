'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildArchivePath, getPostWithRelationsById } from '@/lib/archive';
import { createSlugCandidate } from '@/lib/slug';
import { supabase } from '@/lib/supabase/server';
import type { AdminActionState, AdminPostFormState } from '@/types/post';

function getRequiredText(formData: FormData, key: string, label: string) {
  const value = formData.get(key)?.toString().trim() ?? '';

  if (!value) {
    throw new Error(`${label}은(는) 필수입니다.`);
  }

  return value;
}

function getOptionalText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? '';
}

function parseTags(formData: FormData) {
  const tagsInput = getOptionalText(formData, 'tags');

  return tagsInput
    ? tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];
}

function getPostActionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '저장 중 알 수 없는 문제가 발생했습니다.';
}

function isUniqueViolation(error: { code?: string } | null) {
  return error?.code === '23505';
}

async function findPostSlugConflict(slug: string, postId?: string) {
  let query = supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .limit(1);

  if (postId) {
    query = query.neq('id', postId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
}

async function findCategorySlugConflict(slug: string, categoryId?: string) {
  let query = supabase.from('categories').select('id').eq('slug', slug).limit(1);

  if (categoryId) {
    query = query.neq('id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
}

async function findSubcategorySlugConflict(
  categoryId: string,
  slug: string,
  subcategoryId?: string
) {
  let query = supabase
    .from('subcategories')
    .select('id')
    .eq('category_id', categoryId)
    .eq('slug', slug)
    .limit(1);

  if (subcategoryId) {
    query = query.neq('id', subcategoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
}

async function buildUniqueCategorySlug(name: string, categoryId?: string) {
  const baseSlug = createSlugCandidate(name, 'category');
  let slug = baseSlug;
  let suffix = 2;

  while (await findCategorySlugConflict(slug, categoryId)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function buildUniqueSubcategorySlug(
  categoryId: string,
  name: string,
  subcategoryId?: string
) {
  const baseSlug = createSlugCandidate(name, 'subcategory');
  let slug = baseSlug;
  let suffix = 2;

  while (await findSubcategorySlugConflict(categoryId, slug, subcategoryId)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function buildUniquePostSlug(
  title: string,
  postId?: string
) {
  const baseSlug = createSlugCandidate(title, 'post');
  let slug = baseSlug;
  let suffix = 1;

  while (await findPostSlugConflict(slug, postId)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function getCategoryAndSubcategory(subcategoryId: string) {
  const { data: subcategory, error: subcategoryError } = await supabase
    .from('subcategories')
    .select('id, slug, category_id')
    .eq('id', subcategoryId)
    .single();

  if (subcategoryError || !subcategory) {
    throw new Error('선택한 서브카테고리를 찾을 수 없습니다.');
  }

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('id', subcategory.category_id)
    .single();

  if (categoryError || !category) {
    throw new Error('선택한 카테고리를 찾을 수 없습니다.');
  }

  return { category, subcategory };
}

function revalidateAdminPages() {
  revalidatePath('/admin/categories');
  revalidatePath('/admin/subcategories');
  revalidatePath('/admin/posts');
}

function revalidateArchivePages(categorySlug?: string, subcategorySlug?: string, postSlug?: string) {
  revalidatePath('/archive');

  if (!categorySlug) {
    return;
  }

  revalidatePath(buildArchivePath({ categorySlug }));

  if (!subcategorySlug) {
    return;
  }

  revalidatePath(buildArchivePath({ categorySlug, subcategorySlug }));

  if (postSlug) {
    revalidatePath(
      buildArchivePath({ categorySlug, subcategorySlug, postSlug })
    );
  }
}

export async function createCategoryAction(formData: FormData) {
  const name = getRequiredText(formData, 'name', '카테고리 이름');
  const slug = await buildUniqueCategorySlug(name);

  const { error } = await supabase.from('categories').insert({ name, slug });

  if (error) {
    throw new Error(error.message);
  }

  revalidateAdminPages();
  revalidateArchivePages();
  redirect('/admin/categories');
}

export async function updateCategoryAction(formData: FormData) {
  const id = getRequiredText(formData, 'id', '카테고리 ID');
  const name = getRequiredText(formData, 'name', '카테고리 이름');
  const slug = await buildUniqueCategorySlug(name, id);

  const { data: existing, error: existingError } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', id)
    .single();

  if (existingError || !existing) {
    throw new Error('수정할 카테고리를 찾을 수 없습니다.');
  }

  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAdminPages();
  revalidateArchivePages(existing.slug);
  revalidateArchivePages(slug);
  redirect('/admin/categories');
}

export async function createSubcategoryAction(formData: FormData) {
  const categoryId = getRequiredText(formData, 'category_id', '상위 카테고리');
  const name = getRequiredText(formData, 'name', '서브카테고리 이름');
  const subtitle = getOptionalText(formData, 'subtitle');
  const slug = await buildUniqueSubcategorySlug(categoryId, name);

  const { error } = await supabase
    .from('subcategories')
    .insert({ category_id: categoryId, name, subtitle: subtitle || null, slug });

  if (error) {
    throw new Error(error.message);
  }

  const { data: category } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', categoryId)
    .single();

  revalidateAdminPages();
  revalidateArchivePages(category?.slug);
  redirect('/admin/subcategories');
}

export async function updateSubcategoryAction(formData: FormData) {
  const id = getRequiredText(formData, 'id', '서브카테고리 ID');
  const categoryId = getRequiredText(formData, 'category_id', '상위 카테고리');
  const name = getRequiredText(formData, 'name', '서브카테고리 이름');
  const subtitle = getOptionalText(formData, 'subtitle');
  const slug = await buildUniqueSubcategorySlug(categoryId, name, id);

  const { data: existing, error: existingError } = await supabase
    .from('subcategories')
    .select('id, slug, category_id')
    .eq('id', id)
    .single();

  if (existingError || !existing) {
    throw new Error('수정할 서브카테고리를 찾을 수 없습니다.');
  }

  const [oldCategoryResult, newCategoryResult] = await Promise.all([
    supabase.from('categories').select('slug').eq('id', existing.category_id).single(),
    supabase.from('categories').select('slug').eq('id', categoryId).single(),
  ]);

  const { error } = await supabase
    .from('subcategories')
    .update({ category_id: categoryId, name, subtitle: subtitle || null, slug })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAdminPages();
  revalidateArchivePages(oldCategoryResult.data?.slug, existing.slug);
  revalidateArchivePages(newCategoryResult.data?.slug, slug);
  redirect('/admin/subcategories');
}

export async function createPostAction(
  _state: AdminPostFormState,
  formData: FormData
): Promise<AdminPostFormState> {
  let categoryId: string;
  let subcategoryId: string;
  let title: string;
  let slug: string;
  let content: string;
  let excerpt: string;
  let tags: string[];
  let published: boolean;
  let category: { id: string; slug: string };
  let subcategory: { id: string; slug: string; category_id: string };

  try {
    categoryId = getRequiredText(formData, 'category_id', '카테고리');
    subcategoryId = getRequiredText(formData, 'subcategory_id', '서브카테고리');
    title = getRequiredText(formData, 'title', '제목');
    content = getRequiredText(formData, 'content', '본문');
    excerpt = getOptionalText(formData, 'excerpt');
    tags = parseTags(formData);
    published = formData.get('published') === 'on';

    const relation = await getCategoryAndSubcategory(subcategoryId);
    category = relation.category;
    subcategory = relation.subcategory;
    slug = await buildUniquePostSlug(title);
  } catch (error) {
    return {
      message: getPostActionErrorMessage(error),
    };
  }

  if (category.id !== categoryId) {
    return {
      message: '선택한 카테고리와 서브카테고리 조합이 올바르지 않습니다.',
    };
  }

  let insertError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { error } = await supabase.from('posts').insert({
      subcategory_id: subcategoryId,
      title,
      slug,
      excerpt: excerpt || null,
      content,
      tags,
      published,
    });

    if (!error) {
      insertError = null;
      break;
    }

    insertError = error;

    if (!isUniqueViolation(error)) {
      break;
    }

    slug = await buildUniquePostSlug(title);
  }

  if (insertError) {
    if (isUniqueViolation(insertError)) {
      return {
        message: '자동 URL을 고유하게 만들지 못했습니다. 제목을 조금 바꿔서 다시 시도해주세요.',
      };
    }

    return {
      message: insertError.message,
    };
  }

  revalidateAdminPages();
  revalidateArchivePages(category.slug, subcategory.slug, slug);

  if (published) {
    redirect(
      buildArchivePath({
        categorySlug: category.slug,
        subcategorySlug: subcategory.slug,
        postSlug: slug,
      })
    );
  }

  redirect('/admin/posts');
}

export async function updatePostAction(
  _state: AdminPostFormState,
  formData: FormData
): Promise<AdminPostFormState> {
  let id: string;
  let categoryId: string;
  let subcategoryId: string;
  let title: string;
  let slug: string;
  let content: string;
  let excerpt: string;
  let tags: string[];
  let published: boolean;
  let category: { id: string; slug: string };
  let subcategory: { id: string; slug: string; category_id: string };
  let existing: NonNullable<Awaited<ReturnType<typeof getPostWithRelationsById>>>;

  try {
    id = getRequiredText(formData, 'id', '포스트 ID');
    categoryId = getRequiredText(formData, 'category_id', '카테고리');
    subcategoryId = getRequiredText(formData, 'subcategory_id', '서브카테고리');
    title = getRequiredText(formData, 'title', '제목');
    content = getRequiredText(formData, 'content', '본문');
    excerpt = getOptionalText(formData, 'excerpt');
    tags = parseTags(formData);
    published = formData.get('published') === 'on';

    const post = await getPostWithRelationsById(id);

    if (!post) {
      return {
        message: '수정할 포스트를 찾을 수 없습니다.',
      };
    }

    existing = post;

    const relation = await getCategoryAndSubcategory(subcategoryId);
    category = relation.category;
    subcategory = relation.subcategory;
    slug = await buildUniquePostSlug(title, id);
  } catch (error) {
    return {
      message: getPostActionErrorMessage(error),
    };
  }

  if (category.id !== categoryId) {
    return {
      message: '선택한 카테고리와 서브카테고리 조합이 올바르지 않습니다.',
    };
  }

  let updateError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { error } = await supabase
      .from('posts')
      .update({
        subcategory_id: subcategoryId,
        title,
        slug,
        excerpt: excerpt || null,
        content,
        tags,
        published,
      })
      .eq('id', id);

    if (!error) {
      updateError = null;
      break;
    }

    updateError = error;

    if (!isUniqueViolation(error)) {
      break;
    }

    slug = await buildUniquePostSlug(title, id);
  }

  if (updateError) {
    if (isUniqueViolation(updateError)) {
      return {
        message: '자동 URL을 고유하게 만들지 못했습니다. 제목을 조금 바꿔서 다시 시도해주세요.',
      };
    }

    return {
      message: updateError.message,
    };
  }

  revalidateAdminPages();
  revalidateArchivePages(
    existing.category.slug,
    existing.subcategory.slug,
    existing.slug
  );
  revalidateArchivePages(category.slug, subcategory.slug, slug);

  if (published) {
    redirect(
      buildArchivePath({
        categorySlug: category.slug,
        subcategorySlug: subcategory.slug,
        postSlug: slug,
      })
    );
  }

  redirect('/admin/posts');
}

export async function deletePostAction(formData: FormData) {
  const id = getRequiredText(formData, 'id', '포스트 ID');
  const existing = await getPostWithRelationsById(id);

  if (!existing) {
    throw new Error('삭제할 포스트를 찾을 수 없습니다.');
  }

  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAdminPages();
  revalidateArchivePages(
    existing.category.slug,
    existing.subcategory.slug,
    existing.slug
  );
  redirect('/admin/posts');
}

export async function deleteCategoryAction(
  _state: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const id = getRequiredText(formData, 'id', '카테고리 ID');

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('id', id)
    .single();

  if (categoryError || !category) {
    return {
      message: '삭제할 카테고리를 찾을 수 없습니다.',
    };
  }

  const { count: subcategoryCount, error: subcategoryError } = await supabase
    .from('subcategories')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (subcategoryError) {
    return {
      message: subcategoryError.message,
    };
  }

  if ((subcategoryCount ?? 0) > 0) {
    return {
      message: '연결된 서브카테고리가 있어 삭제할 수 없습니다. 먼저 하위 서브카테고리와 포스트를 정리해주세요.',
    };
  }

  const { data: subcategoryIdsData, error: subcategoryIdsError } = await supabase
    .from('subcategories')
    .select('id')
    .eq('category_id', id);

  if (subcategoryIdsError) {
    return {
      message: subcategoryIdsError.message,
    };
  }

  const subcategoryIds = (subcategoryIdsData ?? []).map((item) => item.id);

  if (subcategoryIds.length > 0) {
    const { count: postCount, error: postError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .in('subcategory_id', subcategoryIds);

    if (postError) {
      return {
        message: postError.message,
      };
    }

    if ((postCount ?? 0) > 0) {
      return {
        message: '연결된 포스트가 있어 삭제할 수 없습니다.',
      };
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidateAdminPages();
  revalidateArchivePages(category.slug);
  redirect('/admin/categories');
}

export async function deleteSubcategoryAction(
  _state: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const id = getRequiredText(formData, 'id', '서브카테고리 ID');

  const { data: subcategory, error: subcategoryError } = await supabase
    .from('subcategories')
    .select('id, slug, category_id')
    .eq('id', id)
    .single();

  if (subcategoryError || !subcategory) {
    return {
      message: '삭제할 서브카테고리를 찾을 수 없습니다.',
    };
  }

  const { count: postCount, error: postError } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('subcategory_id', id);

  if (postError) {
    return {
      message: postError.message,
    };
  }

  if ((postCount ?? 0) > 0) {
    return {
      message: '연결된 포스트가 있어 삭제할 수 없습니다. 먼저 하위 포스트를 삭제하거나 이동해주세요.',
    };
  }

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', subcategory.category_id)
    .single();

  if (categoryError || !category) {
    return {
      message: '상위 카테고리를 찾을 수 없습니다.',
    };
  }

  const { error } = await supabase.from('subcategories').delete().eq('id', id);

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidateAdminPages();
  revalidateArchivePages(category.slug, subcategory.slug);
  redirect('/admin/subcategories');
}
