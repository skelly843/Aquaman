'use client'

import React from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { Edit3, X } from 'lucide-react'

/** The single on/off switch for the in-context editor. Only rendered for active global admins on editable pages. */
export default function GlobalEditorButton() {
  const { isGlobalAdmin, currentPage, editMode, setEditMode, isDirty } = useWebsiteBuilder()

  if (!isGlobalAdmin || !currentPage) return null

  return (
    <button
      type="button"
      onClick={() => setEditMode(!editMode)}
      data-testid="global-editor-button"
      className={`fixed bottom-6 right-6 z-[9999] rounded-full px-6 py-4 font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border ${
        editMode ? 'bg-slate-900 hover:bg-black border-slate-700' : 'bg-blue-600 hover:bg-blue-700 border-blue-500/30'
      }`}
    >
      {editMode ? <X size={18} /> : <Edit3 size={18} />}
      <span>{editMode ? 'Exit editor' : 'Edit this page'}</span>
      {isDirty && <span className="w-2.5 h-2.5 rounded-full bg-amber-400" title="Unsaved changes" />}
    </button>
  )
}
