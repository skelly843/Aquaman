'use client'

import React from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { Edit3 } from 'lucide-react'

export default function GlobalEditorButton() {
  const { isGlobalAdmin, editMode, setEditMode } = useWebsiteBuilder()

  if (!isGlobalAdmin) return null

  return (
    <button
      type="button"
      onClick={() => setEditMode(!editMode)}
      data-testid="global-editor-button"
      className="fixed bottom-6 right-6 z-[9999] rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shrink-0 border border-blue-500/30"
    >
      <Edit3 size={18} className="animate-pulse" />
      <span>{editMode ? 'Exit Website Builder' : 'Edit This Page'}</span>
    </button>
  )
}
