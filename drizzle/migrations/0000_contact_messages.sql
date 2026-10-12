create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  message text not null check (char_length(message) between 1 and 2000),
  lang text not null default 'pt' check (lang in ('pt', 'en')),
  created_at timestamptz not null default now()
);
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;