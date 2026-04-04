import Link from 'next/link';
import { deleteCategoryAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import AdminDeleteButton from '@/components/admin/AdminDeleteButton';
import { getCategorySummaries } from '@/lib/archive';

export default async function AdminCategoriesPage() {
  const categories = await getCategorySummaries();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <AdminArchiveNav />

      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">카테고리 관리</h1>
          <p className="text-sm text-gray-500 mt-2">
            최상위 카테고리를 먼저 만들고, 그 아래에 서브카테고리를 연결합니다.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-5 py-3 rounded bg-black text-white"
        >
          새 카테고리
        </Link>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-xl p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <Link
              href={`/admin/subcategories?categoryId=${category.id}`}
              className="block flex-1 rounded-lg hover:bg-gray-50 transition -m-2 p-2"
            >
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-sm text-gray-500 mt-1">slug: {category.slug}</p>
              <p className="text-sm text-gray-500 mt-1">
                서브카테고리 {category.subcategoryCount}개 / 공개 글 {category.postCount}개
              </p>
            </Link>

            <div className="flex flex-wrap items-start gap-3">
              <Link
                href={`/archive/${category.slug}`}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition"
              >
                공개 보기
              </Link>
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition"
              >
                수정
              </Link>
              <AdminDeleteButton
                action={deleteCategoryAction}
                id={category.id}
                confirmMessage={`카테고리 "${category.name}"을(를) 삭제할까요?`}
              />
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="border rounded-xl p-8 text-gray-500">
            아직 등록된 카테고리가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
