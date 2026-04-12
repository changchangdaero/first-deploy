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
  const groupedSubcategories = subcategories.reduce<
    Array<{
      category: (typeof subcategories)[number]['category'];
      items: typeof subcategories;
    }>
  >((groups, subcategory) => {
    const existingGroup = groups.find(
      (group) => group.category.id === subcategory.category.id
    );

    if (existingGroup) {
      existingGroup.items.push(subcategory);
      return groups;
    }

    groups.push({
      category: subcategory.category,
      items: [subcategory],
    });

    return groups;
  }, []);
  const filterCategoryName = groupedSubcategories[0]?.category.name;

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

      <div className="space-y-8">
        {groupedSubcategories.map((group) => (
          <section
            key={group.category.id}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-default)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Category
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--text-heading)]">
                  {group.category.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  서브카테고리 {group.items.length}개
                </p>
              </div>

              <Link
                href={`/admin/categories/${group.category.id}/edit`}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition whitespace-nowrap"
              >
                카테고리 수정
              </Link>
            </div>

            <div className="grid gap-4">
              {group.items.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="border rounded-xl p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <Link
                    href={`/admin/posts?subcategoryId=${subcategory.id}`}
                    className="block flex-1 rounded-lg hover:bg-gray-50 transition -m-2 p-2"
                  >
                    <h3 className="text-xl font-semibold text-[var(--text-heading)]">
                      {subcategory.name}
                    </h3>
                    {subcategory.subtitle && (
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {subcategory.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                      slug: {subcategory.slug}
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      공개 글 {subcategory.postCount}개
                    </p>
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
            </div>
          </section>
        ))}

        {groupedSubcategories.length === 0 && (
          <div className="border rounded-xl p-8 text-gray-500">
            아직 등록된 서브카테고리가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
