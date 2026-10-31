-- supabase/migrations/003_page_editor.sql
-- In-context page editor: page_blocks + content_revisions, global-admin-only writes,
-- public read grants, and default blocks for every public page.
-- Idempotent: safe to run more than once in the Supabase SQL Editor.

-- ==========================================
-- 1. SECURITY HELPERS (SECURITY DEFINER, so policies never re-enter profiles RLS)
-- ==========================================

create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'global_admin' and coalesce(is_active, false)
       from public.profiles
      where id = auth.uid()),
    false
  );
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.is_global_admin() to anon, authenticated;
grant execute on function public.current_user_role() to anon, authenticated;

-- The 001 profiles policies query profiles from inside a profiles policy, which
-- Postgres rejects with "infinite recursion detected in policy for relation profiles".
-- Re-create them on top of the security-definer helpers.
drop policy if exists "Global admin can do everything on profiles" on public.profiles;
create policy "Global admin can do everything on profiles" on public.profiles for all
  using (public.is_global_admin())
  with check (public.is_global_admin());

drop policy if exists "Users can update their own profile fields" on public.profiles;
create policy "Users can update their own profile fields" on public.profiles for update
  using (auth.uid() = id)
  with check (role = public.current_user_role() or public.is_global_admin());

-- ==========================================
-- 2. TABLES
-- ==========================================

create table if not exists public.global_styles (
  id text primary key default 'default',
  logo_url text,
  favicon_url text,
  primary_color text default '#3b82f6',
  secondary_color text default '#1e293b',
  accent_color text default '#ef4444',
  heading_font text default 'Geist Sans',
  body_font text default 'Geist Sans',
  border_radius text default '0.75rem',
  max_width text default '1280px',
  updated_at timestamp with time zone default now()
);

create table if not exists public.page_blocks (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,
  block_type text not null,
  display_order integer default 0,
  is_visible boolean default true,
  draft_data jsonb default '{}'::jsonb not null,
  published_data jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists page_blocks_page_order_idx on public.page_blocks (page_id, display_order);

create table if not exists public.content_revisions (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,
  blocks_snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.global_styles enable row level security;
alter table public.page_blocks enable row level security;
alter table public.content_revisions enable row level security;

-- ==========================================
-- 3. ROW LEVEL SECURITY
-- ==========================================

-- GLOBAL STYLES
drop policy if exists "Anyone can read global styles" on public.global_styles;
drop policy if exists "Only global admins can update global styles" on public.global_styles;
drop policy if exists "Global admins can insert global styles" on public.global_styles;
drop policy if exists "Global admins can update global styles" on public.global_styles;
drop policy if exists "Global admins can delete global styles" on public.global_styles;
create policy "Anyone can read global styles" on public.global_styles for select using (true);
create policy "Global admins can insert global styles" on public.global_styles for insert
  with check (public.is_global_admin());
create policy "Global admins can update global styles" on public.global_styles for update
  using (public.is_global_admin()) with check (public.is_global_admin());
create policy "Global admins can delete global styles" on public.global_styles for delete
  using (public.is_global_admin());

-- PAGE BLOCKS
drop policy if exists "Anyone can read page blocks" on public.page_blocks;
drop policy if exists "Only global admins can manage page blocks" on public.page_blocks;
drop policy if exists "Global admins can insert page blocks" on public.page_blocks;
drop policy if exists "Global admins can update page blocks" on public.page_blocks;
drop policy if exists "Global admins can delete page blocks" on public.page_blocks;
create policy "Anyone can read page blocks" on public.page_blocks for select using (true);
create policy "Global admins can insert page blocks" on public.page_blocks for insert
  with check (public.is_global_admin());
create policy "Global admins can update page blocks" on public.page_blocks for update
  using (public.is_global_admin()) with check (public.is_global_admin());
create policy "Global admins can delete page blocks" on public.page_blocks for delete
  using (public.is_global_admin());

-- CONTENT REVISIONS
drop policy if exists "Only global admins can select revisions" on public.content_revisions;
drop policy if exists "Only global admins can insert revisions" on public.content_revisions;
drop policy if exists "Global admins can read revisions" on public.content_revisions;
drop policy if exists "Global admins can insert revisions" on public.content_revisions;
drop policy if exists "Global admins can update revisions" on public.content_revisions;
drop policy if exists "Global admins can delete revisions" on public.content_revisions;
create policy "Global admins can read revisions" on public.content_revisions for select
  using (public.is_global_admin());
create policy "Global admins can insert revisions" on public.content_revisions for insert
  with check (public.is_global_admin());
create policy "Global admins can update revisions" on public.content_revisions for update
  using (public.is_global_admin()) with check (public.is_global_admin());
create policy "Global admins can delete revisions" on public.content_revisions for delete
  using (public.is_global_admin());

-- STORAGE: "Replace photo" uploads into the existing public-site-images bucket
drop policy if exists "Anyone can read public site images" on storage.objects;
drop policy if exists "Global admins can upload public site images" on storage.objects;
drop policy if exists "Global admins can update public site images" on storage.objects;
drop policy if exists "Global admins can delete public site images" on storage.objects;
create policy "Anyone can read public site images" on storage.objects for select
  using (bucket_id = 'public-site-images');
create policy "Global admins can upload public site images" on storage.objects for insert
  with check (bucket_id = 'public-site-images' and public.is_global_admin());
create policy "Global admins can update public site images" on storage.objects for update
  using (bucket_id = 'public-site-images' and public.is_global_admin())
  with check (bucket_id = 'public-site-images' and public.is_global_admin());
create policy "Global admins can delete public site images" on storage.objects for delete
  using (bucket_id = 'public-site-images' and public.is_global_admin());

-- ==========================================
-- 4. GRANTS (RLS still decides which rows each role can touch)
-- ==========================================

grant select on public.page_blocks to anon, authenticated;
grant all on public.page_blocks, public.content_revisions to authenticated;
grant select on public.global_styles to anon, authenticated;
grant all on public.global_styles to authenticated;

grant select on public.services, public.gallery_items, public.site_content,
  public.company_settings, public.profiles, public.navigation_items to anon;

-- ==========================================
-- 5. DEFAULT BLOCKS (only for pages that have no blocks yet)
-- Generated from src/components/blocks/defaultPages.json
-- ==========================================

insert into public.global_styles (id) values ('default') on conflict (id) do nothing;

-- home
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'home', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"large","title":"Premium Plumbing & General Contracting","subtitle":"Expert maintenance, urgent emergency dispatch, and custom remodeling services at your fingertips. Manage operations through our live client portal.","ctaText":"Book a Service","ctaUrl":"/request-service","secondaryCtaText":"View Our Work","secondaryCtaUrl":"/gallery","backgroundImage":""}$json$::jsonb),
  ('features', 20, $json${"title":"Why Aquaman Contracting is Rated #1","subtitle":"Our primary design values","items":[{"icon":"shield","title":"Licensed & Fully Insured","desc":"Our technicians are certified plumbing engineers and General B contractors who respect your property."},{"icon":"calendar","title":"State-of-the-Art Scheduling","desc":"Book, adjust, pay invoices, and review high-resolution project files instantly via our premium client portal."},{"icon":"dollar","title":"Fixed, Transparent Pricing","desc":"Enjoy absolute cost certainty. We compile comprehensive upfront estimates with line-by-line transparency."}]}$json$::jsonb),
  ('services_grid', 30, $json${"title":"Our Services","subtitle":"Professional plumbing and general contracting solutions for residential & commercial needs.","limit":6}$json$::jsonb),
  ('cta_banner', 40, $json${"title":"Have a leak, clog, or remodel in mind?","body":"Tell us what's going on and our dispatch team will get back to you fast.","buttonText":"Request Service","buttonUrl":"/request-service"}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'home');

-- about
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'about', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"compact","title":"About Aquaman Plumbing & General Contracting","subtitle":"Providing high-quality plumbing and contracting services with integrity, reliability, and precision.","ctaText":"","ctaUrl":"","secondaryCtaText":"","secondaryCtaUrl":"","backgroundImage":""}$json$::jsonb),
  ('text_image', 20, $json${"title":"Our Story & Mission","body":"Founded with a commitment to premium craftsmanship, Aquaman has grown from a local plumbing team into a premier general contracting firm. We specialize in handling complex residential and commercial water systems, high-efficiency upgrades, custom bathroom & kitchen remodeling, and general maintenance.","quote":"Our mission is to safeguard our clients' homes and commercial investments by delivering robust plumbing engineering, professional project management, and completely transparent pricing on every job.","image_url":"","image_side":"right"}$json$::jsonb),
  ('features', 30, $json${"title":"Why Homeowners Trust Us","subtitle":"","items":[{"icon":"check","title":"Licensed & Insured","desc":"Licensed & insured plumbing and contracting experts."},{"icon":"calendar","title":"Digital Client Portal","desc":"Comprehensive scheduling & digital client portal tracking."},{"icon":"wrench","title":"Advanced Diagnostics","desc":"Advanced hydro-jetting, drain camera scans, and leak diagnostics."},{"icon":"clock","title":"24/7 Emergency Support","desc":"24/7 emergency support for pipe bursts, backups & failures."}]}$json$::jsonb),
  ('features', 40, $json${"title":"Licenses & Accreditations","subtitle":"","items":[{"icon":"shield","title":"Licensed Plumber","desc":"Fully compliant with California State Licensing Board regulations."},{"icon":"award","title":"General B Contractor","desc":"Qualified to execute structural alterations, plumbing upgrades & framing."},{"icon":"droplet","title":"Water Treatment Certified","desc":"Specialized in filtration systems, leak detection & pool diagnostics."}]}$json$::jsonb),
  ('team', 50, $json${"title":"Meet Our Leadership Team","subtitle":"","members":[{"name":"David \"Aquaman\" Carter","role":"Founder & Master Plumber","bio":"Over 15 years of complex water treatment & mechanical engineering experience.","photo":""},{"name":"Marcus Rodriguez","role":"Lead Contracting Estimator","bio":"Expert in structural design, kitchen remodeling, and customer logistics.","photo":""}]}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'about');

-- services
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'services', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"compact","title":"Our Services","subtitle":"Professional plumbing and general contracting solutions designed for residential & commercial needs.","ctaText":"","ctaUrl":"","secondaryCtaText":"","secondaryCtaUrl":"","backgroundImage":""}$json$::jsonb),
  ('services_grid', 20, $json${"title":"","subtitle":"","limit":0}$json$::jsonb),
  ('cta_banner', 30, $json${"title":"Not sure which service you need?","body":"Describe the problem and we'll recommend the right fix.","buttonText":"Contact Us","buttonUrl":"/contact"}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'services');

-- gallery
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'gallery', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"compact","title":"Project Gallery","subtitle":"Explore our professional plumbing installations, bathroom transformations, and general contracting work.","ctaText":"","ctaUrl":"","secondaryCtaText":"","secondaryCtaUrl":"","backgroundImage":""}$json$::jsonb),
  ('gallery_grid', 20, $json${"title":"","subtitle":""}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'gallery');

-- contact
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'contact', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"compact","title":"Contact Us","subtitle":"Got a plumbing emergency, leak, or custom home remodel? Get in touch with our certified engineers today.","ctaText":"","ctaUrl":"","secondaryCtaText":"","secondaryCtaUrl":"","backgroundImage":""}$json$::jsonb),
  ('contact_info', 20, $json${"title":"Get in Touch","body":"Complete the quick contact form or reach out directly. We respond to all non-emergency inquiries within 2 hours."}$json$::jsonb),
  ('contact_form', 30, $json${"title":"Send us a Message","intro":"","buttonText":"Send Message","successMessage":"Message submitted successfully!"}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'contact');

-- request-service
insert into public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
select 'request-service', v.block_type, v.display_order, true, v.data, v.data
from (values
  ('hero', 10, $json${"variant":"compact","title":"Book / Request a Service","subtitle":"Please fill out the form below. Once submitted, our dispatch coordinators will contact you to finalize the schedule.","ctaText":"","ctaUrl":"","secondaryCtaText":"","secondaryCtaUrl":"","backgroundImage":""}$json$::jsonb),
  ('request_form', 20, $json${"title":"","intro":"","buttonText":"Submit Service Request","successMessage":"Booking request submitted! We will contact you soon."}$json$::jsonb)
) as v(block_type, display_order, data)
where not exists (select 1 from public.page_blocks where page_id = 'request-service');
