-- 아카이브 하위 카테고리 부제목 마이그레이션: 카테고리/하위 카테고리 카드에 보일 부제목을 추가합니다.
begin;

alter table public.subcategories
  add column if not exists subtitle text;

update public.subcategories
set
  subtitle = nullif(trim(substring(name from '\(([^()]*)\)\s*$')), ''),
  name = trim(regexp_replace(name, '\s*\([^()]*\)\s*$', ''))
where subtitle is null
  and name ~ '\([^()]*\)\s*$';

commit;
