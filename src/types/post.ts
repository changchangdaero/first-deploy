export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type PostRow = {
  id: string;
  subcategory_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  tags: string[] | null;
  published: boolean;
  created_at: string;
};

export type CategorySummary = Category & {
  postCount: number;
  subcategoryCount: number;
};

export type SubcategoryWithCategory = Subcategory & {
  category: Category;
};

export type SubcategorySummary = SubcategoryWithCategory & {
  postCount: number;
};

export type PostWithRelations = PostRow & {
  tags: string[];
  category: Category;
  subcategory: Subcategory;
};

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

export type AdminPostFormState = {
  message: string | null;
};

export type AdminActionState = {
  message: string | null;
};
