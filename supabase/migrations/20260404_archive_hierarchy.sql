begin;

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

alter table public.posts
  add column if not exists subcategory_id uuid;

insert into public.categories (name, slug, created_at)
select distinct
  p.category,
  p.category_slug,
  min(p.created_at) over (partition by p.category_slug)
from public.posts p
where p.category is not null
  and p.category_slug is not null
on conflict (slug) do update
set name = excluded.name;

insert into public.subcategories (category_id, name, slug, created_at)
select distinct
  c.id,
  p.subcategory,
  p.subcategory_slug,
  min(p.created_at) over (partition by p.category_slug, p.subcategory_slug)
from public.posts p
join public.categories c
  on c.slug = p.category_slug
where p.subcategory is not null
  and p.subcategory_slug is not null
on conflict (category_id, slug) do update
set name = excluded.name;

update public.posts p
set subcategory_id = s.id
from public.categories c
join public.subcategories s
  on s.category_id = c.id
where c.slug = p.category_slug
  and s.slug = p.subcategory_slug
  and p.subcategory_id is null;

alter table public.posts
  alter column subcategory_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_subcategory_id_fkey'
  ) then
    alter table public.posts
      add constraint posts_subcategory_id_fkey
      foreign key (subcategory_id)
      references public.subcategories(id)
      on delete cascade;
  end if;
end $$;

create unique index if not exists posts_subcategory_slug_unique
  on public.posts (subcategory_id, slug);

create index if not exists subcategories_category_id_idx
  on public.subcategories (category_id);

create index if not exists posts_subcategory_id_idx
  on public.posts (subcategory_id);

alter table public.posts
  drop column if exists category,
  drop column if exists category_slug,
  drop column if exists subcategory,
  drop column if exists subcategory_slug;

commit;
