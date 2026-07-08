-- Execute isso no SQL Editor do Supabase Dashboard
alter table public.links add column if not exists active boolean not null default true;
