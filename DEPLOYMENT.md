# Deployment Configuration

To deploy the Aquaman Business Management Portal successfully, you must configure the following environment variables in your hosting provider (e.g., Netlify).

## Supabase Configuration

These are required for authentication and database access.

| Variable Name | Description | Required Value Format |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL. | **MUST** be the base URL only: `https://ntorlyurucgfrxncxrug.supabase.co`. Do **NOT** include `/rest/v1` or `/auth/v1`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project API "anon" key. | Find this in Settings > API. |

**CRITICAL:** If `NEXT_PUBLIC_SUPABASE_URL` includes a path component (like `/rest/v1`), the application will throw a runtime error and authentication will fail.

## Stripe Configuration

These are required for processing payments and handling webhooks.

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key. | Starts with `pk_test_` or `pk_live_`. |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key. | Starts with `sk_test_` or `sk_live_`. |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe Webhook Secret. | Obtained from the Stripe CLI or Dashboard during webhook setup. |

## Role Management

The system uses a `profiles` table to manage roles. To designate an admin:
1. Sign up through the public signup page.
2. In the Supabase Dashboard, go to the `profiles` table.
3. Update the `role` column for your user ID to `admin`.
