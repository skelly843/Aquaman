'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { InlineText } from '@/components/admin/InlineText'
import { Droplet, ChevronRight, Plus, Trash2, Edit, Save, X } from 'lucide-react'

export default function PublicServicesPage() {
  const supabase = createClient()
  const { editMode, previewMode, isGlobalAdmin } = useWebsiteBuilder()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadServices() {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })

      if (data && data.length > 0) {
        setServices(data)
      } else {
        const { FALLBACK_SERVICES } = await import('@/utils/fallbackData')
        setServices(FALLBACK_SERVICES)
      }
    } catch (err) {
      console.warn('Failed to fetch services:', err)
      const { FALLBACK_SERVICES } = await import('@/utils/fallbackData')
      setServices(FALLBACK_SERVICES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleAddService = async () => {
    const title = prompt('Enter new Service Title:')
    if (!title) return
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const newService = {
      title,
      slug,
      short_description: 'Enter a short summary...',
      full_description: 'Enter detailed description...',
      price_range: 'Starting at $99',
      is_published: true,
      sort_order: services.length + 1
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select()
        .single()

      if (error) throw error
      setServices([...services, data || newService])
    } catch (err: any) {
      alert(`Could not insert service: ${err.message}. Added locally.`)
      setServices([...services, { ...newService, id: `temp-${Date.now()}` }])
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      if (error) throw error
      setServices(services.filter(s => s.id !== id))
    } catch (err: any) {
      // Allow deleting local fallback services too
      setServices(services.filter(s => s.id !== id))
    }
  }

  const handleFieldChange = async (id: string, field: string, value: string) => {
    const updated = services.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value }
      }
      return s
    })
    setServices(updated)

    try {
      if (!id.startsWith('temp-') && !id.startsWith('f-')) {
        await supabase
          .from('services')
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
      <main className="flex-1 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header & Introductory description */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Our Services</h1>
            <p className="text-slate-500 text-lg">
              Professional plumbing and general contracting solutions designed for residential & commercial needs.
            </p>
          </div>

          {/* Inline Edit Bar for global admin */}
          {isEditingActive && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-blue-700">
                ⚡ Edit Mode Active: Type directly into titles, summaries, prices or delete items on-the-fly.
              </span>
              <button
                onClick={handleAddService}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add New Service</span>
              </button>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:shadow-blue-50 transition-all flex flex-col justify-between relative"
              >
                {/* Visual Delete button */}
                {isEditingActive && (
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete service"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors overflow-hidden">
                    {service.featured_image ? (
                      <img src={service.featured_image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <Droplet size={28} />
                    )}
                  </div>

                  <InlineText
                    element="h3"
                    value={service.title}
                    onChange={(text) => handleFieldChange(service.id, 'title', text)}
                    className="text-xl font-bold mb-3 text-slate-900 focus:outline-none"
                  />

                  <InlineText
                    element="p"
                    value={service.short_description}
                    onChange={(text) => handleFieldChange(service.id, 'short_description', text)}
                    className="text-slate-600 mb-6 text-sm line-clamp-3 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
                  <div className="max-w-[150px]">
                    <InlineText
                      element="span"
                      value={service.price_range || 'Contact for price'}
                      onChange={(text) => handleFieldChange(service.id, 'price_range', text)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full focus:outline-none"
                    />
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center text-blue-600 font-bold hover:space-x-2 transition-all text-sm ml-auto"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}

            {services.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 italic">No published services found. Please check back later or contact us directly.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
