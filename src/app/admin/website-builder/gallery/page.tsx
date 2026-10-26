'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react'

export default function GalleryFormEditor() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function loadGallery() {
      try {
        const { data } = await supabase
          .from('gallery_items')
          .select('*')
          .order('sort_order', { ascending: true })

        if (data && data.length > 0) {
          setItems(data)
        } else {
          const { FALLBACK_GALLERY_ITEMS } = await import('@/utils/fallbackData')
          setItems(FALLBACK_GALLERY_ITEMS)
        }
      } catch (err) {
        console.warn('Failed to load gallery items.', err)
      }
    }
    loadGallery()
  }, [])

  const handleFieldChange = (id: string, field: string, value: string) => {
    setItems(items.map(i => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const handleAdd = () => {
    const title = prompt('Enter project title:')
    if (!title) return

    const newItem = {
      id: `temp-${Date.now()}`,
      title,
      description: 'Enter transformation description...',
      before_image: '',
      after_image: '',
      service_category: 'Plumbing',
      location: 'Ocean City, CA',
      completion_date: new Date().toISOString().split('T')[0],
      is_published: true,
      sort_order: items.length + 1
    }
    setItems([...items, newItem])
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setItems(items.filter(i => i.id !== id))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      for (const item of items) {
        const isNew = item.id.startsWith('temp-') || item.id.startsWith('g-')
        const payload: any = {
          title: item.title,
          description: item.description,
          before_image: item.before_image,
          after_image: item.after_image,
          service_category: item.service_category || 'Plumbing',
          location: item.location || 'Ocean City',
          is_published: item.is_published ?? true,
          sort_order: item.sort_order || 1
        }

        if (isNew) {
          await supabase.from('gallery_items').insert([payload])
        } else {
          await supabase.from('gallery_items').update(payload).eq('id', item.id)
        }
      }

      setSuccess(true)
    } catch (err: any) {
      alert(`Error saving gallery items: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold text-slate-400">Back</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gallery Form Editor</h2>
            <p className="text-slate-500 text-xs">Manage before-and-after photo captions and categories.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            data-testid="upload-gallery-button"
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1 shadow"
          >
            <Plus size={14} />
            <span>Add Gallery Project</span>
          </button>
        </div>

        <form onSubmit={handleSave} data-testid="gallery-editor-form" className="space-y-6">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleFieldChange(item.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
                    <input
                      type="text"
                      value={item.location || ''}
                      onChange={(e) => handleFieldChange(item.id, 'location', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm h-20"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center space-x-2">
              {success && (
                <div className="flex items-center text-green-600 font-bold text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Gallery details saved and published successfully!</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save & Publish All</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
