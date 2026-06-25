import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing for server client.')
    // For server components, we return a mock that logs errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              single: () => Promise.resolve({ data: null, error: new Error('Missing Supabase Env Vars') }),
              limit: () => Promise.resolve({ data: [], error: new Error('Missing Supabase Env Vars') }),
              then: (cb: any) => cb({ data: [], error: new Error('Missing Supabase Env Vars') })
            }),
            single: () => Promise.resolve({ data: null, error: new Error('Missing Supabase Env Vars') }),
            then: (cb: any) => cb({ data: [], error: new Error('Missing Supabase Env Vars') })
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: new Error('Missing Supabase Env Vars') }),
            then: (cb: any) => cb({ data: [], error: new Error('Missing Supabase Env Vars') })
          }),
          then: (cb: any) => cb({ data: [], error: new Error('Missing Supabase Env Vars') })
        }),
        upsert: () => Promise.resolve({ data: null, error: new Error('Missing Supabase Env Vars') }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Missing Supabase Env Vars') }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Missing Supabase Env Vars') }),
        signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Missing Supabase Env Vars') }),
        signOut: () => Promise.resolve({ error: new Error('Missing Supabase Env Vars') }),
      }
    } as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
