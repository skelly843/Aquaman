'use client'

import React from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { CheckCircle2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface FeatureItem {
  title: string
  desc: string
}

interface FeaturesBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const title = data?.title || 'Why Choose Us'
  const subtitle = data?.subtitle || 'Our commitment to reliability and unmatched service standard.'
  const items: FeatureItem[] = data?.items || [
    { title: 'Licensed & Insured', desc: 'Master plumbers fully equipped for residential and commercial jobs.' },
    { title: '24/7 Emergency Service', desc: 'Immediate response team ready for urgent burst pipes and leaks.' },
    { title: 'Upfront Pricing', desc: 'Transparent estimates before work starts with zero hidden fees.' }
  ]

  const updateItem = (index: number, key: keyof FeatureItem, val: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [key]: val }
    onUpdate({ items: updated })
  }

  const addItem = () => {
    const updated = [...items, { title: 'New Key Point', desc: 'Add description details here...' }]
    onUpdate({ items: updated })
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    onUpdate({ items: updated })
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    onUpdate({ items: updated })
  }

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-all">
              {editMode && (
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                <InlineText
                  value={item.title}
                  onChange={(val) => updateItem(idx, 'title', val)}
                />
              </h3>

              <div className="text-sm text-slate-600 leading-relaxed">
                <InlineText
                  value={item.desc}
                  onChange={(val) => updateItem(idx, 'desc', val)}
                />
              </div>
            </div>
          ))}
        </div>

        {editMode && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 shadow"
            >
              <Plus size={14} />
              <span>Add Feature Point</span>
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
