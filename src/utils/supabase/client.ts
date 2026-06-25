import { createBrowserClient } from '@supabase/ssr'

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
    // Ignore invalid URL errors here, they will be caught by the client creator if necessary
  }
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Run the guard
  validateSupabaseUrl(supabaseUrl)

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a proxy that throws on access to provide better developer feedback
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
    supabaseUrl.trim().replace(/\/$/, ''),
    supabaseAnonKey.trim()
  )
}
