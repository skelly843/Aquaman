'use client'

import React from 'react'

interface SpacerBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const height = data?.height || '64px'

  return (
    <div
      style={{ height: editMode ? '48px' : height }}
      className={`w-full ${editMode ? 'bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest' : ''}`}
    >
      {editMode && <span>Spacer Block ({height})</span>}
    </div>
  )
}
