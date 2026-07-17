'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { InlineText } from '@/components/admin/InlineText'
import { format } from 'date-fns'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'

export default function GalleryPage() {
  const supabase = createClient()
  const { editMode, previewMode, isGlobalAdmin } = useWebsiteBuilder()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadGallery() {
    try {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .eq('is_private', false)
        .order('sort_order', { ascending: true })

      if (data && data.length > 0) {
        setItems(data)
      } else {
        const { FALLBACK_GALLERY_ITEMS } = await import('@/utils/fallbackData')
        setItems(FALLBACK_GALLERY_ITEMS)
      }
    } catch (err) {
      console.warn('Failed to load gallery items:', err)
      const { FALLBACK_GALLERY_ITEMS } = await import('@/utils/fallbackData')
      setItems(FALLBACK_GALLERY_ITEMS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  const handleAddField = async () => {
    const title = prompt('Enter item title:')
    if (!title) return

    const newItem = {
      title,
      description: 'Enter description text here...',
      before_image: '',
      after_image: '',
      completion_date: new Date().toISOString().split('T')[0],
      service_category: 'Plumbing',
      location: 'Ocean City, CA',
      is_published: true,
      is_private: false,
      sort_order: items.length + 1
    }

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert([newItem])
        .select()
        .single()

      if (error) throw error
      setItems([...items, data || newItem])
    } catch (err: any) {
      alert(`Could not insert item: ${err.message}. Added locally.`)
      setItems([...items, { ...newItem, id: `temp-${Date.now()}` }])
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)
      if (error) throw error
      setItems(items.filter(i => i.id !== id))
    } catch (err) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  const handleFieldChange = async (id: string, field: string, value: string) => {
    const updated = items.map(i => {
      if (i.id === id) {
        return { ...i, [field]: value }
      }
      return i
    })
    setItems(updated)

    try {
      if (!id.startsWith('temp-') && !id.startsWith('g-')) {
        await supabase
          .from('gallery_items')
          .update({ [field]: value })
          .eq('id', id)
      }
    } catch (err) {
      console.warn('Silent save failed:', err)
    }
  }

  const isEditingActive = editMode && !previewMode

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Main Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Project Gallery</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our professional plumbing installations, bathroom transformations, and general contracting work.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full space-y-8">
        {/* Visual Edit controls */}
        {isEditingActive && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="text-xs font-bold text-blue-700">
              ⚡ Edit Mode Active: Type directly into titles, locations, summaries or delete cards.
            </span>
            <button
              onClick={handleAddField}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add Gallery Project</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative group">
              {isEditingActive && (
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors z-20"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Before</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                    {item.before_image ? (
                      <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center space-y-1">
                        <ImageIcon size={24} />
                        <span className="text-[10px] uppercase font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center">After</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-blue-100 shadow-lg shadow-blue-50 flex items-center justify-center">
                    {item.after_image ? (
                      <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center space-y-1">
                        <ImageIcon size={24} />
                        <span className="text-[10px] uppercase font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <InlineText
                    element="h3"
                    value={item.title}
                    onChange={(text) => handleFieldChange(item.id, 'title', text)}
                    className="text-xl font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-400">
                    {item.completion_date && format(new Date(item.completion_date), 'MMM yyyy')}
                  </span>
                </div>

                <InlineText
                  element="p"
                  value={item.description}
                  onChange={(text) => handleFieldChange(item.id, 'description', text)}
                  className="text-slate-600 text-sm leading-relaxed focus:outline-none"
                />

                <div className="pt-2 flex flex-wrap gap-2">
                  <div className="focus:outline-none">
                    <InlineText
                      element="span"
                      value={item.service_category || 'Plumbing'}
                      onChange={(text) => handleFieldChange(item.id, 'service_category', text)}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider focus:outline-none"
                    />
                  </div>
                  <div className="focus:outline-none">
                    <InlineText
                      element="span"
                      value={item.location || 'Ocean City'}
                      onChange={(text) => handleFieldChange(item.id, 'location', text)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 italic">No published project gallery images found. Check back soon for our completed transformations!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
