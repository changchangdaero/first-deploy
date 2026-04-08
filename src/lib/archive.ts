import { supabase } from '@/lib/supabase/server';
import type {
  CategoryWithSubcategories,
  Category,
  CategorySummary,
  PostRow,
  PostWithRelations,
  Subcategory,
  SubcategorySummary,
} from '@/types/post';

function toPostWithRelations(
  post: PostRow,
  subcategory: Subcategory,
  category: Category
): PostWithRelations {
  return {
    ...post,
    tags: post.tags ?? [],
    subcategory,
    category,
  };
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
    .select('id, name, slug, created_at')
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
    .select('id, name, slug, created_at')
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
    .select('id, name, slug, created_at')
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
    getAllPosts(),
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
      const postCount = categorySubcategories.reduce(
        (count, subcategory) =>
          count + (postCountBySubcategory.get(subcategory.id) ?? 0),
        0
      );
      const subcategoryCount = categorySubcategories.filter(
        (subcategory) => (postCountBySubcategory.get(subcategory.id) ?? 0) > 0
      ).length;

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

  return categories.filter((category) => category.postCount > 0);
}

export async function getSubcategoryById(id: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, created_at')
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
    .select('id, category_id, name, subtitle, slug, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Subcategory[];
}

export async function getSubcategoriesForCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, category_id, name, subtitle, slug, created_at')
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
    .select('id, category_id, name, subtitle, slug, created_at')
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
    getAllPosts(),
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
      subcategory.category.slug === normalizedCategorySlug && subcategory.postCount > 0
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

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, subcategory_id, title, slug, excerpt, content, tags, published, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostRow[];
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, subcategory_id, title, slug, excerpt, content, tags, published, created_at'
    )
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

  return toPostWithRelations(post, subcategory, category);
}

export async function getAdminPosts() {
  const [posts, subcategories, categories] = await Promise.all([
    getAllPosts(),
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

      return toPostWithRelations(post, subcategory, category);
    })
    .filter((value): value is PostWithRelations => value !== null);
}

export async function getPostsForSubcategory(subcategoryId: string, publishedOnly = false) {
  let query = supabase
    .from('posts')
    .select(
      'id, subcategory_id, title, slug, excerpt, content, tags, published, created_at'
    )
    .eq('subcategory_id', subcategoryId)
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostRow[];
}

export async function getPublishedPostsForSubcategory(
  categorySlug: string,
  subcategorySlug: string
) {
  const relation = await getSubcategoryBySlugs(categorySlug, subcategorySlug);

  if (!relation) {
    return null;
  }

  const posts = await getPostsForSubcategory(relation.subcategory.id, true);

  return {
    ...relation,
    posts: posts.map((post) =>
      toPostWithRelations(post, relation.subcategory, relation.category)
    ),
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

  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, subcategory_id, title, slug, excerpt, content, tags, published, created_at'
    )
    .eq('subcategory_id', relation.subcategory.id)
    .eq('slug', normalizedPostSlug)
    .eq('published', true)
    .single();

  if (error) {
    return null;
  }

  return toPostWithRelations(data as PostRow, relation.subcategory, relation.category);
}
