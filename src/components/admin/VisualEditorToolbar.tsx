'use client'

import React, { useState, useEffect } from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import {
  Edit,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Check,
  Undo,
  Redo,
  Plus,
  Settings,
  X,
  Loader2,
  Lock,
  Globe
} from 'lucide-react'

export const VisualEditorToolbar: React.FC = () => {
  const {
    editMode,
    setEditMode,
    previewMode,
    setPreviewMode,
    previewDevice,
    setPreviewDevice,
    loading,
    saveDraft,
    publishLive,
    undo,
    redo,
    addBlock,
    canUndo,
    canRedo,
    styles,
    setStyles,
    isGlobalAdmin
  } = useWebsiteBuilder()

  const [showStylesModal, setShowStylesModal] = useState(false)
  const [showBlocksModal, setShowBlocksModal] = useState(false)

  // Offset page body so top toolbar doesn't obstruct fixed header
  useEffect(() => {
    if (editMode && isGlobalAdmin) {
      document.body.style.paddingTop = '56px'
    } else {
      document.body.style.paddingTop = '0px'
    }
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [editMode, isGlobalAdmin])

  const availableBlocks = [
    { type: 'hero', label: 'Hero Header', desc: 'Large headline background image with CTA buttons' },
    { type: 'text_image', label: 'Text & Image', desc: 'Informational text with customizable side photo' },
    { type: 'features', label: 'Key Features', desc: 'Three-column repeatable feature cards' },
    { type: 'team', label: 'Team Members', desc: 'Leadership grid with photos and bio text' },
    { type: 'gallery_grid', label: 'Gallery Grid', desc: 'Category-filtered project showcase gallery' },
    { type: 'services_grid', label: 'Services Grid', desc: 'Catalog cards pulling active company services' },
    { type: 'contact_info', label: 'Contact Details', desc: 'Phone, email, address and operating hours bar' },
    { type: 'contact_form', label: 'Contact Message Form', desc: 'Standard customer inquiry contact form' },
    { type: 'request_form', label: 'Service Dispatch Form', desc: 'Detailed booking and service dispatch form' },
    { type: 'cta_banner', label: 'Call-to-Action Banner', desc: 'Prominent full-width blue action banner' },
    { type: 'image', label: 'Standalone Photo', desc: 'Full-width custom image block' },
    { type: 'spacer', label: 'Spacer', desc: 'Vertical spacing separator' }
  ]

  if (!isGlobalAdmin) return null

  return (
    <div
      data-testid="visual-editor-toolbar"
      className="fixed top-0 left-0 right-0 z-[99999] bg-slate-900 text-white shadow-2xl px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 select-none"
    >
      <div className="flex items-center space-x-3 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
          <Settings size={18} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-blue-400">Website Builder</p>
          <p className="text-[10px] text-slate-400 font-medium">On-Page Live Visual Editor</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setEditMode(!editMode)
            if (!editMode) setPreviewMode(false)
          }}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editMode ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Edit size={14} />
          <span>Toggle Page Editor [ {editMode ? 'ON' : 'OFF'} ]</span>
        </button>

        {editMode && (
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye size={14} />
            <span>{previewMode ? 'Edit Mode' : 'Preview Live'}</span>
          </button>
        )}
      </div>

      {editMode && (
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-md transition-all ${
              previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop frame"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-md transition-all ${
              previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet frame"
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-md transition-all ${
              previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile frame"
          >
            <Smartphone size={14} />
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 border-r border-slate-800 pr-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              title="Undo"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              title="Redo"
            >
              <Redo size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowBlocksModal(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            <Plus size={14} />
            <span>Add Section</span>
          </button>

          <button
            onClick={saveDraft}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={publishLive}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
            <span>Publish</span>
          </button>
        </div>
      )}

      {/* Add Section Modal */}
      {showBlocksModal && (
        <div className="fixed inset-0 bg-black/60 z-[100000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Plus className="mr-2 text-blue-500" size={18} />
                Add Page Section Block
              </h3>
              <button onClick={() => setShowBlocksModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {availableBlocks.map((b) => (
                <button
                  key={b.type}
                  onClick={() => {
                    addBlock(b.type)
                    setShowBlocksModal(false)
                  }}
                  className="w-full text-left p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all flex flex-col space-y-0.5"
                >
                  <span className="font-bold text-xs text-slate-100">{b.label}</span>
                  <span className="text-[11px] text-slate-400">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
