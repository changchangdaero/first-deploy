-- 아카이브 분류 공개 상태: 글이 없어도 카테고리와 서브카테고리 자체를 공개/비공개로 관리합니다.
begin;

alter table public.categories
  add column if not exists published boolean not null default true;

alter table public.subcategories
  add column if not exists published boolean not null default true;

create index if not exists categories_published_idx
  on public.categories (published);

create index if not exists subcategories_published_idx
  on public.subcategories (published);

commit;
