'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Type,
  Image as ImageIcon,
  Layout,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  Eye,
  Edit,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Palette,
  Sparkles,
  Move,
  FileText,
  Quote,
  Layers,
  Columns,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react'

// Curated fonts dropdown options
export const CURATED_FONTS = [
  { name: 'Geist Sans', family: "'Geist Sans', sans-serif", category: 'Sans-Serif' },
  { name: 'Inter', family: "'Inter', sans-serif", category: 'Sans-Serif' },
  { name: 'Playfair Display', family: "'Playfair Display', Georgia, serif", category: 'Serif' },
  { name: 'Merriweather', family: "'Merriweather', serif", category: 'Serif' },
  { name: 'Roboto', family: "'Roboto', sans-serif", category: 'Sans-Serif' },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Sans-Serif' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'Headline' },
  { name: 'Lora', family: "'Lora', serif", category: 'Serif' },
  { name: 'Cinzel', family: "'Cinzel', serif", category: 'Display' },
  { name: 'Fira Code', family: "'Fira Code', monospace", category: 'Monospace' },
]

export interface EditorialBlock {
  id: string
  type: 'hero' | 'text' | 'image' | 'text_image' | 'quote' | 'callout' | 'columns'
  title?: string
  subtitle?: string
  body_content?: string
  image_url?: string
  caption?: string
  author?: string
  columns_data?: { title: string; content: string; image_url?: string }[]
  font_family?: string
  font_size?: string // e.g. 'text-base', 'text-xl', 'text-3xl', 'text-5xl'
  font_weight?: string // e.g. 'font-normal', 'font-medium', 'font-bold', 'font-black'
  text_color?: string
  text_align?: 'left' | 'center' | 'right' | 'justify'
  bg_color?: string
  layout_variant?: 'full' | 'text_left' | 'text_right' | 'centered' | 'card'
  image_aspect?: '16:9' | '4:3' | '1:1' | 'auto'
  image_radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const DEFAULT_EDITORIAL_BLOCKS: EditorialBlock[] = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'The Art & Science of Modern Water Solutions',
    subtitle: 'An Editorial Showcase on Sustainable Home Infrastructure & Premium Contracting',
    author: 'By Aquaman Editorial Team • Published March 2026',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
    font_family: 'Playfair Display',
    font_size: 'text-5xl',
    font_weight: 'font-black',
    text_color: '#0f172a',
    text_align: 'center',
    bg_color: '#f8fafc',
    image_aspect: '16:9',
    image_radius: 'lg'
  },
  {
    id: 'text-1',
    type: 'text',
    title: 'Craftsmanship Meets High Efficiency',
    body_content: 'Water management in modern residences requires a harmonious balance between engineering precision and refined aesthetic integration. Every piping run, high-capacity water heating unit, and luxury fixture represents a deliberate investment in comfort, safety, and long-term durability.',
    font_family: 'Merriweather',
    font_size: 'text-lg',
    font_weight: 'font-normal',
    text_color: '#334155',
    text_align: 'left',
    bg_color: '#ffffff'
  },
  {
    id: 'quote-1',
    type: 'quote',
    body_content: 'Water is the true foundation of home health. Designing systems that flow cleanly and efficiently transforms how people experience their living spaces daily.',
    author: 'Master Contracting Specialist, Aquaman Services',
    font_family: 'Cinzel',
    font_size: 'text-2xl',
    font_weight: 'font-semibold',
    text_color: '#1e40af',
    text_align: 'center',
    bg_color: '#eff6ff'
  },
  {
    id: 'text_image-1',
    type: 'text_image',
    title: 'Precision Contracting & System Integration',
    body_content: 'From custom bathroom remodeling to whole-home filtration systems, our master technicians ensure every installation exceeds strict safety standards while matching your architectural vision.',
    image_url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    caption: 'Custom water filtration manifold installed in Ocean City residence.',
    font_family: 'Inter',
    font_size: 'text-base',
    font_weight: 'font-normal',
    text_color: '#1e293b',
    layout_variant: 'text_left',
    image_aspect: '4:3',
    image_radius: 'md'
  }
]

export default function EditorialEditor() {
  const supabase = createClient()

  // State definitions
  const [blocks, setBlocks] = useState<EditorialBlock[]>(DEFAULT_EDITORIAL_BLOCKS)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('hero-1')
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [loading, setLoading] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [userSession, setUserSession] = useState<any>(null)
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'blocks' | 'typography' | 'media' | 'templates'>('blocks')

  // Sample media palette images for drag-and-drop
  const [mediaPalette, setMediaPalette] = useState<string[]>([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'
  ])
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)

  // Load user session and saved editorial content on mount
  useEffect(() => {
    async function initEditorial() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        setUserSession(session)

        // Load saved editorial layout from site_content
        const { data: savedData } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'editorial_layout')
          .single()

        if (savedData?.content && Array.isArray((savedData.content as any).blocks)) {
          setBlocks((savedData.content as any).blocks)
        }
      } catch (err) {
        console.warn('Using default editorial layout:', err)
      } finally {
        setLoading(false)
      }
    }
    initEditorial()
  }, [supabase])

  // Save editorial blocks to Supabase
  const handleSaveToSupabase = async () => {
    try {
      setLoading(true)
      setSaveStatus(null)

      const payload = {
        blocks,
        updated_at: new Date().toISOString(),
        updated_by: userSession?.user?.email || 'authenticated_user'
      }

      // Upsert into site_content table
      const { error: siteErr } = await supabase
        .from('site_content')
        .upsert({
          id: 'editorial_layout',
          content: payload as any,
          updated_at: new Date().toISOString()
        })

      if (siteErr) throw siteErr

      setSaveStatus('Editorial saved successfully to Supabase!')
      setTimeout(() => setSaveStatus(null), 4000)
    } catch (err: any) {
      setSaveStatus(`Save error: ${err.message || 'Failed to save'}`)
    } finally {
      setLoading(false)
    }
  }

  // Block management actions
  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0]

  const updateSelectedBlock = (field: keyof EditorialBlock, value: any) => {
    if (!selectedBlockId) return
    setBlocks(prev =>
      prev.map(b => (b.id === selectedBlockId ? { ...b, [field]: value } : b))
    )
  }

  const addBlock = (type: EditorialBlock['type']) => {
    const newBlock: EditorialBlock = {
      id: `block-${Date.now()}`,
      type,
      title: type === 'hero' ? 'New Editorial Headline' : type === 'quote' ? '' : 'Section Subheading',
      body_content: type === 'quote' ? 'Insert impactful editorial quote verbiage here...' : 'Write paragraph context and verbiage here...',
      image_url: type === 'image' || type === 'text_image' || type === 'hero' ? mediaPalette[0] : undefined,
      font_family: 'Inter',
      font_size: 'text-base',
      font_weight: 'font-normal',
      text_color: '#1e293b',
      text_align: 'left',
      bg_color: '#ffffff',
      layout_variant: 'full',
      image_aspect: '16:9',
      image_radius: 'md'
    }
    setBlocks(prev => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      alert('Your layout must contain at least one block.')
      return
    }
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedBlockId === id) {
      const remaining = blocks.filter(b => b.id !== id)
      setSelectedBlockId(remaining[0]?.id || null)
    }
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= blocks.length) return
    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIdx]
    newBlocks[targetIdx] = temp
    setBlocks(newBlocks)
  }

  // Native Drag and Drop Reordering for blocks
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedBlockIndex(index)
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnBlock = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    // Check if dragging image URL from palette
    const droppedImageUrl = e.dataTransfer.getData('image/url')
    if (droppedImageUrl && blocks[dropIndex]) {
      const updated = [...blocks]
      updated[dropIndex] = { ...updated[dropIndex], image_url: droppedImageUrl }
      setBlocks(updated)
      return
    }

    // Otherwise handle block reordering
    if (draggedBlockIndex === null || draggedBlockIndex === dropIndex) return
    const newBlocks = [...blocks]
    const [draggedItem] = newBlocks.splice(draggedBlockIndex, 1)
    newBlocks.splice(dropIndex, 0, draggedItem)
    setBlocks(newBlocks)
    setDraggedBlockIndex(null)
  }

  // Local image file drop handler
  const handleLocalFileDrop = async (e: React.DragEvent, blockId: string) => {
    e.preventDefault()
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const file = e.dataTransfer.files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please drop a valid image file.')
      return
    }

    try {
      setUploadingImage(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `editorial-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('public-site-images')
        .upload(fileName, file)

      if (uploadErr) throw uploadErr

      const publicUrl = supabase.storage
        .from('public-site-images')
        .getPublicUrl(fileName).data.publicUrl

      setBlocks(prev =>
        prev.map(b => (b.id === blockId ? { ...b, image_url: publicUrl } : b))
      )
      setMediaPalette(prev => [publicUrl, ...prev])
    } catch (err: any) {
      alert(`Image upload error: ${err.message || 'Upload failed'}`)
    } finally {
      setUploadingImage(false)
    }
  }

  // Preset Layout Templates loader
  const loadPresetTemplate = (templateName: 'magazine' | 'story' | 'gallery') => {
    if (templateName === 'magazine') {
      setBlocks(DEFAULT_EDITORIAL_BLOCKS)
    } else if (templateName === 'story') {
      setBlocks([
        {
          id: 'hero-story',
          type: 'hero',
          title: 'Architectural Plumbing & Sustainable Luxury',
          subtitle: 'Redefining Water Design and Infrastructure in Residential Architecture',
          image_url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80',
          font_family: 'Playfair Display',
          font_size: 'text-5xl',
          font_weight: 'font-extrabold',
          text_color: '#0f172a',
          text_align: 'center',
          bg_color: '#f1f5f9'
        },
        {
          id: 'callout-1',
          type: 'callout',
          title: 'Key Industry Standard',
          body_content: 'High-efficiency systems reduce household water usage by up to 40% while preserving peak flow pressure.',
          font_family: 'Inter',
          font_size: 'text-lg',
          font_weight: 'font-semibold',
          text_color: '#0369a1',
          bg_color: '#e0f2fe'
        },
        {
          id: 'text-story',
          type: 'text',
          title: 'Clean Engineering for Modern Homes',
          body_content: 'Every element of our contracting work focuses on long-term dependability, zero leaks, and architectural harmony.',
          font_family: 'Lora',
          font_size: 'text-lg',
          font_weight: 'font-normal',
          text_color: '#334155'
        }
      ])
    } else if (templateName === 'gallery') {
      setBlocks([
        {
          id: 'gallery-hero',
          type: 'hero',
          title: 'Aquaman Visual Portfolio Showcase',
          subtitle: 'A Curated Collection of Water System Installations and Renovations',
          font_family: 'Cinzel',
          font_size: 'text-4xl',
          font_weight: 'font-bold',
          text_align: 'center',
          bg_color: '#0f172a',
          text_color: '#ffffff'
        },
        {
          id: 'img-1',
          type: 'image',
          image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
          caption: 'High-capacity water filtration system installation.',
          image_aspect: '16:9',
          image_radius: 'lg'
        },
        {
          id: 'img-2',
          type: 'image',
          image_url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
          caption: 'Custom bathroom plumbing fixtures and tile detail.',
          image_aspect: '16:9',
          image_radius: 'lg'
        }
      ])
    }
  }

  // Get responsive wrapper style based on preview mode
  const getContainerClass = () => {
    if (!previewMode) return 'w-full'
    if (previewDevice === 'mobile') return 'max-w-[390px] mx-auto shadow-2xl border-x border-slate-300'
    if (previewDevice === 'tablet') return 'max-w-[768px] mx-auto shadow-2xl border-x border-slate-300'
    return 'max-w-6xl mx-auto'
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Editorial Control Header */}
      <div className="sticky top-20 z-40 bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Sparkles size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>Editorial Studio & Layout Builder</span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full uppercase">
                Drag-and-Drop
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Customize typography, drag photo placements, edit verbiage, and save directly to Supabase.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          {/* Viewport device frame toggles */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 space-x-1">
            <button
              onClick={() => { setPreviewMode(true); setPreviewDevice('desktop') }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode && previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => { setPreviewMode(true); setPreviewDevice('tablet') }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode && previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet Frame"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => { setPreviewMode(true); setPreviewDevice('mobile') }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode && previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Frame"
            >
              <Smartphone size={16} />
            </button>
          </div>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
              previewMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Eye size={14} />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>

          <button
            onClick={handleSaveToSupabase}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save to Supabase</span>
          </button>
        </div>
      </div>

      {/* Alert / Notification banner */}
      {saveStatus && (
        <div className={`px-6 py-2.5 text-xs font-bold text-center flex items-center justify-center space-x-2 ${
          saveStatus.includes('error') ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <Check size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Control Panel (Hidden in Preview Mode) */}
        {!previewMode && (
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-140px)] shrink-0 overflow-y-auto">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1">
              {[
                { id: 'blocks', label: 'Blocks', icon: Layers },
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'media', label: 'Media', icon: ImageIcon },
                { id: 'templates', label: 'Presets', icon: Layout },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1 transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <tab.icon size={13} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT: BLOCKS LIST & ADDER */}
            {activeTab === 'blocks' && (
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add Editorial Elements</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addBlock('hero')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Hero Header</p>
                      <p className="text-[10px] text-slate-400">Large editorial headline</p>
                    </button>
                    <button
                      onClick={() => addBlock('text')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Text Article</p>
                      <p className="text-[10px] text-slate-400">Paragraph verbiage</p>
                    </button>
                    <button
                      onClick={() => addBlock('text_image')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Text & Image</p>
                      <p className="text-[10px] text-slate-400">Side-by-side layout</p>
                    </button>
                    <button
                      onClick={() => addBlock('quote')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Callout Quote</p>
                      <p className="text-[10px] text-slate-400">Editorial quotation</p>
                    </button>
                    <button
                      onClick={() => addBlock('image')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Photo Feature</p>
                      <p className="text-[10px] text-slate-400">Full-width photo</p>
                    </button>
                    <button
                      onClick={() => addBlock('callout')}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all"
                    >
                      <p className="font-bold text-xs text-slate-800">Highlight Box</p>
                      <p className="text-[10px] text-slate-400">Callout panel</p>
                    </button>
                  </div>
                </div>

                {/* Structure Outline / Reordering */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Canvas Outline & Order</p>
                  <div className="space-y-2">
                    {blocks.map((block, idx) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnBlock(e, idx)}
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedBlockId === block.id
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Move size={14} className="text-slate-400 shrink-0 cursor-grab" />
                          <div>
                            <p className="font-bold text-xs text-slate-800 capitalize truncate">
                              {block.type} Element
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {block.title || block.body_content || 'Empty Content'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up') }}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down') }}
                            disabled={idx === blocks.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id) }}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TYPOGRAPHY & TEXT STYLING */}
            {activeTab === 'typography' && (
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Block Typography</p>

                  {selectedBlock ? (
                    <div className="space-y-4">
                      {/* Curated Font Family Dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Font Family</label>
                        <select
                          value={selectedBlock.font_family || 'Inter'}
                          onChange={(e) => updateSelectedBlock('font_family', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                          {CURATED_FONTS.map(font => (
                            <option key={font.name} value={font.name}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size & Weight */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Font Size</label>
                          <select
                            value={selectedBlock.font_size || 'text-base'}
                            onChange={(e) => updateSelectedBlock('font_size', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                          >
                            <option value="text-sm">Small (14px)</option>
                            <option value="text-base">Base (16px)</option>
                            <option value="text-lg">Large (18px)</option>
                            <option value="text-xl">XL (20px)</option>
                            <option value="text-2xl">2XL (24px)</option>
                            <option value="text-3xl">3XL (30px)</option>
                            <option value="text-4xl">4XL (36px)</option>
                            <option value="text-5xl">Hero 5XL (48px)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Font Weight</label>
                          <select
                            value={selectedBlock.font_weight || 'font-normal'}
                            onChange={(e) => updateSelectedBlock('font_weight', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                          >
                            <option value="font-normal">Normal (400)</option>
                            <option value="font-medium">Medium (500)</option>
                            <option value="font-semibold">Semi-Bold (600)</option>
                            <option value="font-bold">Bold (700)</option>
                            <option value="font-black">Black (900)</option>
                          </select>
                        </div>
                      </div>

                      {/* Text Color & Alignment */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Text Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={selectedBlock.text_color || '#1e293b'}
                            onChange={(e) => updateSelectedBlock('text_color', e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={selectedBlock.text_color || '#1e293b'}
                            onChange={(e) => updateSelectedBlock('text_color', e.target.value)}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Text Alignment</label>
                        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                          {(['left', 'center', 'right', 'justify'] as const).map(align => (
                            <button
                              key={align}
                              onClick={() => updateSelectedBlock('text_align', align)}
                              className={`py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                                selectedBlock.text_align === align ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Background Color */}
                      <div className="space-y-1 pt-3 border-t border-slate-200">
                        <label className="text-xs font-bold text-slate-700">Block Background Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={selectedBlock.bg_color || '#ffffff'}
                            onChange={(e) => updateSelectedBlock('bg_color', e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={selectedBlock.bg_color || '#ffffff'}
                            onChange={(e) => updateSelectedBlock('bg_color', e.target.value)}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Select a block on the canvas to style its typography.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: MEDIA PALETTE & DRAG-AND-DROP */}
            {activeTab === 'media' && (
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Assets Palette</p>
                    <label className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                      {uploadingImage ? <Loader2 className="animate-spin" size={10} /> : <Upload size={10} />}
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (!e.target.files || !e.target.files[0]) return
                          const file = e.target.files[0]
                          const fileExt = file.name.split('.').pop()
                          const fileName = `editorial-${Date.now()}.${fileExt}`
                          setUploadingImage(true)
                          const { error } = await supabase.storage.from('public-site-images').upload(fileName, file)
                          if (!error) {
                            const publicUrl = supabase.storage.from('public-site-images').getPublicUrl(fileName).data.publicUrl
                            setMediaPalette(prev => [publicUrl, ...prev])
                          }
                          setUploadingImage(false)
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Drag any image below directly onto a canvas element or drop local files from your desktop onto any image block!
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {mediaPalette.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('image/url', imgUrl)
                        }}
                        onClick={() => {
                          if (selectedBlockId) {
                            updateSelectedBlock('image_url', imgUrl)
                          }
                        }}
                        className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 cursor-grab hover:ring-2 hover:ring-blue-500 transition-all bg-slate-100"
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity">
                          Drag / Click
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRESET TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bootstrap Layout Presets</p>
                <div className="space-y-3">
                  <button
                    onClick={() => loadPresetTemplate('magazine')}
                    className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition-all space-y-1"
                  >
                    <p className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-600" />
                      <span>Magazine Feature Article</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Bold title header, pull quotes, side-by-side technical image feature, and body text.
                    </p>
                  </button>

                  <button
                    onClick={() => loadPresetTemplate('story')}
                    className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition-all space-y-1"
                  >
                    <p className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <FileText size={14} className="text-indigo-600" />
                      <span>Contracting Hero Story</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      High-impact full background hero, highlight banner callout, and story verbiage.
                    </p>
                  </button>

                  <button
                    onClick={() => loadPresetTemplate('gallery')}
                    className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition-all space-y-1"
                  >
                    <p className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <ImageIcon size={14} className="text-emerald-600" />
                      <span>Visual Portfolio Showcase</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Minimalist header with large imagery cards and technical captions.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center Canvas Area */}
        <div className="flex-1 bg-slate-100 p-6 md:p-10 overflow-y-auto min-h-[calc(100vh-140px)]">
          <div className={getContainerClass()}>
            <div className="space-y-6">
              {blocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id && !previewMode
                const fontStyle = {
                  fontFamily: block.font_family ? `'${block.font_family}', sans-serif` : 'inherit',
                  color: block.text_color || undefined,
                  backgroundColor: block.bg_color || '#ffffff'
                }

                return (
                  <div
                    key={block.id}
                    onClick={() => !previewMode && setSelectedBlockId(block.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleLocalFileDrop(e, block.id)}
                    className={`relative rounded-2xl transition-all ${
                      isSelected
                        ? 'ring-4 ring-blue-500/30 border-2 border-blue-500 shadow-xl'
                        : 'border border-slate-200 shadow-sm hover:shadow-md'
                    }`}
                    style={fontStyle}
                  >
                    {/* Floating block toolbar when selected in Edit mode */}
                    {isSelected && (
                      <div className="absolute -top-4 right-4 z-20 bg-slate-900 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg">
                        <span className="text-[10px] text-blue-400 uppercase tracking-wider">{block.type} Block</span>
                        <div className="h-3 w-px bg-slate-700" />
                        <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="hover:text-blue-400">
                          <ArrowUp size={12} />
                        </button>
                        <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="hover:text-blue-400">
                          <ArrowDown size={12} />
                        </button>
                        <button onClick={() => deleteBlock(block.id)} className="hover:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    {/* HERO BLOCK */}
                    {block.type === 'hero' && (
                      <div className="p-8 md:p-16 text-center space-y-6 rounded-2xl overflow-hidden relative">
                        {block.image_url && (
                          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-inner">
                            <img src={block.image_url} className="w-full h-full object-cover" />
                            {!previewMode && (
                              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                Drag photo here or drop file from desktop to swap image
                              </div>
                            )}
                          </div>
                        )}

                        <div className="max-w-3xl mx-auto space-y-4">
                          {!previewMode ? (
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => updateSelectedBlock('title', e.target.value)}
                              placeholder="Editorial Headline Title..."
                              className={`w-full text-center bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none ${block.font_size || 'text-4xl'} ${block.font_weight || 'font-black'}`}
                              style={{ fontFamily: block.font_family }}
                            />
                          ) : (
                            <h1 className={`${block.font_size || 'text-4xl'} ${block.font_weight || 'font-black'} tracking-tight`}>
                              {block.title}
                            </h1>
                          )}

                          {!previewMode ? (
                            <textarea
                              value={block.subtitle || ''}
                              onChange={(e) => updateSelectedBlock('subtitle', e.target.value)}
                              placeholder="Subtitle or author context..."
                              className="w-full text-center bg-transparent border-b border-dashed border-slate-200 focus:outline-none text-slate-500 text-sm md:text-base resize-none"
                            />
                          ) : (
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                              {block.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TEXT ARTICLE BLOCK */}
                    {block.type === 'text' && (
                      <div className="p-8 md:p-12 space-y-4 rounded-2xl">
                        {!previewMode ? (
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => updateSelectedBlock('title', e.target.value)}
                            placeholder="Section Title..."
                            className="w-full bg-transparent border-b border-dashed border-slate-200 text-2xl font-bold focus:outline-none mb-2"
                          />
                        ) : (
                          block.title && <h2 className="text-2xl font-bold tracking-tight mb-2">{block.title}</h2>
                        )}

                        {!previewMode ? (
                          <textarea
                            value={block.body_content || ''}
                            onChange={(e) => updateSelectedBlock('body_content', e.target.value)}
                            placeholder="Write article verbiage content..."
                            className={`w-full bg-transparent border border-dashed border-slate-200 p-3 rounded-xl focus:outline-none min-h-[140px] ${block.font_size || 'text-base'}`}
                            style={{ textAlign: block.text_align || 'left' }}
                          />
                        ) : (
                          <p
                            className={`leading-relaxed text-slate-700 ${block.font_size || 'text-base'}`}
                            style={{ textAlign: block.text_align || 'left' }}
                          >
                            {block.body_content}
                          </p>
                        )}
                      </div>
                    )}

                    {/* TEXT AND IMAGE SIDE-BY-SIDE */}
                    {block.type === 'text_image' && (
                      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl">
                        <div className="space-y-4">
                          {!previewMode ? (
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => updateSelectedBlock('title', e.target.value)}
                              placeholder="Section Heading..."
                              className="w-full bg-transparent border-b border-dashed border-slate-200 text-2xl font-bold focus:outline-none"
                            />
                          ) : (
                            <h2 className="text-2xl font-bold tracking-tight">{block.title}</h2>
                          )}

                          {!previewMode ? (
                            <textarea
                              value={block.body_content || ''}
                              onChange={(e) => updateSelectedBlock('body_content', e.target.value)}
                              placeholder="Paragraph context..."
                              className="w-full bg-transparent border border-dashed border-slate-200 p-3 rounded-xl focus:outline-none min-h-[120px] text-sm"
                            />
                          ) : (
                            <p className="text-slate-600 leading-relaxed text-sm">{block.body_content}</p>
                          )}
                        </div>

                        <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                          {block.image_url ? (
                            <img src={block.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                              <ImageIcon size={32} />
                              <p className="text-xs mt-2">Drag photo here or drop file</p>
                            </div>
                          )}
                          {!previewMode && (
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                              Drop image to replace
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CALLOUT QUOTE BLOCK */}
                    {block.type === 'quote' && (
                      <div className="p-8 md:p-12 text-center space-y-4 rounded-2xl border-l-4 border-blue-600 bg-blue-50/50">
                        <Quote size={32} className="mx-auto text-blue-600 opacity-40" />
                        {!previewMode ? (
                          <textarea
                            value={block.body_content || ''}
                            onChange={(e) => updateSelectedBlock('body_content', e.target.value)}
                            placeholder="Impactful quote context..."
                            className="w-full text-center bg-transparent border-b border-dashed border-blue-200 focus:outline-none text-xl font-serif italic text-blue-900 resize-none"
                          />
                        ) : (
                          <blockquote className="text-xl md:text-2xl font-serif italic text-blue-950 max-w-2xl mx-auto">
                            “{block.body_content}”
                          </blockquote>
                        )}

                        {!previewMode ? (
                          <input
                            type="text"
                            value={block.author || ''}
                            onChange={(e) => updateSelectedBlock('author', e.target.value)}
                            placeholder="Author attribution..."
                            className="text-center bg-transparent text-xs uppercase tracking-wider font-bold text-blue-600 focus:outline-none"
                          />
                        ) : (
                          block.author && <p className="text-xs uppercase tracking-widest font-bold text-blue-700">— {block.author}</p>
                        )}
                      </div>
                    )}

                    {/* FULL PHOTO FEATURE */}
                    {block.type === 'image' && (
                      <div className="p-6 rounded-2xl space-y-3">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-slate-50 group">
                          {block.image_url ? (
                            <img src={block.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <ImageIcon size={40} />
                              <p className="text-xs mt-2 font-bold">Drag photo onto this block</p>
                            </div>
                          )}
                        </div>
                        {!previewMode ? (
                          <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => updateSelectedBlock('caption', e.target.value)}
                            placeholder="Photo caption text..."
                            className="w-full text-center text-xs text-slate-400 bg-transparent border-b border-dashed border-slate-200 focus:outline-none"
                          />
                        ) : (
                          block.caption && <p className="text-center text-xs text-slate-500 italic">{block.caption}</p>
                        )}
                      </div>
                    )}

                    {/* HIGHLIGHT CALLOUT BOX */}
                    {block.type === 'callout' && (
                      <div className="p-8 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white space-y-3">
                        {!previewMode ? (
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => updateSelectedBlock('title', e.target.value)}
                            placeholder="Highlight Title..."
                            className="w-full bg-transparent border-b border-dashed border-white/40 text-xl font-bold focus:outline-none text-white placeholder-white/70"
                          />
                        ) : (
                          <h3 className="text-xl font-bold">{block.title}</h3>
                        )}
                        {!previewMode ? (
                          <textarea
                            value={block.body_content || ''}
                            onChange={(e) => updateSelectedBlock('body_content', e.target.value)}
                            placeholder="Highlight message context..."
                            className="w-full bg-transparent border border-dashed border-white/30 p-3 rounded-xl focus:outline-none text-sm text-white placeholder-white/70"
                          />
                        ) : (
                          <p className="text-sm text-sky-50 leading-relaxed">{block.body_content}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
