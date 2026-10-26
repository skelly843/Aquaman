'use client'

import React from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { Edit3 } from 'lucide-react'

export default function GlobalEditorButton() {
  const { isGlobalAdmin, editMode, setEditMode } = useWebsiteBuilder()

  // STRICT RULE: Only render for real authenticated profiles who possess the actual role of global_admin
  if (!isGlobalAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center space-x-2">
      <button
        type="button"
        onClick={() => setEditMode(!editMode)}
        data-testid="global-editor-button"
        className={`rounded-full px-6 py-4 font-black text-sm text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shrink-0 border border-white/20 ${
          editMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <Edit3 size={18} />
        <span>Toggle Page Editor [ {editMode ? 'ON' : 'OFF'} ]</span>
      </button>
    </div>
  )
}
