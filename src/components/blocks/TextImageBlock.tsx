'use client'

import React from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { InlineText } from '@/components/admin/InlineText'
import { EditableImage } from './shared'
import type { BlockProps } from './types'

export default function TextImageBlock({ data, editable, update }: BlockProps) {
  const imageLeft = data.image_side === 'left'
  const hasImage = editable || !!data.image_url

  return (
    <section className="py-16 lg:py-20">
      <div
        className={`mx-auto px-6 grid grid-cols-1 gap-12 items-center ${hasImage ? 'max-w-6xl md:grid-cols-2' : 'max-w-3xl'}`}
      >
        <div className={`space-y-6 ${imageLeft ? 'md:order-2' : ''}`}>
          <InlineText
            element="h2"
            value={data.title || ''}
            onChange={(title) => update({ title })}
            placeholder="Heading"
            className="text-3xl font-bold text-slate-900 block"
          />
          <InlineText
            element="p"
            value={data.body || ''}
            onChange={(body) => update({ body })}
            placeholder="Paragraph text"
            className="text-slate-600 leading-relaxed block"
          />
          <InlineText
            element="p"
            value={data.quote || ''}
            onChange={(quote) => update({ quote })}
            placeholder="Optional highlighted quote"
            className="text-slate-700 leading-relaxed block font-semibold border-l-4 border-blue-500 pl-4 italic"
          />
        </div>

        {hasImage && (
          <div className={`relative ${imageLeft ? 'md:order-1' : ''}`}>
            <EditableImage
              src={data.image_url || ''}
              editable={editable}
              onChange={(image_url) => update({ image_url })}
              aspect={4 / 3}
              className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-slate-100"
            />
            {editable && (
              <button
                type="button"
                onClick={() => update({ image_side: imageLeft ? 'right' : 'left' })}
                className="absolute top-2 left-2 z-20 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
              >
                <ArrowLeftRight size={14} />
                <span>Image on {imageLeft ? 'right' : 'left'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
