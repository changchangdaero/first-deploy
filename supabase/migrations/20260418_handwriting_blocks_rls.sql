-- 손글씨 블록 정책: 공개 읽기와 관리자 편집을 위한 행 수준 보안 규칙을 적용합니다.
alter table public.handwriting_blocks enable row level security;

drop policy if exists "temp_read_all_handwriting_blocks" on public.handwriting_blocks;
drop policy if exists "public_can_read_published_post_handwriting_blocks" on public.handwriting_blocks;

create policy "public_can_read_published_post_handwriting_blocks"
on public.handwriting_blocks
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.posts
    where posts.id = handwriting_blocks.post_id
      and posts.published = true
  )
);
