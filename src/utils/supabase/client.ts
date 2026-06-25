import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.')

    return new Proxy({} as any, {
      get: (target, prop) => {
        if (prop === 'auth' || prop === 'from' || prop === 'storage') {
          return new Proxy(() => {}, {
            get: () => {
              throw new Error(
                'Supabase client is not initialized. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.'
              )
            },
            apply: () => {
              throw new Error(
                'Supabase client is not initialized. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.'
              )
            }
          })
        }
        return undefined
      }
    })
  }

  // Ensure URL doesn't contain /auth/v1 or similar
  if (supabaseUrl.includes('/auth/') || supabaseUrl.includes('/rest/')) {
    console.error('Malformed Supabase URL: URL should be the base project URL only (e.g., https://xyz.supabase.co)')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
