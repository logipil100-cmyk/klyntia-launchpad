create table public.assistant_settings (
  user_id uuid primary key,
  bot_name text not null default '',
  business_hours text not null default '',
  faq text not null default '',
  tone text not null default 'amigável',
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.assistant_settings to authenticated;
grant all on public.assistant_settings to service_role;
alter table public.assistant_settings enable row level security;
create policy "own select" on public.assistant_settings for select to authenticated using (auth.uid() = user_id);
create policy "own insert" on public.assistant_settings for insert to authenticated with check (auth.uid() = user_id);
create policy "own update" on public.assistant_settings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own delete" on public.assistant_settings for delete to authenticated using (auth.uid() = user_id);