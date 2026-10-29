'use client'

import React from 'react'
import { Compass } from 'lucide-react'
import { InlineText } from '@/components/admin/InlineText'
import { AddItemButton, ICONS, ItemControls, SectionHeading, moveItem, nextIcon, patchItem } from './shared'
import type { BlockProps } from './types'

interface FeatureItem {
  icon?: string
  title: string
  desc: string
}

export default function FeaturesBlock({ data, editable, update }: BlockProps) {
  const items: FeatureItem[] = Array.isArray(data.items) ? data.items : []
  const setItems = (next: FeatureItem[]) => update({ items: next })
  const cols = items.length + (editable ? 1 : 0) >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading data={data} update={update} editable={editable} />

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6`}>
          {items.map((item, idx) => {
            const Icon = ICONS[item.icon || ''] || Compass
            return (
              <div key={idx} className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                {editable && (
                  <ItemControls
                    index={idx}
                    count={items.length}
                    onMove={(delta) => setItems(moveItem(items, idx, delta))}
                    onRemove={() => setItems(items.filter((_, i) => i !== idx))}
                  />
                )}
                {editable ? (
                  <button
                    type="button"
                    onClick={() => setItems(patchItem(items, idx, { icon: nextIcon(item.icon) }))}
                    className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center ring-2 ring-dashed ring-transparent hover:ring-blue-400"
                    title="Change icon"
                  >
                    <Icon size={24} />
                  </button>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                )}
                <InlineText
                  element="h3"
                  value={item.title}
                  onChange={(title) => setItems(patchItem(items, idx, { title }))}
                  placeholder="Feature title"
                  className="font-bold text-slate-900 text-lg block"
                />
                <InlineText
                  element="p"
                  value={item.desc}
                  onChange={(desc) => setItems(patchItem(items, idx, { desc }))}
                  placeholder="Describe this feature"
                  className="text-slate-600 text-sm leading-relaxed block"
                />
              </div>
            )
          })}

          {editable && (
            <AddItemButton
              label="Add feature"
              onClick={() => setItems([...items, { icon: 'star', title: 'New feature', desc: 'Describe this feature.' }])}
            />
          )}
        </div>
      </div>
    </section>
  )
}
