begin;

create table if not exists public.visitor_visit_logs (
  visitor_id text not null,
  visit_date date not null,
  first_visited_at timestamptz not null default now(),
  last_visited_at timestamptz not null default now(),
  landing_path text not null default '/',
  referrer_host text,
  source_type text not null default 'direct_or_private',
  source_label text not null default '직접 접속 또는 경로 비공개',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text not null default 'unknown',
  is_returning boolean not null default false,
  visitor_class text not null default 'unknown',
  bot_score integer not null default 0,
  classification_reasons text[] not null default '{}',
  user_agent text,
  primary key (visitor_id, visit_date),
  constraint visitor_visit_logs_class_check
    check (visitor_class in ('human_likely', 'bot', 'suspected_bot', 'unknown')),
  constraint visitor_visit_logs_score_check
    check (bot_score between 0 and 100)
);

create index if not exists visitor_visit_logs_visit_date_idx
  on public.visitor_visit_logs (visit_date desc);
create index if not exists visitor_visit_logs_last_visited_at_idx
  on public.visitor_visit_logs (last_visited_at desc);
create index if not exists visitor_visit_logs_class_idx
  on public.visitor_visit_logs (visitor_class);

alter table public.visitor_visit_logs enable row level security;

comment on table public.visitor_visit_logs is
  '관리자만 service role로 조회하는 비공개 방문 분석 로그';

commit;
