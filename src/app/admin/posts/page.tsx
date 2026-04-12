import Link from 'next/link';
import { deletePostAction } from '@/app/admin/archive-actions';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { buildArchivePath, getAdminPosts } from '@/lib/archive';

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ subcategoryId?: string }>;
}) {
  const { subcategoryId } = await searchParams;
  const allPosts = await getAdminPosts();
  const posts = subcategoryId
    ? allPosts.filter((post) => post.subcategory.id === subcategoryId)
    : allPosts;
  const filterLabel =
    posts[0] && subcategoryId
      ? `${posts[0].category.name} / ${posts[0].subcategory.name}`
      : null;
  const groupedPosts = posts.reduce<
    Array<{
      category: (typeof posts)[number]['category'];
      subcategories: Array<{
        subcategory: (typeof posts)[number]['subcategory'];
        items: typeof posts;
      }>;
    }>
  >((groups, post) => {
    const categoryGroup = groups.find(
      (group) => group.category.id === post.category.id
    );

    if (!categoryGroup) {
      groups.push({
        category: post.category,
        subcategories: [
          {
            subcategory: post.subcategory,
            items: [post],
          },
        ],
      });
      return groups;
    }

    const subcategoryGroup = categoryGroup.subcategories.find(
      (group) => group.subcategory.id === post.subcategory.id
    );

    if (!subcategoryGroup) {
      categoryGroup.subcategories.push({
        subcategory: post.subcategory,
        items: [post],
      });
      return groups;
    }

    subcategoryGroup.items.push(post);
    return groups;
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <AdminArchiveNav />

      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">포스트 관리</h1>
          <p className="text-sm text-gray-500 mt-2">
            {filterLabel
              ? `${filterLabel} 서브카테고리의 포스트 목록입니다.`
              : '포스트는 서브카테고리를 선택해서 생성합니다.'}
          </p>
        </div>
        <div className="flex gap-3">
          {subcategoryId && (
            <Link href="/admin/posts" className="whitespace-nowrap px-5 py-3 rounded border">
              전체 보기
            </Link>
          )}
          <Link
            href="/admin/posts/new"
            className="whitespace-nowrap px-5 py-3 rounded bg-black text-white"
          >
            새 포스트
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {groupedPosts.map((categoryGroup) => (
          <section
            key={categoryGroup.category.id}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="mb-5 border-b border-[var(--border-default)] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                Category
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text-heading)]">
                {categoryGroup.category.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                포스트 {categoryGroup.subcategories.reduce(
                  (count, subcategoryGroup) => count + subcategoryGroup.items.length,
                  0
                )}개
              </p>
            </div>

            <div className="space-y-6">
              {categoryGroup.subcategories.map((subcategoryGroup) => (
                <div key={subcategoryGroup.subcategory.id} className="space-y-4">
                  <div className="rounded-xl bg-[var(--portfolio-surface-muted)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--text-heading)]">
                      {subcategoryGroup.subcategory.name}
                    </p>
                    {subcategoryGroup.subcategory.subtitle && (
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {subcategoryGroup.subcategory.subtitle}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--text-faint)]">
                      포스트 {subcategoryGroup.items.length}개
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {subcategoryGroup.items.map((post) => (
                      <div
                        key={post.id}
                        className="border rounded-xl p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm text-gray-500">
                            {post.category.name} / {post.subcategory.name}
                          </p>
                          <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">slug: {post.slug}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            상태: {post.published ? '공개' : '비공개'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 break-all">
                            URL:{' '}
                            {buildArchivePath({
                              categorySlug: post.category.slug,
                              subcategorySlug: post.subcategory.slug,
                              postSlug: post.slug,
                            })}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          {post.published && (
                            <Link
                              href={buildArchivePath({
                                categorySlug: post.category.slug,
                                subcategorySlug: post.subcategory.slug,
                                postSlug: post.slug,
                              })}
                              className="whitespace-nowrap px-4 py-2 rounded border hover:bg-gray-50 transition"
                            >
                              공개 보기
                            </Link>
                          )}
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="whitespace-nowrap px-4 py-2 rounded border hover:bg-gray-50 transition"
                          >
                            수정
                          </Link>
                          <form action={deletePostAction}>
                            <input type="hidden" name="id" value={post.id} />
                            <button
                              type="submit"
                              className="whitespace-nowrap px-4 py-2 rounded border text-red-600 hover:bg-red-50 transition"
                            >
                              삭제
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {groupedPosts.length === 0 && (
          <div className="border rounded-xl p-8 text-gray-500">
            아직 등록된 포스트가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
