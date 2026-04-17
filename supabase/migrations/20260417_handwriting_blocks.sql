create table if not exists public.handwriting_blocks (
  id text primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  strokes jsonb not null default '[]'::jsonb,
  preview_image_url text,
  width integer not null default 960,
  height integer not null default 540,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists handwriting_blocks_post_id_idx
  on public.handwriting_blocks (post_id, created_at);

create or replace function public.set_handwriting_blocks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists handwriting_blocks_set_updated_at on public.handwriting_blocks;

create trigger handwriting_blocks_set_updated_at
before update on public.handwriting_blocks
for each row
execute function public.set_handwriting_blocks_updated_at();
