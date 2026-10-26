'use client'

import React, { useState } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { Camera, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const [showImageCropper, setShowImageCropper] = useState(false)

  const title = data?.title || 'Master Plumbing & Premium Remodeling Services'
  const subtitle = data?.subtitle || '24/7 Emergency Repairs, Water Heater Installs & Custom Kitchen/Bathroom Solutions'
  const ctaText = data?.ctaText || 'Request Service'
  const ctaUrl = data?.ctaUrl || '/request-service'
  const secondaryCtaText = data?.secondaryCtaText || 'Explore Services'
  const secondaryCtaUrl = data?.secondaryCtaUrl || '/services'
  const backgroundImage = data?.backgroundImage || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'

  return (
    <div className="relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center text-white bg-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/60" />
      </div>

      {editMode && (
        <button
          type="button"
          onClick={() => setShowImageCropper(true)}
          className="absolute top-4 right-4 z-20 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg backdrop-blur"
        >
          <Camera size={14} className="text-blue-400" />
          <span>Replace Photo</span>
        </button>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
          <InlineText
            value={title}
            onChange={(val) => onUpdate({ title: val })}
            className="text-white"
          />
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed font-medium">
          <InlineText
            value={subtitle}
            onChange={(val) => onUpdate({ subtitle: val })}
            className="text-slate-200"
          />
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link
            href={ctaUrl}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>
              <InlineText
                value={ctaText}
                onChange={(val) => onUpdate({ ctaText: val })}
              />
            </span>
            <ArrowRight size={18} />
          </Link>

          {secondaryCtaText && (
            <Link
              href={secondaryCtaUrl}
              className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl text-base border border-slate-700 backdrop-blur transition-all"
            >
              <span>
                <InlineText
                  value={secondaryCtaText}
                  onChange={(val) => onUpdate({ secondaryCtaText: val })}
                />
              </span>
            </Link>
          )}
        </div>
      </div>

      {showImageCropper && (
        <ImageCropperModal
          bucket="public-site-images"
          onSave={(url) => {
            onUpdate({ backgroundImage: url })
            setShowImageCropper(false)
          }}
          onClose={() => setShowImageCropper(false)}
        />
      )}
    </div>
  )
}
