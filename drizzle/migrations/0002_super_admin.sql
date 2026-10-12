create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles select" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create table public.plans (
  id text primary key check (id ~ '^[a-z0-9_-]{2,30}$'),
  name text not null check (char_length(name) between 1 and 60),
  price_monthly_cents integer not null check (price_monthly_cents >= 0),
  active boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);
grant all on public.plans to service_role;
alter table public.plans enable row level security;
insert into public.plans (id, name, price_monthly_cents, sort) values
  ('starter','Starter',2900,1),('pro','Pro',8900,2),('scale','Scale',19900,3);

create table public.subscriptions (
  user_id uuid primary key,
  plan_id text not null references public.plans(id),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  updated_at timestamptz not null default now()
);
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  action text not null,
  target text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_created_idx on public.audit_log(created_at desc);
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;