'use client'

import React from 'react'
import { User } from 'lucide-react'
import { InlineText } from '@/components/admin/InlineText'
import { AddItemButton, EditableImage, ItemControls, SectionHeading, moveItem, patchItem } from './shared'
import type { BlockProps } from './types'

interface Member {
  name: string
  role: string
  bio: string
  photo?: string
}

export default function TeamBlock({ data, editable, update }: BlockProps) {
  const members: Member[] = Array.isArray(data.members) ? data.members : []
  const setMembers = (next: Member[]) => update({ members: next })

  return (
    <section className="py-16 lg:py-20 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading data={data} update={update} editable={editable} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-4">
              {editable && (
                <ItemControls
                  index={idx}
                  count={members.length}
                  onMove={(delta) => setMembers(moveItem(members, idx, delta))}
                  onRemove={() => setMembers(members.filter((_, i) => i !== idx))}
                />
              )}
              <EditableImage
                src={member.photo || ''}
                alt={member.name}
                editable={editable}
                onChange={(photo) => setMembers(patchItem(members, idx, { photo }))}
                aspect={1}
                label="Replace"
                className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-100"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                }
              />
              <div>
                <InlineText
                  element="h3"
                  value={member.name}
                  onChange={(name) => setMembers(patchItem(members, idx, { name }))}
                  placeholder="Name"
                  className="font-bold text-slate-900 block"
                />
                <InlineText
                  element="p"
                  value={member.role}
                  onChange={(role) => setMembers(patchItem(members, idx, { role }))}
                  placeholder="Role"
                  multiline={false}
                  className="text-xs text-blue-600 font-bold uppercase mt-1 block"
                />
                <InlineText
                  element="p"
                  value={member.bio}
                  onChange={(bio) => setMembers(patchItem(members, idx, { bio }))}
                  placeholder="Short bio"
                  className="text-sm text-slate-500 mt-2 block leading-relaxed"
                />
              </div>
            </div>
          ))}

          {editable && (
            <AddItemButton
              label="Add team member"
              onClick={() => setMembers([...members, { name: 'New team member', role: 'Role', bio: 'Short bio.', photo: '' }])}
            />
          )}
        </div>
      </div>
    </section>
  )
}
