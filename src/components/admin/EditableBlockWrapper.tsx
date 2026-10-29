'use client'

import React from 'react'
import { PageBlock, useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react'

interface EditableBlockWrapperProps {
  block: PageBlock
  index: number
  totalBlocks: number
  children: React.ReactNode
}

export default function EditableBlockWrapper({
  block,
  index,
  totalBlocks,
  children
}: EditableBlockWrapperProps) {
  const {
    editMode,
    previewMode,
    moveBlock,
    duplicateBlock,
    deleteBlock,
    toggleBlockVisibility,
    reorderBlocks
  } = useWebsiteBuilder()

  if (!editMode || previewMode) {
    if (!block.is_visible) return null
    return <>{children}</>
  }

  // Native Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(fromIndex) && fromIndex !== index) {
      reorderBlocks(fromIndex, index)
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed my-3 p-1.5 transition-all rounded-2xl group ${
        block.is_visible
          ? 'border-blue-400/80 hover:border-blue-600 bg-white/60'
          : 'border-slate-300 bg-slate-100 opacity-60'
      }`}
    >
      {/* Control Overlay */}
      <div className="absolute top-3 right-3 z-50 bg-slate-900/95 text-white rounded-xl shadow-xl px-3 py-1.5 flex items-center space-x-2 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity select-none text-xs backdrop-blur-sm">

        {/* Grip Handle */}
        <div className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-white" title="Drag to reorder section">
          <GripVertical size={14} />
        </div>

        <span className="font-extrabold text-[10px] uppercase text-blue-400 font-mono tracking-wider">
          {block.block_type}
        </span>

        <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
          {/* Reorder Up/Down */}
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
            disabled={index === totalBlocks - 1}
            className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 transition-all text-slate-300"
            title="Move Section Down"
          >
            <ArrowDown size={12} />
          </button>

          {/* Visibility */}
          <button
            type="button"
            onClick={() => toggleBlockVisibility(block.id)}
            className="p-1 hover:bg-slate-800 rounded transition-all text-slate-300"
            title={block.is_visible ? 'Hide Section' : 'Show Section'}
          >
            {block.is_visible ? <Eye size={12} /> : <EyeOff size={12} className="text-amber-400" />}
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => duplicateBlock(block.id)}
            className="p-1 hover:bg-slate-800 rounded transition-all text-slate-300"
            title="Duplicate Section"
          >
            <Copy size={12} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => deleteBlock(block.id)}
            className="p-1 hover:bg-red-950/80 rounded transition-all text-red-400"
            title="Delete Section"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="relative">
        {!block.is_visible && (
          <div className="absolute inset-0 bg-slate-200/40 z-40 pointer-events-none rounded-xl flex items-center justify-center">
            <span className="bg-slate-800 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm">
              Hidden Section
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
