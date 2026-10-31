-- supabase/migrations/006_storage_buckets.sql
-- Every storage bucket the site uploads to. public-site-images and its policies
-- come from 003 and 004. Run after 005_role_permissions.sql.
-- Idempotent: safe to run more than once in the Supabase SQL Editor.

-- 1. Website photos can be viewed by anyone; customer files and receipts stay private
insert into storage.buckets (id, name, public) values
  ('public-site-images', 'public-site-images', true),
  ('images', 'images', true),
  ('gallery-images', 'gallery-images', true),
  ('profile-images', 'profile-images', true),
  ('customer-files', 'customer-files', false),
  ('receipts', 'receipts', false)
on conflict (id) do update set public = excluded.public;

-- 2. Website photos: anyone can view, admin staff can manage
drop policy if exists "Anyone can read website photos" on storage.objects;
drop policy if exists "Admins can upload website photos" on storage.objects;
drop policy if exists "Admins can update website photos" on storage.objects;
drop policy if exists "Admins can delete website photos" on storage.objects;
create policy "Anyone can read website photos" on storage.objects for select
  using (bucket_id in ('images', 'gallery-images', 'profile-images'));
create policy "Admins can upload website photos" on storage.objects for insert
  with check (bucket_id in ('images', 'gallery-images', 'profile-images') and public.is_admin());
create policy "Admins can update website photos" on storage.objects for update
  using (bucket_id in ('images', 'gallery-images', 'profile-images') and public.is_admin())
  with check (bucket_id in ('images', 'gallery-images', 'profile-images') and public.is_admin());
create policy "Admins can delete website photos" on storage.objects for delete
  using (bucket_id in ('images', 'gallery-images', 'profile-images') and public.is_admin());

-- 3. Customer files and receipts: admin staff only
drop policy if exists "Admins can read private files" on storage.objects;
drop policy if exists "Admins can upload private files" on storage.objects;
drop policy if exists "Admins can update private files" on storage.objects;
drop policy if exists "Admins can delete private files" on storage.objects;
create policy "Admins can read private files" on storage.objects for select
  using (bucket_id in ('customer-files', 'receipts') and public.is_admin());
create policy "Admins can upload private files" on storage.objects for insert
  with check (bucket_id in ('customer-files', 'receipts') and public.is_admin());
create policy "Admins can update private files" on storage.objects for update
  using (bucket_id in ('customer-files', 'receipts') and public.is_admin())
  with check (bucket_id in ('customer-files', 'receipts') and public.is_admin());
create policy "Admins can delete private files" on storage.objects for delete
  using (bucket_id in ('customer-files', 'receipts') and public.is_admin());
