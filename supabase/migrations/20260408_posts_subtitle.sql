begin;

alter table public.posts
  add column if not exists subtitle text;

commit;
