'use client'

import React, { useState, useEffect } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { createClient } from '@/utils/supabase/client'
import { fallbackServices } from '@/utils/fallbackData'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServicesGridBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const ServicesGridBlock: React.FC<ServicesGridBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])

  const title = data?.title || 'Our Services'
  const subtitle = data?.subtitle || 'Select a service below to learn more or request an immediate quote.'

  useEffect(() => {
    async function loadServices() {
      try {
        const { data: dbServices } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (dbServices && dbServices.length > 0) {
          setServices(dbServices)
        } else {
          setServices(fallbackServices)
        }
      } catch (e) {
        console.warn('Error loading services:', e)
        setServices(fallbackServices)
      }
    }

    loadServices()
  }, [supabase])

  return (
    <div className="py-16 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={srv.id || idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <img
                  src={srv.featured_image || srv.image_url || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80'}
                  alt={srv.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {srv.category || 'Plumbing'}
                    </span>
                    {(srv.price_range || srv.estimated_price) && (
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {srv.price_range || srv.estimated_price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{srv.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {srv.short_description || srv.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/services/${srv.slug || ''}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/request-service"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
