'use client'

import React from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface EditableBlockWrapperProps {
  id: string
  index: number
  blockType: string
  isVisible: boolean
  children: React.ReactNode
}

export const EditableBlockWrapper: React.FC<EditableBlockWrapperProps> = ({
  id,
  index,
  blockType,
  isVisible,
  children
}) => {
  const {
    editMode,
    previewMode,
    moveBlock,
    duplicateBlock,
    deleteBlock,
    toggleBlockVisibility,
    blocks
  } = useWebsiteBuilder()

  if (!editMode || previewMode) {
    // If not in edit mode or previewing live output, render plain children
    if (!isVisible) return null
    return <>{children}</>
  }

  return (
    <div className={`relative border-2 border-dashed my-4 p-2 transition-all rounded-2xl group ${
      isVisible
        ? 'border-blue-400 hover:border-blue-600 bg-white/50'
        : 'border-slate-300 bg-slate-100 opacity-60'
    }`}>
      {/* Floating control overlay */}
      <div className="absolute top-2 right-2 z-50 bg-slate-900/90 text-white rounded-xl shadow-lg px-2.5 py-1.5 flex items-center space-x-2 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity select-none text-xs">
        <span className="font-extrabold text-[10px] uppercase text-blue-400 font-mono tracking-wider">{blockType}</span>

        <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
          {/* Reordering */}
          <button
            type="button"
            onClick={() => moveBlock(index, 'up')}
            disabled={index === 0}
            className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 transition-all text-slate-300"
            title="Move Section Up"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => moveBlock(index, 'down')}
            disabled={index === blocks.length - 1}
            className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 transition-all text-slate-300"
            title="Move Section Down"
          >
            <ArrowDown size={12} />
          </button>

          {/* Visibility toggle */}
          <button
            type="button"
            onClick={() => toggleBlockVisibility(id)}
            className="p-1 hover:bg-slate-800 rounded transition-all text-slate-300"
            title={isVisible ? 'Hide Section' : 'Show Section'}
          >
            {isVisible ? <Eye size={12} /> : <EyeOff size={12} className="text-amber-400" />}
          </button>

          {/* Copy section */}
          <button
            type="button"
            onClick={() => duplicateBlock(id)}
            className="p-1 hover:bg-slate-800 rounded transition-all text-slate-300"
            title="Duplicate Section"
          >
            <Copy size={12} />
          </button>

          {/* Delete section */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this section block?')) {
                deleteBlock(id)
              }
            }}
            className="p-1 hover:bg-red-950/80 rounded transition-all text-red-400"
            title="Delete Section"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Actual on-page block elements inside */}
      <div className="relative">
        {!isVisible && (
          <div className="absolute inset-0 bg-slate-200/40 z-40 pointer-events-none rounded-xl flex items-center justify-center">
            <span className="bg-slate-800 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm">Hidden Section</span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
