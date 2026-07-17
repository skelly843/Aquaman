import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'customer'

  if (role === 'global_admin' || role === 'admin') {
    return redirect('/admin')
  }

  if (role === 'employee') {
    return redirect('/employee')
  }

  return redirect('/portal')
}
