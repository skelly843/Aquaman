'use client'

import React, { useState } from 'react'
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

  // Block definitions list
  const availableBlocks = [
    { type: 'hero', label: 'Hero Image Header', desc: 'Large title header with image and CTAs' },
    { type: 'text_image', label: 'Text with Image Column', desc: 'Side-by-side informational text and imagery' },
    { type: 'features', label: 'Key Features Grid', desc: 'Three-column feature list with clean icons' }
  ]

  if (!isGlobalAdmin) return null

  return (
    <div
      data-testid="visual-editor-toolbar"
      className="fixed top-0 left-0 right-0 z-[9999] bg-slate-900 text-white shadow-xl px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 select-none"
    >
      <div className="flex items-center space-x-3 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
          <Settings size={18} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-blue-400">Website Builder</p>
          <p className="text-[10px] text-slate-400 font-medium">Edit actual elements live</p>
        </div>
      </div>

      {/* Editor Toggles */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setEditMode(!editMode)
            if (!editMode) setPreviewMode(false)
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editMode ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Edit size={14} />
          <span>{editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}</span>
        </button>

        {editMode && (
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye size={14} />
            <span>{previewMode ? 'Edit Draft View' : 'Preview Live'}</span>
          </button>
        )}
      </div>

      {/* Viewport size frame controllers */}
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

      {/* Action commands */}
      {editMode && (
        <div className="flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 border-r border-slate-800 pr-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              title="Undo last change"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              title="Redo change"
            >
              <Redo size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowBlocksModal(true)}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            <Plus size={14} />
            <span>Add Section</span>
          </button>

          <button
            onClick={() => setShowStylesModal(true)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-all"
          >
            <Settings size={14} />
            <span>Styles</span>
          </button>

          <button
            onClick={saveDraft}
            disabled={loading}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={publishLive}
            disabled={loading}
            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
            <span>Publish Live</span>
          </button>
        </div>
      )}

      {/* Global Style Modal */}
      {showStylesModal && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Settings className="mr-2 text-blue-500" size={18} />
                Global Branding Style
              </h3>
              <button onClick={() => setShowStylesModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={styles.primary_color}
                      onChange={(e) => setStyles({ ...styles, primary_color: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={styles.primary_color}
                      onChange={(e) => setStyles({ ...styles, primary_color: e.target.value })}
                      className="w-full bg-slate-800 text-xs text-white border-0 rounded px-2"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={styles.secondary_color}
                      onChange={(e) => setStyles({ ...styles, secondary_color: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={styles.secondary_color}
                      onChange={(e) => setStyles({ ...styles, secondary_color: e.target.value })}
                      className="w-full bg-slate-800 text-xs text-white border-0 rounded px-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heading & Logo Font</label>
                <select
                  value={styles.heading_font}
                  onChange={(e) => setStyles({ ...styles, heading_font: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded px-3 py-2 text-xs border-0 focus:outline-none"
                >
                  <option value="Geist Sans">Geist Sans (Clean/Modern)</option>
                  <option value="Inter">Inter (System Premium)</option>
                  <option value="Merriweather">Merriweather (Classic Serif)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card Border Radius</label>
                <select
                  value={styles.border_radius}
                  onChange={(e) => setStyles({ ...styles, border_radius: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded px-3 py-2 text-xs border-0 focus:outline-none"
                >
                  <option value="0px">Sharp (0px)</option>
                  <option value="0.5rem">Standard (8px)</option>
                  <option value="0.75rem">Round (12px)</option>
                  <option value="1.5rem">Extra Round (24px)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowStylesModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Apply Style Changes
            </button>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      {showBlocksModal && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Plus className="mr-2 text-green-500" size={18} />
                Add Page Section Block
              </h3>
              <button onClick={() => setShowBlocksModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {availableBlocks.map((b) => (
                <button
                  key={b.type}
                  onClick={() => {
                    addBlock(b.type)
                    setShowBlocksModal(false)
                  }}
                  className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex flex-col space-y-1"
                >
                  <span className="font-bold text-sm text-slate-100">{b.label}</span>
                  <span className="text-xs text-slate-400">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
