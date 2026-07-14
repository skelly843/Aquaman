# Supabase Setup Guide

This document guides you through setting up Supabase, configuring the database schema, creating the first `global_admin` user, and setting up the required storage buckets and environment variables.

---

## 1. Run the SQL Schema Migration

1. Connect to your Supabase project dashboard.
2. Open the **SQL Editor** from the left-hand navigation.
3. Create a new query.
4. Copy the entire contents of the schema file:
   - `supabase/migrations/001_initial_schema.sql` (or `supabase/full-setup.sql`)
5. Paste the SQL into the editor and click **Run**.
6. This will successfully create:
   - All necessary CRM tables (profiles, customers, jobs, invoices, appointments, page_sections, site_content, etc.).
   - Helper functions for role queries (`is_global_admin()`, `current_user_role()`, etc.).
   - RLS policies to enforce role boundaries.
   - Initial seed data (default services, navigation, settings, and home hero site content).

---

## 2. Configure Storage Buckets & Policies

You need to create 5 storage buckets in your Supabase project dashboard (**Storage** menu):

1. **`public-site-images`**: Used for homepage, hero, and public web image uploads. (Public bucket)
2. **`gallery-images`**: Used for project showcase photos. (Public bucket)
3. **`customer-files`**: Private customer files. (Private bucket)
4. **`receipts`**: Private financial receipts for jobs/expenses. (Private bucket)
5. **`profile-images`**: Public/Private avatars. (Public bucket)

### Setup Storage Policies:
In the Supabase Storage dashboard, set up the following row-level security (RLS) policies for object access:
- **Public access** (select/read) on `public-site-images` and `gallery-images` for everyone.
- **Admin read/write access** (insert, update, delete) on all buckets.
- **Customer select/read access** on `customer-files` and `receipts` where the file path or owner ID matches their unique customer ID.

---

## 3. Create the First Global Admin

To designate a user as the first `global_admin` of the system:

1. Sign up on the landing page or on `/signup` as a regular user.
2. Go to your Supabase dashboard and view the **Authentication > Users** list.
3. Locate the newly created user and copy their **User ID (UUID)**.
4. Go back to the **SQL Editor** and execute the following SQL command:

```sql
update public.profiles
set role = 'global_admin',
    is_active = true
where id = 'REPLACE_WITH_YOUR_AUTH_USER_UUID';
```

*(Ensure you replace `'REPLACE_WITH_YOUR_AUTH_USER_UUID'` with the actual copied UUID)*.

Once run, logging in with this user account will automatically redirect you to the main `/admin` CRM dashboard with full administrative controls.

---

## 4. Netlify Deployment Environment Variables

Configure these environment variables in your Netlify Dashboard under **Site Settings > Environment Variables**:

| Variable Name | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Base URL of your Supabase project (no trailing slash or `/rest/v1` path) | `https://your-proj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key for client operations | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Administrative service key (Used ONLY server-side) | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | Domain where your app is hosted | `https://your-app.netlify.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client payments | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key for backend actions | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret | `whsec_...` |

**Crucial Note on `NEXT_PUBLIC_SUPABASE_URL`**: Ensure this is only the base protocol + hostname (e.g., `https://abc.supabase.co`). If path components are included, the client initialization will throw a configuration error.
