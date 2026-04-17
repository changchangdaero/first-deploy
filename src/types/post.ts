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
  subtitle: string | null;
  slug: string;
  created_at: string;
};

export type PostRow = {
  id: string;
  subcategory_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail_url?: string | null;
  tags: string[] | null;
  published: boolean;
  created_at: string;
};

export type HandwritingPoint = {
  x: number;
  y: number;
  pressure?: number;
};

export type HandwritingStroke = {
  id: string;
  tool: 'pen' | 'eraser';
  color: string;
  size: number;
  points: HandwritingPoint[];
};

export type HandwritingBlockRow = {
  id: string;
  post_id: string;
  strokes: HandwritingStroke[];
  preview_image_url: string | null;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
};

export type HandwritingBlockInput = Omit<
  HandwritingBlockRow,
  'post_id' | 'created_at' | 'updated_at'
>;

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
  handwritingBlocks: HandwritingBlockRow[];
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
