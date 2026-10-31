'use client'

import React from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { InlineText } from '@/components/admin/InlineText'
import { EditableImage } from './shared'
import type { BlockProps } from './types'

export default function ImageBlock({ data, editable, update }: BlockProps) {
  const full = data.width === 'full'
  if (!editable && !data.image_url) return null

  return (
    <section className="py-8">
      <figure className={`mx-auto space-y-3 ${full ? 'max-w-none' : 'max-w-5xl px-6'}`}>
        <div className="relative">
          <EditableImage
            src={data.image_url || ''}
            alt={data.caption || ''}
            editable={editable}
            onChange={(image_url) => update({ image_url })}
            aspect={16 / 9}
            className={`overflow-hidden bg-slate-100 ${full ? 'aspect-[21/9]' : 'aspect-video rounded-3xl shadow-lg'}`}
          />
          {editable && (
            <button
              type="button"
              onClick={() => update({ width: full ? 'contained' : 'full' })}
              className="absolute top-2 left-2 z-20 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
            >
              {full ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{full ? 'Contained width' : 'Full width'}</span>
            </button>
          )}
        </div>
        <figcaption className="text-center">
          <InlineText
            element="span"
            value={data.caption || ''}
            onChange={(caption) => update({ caption })}
            placeholder="Optional caption"
            className="text-sm text-slate-500"
          />
        </figcaption>
      </figure>
    </section>
  )
}
