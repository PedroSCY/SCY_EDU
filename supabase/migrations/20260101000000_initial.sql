-- Execute isso no SQL Editor do Supabase Dashboard

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  color text not null default '#3B82F6',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  active boolean not null default true,
  type text not null default 'link',
  created_by_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.links enable row level security;

create policy "Categorias visiveis para todos"
  on public.categories for select
  using (true);

create policy "Categorias editaveis por admins"
  on public.categories for all
  using (auth.role() = 'authenticated');

create policy "Links visiveis para todos"
  on public.links for select
  using (true);

create policy "Links editaveis por admins"
  on public.links for all
  using (auth.role() = 'authenticated');
