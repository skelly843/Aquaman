import { createClient } from '@/utils/supabase/server'
import ServiceForm from '@/components/admin/ServiceForm'
import { notFound } from 'next/navigation'

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (!service) {
    notFound()
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Service</h1>
        <p className="text-slate-500 mt-1">Update your service details and visibility.</p>
      </div>
      <ServiceForm initialData={service} />
    </div>
  )
}
