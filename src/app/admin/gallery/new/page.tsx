import GalleryForm from '@/components/admin/GalleryForm'

export default function NewGalleryItemPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Gallery Item</h1>
        <p className="text-slate-500 mt-1">Showcase a completed project with before and after photos.</p>
      </div>
      <GalleryForm />
    </div>
  )
}
