import Link from 'next/link';
import { deleteSubcategoryAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import AdminDeleteButton from '@/components/admin/AdminDeleteButton';
import { getSubcategorySummaries } from '@/lib/archive';

export default async function AdminSubcategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const allSubcategories = await getSubcategorySummaries();
  const subcategories = categoryId
    ? allSubcategories.filter((subcategory) => subcategory.category.id === categoryId)
    : allSubcategories;
  const filterCategoryName = subcategories[0]?.category.name;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <AdminArchiveNav />

      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">서브카테고리 관리</h1>
          <p className="text-sm text-gray-500 mt-2">
            {filterCategoryName
              ? `${filterCategoryName} 카테고리에 속한 서브카테고리입니다.`
              : '각 서브카테고리는 하나의 카테고리에 속합니다.'}
          </p>
        </div>
        <div className="flex gap-3">
          {categoryId && (
            <Link
              href="/admin/subcategories"
              className="px-5 py-3 rounded border"
            >
              전체 보기
            </Link>
          )}
          <Link
            href="/admin/subcategories/new"
            className="px-5 py-3 rounded bg-black text-white"
          >
            새 서브카테고리
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="border rounded-xl p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <Link
              href={`/admin/posts?subcategoryId=${subcategory.id}`}
              className="block flex-1 rounded-lg hover:bg-gray-50 transition -m-2 p-2"
            >
              <p className="text-sm text-gray-500">{subcategory.category.name}</p>
              <h2 className="text-xl font-semibold mt-1">{subcategory.name}</h2>
              {subcategory.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subcategory.subtitle}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">slug: {subcategory.slug}</p>
              <p className="text-sm text-gray-500 mt-1">공개 글 {subcategory.postCount}개</p>
            </Link>

            <div className="flex flex-wrap items-start gap-3">
              <Link
                href={`/archive/${subcategory.category.slug}/${subcategory.slug}`}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition"
              >
                공개 보기
              </Link>
              <Link
                href={`/admin/subcategories/${subcategory.id}/edit`}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition"
              >
                수정
              </Link>
              <AdminDeleteButton
                action={deleteSubcategoryAction}
                id={subcategory.id}
                confirmMessage={`서브카테고리 "${subcategory.name}"을(를) 삭제할까요?`}
              />
            </div>
          </div>
        ))}

        {subcategories.length === 0 && (
          <div className="border rounded-xl p-8 text-gray-500">
            아직 등록된 서브카테고리가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
