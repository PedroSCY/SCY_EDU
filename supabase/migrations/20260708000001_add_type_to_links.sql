-- Execute isso no SQL Editor do Supabase Dashboard
alter table public.links add column if not exists type text not null default 'link';
