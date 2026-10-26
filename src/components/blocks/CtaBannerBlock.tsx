'use client'

import React from 'react'
import { InlineText } from '@/components/admin/InlineText'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CtaBannerBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const CtaBannerBlock: React.FC<CtaBannerBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const title = data?.title || 'Ready to Start Your Project?'
  const subtitle = data?.subtitle || 'Contact our master technicians today for a fast estimate or emergency service.'
  const buttonText = data?.buttonText || 'Schedule Online Now'
  const buttonUrl = data?.buttonUrl || '/request-service'

  return (
    <div className="py-16 sm:py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          <InlineText
            value={title}
            onChange={(val) => onUpdate({ title: val })}
            className="text-white"
          />
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-blue-100 font-medium leading-relaxed">
          <InlineText
            value={subtitle}
            onChange={(val) => onUpdate({ subtitle: val })}
            className="text-blue-100"
          />
        </p>

        <div>
          <Link
            href={buttonUrl}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-900 font-bold px-8 py-4 rounded-xl text-base shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>
              <InlineText
                value={buttonText}
                onChange={(val) => onUpdate({ buttonText: val })}
                className="text-blue-900"
              />
            </span>
            <ArrowRight size={18} className="text-blue-900" />
          </Link>
        </div>

      </div>
    </div>
  )
}
