// 아카이브 글 타입: 카테고리, 하위 카테고리, 글, 손글씨 블록에서 공유하는 데이터 구조입니다.
export type Category = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  created_at: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  subtitle: string | null;
  slug: string;
  published: boolean;
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

export type PostListRow = Omit<PostRow, 'content'>;

export type PostCountRow = Pick<PostRow, 'id' | 'subcategory_id' | 'published'>;

export type HandwritingPoint = {
  x: number;
  y: number;
  pressure?: number;
};

export type HandwritingLineShape = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type HandwritingEllipseShape = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotation?: number;
};

export type HandwritingStroke = {
  id: string;
  tool: 'pen' | 'eraser';
  color: string;
  size: number;
  points: HandwritingPoint[];
  kind?: 'freehand' | 'line' | 'ellipse';
  line?: HandwritingLineShape;
  ellipse?: HandwritingEllipseShape;
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

export type PostListItemWithRelations = PostListRow & {
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
