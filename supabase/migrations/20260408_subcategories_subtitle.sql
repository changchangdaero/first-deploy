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
