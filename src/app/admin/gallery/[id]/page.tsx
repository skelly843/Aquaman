import { createClient } from '@/utils/supabase/server'
import GalleryForm from '@/components/admin/GalleryForm'
import { notFound } from 'next/navigation'

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Gallery Item</h1>
        <p className="text-slate-500 mt-1">Update your project showcase details.</p>
      </div>
      <GalleryForm initialData={item} />
    </div>
  )
}
