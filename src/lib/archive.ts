// 아카이브 데이터 계층: 공개 아카이브 화면과 관리자 관리 화면에서 쓰는 Supabase 조회와 URL 생성을 담당합니다.
import { createAdminSupabase } from '@/lib/supabase/admin';
import { supabase } from '@/lib/supabase/server';
import type {
  CategoryWithSubcategories,
  Category,
  CategorySummary,
  HandwritingBlockRow,
  PostCountRow,
  PostListItemWithRelations,
  PostListRow,
  PostRow,
  PostWithRelations,
  Subcategory,
  SubcategorySummary,
} from '@/types/post';

export const ARCHIVE_POST_LIST_PAGE_SIZE = 12;

const POST_LIST_SELECT =
  'id, subcategory_id, title, slug, excerpt, thumbnail_url, tags, published, created_at';

const POST_DETAIL_SELECT =
  'id, subcategory_id, title, slug, excerpt, content, thumbnail_url, tags, published, created_at';

const POST_COUNT_SELECT = 'id, subcategory_id, published';

function toPostWithRelations(
  post: PostRow,
  subcategory: Subcategory,
  category: Category,
  handwritingBlocks: HandwritingBlockRow[] = []
): PostWithRelations {
  return {
    ...post,
    tags: post.tags ?? [],
    subcategory,
    category,
    handwritingBlocks,
  };
}

function toPostListItemWithRelations(
  post: PostListRow,
  subcategory: Subcategory,
  category: Category
): PostListItemWithRelations {
  return {
    ...post,
    tags: post.tags ?? [],
    subcategory,
    category,
  };
}

async function getHandwritingBlocksForPostWithClient(
  postId: string,
  client: typeof supabase
) {
  const { data, error } = await client
    .from('handwriting_blocks')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as HandwritingBlockRow[];
}

export async function getHandwritingBlocksForPost(postId: string) {
  return getHandwritingBlocksForPostWithClient(postId, supabase);
}

export async function getAdminHandwritingBlocksForPost(postId: string) {
  return getHandwritingBlocksForPostWithClient(postId, createAdminSupabase());
}

export function buildArchivePath(params: {
  categorySlug: string;
  subcategorySlug?: string;
  postSlug?: string;
}) {
  const segments = ['/archive', params.categorySlug];

  if (params.subcategorySlug) {
    segments.push(params.subcategorySlug);
  }

  if (params.postSlug) {
    segments.push(params.postSlug);
  }

  return segments.map((segment, index) => {
    if (index === 0) {
      return segment;
    }

    return encodeURIComponent(segment.trim());
  }).join('/');
}

export function normalizeRouteSlug(slug: string) {
  return decodeURIComponent(slug).trim();
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, published, created_at')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as Category;
}

export async function getCategoryBySlug(slug: string) {
  const normalizedSlug = normalizeRouteSlug(slug);
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, published, created_at')
    .eq('slug', normalizedSlug)
    .single();

  if (error) {
    return null;
  }

  return data as Category;
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, published, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}

export async function getCategorySummaries(): Promise<CategorySummary[]> {
  const [categories, subcategories, posts] = await Promise.all([
    getAllCategories(),
    getAllSubcategories(),
    getPostCountRows(),
  ]);

  const publishedPosts = posts.filter((post) => post.published);
  const postCountBySubcategory = new Map<string, number>();

  publishedPosts.forEach((post) => {
    postCountBySubcategory.set(
      post.subcategory_id,
      (postCountBySubcategory.get(post.subcategory_id) ?? 0) + 1
    );
  });

  return categories
    .map((category) => {
      const categorySubcategories = subcategories.filter(
        (subcategory) => subcategory.category_id === category.id
      );
      const publishedSubcategories = categorySubcategories.filter(
        (subcategory) => subcategory.published
      );
      const postCount = publishedSubcategories.reduce(
        (count, subcategory) =>
          count + (postCountBySubcategory.get(subcategory.id) ?? 0),
        0
      );
      const subcategoryCount = publishedSubcategories.length;

      return {
        ...category,
        postCount,
        subcategoryCount,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
}

export async function getPublishedCategorySummaries() {
  const categories = await getCategorySummaries();

  return categories.filter((category) => category.published);
}

export async function getSubcategoryById(id: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, published, created_at')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as Subcategory;
}

export async function getAllSubcategories() {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, published, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Subcategory[];
}

export async function getSubcategoriesForCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, published, created_at')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Subcategory[];
}

export async function getSubcategoryBySlugs(
  categorySlug: string,
  subcategorySlug: string
) {
  const normalizedCategorySlug = normalizeRouteSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeRouteSlug(subcategorySlug);
  const category = await getCategoryBySlug(normalizedCategorySlug);

  if (!category) {
    return null;
  }

  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, published, created_at')
    .eq('category_id', category.id)
    .eq('slug', normalizedSubcategorySlug)
    .single();

  if (error) {
    return null;
  }

  return {
    category,
    subcategory: data as Subcategory,
  };
}

export async function getSubcategorySummaries() {
  const [categories, subcategories, posts] = await Promise.all([
    getAllCategories(),
    getAllSubcategories(),
    getPostCountRows(),
  ]);

  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const publishedPosts = posts.filter((post) => post.published);
  const postCountBySubcategory = new Map<string, number>();

  publishedPosts.forEach((post) => {
    postCountBySubcategory.set(
      post.subcategory_id,
      (postCountBySubcategory.get(post.subcategory_id) ?? 0) + 1
    );
  });

  return subcategories
    .map((subcategory) => {
      const category = categoryMap.get(subcategory.category_id);

      if (!category) {
        return null;
      }

      return {
        ...subcategory,
        category,
        postCount: postCountBySubcategory.get(subcategory.id) ?? 0,
      };
    })
    .filter((value): value is SubcategorySummary => value !== null)
    .sort((a, b) => {
      const categoryDiff = a.category.name.localeCompare(b.category.name, 'ko-KR');

      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      return a.name.localeCompare(b.name, 'ko-KR');
    });
}

export async function getPublishedSubcategorySummaries(categorySlug: string) {
  const normalizedCategorySlug = normalizeRouteSlug(categorySlug);
  const relation = await getSubcategorySummaries();

  return relation.filter(
    (subcategory) =>
      subcategory.category.slug === normalizedCategorySlug &&
      subcategory.category.published &&
      subcategory.published
  );
}

export async function getSubcategoryOptions() {
  const summaries = await getSubcategorySummaries();

  return summaries.map((subcategory) => ({
    id: subcategory.id,
    label: `${subcategory.category.name} / ${subcategory.name}`,
    categorySlug: subcategory.category.slug,
    subcategorySlug: subcategory.slug,
  }));
}

export async function getCategoryTree(): Promise<CategoryWithSubcategories[]> {
  const [categories, subcategories] = await Promise.all([
    getAllCategories(),
    getAllSubcategories(),
  ]);

  return categories
    .map((category) => ({
      ...category,
      subcategories: subcategories
        .filter((subcategory) => subcategory.category_id === category.id)
        .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR')),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
}

async function getPostCountRows() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COUNT_SELECT);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostCountRow[];
}

async function getAllPostListRows() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_LIST_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostListRow[];
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_DETAIL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as PostRow;
}

export async function getPostWithRelationsById(id: string) {
  const post = await getPostById(id);

  if (!post) {
    return null;
  }

  const subcategory = await getSubcategoryById(post.subcategory_id);

  if (!subcategory) {
    return null;
  }

  const category = await getCategoryById(subcategory.category_id);

  if (!category) {
    return null;
  }

  const handwritingBlocks = await getAdminHandwritingBlocksForPost(post.id);

  return toPostWithRelations(post, subcategory, category, handwritingBlocks);
}

export async function getAdminPosts() {
  const [posts, subcategories, categories] = await Promise.all([
    getAllPostListRows(),
    getAllSubcategories(),
    getAllCategories(),
  ]);

  const subcategoryMap = new Map(subcategories.map((subcategory) => [subcategory.id, subcategory]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return posts
    .map((post) => {
      const subcategory = subcategoryMap.get(post.subcategory_id);

      if (!subcategory) {
        return null;
      }

      const category = categoryMap.get(subcategory.category_id);

      if (!category) {
        return null;
      }

      return toPostListItemWithRelations(post, subcategory, category);
    })
    .filter((value): value is PostListItemWithRelations => value !== null);
}

async function getPostListRowsForSubcategory({
  subcategoryId,
  publishedOnly = false,
  limit,
}: {
  subcategoryId: string;
  publishedOnly?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('posts')
    .select(POST_LIST_SELECT)
    .eq('subcategory_id', subcategoryId)
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  if (limit && limit > 0) {
    query = query.range(0, limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostListRow[];
}

export async function getPublishedPostsForSubcategory(
  categorySlug: string,
  subcategorySlug: string,
  options: {
    page?: number;
    pageSize?: number;
  } = {}
) {
  const relation = await getSubcategoryBySlugs(categorySlug, subcategorySlug);

  if (!relation) {
    return null;
  }

  if (!relation.category.published || !relation.subcategory.published) {
    return null;
  }

  const page = Math.max(1, Math.floor(options.page ?? 1));
  const pageSize = Math.max(1, options.pageSize ?? ARCHIVE_POST_LIST_PAGE_SIZE);
  const visiblePostCount = page * pageSize;
  const posts = await getPostListRowsForSubcategory({
    subcategoryId: relation.subcategory.id,
    publishedOnly: true,
    limit: visiblePostCount + 1,
  });
  const visiblePosts = posts.slice(0, visiblePostCount);

  return {
    ...relation,
    posts: visiblePosts.map((post) =>
      toPostListItemWithRelations(post, relation.subcategory, relation.category)
    ),
    pagination: {
      page,
      pageSize,
      hasMore: posts.length > visiblePostCount,
    },
  };
}

export async function getPublishedPostBySlugs(
  categorySlug: string,
  subcategorySlug: string,
  postSlug: string
) {
  const normalizedPostSlug = normalizeRouteSlug(postSlug);
  const relation = await getSubcategoryBySlugs(categorySlug, subcategorySlug);

  if (!relation) {
    return null;
  }

  if (!relation.category.published || !relation.subcategory.published) {
    return null;
  }

  const { data, error } = await supabase
    .from('posts')
    .select(POST_DETAIL_SELECT)
    .eq('subcategory_id', relation.subcategory.id)
    .eq('slug', normalizedPostSlug)
    .eq('published', true)
    .single();

  if (error) {
    return null;
  }

  const post = data as PostRow;
  const handwritingBlocks = await getHandwritingBlocksForPost(post.id);

  return toPostWithRelations(
    post,
    relation.subcategory,
    relation.category,
    handwritingBlocks
  );
}

export async function getAdminPostBySlugs(
  categorySlug: string,
  subcategorySlug: string,
  postSlug: string
) {
  const normalizedPostSlug = normalizeRouteSlug(postSlug);
  const relation = await getSubcategoryBySlugs(categorySlug, subcategorySlug);

  if (!relation) {
    return null;
  }

  const { data, error } = await createAdminSupabase()
    .from('posts')
    .select(POST_DETAIL_SELECT)
    .eq('subcategory_id', relation.subcategory.id)
    .eq('slug', normalizedPostSlug)
    .single();

  if (error) {
    return null;
  }

  const post = data as PostRow;
  const handwritingBlocks = await getAdminHandwritingBlocksForPost(post.id);

  return toPostWithRelations(
    post,
    relation.subcategory,
    relation.category,
    handwritingBlocks
  );
}
