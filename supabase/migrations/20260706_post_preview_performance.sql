-- Store lightweight preview data so archive lists do not fetch full post content.
begin;

alter table public.posts
  add column if not exists excerpt text,
  add column if not exists thumbnail_url text;

create index if not exists posts_subcategory_published_created_at_idx
  on public.posts (subcategory_id, published, created_at desc);

create index if not exists posts_published_created_at_idx
  on public.posts (published, created_at desc);

create or replace function public.archive_extract_first_image(markdown text)
returns text
language plpgsql
immutable
as $$
declare
  html_match text[];
  markdown_match text[];
  html_url text;
  markdown_url text;
  html_position integer;
  markdown_position integer;
begin
  if markdown is null or btrim(markdown) = '' then
    return null;
  end if;

  html_match := regexp_match(
    markdown,
    $re$(<img[[:space:]][^>]*src[[:space:]]*=[[:space:]]*("([^"]+)"|'([^']+)'|([^[:space:]>]+))[^>]*>)$re$,
    'i'
  );

  markdown_match := regexp_match(
    markdown,
    $re$(!\[[^]]*]\([[:space:]]*(<([^>[:space:]]+)>|([^[:space:])]+)))$re$,
    'i'
  );

  html_url := nullif(btrim(coalesce(html_match[3], html_match[4], html_match[5])), '');
  markdown_url := nullif(btrim(coalesce(markdown_match[3], markdown_match[4])), '');

  if html_url is null then
    return markdown_url;
  end if;

  if markdown_url is null then
    return html_url;
  end if;

  html_position := position(html_match[1] in markdown);
  markdown_position := position(markdown_match[1] in markdown);

  if html_position > 0 and markdown_position > 0 and html_position <= markdown_position then
    return html_url;
  end if;

  return markdown_url;
end;
$$;

create or replace function public.archive_build_excerpt(markdown text, max_length integer default 180)
returns text
language plpgsql
immutable
as $$
declare
  plain text;
begin
  plain := coalesce(markdown, '');
  plain := regexp_replace(plain, $re$<img\b[^>]*>$re$, ' ', 'gi');
  plain := regexp_replace(plain, $re$!\[[^]]*]\([^)]+\)$re$, ' ', 'g');
  plain := regexp_replace(plain, $re$\[([^]]+)]\([^)]+\)$re$, '\1', 'g');
  plain := regexp_replace(plain, $re$</?[^>]+>$re$, ' ', 'g');
  plain := regexp_replace(plain, $re$&nbsp;$re$, ' ', 'gi');
  plain := regexp_replace(plain, $re$&amp;$re$, '&', 'gi');
  plain := regexp_replace(plain, $re$&lt;$re$, '<', 'gi');
  plain := regexp_replace(plain, $re$&gt;$re$, '>', 'gi');
  plain := regexp_replace(plain, $re$&quot;$re$, '"', 'gi');
  plain := regexp_replace(plain, $re$&#39;$re$, '''', 'gi');
  plain := regexp_replace(plain, $re$[#*_~`>]+$re$, ' ', 'g');
  plain := regexp_replace(plain, $re$[[:space:]]+$re$, ' ', 'g');
  plain := btrim(plain);

  if plain = '' then
    return null;
  end if;

  return left(plain, max_length);
end;
$$;

update public.posts
set
  excerpt = coalesce(nullif(btrim(excerpt), ''), public.archive_build_excerpt(content, 180)),
  thumbnail_url = coalesce(
    nullif(btrim(thumbnail_url), ''),
    public.archive_extract_first_image(content)
  )
where content is not null;

drop function public.archive_build_excerpt(text, integer);
drop function public.archive_extract_first_image(text);

commit;
