import { createClient } from '@/utils/supabase/server'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  customer_id: string | null
}

/**
 * Secure, server-side helper to load the authenticated profile.
 * Standardizes auth check across layouts, routers, and templates.
 */
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_active')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Server-side Profile Lookup Failure:', profileError?.message || 'Profile record not found.')
      return null
    }

    // Try to locate a customer record if any, via email matching
    let customer_id: string | null = null
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', profile.email)
        .single()
      if (customer) {
        customer_id = customer.id
      }
    } catch {
      // Non-blocking
    }

    return {
      id: profile.id,
      email: profile.email || '',
      full_name: profile.full_name || '',
      role: profile.role || 'customer',
      is_active: profile.is_active ?? false,
      customer_id
    }
  } catch (err: any) {
    console.error('CRITICAL SERVER-SIDE PROFILE RESOLUTION ERROR:', err.message)
    return null
  }
}
