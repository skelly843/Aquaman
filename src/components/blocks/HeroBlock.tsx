'use client'

import React, { useState } from 'react'
import { ArrowRight, ImagePlus, Maximize2, Minimize2, X } from 'lucide-react'
import { InlineText } from '@/components/admin/InlineText'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { EditableLink } from './shared'
import type { BlockProps } from './types'

export default function HeroBlock({ data, editable, update }: BlockProps) {
  const [cropperOpen, setCropperOpen] = useState(false)
  const large = data.variant !== 'compact'

  return (
    <section
      className={`relative overflow-hidden bg-slate-900 text-white ${
        large ? 'py-24 lg:py-32 min-h-[480px] flex items-center' : 'py-16'
      }`}
    >
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.backgroundImage} alt="" className="w-full h-full object-cover brightness-[0.45]" />
        </div>
      )}

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 ${large ? '' : 'text-center'}`}>
        <div className={`space-y-4 ${large ? 'max-w-3xl' : 'max-w-3xl mx-auto'}`}>
          <InlineText
            element="h1"
            value={data.title || ''}
            onChange={(title) => update({ title })}
            placeholder="Headline"
            className={`font-extrabold tracking-tight text-white block ${
              large ? 'text-4xl md:text-5xl lg:text-6xl leading-tight' : 'text-4xl md:text-5xl'
            }`}
          />
          <InlineText
            element="p"
            value={data.subtitle || ''}
            onChange={(subtitle) => update({ subtitle })}
            placeholder="Subtitle"
            className={`leading-relaxed block ${large ? 'text-base md:text-lg text-slate-300 max-w-2xl' : 'text-lg text-slate-400'}`}
          />

          {(editable || data.ctaText || data.secondaryCtaText) && (
            <div className={`flex flex-col sm:flex-row gap-4 pt-4 ${large ? '' : 'justify-center'}`}>
              <EditableLink
                href={data.ctaUrl}
                text={data.ctaText || ''}
                editable={editable}
                onChange={({ text, href }) =>
                  update({ ...(text !== undefined && { ctaText: text }), ...(href !== undefined && { ctaUrl: href }) })
                }
                placeholder="Primary button"
                icon={<ArrowRight size={16} />}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-1.5 shadow"
              />
              <EditableLink
                href={data.secondaryCtaUrl}
                text={data.secondaryCtaText || ''}
                editable={editable}
                onChange={({ text, href }) =>
                  update({
                    ...(text !== undefined && { secondaryCtaText: text }),
                    ...(href !== undefined && { secondaryCtaUrl: href })
                  })
                }
                placeholder="Secondary button"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-1.5"
              />
            </div>
          )}
        </div>
      </div>

      {editable && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={() => update({ variant: large ? 'compact' : 'large' })}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
          >
            {large ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{large ? 'Compact' : 'Large'}</span>
          </button>
          <button
            type="button"
            onClick={() => setCropperOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
          >
            <ImagePlus size={14} />
            <span>{data.backgroundImage ? 'Replace photo' : 'Add background photo'}</span>
          </button>
          {data.backgroundImage && (
            <button
              type="button"
              onClick={() => update({ backgroundImage: '' })}
              className="p-1.5 bg-slate-800/90 hover:bg-red-600 text-white rounded-lg shadow"
              title="Remove background photo"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {cropperOpen && (
        <ImageCropperModal
          bucket="public-site-images"
          aspect={large ? 16 / 9 : 3}
          onClose={() => setCropperOpen(false)}
          onSave={(url) => update({ backgroundImage: url })}
        />
      )}
    </section>
  )
}
