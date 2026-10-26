'use client'

import React, { useState } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { Camera, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  photo: string
  bio: string
}

interface TeamBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const TeamBlock: React.FC<TeamBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null)

  const title = data?.title || 'Meet Our Team'
  const subtitle = data?.subtitle || 'Experienced leadership and master technicians.'
  const members: TeamMember[] = data?.members || [
    {
      name: 'Arthur Curry',
      role: 'Master Plumber & Founder',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
      bio: '18+ years of commercial and residential plumbing experience.'
    },
    {
      name: 'Mera Pelagios',
      role: 'Head of Contracting & Remodeling',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
      bio: 'General contractor specialized in luxury bathroom and kitchen structural build-outs.'
    }
  ]

  const updateMember = (index: number, key: keyof TeamMember, val: string) => {
    const updated = [...members]
    updated[index] = { ...updated[index], [key]: val }
    onUpdate({ members: updated })
  }

  const addMember = () => {
    const updated = [
      ...members,
      {
        name: 'New Team Member',
        role: 'Specialist Technician',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
        bio: 'Professional background description...'
      }
    ]
    onUpdate({ members: updated })
  }

  const removeMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index)
    onUpdate({ members: updated })
  }

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= members.length) return
    const updated = [...members]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    onUpdate({ members: updated })
  }

  return (
    <div className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-100">
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
          {members.map((m, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm relative group hover:shadow-md transition-all">
              {editMode && (
                <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-white/90 p-1 rounded-lg border border-slate-200 shadow">
                  <button
                    type="button"
                    onClick={() => moveMember(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMember(idx, 'down')}
                    disabled={idx === members.length - 1}
                    className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              <div className="relative h-64 bg-slate-200">
                <img
                  src={m.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'}
                  alt={m.name}
                  className="w-full h-full object-cover object-top"
                />

                {editMode && (
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 shadow"
                  >
                    <Camera size={12} className="text-blue-400" />
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">
                  <InlineText
                    value={m.name}
                    onChange={(val) => updateMember(idx, 'name', val)}
                  />
                </h3>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  <InlineText
                    value={m.role}
                    onChange={(val) => updateMember(idx, 'role', val)}
                  />
                </p>

                <div className="text-sm text-slate-600 leading-relaxed">
                  <InlineText
                    value={m.bio}
                    onChange={(val) => updateMember(idx, 'bio', val)}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {editMode && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={addMember}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 shadow"
            >
              <Plus size={14} />
              <span>Add Team Member</span>
            </button>
          </div>
        )}

      </div>

      {activePhotoIdx !== null && (
        <ImageCropperModal
          bucket="public-site-images"
          onSave={(url) => {
            updateMember(activePhotoIdx, 'photo', url)
            setActivePhotoIdx(null)
          }}
          onClose={() => setActivePhotoIdx(null)}
        />
      )}
    </div>
  )
}
