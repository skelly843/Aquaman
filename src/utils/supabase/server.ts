import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Validates the Supabase URL to ensure it is the base project URL only.
 * Throws a critical error if it contains /rest/v1, /auth/v1, or any other path.
 */
function validateSupabaseUrl(url: string | undefined) {
  if (!url) return

  const trimmedUrl = url.trim().replace(/\/$/, '')

  if (trimmedUrl.includes('/rest/v1') || trimmedUrl.includes('/auth/v1') || trimmedUrl.includes('/auth/v2')) {
    const errorMsg = `CRITICAL CONFIG ERROR: NEXT_PUBLIC_SUPABASE_URL must be the base project URL ONLY (e.g. https://xyz.supabase.co). It currently includes a path component: "${trimmedUrl}". Please remove "/rest/v1", "/auth/v1", etc. from your environment variables.`
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  try {
    const parsed = new URL(trimmedUrl)
    if (parsed.pathname !== '/' && parsed.pathname !== '') {
      const errorMsg = `CRITICAL CONFIG ERROR: NEXT_PUBLIC_SUPABASE_URL must be the base URL with no path. Detected path: "${parsed.pathname}". Current value: "${trimmedUrl}". Please update it to the base URL only.`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
  } catch (e: any) {
    if (e.message.includes('CRITICAL CONFIG ERROR')) throw e
  }
}

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Run the guard
  validateSupabaseUrl(supabaseUrl)

  if (!supabaseUrl || !supabaseAnonKey) {
    // For server components, we return an infinitely chainable mock Proxy to prevent runtime crashes during static site generation
    const createChainProxy = (): any => {
      const target = () => {};
      const proxy: any = new Proxy(target, {
        get(t, prop) {
          if (prop === 'then') {
            return (resolve: any) => resolve({ data: [], error: null });
          }
          return createChainProxy();
        },
        apply() {
          return proxy;
        }
      });
      return proxy;
    };

    return {
      from: () => createChainProxy(),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        exchangeCodeForSession: () => Promise.resolve({ data: { session: null }, error: null }),
      }
    } as any
  }

  return createServerClient(
    supabaseUrl.trim().replace(/\/$/, ''),
    supabaseAnonKey.trim(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}
