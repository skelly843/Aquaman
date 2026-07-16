'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { EditableBlockWrapper } from '@/components/admin/EditableBlockWrapper'
import { InlineText } from '@/components/admin/InlineText'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { createClient } from '@/utils/supabase/client'
import {
  Droplet,
  Shield,
  Clock,
  ArrowRight,
  ChevronRight,
  Upload,
  Plus,
  Compass
} from 'lucide-react'

export default function LandingPage() {
  const supabase = createClient()
  const {
    editMode,
    previewMode,
    previewDevice,
    blocks,
    setBlocks,
    setCurrentPage,
    updateBlockData
  } = useWebsiteBuilder()

  const [activeServices, setActiveServices] = useState<any[]>([])
  const [showCropperBlockId, setShowCropperBlockId] = useState<string | null>(null)

  // Register current page
  useEffect(() => {
    setCurrentPage('home')
  }, [setCurrentPage])

  // Load published services for the grid
  useEffect(() => {
    async function loadServices() {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
        if (data) {
          setActiveServices(data)
        }
      } catch (err) {
        console.warn('Failed to load active services:', err)
      }
    }
    loadServices()
  }, [supabase])

  // Responsive previews wrapper styling
  const getResponsiveClass = () => {
    if (!editMode || previewMode) return 'w-full'
    if (previewDevice === 'mobile') return 'max-w-[375px] mx-auto border-4 border-slate-800 rounded-3xl shadow-2xl p-2 my-6 transition-all bg-white'
    if (previewDevice === 'tablet') return 'max-w-[768px] mx-auto border-4 border-slate-800 rounded-3xl shadow-2xl p-2 my-6 transition-all bg-white'
    return 'w-full'
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <div className={getResponsiveClass()}>
        {blocks.map((block: PageBlock, index: number) => {
          const data = block.draft_data || {}

          return (
            <EditableBlockWrapper
              key={block.id}
              id={block.id}
              index={index}
              blockType={block.block_type}
              isVisible={block.is_visible}
            >
              {/* HERO BLOCK TYPE */}
              {block.block_type === 'hero' && (
                <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white min-h-[500px] flex items-center rounded-3xl">
                  {data.backgroundImage && (
                    <div className="absolute inset-0 z-0">
                      <img src={data.backgroundImage} alt="" className="w-full h-full object-cover brightness-[0.6]" />
                    </div>
                  )}
                  <div className="container mx-auto px-8 relative z-10 space-y-6">
                    <div className="max-w-3xl space-y-4">
                      <InlineText
                        element="h1"
                        value={data.title}
                        onChange={(text) => updateBlockData(block.id, { title: text })}
                        className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white block focus:outline-none"
                      />
                      <InlineText
                        element="p"
                        value={data.subtitle}
                        onChange={(text) => updateBlockData(block.id, { subtitle: text })}
                        className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl block"
                      />
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                          href={data.ctaUrl || '/request-service'}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center space-x-1 shadow"
                        >
                          <InlineText
                            element="span"
                            value={data.ctaText || 'Get Started'}
                            onChange={(text) => updateBlockData(block.id, { ctaText: text })}
                          />
                          <ArrowRight size={16} />
                        </Link>

                        <Link
                          href={data.secondaryCtaUrl || '/gallery'}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center"
                        >
                          <InlineText
                            element="span"
                            value={data.secondaryCtaText || 'View Our Work'}
                            onChange={(text) => updateBlockData(block.id, { secondaryCtaText: text })}
                          />
                        </Link>
                      </div>
                    </div>

                    {/* Image cropper button */}
                    {editMode && !previewMode && (
                      <div className="pt-6 shrink-0 z-50 relative">
                        <button
                          type="button"
                          onClick={() => setShowCropperBlockId(block.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow"
                        >
                          <Upload size={14} />
                          <span>{data.backgroundImage ? 'Replace Background' : 'Upload Background'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {showCropperBlockId === block.id && (
                    <ImageCropperModal
                      bucket="public-site-images"
                      onClose={() => setShowCropperBlockId(null)}
                      onSave={(url) => {
                        updateBlockData(block.id, { backgroundImage: url })
                      }}
                    />
                  )}
                </section>
              )}

              {/* FEATURES BLOCK TYPE */}
              {block.block_type === 'features' && (
                <section className="py-20 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <InlineText
                      element="h2"
                      value={data.title || 'Why Choose Us'}
                      onChange={(text) => updateBlockData(block.id, { title: text })}
                      className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 block"
                    />
                    <InlineText
                      element="p"
                      value={data.subtitle || 'Our custom features'}
                      onChange={(text) => updateBlockData(block.id, { subtitle: text })}
                      className="text-slate-500 text-sm font-medium block"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(data.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center border border-blue-50">
                          <Compass size={24} />
                        </div>
                        <InlineText
                          element="h4"
                          value={item.title}
                          onChange={(text) => {
                            const newItems = [...data.items]
                            newItems[idx].title = text
                            updateBlockData(block.id, { items: newItems })
                          }}
                          className="font-bold text-slate-800 text-base block"
                        />
                        <InlineText
                          element="p"
                          value={item.desc}
                          onChange={(text) => {
                            const newItems = [...data.items]
                            newItems[idx].desc = text
                            updateBlockData(block.id, { items: newItems })
                          }}
                          className="text-slate-600 text-xs leading-relaxed block"
                        />
                      </div>
                    ))}
                    {editMode && !previewMode && (
                      <div className="col-span-full flex justify-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const currentItems = data.items || []
                            updateBlockData(block.id, {
                              items: [...currentItems, { title: 'New Benefit Point', desc: 'Point details...' }]
                            })
                          }}
                          className="px-4 py-2 bg-slate-900 text-white hover:bg-black font-bold text-xs rounded-xl flex items-center space-x-1"
                        >
                          <Plus size={12} />
                          <span>Add Key Point</span>
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </EditableBlockWrapper>
          )
        })}

        {/* Dynamic services listing cards */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeServices.map((service) => (
                <div key={service.id} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden border">
                      {service.featured_image ? (
                        <img src={service.featured_image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Droplet size={32} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{service.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{service.short_description}</p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-blue-600 font-bold text-xs inline-flex items-center space-x-1 hover:underline pt-2"
                  >
                    <span>View Service details</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
