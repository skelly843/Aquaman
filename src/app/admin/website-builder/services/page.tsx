'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react'

export default function ServicesFormEditor() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    async function loadServices() {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true })

        if (data && data.length > 0) {
          setServices(data)
        } else {
          const { FALLBACK_SERVICES } = await import('@/utils/fallbackData')
          setServices(FALLBACK_SERVICES)
        }
      } catch (err) {
        console.warn('Failed to load services in admin form.', err)
      }
    }
    loadServices()
  }, [])

  const handleFieldChange = (id: string, field: string, value: string) => {
    setServices(services.map(s => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleAdd = () => {
    const title = prompt('Enter service title:')
    if (!title) return
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const newService = {
      id: `temp-${Date.now()}`,
      title,
      slug,
      short_description: 'Enter a short summary...',
      full_description: 'Detailed description text...',
      price_range: 'Starting at $99',
      is_published: true,
      sort_order: services.length + 1
    }
    setServices([...services, newService])
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    setServices(services.filter(s => s.id !== id))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      // Upsert all modified services
      for (const service of services) {
        const isNew = service.id.startsWith('temp-') || service.id.startsWith('f-')
        const payload: any = {
          title: service.title,
          slug: service.slug,
          short_description: service.short_description,
          full_description: service.full_description,
          price_range: service.price_range,
          is_published: service.is_published ?? true,
          sort_order: service.sort_order || 1
        }

        if (isNew) {
          await supabase.from('services').insert([payload])
        } else {
          await supabase.from('services').update(payload).eq('id', service.id)
        }
      }

      setSuccess(true)
    } catch (err: any) {
      alert(`Error saving services: ${err.message}`)
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Services Form Editor</h2>
            <p className="text-slate-500 text-xs">Configure prices, summaries, and descriptions on the grid.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            data-testid="add-service-button"
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1 shadow"
          >
            <Plus size={14} />
            <span>Add New Service</span>
          </button>
        </div>

        <form onSubmit={handleSave} data-testid="services-editor-form" className="space-y-6">
          <div className="space-y-6">
            {services.map((service, index) => (
              <div key={service.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleFieldChange(service.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing Range / Note</label>
                    <input
                      type="text"
                      value={service.price_range || ''}
                      onChange={(e) => handleFieldChange(service.id, 'price_range', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                      placeholder="e.g. Starting at $99"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Short Summary Description</label>
                  <input
                    type="text"
                    value={service.short_description || ''}
                    onChange={(e) => handleFieldChange(service.id, 'short_description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Detailed Overview</label>
                  <textarea
                    value={service.full_description || ''}
                    onChange={(e) => handleFieldChange(service.id, 'full_description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm h-24"
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
                  <span>Services saved and published successfully!</span>
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
