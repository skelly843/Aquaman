'use client'

import React, { useState, useEffect } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { createClient } from '@/utils/supabase/client'
import { fallbackGalleryItems } from '@/utils/fallbackData'

interface GalleryGridBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const GalleryGridBlock: React.FC<GalleryGridBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('All')

  const title = data?.title || 'Our Completed Work'
  const subtitle = data?.subtitle || 'Filter by category to view our craftsmanship in detail.'

  useEffect(() => {
    async function loadGalleryItems() {
      try {
        const { data: dbItems } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (dbItems && dbItems.length > 0) {
          setItems(dbItems)
        } else {
          setItems(fallbackGalleryItems)
        }
      } catch (e) {
        console.warn('Error loading gallery items:', e)
        setItems(fallbackGalleryItems)
      }
    }

    loadGalleryItems()
  }, [supabase])

  const categories = ['All', ...Array.from(new Set(items.map(i => i.service_category || i.category || 'General')))]
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => (i.service_category || i.category || 'General') === activeCategory)

  return (
    <div className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            <InlineText
              value={title}
              onChange={(val) => onUpdate({ title: val })}
            />
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            <InlineText
              value={subtitle}
              onChange={(val) => onUpdate({ subtitle: val })}
            />
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div key={item.id || idx} className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg aspect-[4/3]">
              <img
                src={item.after_image || item.image_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'}
                alt={item.title || 'Gallery item'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/50 inline-block mb-1">
                  {item.service_category || item.category || 'General'}
                </span>
                <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
