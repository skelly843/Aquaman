'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { BLOCK_DEFINITIONS } from '@/components/blocks/registry'
import { EDITABLE_PAGES } from '@/utils/pages'
import {
  Eye,
  EyeOff,
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
  Loader2
} from 'lucide-react'

/** Fixed editor toolbar, shown only while edit mode is on. */
export const VisualEditorToolbar: React.FC = () => {
  const {
    editMode,
    previewMode,
    setPreviewMode,
    previewDevice,
    setPreviewDevice,
    currentPage,
    saving,
    isDirty,
    saveDraft,
    publishLive,
    undo,
    redo,
    addBlock,
    canUndo,
    canRedo,
    styles,
    setStyles
  } = useWebsiteBuilder()

  const barRef = useRef<HTMLDivElement>(null)
  const [showStylesModal, setShowStylesModal] = useState(false)
  const [showBlocksModal, setShowBlocksModal] = useState(false)

  // Publish the toolbar height so body/header can be offset beneath it
  useEffect(() => {
    const root = document.documentElement
    const el = barRef.current
    if (!editMode || !el) {
      root.style.setProperty('--editor-toolbar-h', '0px')
      return
    }
    const apply = () => root.style.setProperty('--editor-toolbar-h', `${el.offsetHeight}px`)
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => {
      observer.disconnect()
      root.style.setProperty('--editor-toolbar-h', '0px')
    }
  }, [editMode])

  if (!editMode || !currentPage) return null

  const deviceButton = (device: 'desktop' | 'tablet' | 'mobile', Icon: typeof Monitor, title: string) => (
    <button
      type="button"
      onClick={() => setPreviewDevice(device)}
      className={`p-1.5 rounded-md transition-all ${
        previewDevice === device ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
      }`}
      title={title}
    >
      <Icon size={14} />
    </button>
  )

  return (
    <>
      <div
        ref={barRef}
        data-testid="visual-editor-toolbar"
        className="fixed top-0 left-0 right-0 z-[9999] bg-slate-900 text-white shadow-xl px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none"
      >
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
            <Settings size={18} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-blue-400">
              Editing: {EDITABLE_PAGES[currentPage].label}
            </p>
            <p className={`text-[10px] font-medium ${isDirty ? 'text-amber-400' : 'text-slate-400'}`}>
              {saving ? 'Saving…' : isDirty ? 'Unsaved changes' : 'All changes saved'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {deviceButton('desktop', Monitor, 'Desktop width')}
            {deviceButton('tablet', Tablet, 'Tablet width')}
            {deviceButton('mobile', Smartphone, 'Mobile width')}
          </div>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Hide editing controls to see the draft as visitors would"
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{previewMode ? 'Back to editing' : 'Preview'}</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-25 transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={14} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-25 transition-all"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowBlocksModal(true)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
          >
            <Plus size={14} />
            <span>Add Section</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStylesModal(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-all"
          >
            <Settings size={14} />
            <span>Styles</span>
          </button>

          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={publishLive}
            disabled={saving}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Global Style Modal */}
      {showStylesModal && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 text-left text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Settings className="mr-2 text-blue-500" size={18} />
                Global Branding Style
              </h3>
              <button type="button" onClick={() => setShowStylesModal(false)} className="text-slate-400 hover:text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['primary_color', 'secondary_color'] as const).map((key) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {key === 'primary_color' ? 'Primary Color' : 'Secondary Color'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles[key]}
                        onChange={(e) => setStyles({ ...styles, [key]: e.target.value })}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={styles[key]}
                        onChange={(e) => setStyles({ ...styles, [key]: e.target.value })}
                        className="w-full bg-slate-800 text-xs text-white border-0 rounded px-2"
                      />
                    </div>
                  </div>
                ))}
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
              <p className="text-[11px] text-slate-500">Saved with the page when you press Save Draft or Publish.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowStylesModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showBlocksModal && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 text-left max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Plus className="mr-2 text-green-500" size={18} />
                Add a section
              </h3>
              <button type="button" onClick={() => setShowBlocksModal(false)} className="text-slate-400 hover:text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
              {BLOCK_DEFINITIONS.map((def) => (
                <button
                  type="button"
                  key={def.type}
                  onClick={() => {
                    const id = addBlock(def.type)
                    setShowBlocksModal(false)
                    setPreviewMode(false)
                    requestAnimationFrame(() =>
                      setTimeout(() => document.getElementById(`block-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
                    )
                  }}
                  className="text-left p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex flex-col gap-1"
                >
                  <span className="font-bold text-sm text-slate-100">{def.label}</span>
                  <span className="text-xs text-slate-400">{def.description}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 shrink-0">New sections are added at the bottom of the page — drag them into place.</p>
          </div>
        </div>
      )}
    </>
  )
}
