import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const formData = await request.formData()
  const userId = formData.get('userId') as string
  const role = formData.get('role') as string

  if (!userId || !role) {
    return new Response('Missing user ID or role', { status: 400 })
  }

  const supabase = await createClient()

  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'admin') {
    return new Response('Forbidden', { status: 403 })
  }

  // Prevent removing the last admin (basic check)
  if (role !== 'admin' && (await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin')).count === 1) {
    const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', userId).single()
    if (targetProfile?.role === 'admin') {
        return new Response('Cannot remove the last admin account', { status: 400 })
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    return new Response('Error updating role', { status: 500 })
  }

  revalidatePath(`/admin/customers/${userId}`)
  revalidatePath('/admin/customers')

  // Return to the customer detail page
  return redirect(`/admin/customers/${userId}?success=true`)
}
