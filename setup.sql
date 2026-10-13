-- Paste this whole file into Supabase -> SQL Editor -> Run (once).
-- BEFORE running: replace YOUR-ADMIN-EMAIL@example.com (3 places) with the
-- email you will log in with on the Admin page.

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  price        numeric not null,
  category     text,
  note         text,
  retail_url   text,
  retail_price numeric,
  image_url    text,
  image_path   text,
  visible      boolean not null default true
);

alter table public.products enable row level security;

-- Let the website reach the table (the policies below still decide who sees/edits what)
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- Everyone can see visible products
create policy "public can read visible products"
  on public.products for select
  using (visible = true);

-- Only the admin can see hidden products and add / edit / delete
create policy "admin full access"
  on public.products for all to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR-ADMIN-EMAIL@example.com')
  with check ((auth.jwt() ->> 'email') = 'YOUR-ADMIN-EMAIL@example.com');

-- Public photo bucket (anyone can view photos, only admin can upload)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "admin manages product photos"
  on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'YOUR-ADMIN-EMAIL@example.com')
  with check (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'YOUR-ADMIN-EMAIL@example.com');
