-- Migration 003: Idempotent Page Editor Schema & Permissions
-- Creates page_blocks and content_revisions with non-recursive helper functions and seed data.

-- 1. Helper function to safely check global admin status without recursive profile query loops
CREATE OR REPLACE FUNCTION public.is_global_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'global_admin'
      AND (is_active IS NULL OR is_active = true)
  );
$$;

-- Grant execution permission on helper function
GRANT EXECUTE ON FUNCTION public.is_global_admin() TO anon, authenticated, service_role;

-- 2. Create page_blocks table
CREATE TABLE IF NOT EXISTS public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  block_type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  draft_data JSONB DEFAULT '{}'::jsonb,
  published_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on page_blocks
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present to prevent conflicts
DROP POLICY IF EXISTS "Public page_blocks select policy" ON public.page_blocks;
DROP POLICY IF EXISTS "Global Admin page_blocks insert policy" ON public.page_blocks;
DROP POLICY IF EXISTS "Global Admin page_blocks update policy" ON public.page_blocks;
DROP POLICY IF EXISTS "Global Admin page_blocks delete policy" ON public.page_blocks;

-- page_blocks RLS Policies
CREATE POLICY "Public page_blocks select policy"
  ON public.page_blocks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Global Admin page_blocks insert policy"
  ON public.page_blocks FOR INSERT
  TO authenticated
  WITH CHECK (public.is_global_admin());

CREATE POLICY "Global Admin page_blocks update policy"
  ON public.page_blocks FOR UPDATE
  TO authenticated
  USING (public.is_global_admin())
  WITH CHECK (public.is_global_admin());

CREATE POLICY "Global Admin page_blocks delete policy"
  ON public.page_blocks FOR DELETE
  TO authenticated
  USING (public.is_global_admin());


-- 3. Create content_revisions table
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  blocks_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on content_revisions
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present to prevent conflicts
DROP POLICY IF EXISTS "Global Admin content_revisions select policy" ON public.content_revisions;
DROP POLICY IF EXISTS "Global Admin content_revisions insert policy" ON public.content_revisions;
DROP POLICY IF EXISTS "Global Admin content_revisions update policy" ON public.content_revisions;
DROP POLICY IF EXISTS "Global Admin content_revisions delete policy" ON public.content_revisions;

-- content_revisions RLS Policies
CREATE POLICY "Global Admin content_revisions select policy"
  ON public.content_revisions FOR SELECT
  TO authenticated
  USING (public.is_global_admin());

CREATE POLICY "Global Admin content_revisions insert policy"
  ON public.content_revisions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_global_admin());

CREATE POLICY "Global Admin content_revisions update policy"
  ON public.content_revisions FOR UPDATE
  TO authenticated
  USING (public.is_global_admin())
  WITH CHECK (public.is_global_admin());

CREATE POLICY "Global Admin content_revisions delete policy"
  ON public.content_revisions FOR DELETE
  TO authenticated
  USING (public.is_global_admin());


-- 4. Table grants
GRANT SELECT ON public.page_blocks TO anon, authenticated;
GRANT ALL ON public.page_blocks TO authenticated;
GRANT ALL ON public.content_revisions TO authenticated;

-- Public grants for required display tables (preventing permission denied errors)
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT SELECT ON public.company_settings TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- Create indices for performant route queries
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id ON public.page_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_content_revisions_page_id ON public.content_revisions(page_id);

-- 5. Seed default page blocks (Home, Services, Gallery, About, Contact, Request Service)
-- Home Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'home', 'hero', 10, true,
  '{"title": "Master Plumbing & Premium Remodeling Services", "subtitle": "24/7 Emergency Repairs, Water Heater Installs & Custom Kitchen/Bathroom Solutions", "ctaText": "Request Service", "ctaUrl": "/request-service", "secondaryCtaText": "Explore Services", "secondaryCtaUrl": "/services", "backgroundImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"}',
  '{"title": "Master Plumbing & Premium Remodeling Services", "subtitle": "24/7 Emergency Repairs, Water Heater Installs & Custom Kitchen/Bathroom Solutions", "ctaText": "Request Service", "ctaUrl": "/request-service", "secondaryCtaText": "Explore Services", "secondaryCtaUrl": "/services", "backgroundImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"}'
),
(
  'home', 'features', 20, true,
  '{"title": "Why Aquaman Contracting?", "subtitle": "Delivering reliable craftsmanship and transparent upfront pricing on every project.", "items": [{"title": "Licensed & Insured", "desc": "Master plumbers and certified general contractors fully equipped for residential and commercial jobs."}, {"title": "24/7 Emergency Dispatch", "desc": "Immediate rapid response team ready for urgent burst pipes, leaks, and sewer line backups."}, {"title": "Upfront Transparent Pricing", "desc": "Detailed transparent estimates before work begins with zero hidden fees or unexpected charges."}]}',
  '{"title": "Why Aquaman Contracting?", "subtitle": "Delivering reliable craftsmanship and transparent upfront pricing on every project.", "items": [{"title": "Licensed & Insured", "desc": "Master plumbers and certified general contractors fully equipped for residential and commercial jobs."}, {"title": "24/7 Emergency Dispatch", "desc": "Immediate rapid response team ready for urgent burst pipes, leaks, and sewer line backups."}, {"title": "Upfront Transparent Pricing", "desc": "Detailed transparent estimates before work begins with zero hidden fees or unexpected charges."}]}'
),
(
  'home', 'services_grid', 30, true,
  '{"title": "Our Premier Services", "subtitle": "Comprehensive plumbing and renovation solutions tailored to your property."}',
  '{"title": "Our Premier Services", "subtitle": "Comprehensive plumbing and renovation solutions tailored to your property."}'
),
(
  'home', 'cta_banner', 40, true,
  '{"title": "Ready to Start Your Project?", "subtitle": "Contact our master technicians today for a fast estimate or emergency service.", "buttonText": "Schedule Online Now", "buttonUrl": "/request-service"}',
  '{"title": "Ready to Start Your Project?", "subtitle": "Contact our master technicians today for a fast estimate or emergency service.", "buttonText": "Schedule Online Now", "buttonUrl": "/request-service"}'
)
ON CONFLICT DO NOTHING;

-- About Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'about', 'hero', 10, true,
  '{"title": "About Aquaman Plumbing", "subtitle": "Over 15 Years of Excellence in Plumbing & General Contracting", "backgroundImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"}',
  '{"title": "About Aquaman Plumbing", "subtitle": "Over 15 Years of Excellence in Plumbing & General Contracting", "backgroundImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"}'
),
(
  'about', 'text_image', 20, true,
  '{"title": "Our Story & Commitment", "body_content": "Founded in 2010, Aquaman Plumbing & General Contracting has built a reputation on integrity, quality craftsmanship, and exceptional customer service. From emergency pipe repairs to full home kitchen and bathroom remodels, our master plumbers and contractors handle every job with extreme attention to detail.", "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", "layout": "text_left"}',
  '{"title": "Our Story & Commitment", "body_content": "Founded in 2010, Aquaman Plumbing & General Contracting has built a reputation on integrity, quality craftsmanship, and exceptional customer service. From emergency pipe repairs to full home kitchen and bathroom remodels, our master plumbers and contractors handle every job with extreme attention to detail.", "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", "layout": "text_left"}'
),
(
  'about', 'team', 30, true,
  '{"title": "Meet Our Leadership", "subtitle": "Dedicated professionals ensuring top-tier quality on every job site.", "members": [{"name": "Arthur Curry", "role": "Master Plumber & Founder", "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80", "bio": "18+ years of commercial and residential plumbing experience."}, {"name": "Mera Pelagios", "role": "Head of Contracting & Remodeling", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80", "bio": "General contractor specialized in luxury bathroom and kitchen structural build-outs."}]}',
  '{"title": "Meet Our Leadership", "subtitle": "Dedicated professionals ensuring top-tier quality on every job site.", "members": [{"name": "Arthur Curry", "role": "Master Plumber & Founder", "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80", "bio": "18+ years of commercial and residential plumbing experience."}, {"name": "Mera Pelagios", "role": "Head of Contracting & Remodeling", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80", "bio": "General contractor specialized in luxury bathroom and kitchen structural build-outs."}]}'
)
ON CONFLICT DO NOTHING;

-- Services Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'services', 'hero', 10, true,
  '{"title": "Professional Services", "subtitle": "Explore our comprehensive plumbing, water heating, and general contracting services.", "backgroundImage": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"}',
  '{"title": "Professional Services", "subtitle": "Explore our comprehensive plumbing, water heating, and general contracting services.", "backgroundImage": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"}'
),
(
  'services', 'services_grid', 20, true,
  '{"title": "Our Complete Service Catalog", "subtitle": "Select a service below to learn more or request an immediate quote."}',
  '{"title": "Our Complete Service Catalog", "subtitle": "Select a service below to learn more or request an immediate quote."}'
)
ON CONFLICT DO NOTHING;

-- Gallery Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'gallery', 'hero', 10, true,
  '{"title": "Project Gallery", "subtitle": "Take a look at our recent plumbing installs and home remodeling transformations.", "backgroundImage": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80"}',
  '{"title": "Project Gallery", "subtitle": "Take a look at our recent plumbing installs and home remodeling transformations.", "backgroundImage": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80"}'
),
(
  'gallery', 'gallery_grid', 20, true,
  '{"title": "Our Completed Work", "subtitle": "Filter by category to view our craftsmanship in detail."}',
  '{"title": "Our Completed Work", "subtitle": "Filter by category to view our craftsmanship in detail."}'
)
ON CONFLICT DO NOTHING;

-- Contact Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'contact', 'hero', 10, true,
  '{"title": "Contact Us", "subtitle": "Get in touch with our team for questions, estimates, or service requests.", "backgroundImage": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80"}',
  '{"title": "Contact Us", "subtitle": "Get in touch with our team for questions, estimates, or service requests.", "backgroundImage": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80"}'
),
(
  'contact', 'contact_info', 20, true,
  '{"title": "Reach Out directly", "subtitle": "We are available 24/7 for urgent plumbing emergencies.", "phone": "(555) 234-5678", "email": "info@aquamanplumbing.com", "address": "123 Ocean Boulevard, Suite 100, Atlantis, CA 90210", "hours": "24/7 Emergency Service Available | Mon-Fri 7am-6pm"}',
  '{"title": "Reach Out directly", "subtitle": "We are available 24/7 for urgent plumbing emergencies.", "phone": "(555) 234-5678", "email": "info@aquamanplumbing.com", "address": "123 Ocean Boulevard, Suite 100, Atlantis, CA 90210", "hours": "24/7 Emergency Service Available | Mon-Fri 7am-6pm"}'
),
(
  'contact', 'contact_form', 30, true,
  '{"title": "Send Us a Message", "subtitle": "Fill out the form below and we will respond within 1 business hour."}',
  '{"title": "Send Us a Message", "subtitle": "Fill out the form below and we will respond within 1 business hour."}'
)
ON CONFLICT DO NOTHING;

-- Request Service Page Blocks
INSERT INTO public.page_blocks (page_id, block_type, display_order, is_visible, draft_data, published_data)
VALUES
(
  'request-service', 'hero', 10, true,
  '{"title": "Request Service Online", "subtitle": "Schedule plumbing repairs or request a detailed project estimate.", "backgroundImage": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"}',
  '{"title": "Request Service Online", "subtitle": "Schedule plumbing repairs or request a detailed project estimate.", "backgroundImage": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"}'
),
(
  'request-service', 'request_form', 20, true,
  '{"title": "Service Dispatch Form", "subtitle": "Tell us about your issue and preferred appointment time."}',
  '{"title": "Service Dispatch Form", "subtitle": "Tell us about your issue and preferred appointment time."}'
)
ON CONFLICT DO NOTHING;
