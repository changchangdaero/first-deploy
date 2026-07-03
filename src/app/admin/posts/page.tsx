// 관리자 글 목록: "/admin/posts"에서 아카이브 글을 글 목록 카드로 보여줍니다.
import Link from 'next/link';
import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { buildArchivePath, getAdminPosts } from '@/lib/archive';

function formatAdminPostDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

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
                    {subcategoryGroup.items.map((post) => {
                      const postHref = buildArchivePath({
                        categorySlug: post.category.slug,
                        subcategorySlug: post.subcategory.slug,
                        postSlug: post.slug,
                      });

                      return (
                        <Link
                          key={post.id}
                          href={postHref}
                          className="admin-post-card"
                          aria-label={`${post.title} 상세 보기`}
                        >
                          <div>
                            <p className="admin-post-card__eyebrow">
                              {post.category.name} / {post.subcategory.name}
                            </p>
                            <h3 className="admin-post-card__title">{post.title}</h3>
                            {post.excerpt && (
                              <p className="admin-post-card__excerpt">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          <div className="admin-post-card__footer">
                            <time dateTime={post.created_at}>
                              {formatAdminPostDate(post.created_at)}
                            </time>
                            <span
                              className={
                                post.published
                                  ? 'admin-status-badge admin-status-badge--published'
                                  : 'admin-status-badge admin-status-badge--private'
                              }
                            >
                              {post.published ? '공개' : '비공개'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
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
