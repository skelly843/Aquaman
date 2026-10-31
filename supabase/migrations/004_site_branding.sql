-- supabase/migrations/004_site_branding.sql
-- Brand & Theme settings for the editor (business name, logo, favicon, colors, fonts,
-- corners, footer text, page title). Run after 003_page_editor.sql.
-- Idempotent: safe to run more than once in the Supabase SQL Editor.

-- 1. Brand columns on the single global_styles row
alter table public.global_styles add column if not exists site_name text;
alter table public.global_styles add column if not exists footer_name text;
alter table public.global_styles add column if not exists footer_tagline text;
alter table public.global_styles add column if not exists copyright_text text;
alter table public.global_styles add column if not exists seo_title text;
alter table public.global_styles add column if not exists seo_description text;

-- 2. Starting values: keep anything already set, otherwise copy the existing footer
--    and company settings, otherwise use the current site's text.
insert into public.global_styles (id) values ('default') on conflict (id) do nothing;

update public.global_styles g set
  site_name       = coalesce(nullif(g.site_name, ''), 'Aquaman'),
  footer_name     = coalesce(nullif(g.footer_name, ''), nullif(f.content->>'brandName', ''), 'Aquaman Plumbing & Contracting'),
  footer_tagline  = coalesce(nullif(g.footer_tagline, ''), nullif(f.content->>'description', ''),
                      'Expert plumbing, water heater installations, drain cleaning, and general contracting remodeling.'),
  copyright_text  = coalesce(nullif(g.copyright_text, ''), '© {year} Aquaman Services Inc. All rights reserved.'),
  seo_title       = coalesce(nullif(g.seo_title, ''), nullif(c.seo_title, ''), 'Aquaman Plumbing & General Contracting'),
  seo_description = coalesce(nullif(g.seo_description, ''), nullif(c.seo_description, ''),
                      'Expert plumbing, water heater installations, drain cleaning, and general contracting remodeling.'),
  logo_url        = coalesce(nullif(g.logo_url, ''), nullif(c.logo_url, '')),
  favicon_url     = coalesce(nullif(g.favicon_url, ''), nullif(c.favicon_url, '')),
  -- The first Styles panel saved placeholder values; the editor treats these as "default"
  primary_color   = case when g.primary_color is null or lower(g.primary_color) = '#3b82f6' then '#2563eb' else g.primary_color end,
  secondary_color = case when g.secondary_color is null or lower(g.secondary_color) = '#1e293b' then '#0f172a' else g.secondary_color end,
  heading_font    = case when g.heading_font in ('Geist Sans') or g.heading_font is null then 'default' else g.heading_font end,
  body_font       = case when g.body_font in ('Geist Sans') or g.body_font is null then 'default' else g.body_font end,
  border_radius   = case when g.border_radius in ('sharp', 'small', 'default', 'round') then g.border_radius else 'default' end
from (select 1) as one
left join public.site_content f on f.id = 'footer_settings'
left join public.company_settings c on c.id = 'default'
where g.id = 'default';

-- 3. Home link in the top menu (the header shows navigation_items when the table has rows)
insert into public.navigation_items (label, url, display_order, is_active)
select 'Home', '/', 0, true
where not exists (select 1 from public.navigation_items where url = '/');

-- 4. Public bucket for photos, logos and icons uploaded in the editor (policies from 003)
insert into storage.buckets (id, name, public)
values ('public-site-images', 'public-site-images', true)
on conflict (id) do nothing;

-- 5. Visitors read the brand; only global admins change it (policies from 003)
grant select on public.global_styles to anon, authenticated;
grant all on public.global_styles to authenticated;
