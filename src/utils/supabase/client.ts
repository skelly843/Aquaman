import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build or if env vars are missing, we return a proxy that throws
    // helpful errors when accessed. This prevents total app crashes on load.
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

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
