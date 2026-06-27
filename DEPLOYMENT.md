# Deployment & Administration Guide

## Supabase Configuration

Configure these environment variables in your hosting provider (e.g., Netlify).

| Variable Name | Description | Value Format |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL. | Base URL only: `https://xyz.supabase.co`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase API "anon" key. | Found in Settings > API. |

## First-Time Admin Promotion

By default, **every** new user who signs up is assigned the `customer` role for security. To create your first admin account:

1. Go to your public website and **Sign Up** for a new account.
2. Log in to your **Supabase Dashboard**.
3. Go to the **Table Editor** and select the `profiles` table.
4. Find the row corresponding to your email/ID.
5. Manually change the `role` column from `customer` to `admin`.
6. Refresh your website; you will now have access to the `/admin` routes.

## Promoting Employees

Once you are an admin, you can promote other users to `admin` or `employee` roles directly from the application:

1. Log in as an admin.
2. Navigate to **Customers & Users** (or `/admin/customers`).
3. Click **Manage** on the user you wish to promote.
4. In the **Manage Permissions** sidebar, select the new role and click **Update Role**.

## Database Setup

To apply the necessary table structures, triggers, and RLS policies, run the content of `schema.sql` in the **Supabase SQL Editor**.

**Key Security Features:**
- **Strict Defaults:** The `handle_new_user` trigger ignores any role passed from the frontend and always defaults to `customer`.
- **RLS Protection:** Customers are logically isolated. They cannot query or modify data belonging to other users.
- **Middleware Guard:** Server-side redirection prevents customers from even seeing the admin UI.
