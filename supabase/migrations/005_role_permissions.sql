-- supabase/migrations/005_role_permissions.sql
-- This Supabase project does not give the anon and authenticated roles automatic
-- access to new tables or functions. Without these grants a signed-in user cannot read
-- public.profiles, so the app treats every account (global admins too) as a customer,
-- and every dashboard fails. Row level security still decides which rows each person
-- can see or change. Run after 004_site_branding.sql.
-- Idempotent: safe to run more than once in the Supabase SQL Editor.

-- 1. Grants below rely on row level security, so make sure it is on everywhere
do $$
declare
  t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end;
$$;

-- 2. Signed-in users: table access, limited by each table's policies
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- 3. Helpers that the policies call
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_global_admin() to anon, authenticated;
grant execute on function public.current_user_role() to anon, authenticated;
grant execute on function public.current_customer_id() to anon, authenticated;
grant execute on function public.can_access_customer(uuid) to anon, authenticated;

-- 4. Visitors: public website content and the two public forms
grant select on public.services, public.service_categories, public.gallery_items,
  public.gallery_albums, public.page_sections, public.website_pages,
  public.website_content_blocks to anon;
grant insert on public.contact_submissions, public.service_requests to anon;

-- 5. Tables added later get the same signed-in access
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;
