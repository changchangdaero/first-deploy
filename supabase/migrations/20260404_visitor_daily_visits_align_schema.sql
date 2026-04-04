begin;

alter table public.visitor_daily_visits
  add column if not exists visited_at timestamptz not null default now();

update public.visitor_daily_visits
set visited_at = coalesce(visited_at, now())
where visited_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'visitor_daily_visits_pkey'
  ) then
    alter table public.visitor_daily_visits
      add constraint visitor_daily_visits_pkey
      primary key (visitor_id, visit_date);
  end if;
end $$;

create index if not exists visitor_daily_visits_visit_date_idx
  on public.visitor_daily_visits (visit_date);

create index if not exists visitor_daily_visits_visitor_id_idx
  on public.visitor_daily_visits (visitor_id);

commit;
