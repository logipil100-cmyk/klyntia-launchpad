create table public.affiliate_links (
  user_id uuid primary key,
  code text not null unique check (code ~ '^[a-z0-9]{6,16}$'),
  created_at timestamptz not null default now()
);
grant all on public.affiliate_links to service_role;
alter table public.affiliate_links enable row level security;

create table public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  created_at timestamptz not null default now(),
  unique (code, visitor_id)
);
create index affiliate_clicks_code_idx on public.affiliate_clicks(code);
grant all on public.affiliate_clicks to service_role;
alter table public.affiliate_clicks enable row level security;

create table public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null,
  amount_cents integer not null check (amount_cents > 0),
  method text not null check (char_length(method) between 2 and 40),
  details text not null check (char_length(details) between 3 and 300),
  status text not null default 'requested' check (status in ('requested','paid','rejected')),
  created_at timestamptz not null default now()
);
create index affiliate_payouts_aff_idx on public.affiliate_payouts(affiliate_user_id);
grant all on public.affiliate_payouts to service_role;
alter table public.affiliate_payouts enable row level security;

create table public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null,
  referred_user_id uuid not null unique,
  amount_cents integer not null check (amount_cents >= 0),
  status text not null default 'pending' check (status in ('pending','requested','paid')),
  payout_id uuid references public.affiliate_payouts(id),
  created_at timestamptz not null default now()
);
create index affiliate_commissions_aff_idx on public.affiliate_commissions(affiliate_user_id);
grant all on public.affiliate_commissions to service_role;
alter table public.affiliate_commissions enable row level security;