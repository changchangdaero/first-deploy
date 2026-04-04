begin;

create table if not exists public.visitor_daily_visits (
  visitor_id text not null,
  visit_date date not null,
  visited_at timestamptz not null default now(),
  primary key (visitor_id, visit_date)
);

create index if not exists visitor_daily_visits_visit_date_idx
  on public.visitor_daily_visits (visit_date);

create index if not exists visitor_daily_visits_visitor_id_idx
  on public.visitor_daily_visits (visitor_id);

commit;
