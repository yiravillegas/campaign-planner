create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  business_brief text not null,
  audience text not null,
  goal text not null,
  offer text not null default '',
  channels text[] not null default '{}',
  start_date date not null,
  duration_days integer not null check (duration_days between 7 and 90),
  posts_per_week integer not null default 3 check (posts_per_week between 1 and 7),
  strategy text,
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'ready_for_review', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_owner_updated_idx on public.campaigns (owner_id, updated_at desc);
alter table public.campaigns enable row level security;

drop policy if exists "Users can read their campaigns" on public.campaigns;
create policy "Users can read their campaigns"
  on public.campaigns for select to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Users can create their campaigns" on public.campaigns;
create policy "Users can create their campaigns"
  on public.campaigns for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Users can edit their campaigns" on public.campaigns;
create policy "Users can edit their campaigns"
  on public.campaigns for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "Users can delete their campaigns" on public.campaigns;
create policy "Users can delete their campaigns"
  on public.campaigns for delete to authenticated
  using (owner_id = (select auth.uid()));

create or replace function public.set_campaign_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
  before update on public.campaigns
  for each row execute function public.set_campaign_updated_at();
