'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface PageBlock {
  id: string
  page_id: string
  block_type: string
  display_order: number
  is_visible: boolean
  draft_data: any
  published_data: any
}

interface WebsiteBuilderContextType {
  editMode: boolean
  setEditMode: (mode: boolean) => void
  previewMode: boolean
  setPreviewMode: (mode: boolean) => void
  previewDevice: 'desktop' | 'tablet' | 'mobile'
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  currentPage: string
  setCurrentPage: (page: string) => void
  blocks: PageBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<PageBlock[]>>
  styles: {
    primary_color: string
    secondary_color: string
    accent_color: string
    heading_font: string
    body_font: string
    border_radius: string
    logo_url: string
    favicon_url: string
  }
  setStyles: React.Dispatch<React.SetStateAction<any>>
  isGlobalAdmin: boolean
  loading: boolean
  saveDraft: () => Promise<void>
  publishLive: () => Promise<void>
  undo: () => void
  redo: () => void
  pushState: (newBlocks: PageBlock[]) => void
  updateBlockData: (id: string, updatedData: any) => void
  moveBlock: (index: number, direction: 'up' | 'down') => void
  addBlock: (blockType: string) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  toggleBlockVisibility: (id: string) => void
  canUndo: boolean
  canRedo: boolean
}

const WebsiteBuilderContext = createContext<WebsiteBuilderContextType | undefined>(undefined)

export const WebsiteBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient()
  const [editMode, setEditMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [currentPage, setCurrentPage] = useState('home')
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [styles, setStyles] = useState({
    primary_color: '#3b82f6',
    secondary_color: '#1e293b',
    accent_color: '#ef4444',
    heading_font: 'Geist Sans',
    body_font: 'Geist Sans',
    border_radius: '0.75rem',
    logo_url: '',
    favicon_url: ''
  })
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  // Undo/Redo stack state
  const [undoStack, setUndoStack] = useState<PageBlock[][]>([])
  const [redoStack, setRedoStack] = useState<PageBlock[][]>([])

  // Verify role with an active session change listener + initial check using the strict DB profiles table
  useEffect(() => {
    async function checkUserRole(userId: string) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', userId)
          .single()

        setIsGlobalAdmin(profile?.role === 'global_admin' && profile?.is_active === true)
      } catch (e) {
        console.warn('Error fetching role in context:', e)
        setIsGlobalAdmin(false)
      }
    }

    // Initial check on mount safely typed
    supabase.auth.getSession().then(({ data }: any) => {
      const session = data?.session
      if (session?.user) {
        checkUserRole(session.user.id)
      } else {
        setIsGlobalAdmin(false)
      }
    })

    // Active real-time listener for Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        checkUserRole(session.user.id)
      } else {
        setIsGlobalAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Fetch page blocks and styles
  useEffect(() => {
    async function loadPageData() {
      if (!currentPage) return
      try {
        setLoading(true)
        const { data: blocksData } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', currentPage)
          .order('display_order', { ascending: true })

        if (blocksData) {
          setBlocks(blocksData as PageBlock[])
          setUndoStack([])
          setRedoStack([])
        }

        const { data: styleData } = await supabase
          .from('global_styles')
          .select('*')
          .eq('id', 'default')
          .single()

        if (styleData) {
          setStyles(styleData)
        }
      } catch (err) {
        console.warn('Error loading dynamic website builder contents:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPageData()
  }, [currentPage, supabase])

  // Pushes blocks array onto Undo stack, clearing Redo stack
  const pushState = (newBlocks: PageBlock[]) => {
    setUndoStack(prev => [...prev, blocks])
    setRedoStack([])
    setBlocks(newBlocks)
  }

  const undo = () => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(prevStack => prevStack.slice(0, -1))
    setRedoStack(prevRedo => [...prevRedo, blocks])
    setBlocks(prev)
  }

  const redo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(prevRedo => prevRedo.slice(0, -1))
    setUndoStack(prevUndo => [...prevUndo, blocks])
    setBlocks(next)
  }

  // Edit in-place
  const updateBlockData = (id: string, updatedData: any) => {
    const updated = blocks.map(b => {
      if (b.id === id) {
        return { ...b, draft_data: { ...b.draft_data, ...updatedData } }
      }
      return b
    })
    pushState(updated)
  }

  // Move up/down
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= blocks.length) return

    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIdx]
    newBlocks[targetIdx] = temp

    // Reorder values
    const updated = newBlocks.map((b, idx) => ({
      ...b,
      display_order: (idx + 1) * 10
    }))
    pushState(updated)
  }

  // Create section
  const addBlock = (blockType: string) => {
    let defaultData: any = {}
    if (blockType === 'hero') {
      defaultData = {
        title: 'New Headline Title',
        subtitle: 'Add subtitle context...',
        ctaText: 'Get Started',
        ctaUrl: '#',
        backgroundImage: ''
      }
    } else if (blockType === 'text_image' || blockType === 'text') {
      defaultData = {
        title: 'Section Heading',
        body_content: 'Edit paragraph context...',
        image_url: '',
        layout: 'text_left'
      }
    } else if (blockType === 'features') {
      defaultData = {
        title: 'Featured Key Points',
        subtitle: 'Why choose our services',
        items: [
          { title: 'Feature Point', desc: 'Detail context...' }
        ]
      }
    } else {
      defaultData = {
        title: 'Section Custom Header',
        body_content: 'Details go here...'
      }
    }

    const newBlock: PageBlock = {
      id: `temp-${Date.now()}`,
      page_id: currentPage,
      block_type: blockType,
      display_order: (blocks.length + 1) * 10,
      is_visible: true,
      draft_data: defaultData,
      published_data: defaultData
    }
    pushState([...blocks, newBlock])
  }

  // Deleting blocks
  const deleteBlock = (id: string) => {
    pushState(blocks.filter(b => b.id !== id))
  }

  // Duplicating blocks
  const duplicateBlock = (id: string) => {
    const target = blocks.find(b => b.id === id)
    if (!target) return
    const duplicated: PageBlock = {
      ...target,
      id: `temp-dup-${Date.now()}`,
      display_order: target.display_order + 1
    }
    const idx = blocks.indexOf(target)
    const newBlocks = [...blocks]
    newBlocks.splice(idx + 1, 0, duplicated)
    pushState(newBlocks.map((b, i) => ({ ...b, display_order: (i + 1) * 10 })))
  }

  // Hide/Show toggles
  const toggleBlockVisibility = (id: string) => {
    pushState(blocks.map(b => (b.id === id ? { ...b, is_visible: !b.is_visible } : b)))
  }

  // Save drafts
  const saveDraft = async () => {
    try {
      setLoading(true)
      // Save global branding style first
      await supabase
        .from('global_styles')
        .upsert({ id: 'default', ...styles })

      // Save each block
      for (const b of blocks) {
        const isNew = b.id.startsWith('temp-')
        const payload: any = {
          page_id: b.page_id,
          block_type: b.block_type,
          display_order: b.display_order,
          is_visible: b.is_visible,
          draft_data: b.draft_data
        }

        if (isNew) {
          await supabase.from('page_blocks').insert([payload])
        } else {
          await supabase.from('page_blocks').update(payload).eq('id', b.id)
        }
      }

      // Re-fetch to clear temp IDs
      const { data: blocksData } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', currentPage)
        .order('display_order', { ascending: true })

      if (blocksData) {
        setBlocks(blocksData as PageBlock[])
      }

      alert('Draft snapshot saved successfully!')
    } catch (e: any) {
      alert(`Draft save failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Publish Draft changes live
  const publishLive = async () => {
    try {
      setLoading(true)

      // Snapshot revision prior to publishing
      await supabase
        .from('content_revisions')
        .insert([{
          page_id: currentPage,
          blocks_snapshot: blocks
        }])

      // Copy draft_data to published_data for all blocks
      for (const b of blocks) {
        const isNew = b.id.startsWith('temp-')
        const payload: any = {
          page_id: b.page_id,
          block_type: b.block_type,
          display_order: b.display_order,
          is_visible: b.is_visible,
          draft_data: b.draft_data,
          published_data: b.draft_data // Set live published data matching draft data!
        }

        if (isNew) {
          await supabase.from('page_blocks').insert([payload])
        } else {
          await supabase.from('page_blocks').update(payload).eq('id', b.id)
        }
      }

      // Update global style
      await supabase
        .from('global_styles')
        .upsert({ id: 'default', ...styles })

      // Re-fetch to normalize
      const { data: blocksData } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', currentPage)
        .order('display_order', { ascending: true })

      if (blocksData) {
        setBlocks(blocksData as PageBlock[])
      }

      alert('Changes published successfully to live public visitors!')
    } catch (e: any) {
      alert(`Publishing failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0

  return (
    <WebsiteBuilderContext.Provider
      value={{
        editMode,
        setEditMode,
        previewMode,
        setPreviewMode,
        previewDevice,
        setPreviewDevice,
        currentPage,
        setCurrentPage,
        blocks,
        setBlocks,
        styles,
        setStyles,
        isGlobalAdmin,
        loading,
        saveDraft,
        publishLive,
        undo,
        redo,
        pushState,
        updateBlockData,
        moveBlock,
        addBlock,
        deleteBlock,
        duplicateBlock,
        toggleBlockVisibility,
        canUndo,
        canRedo
      }}
    >
      {children}
    </WebsiteBuilderContext.Provider>
  )
}

export const useWebsiteBuilder = () => {
  const context = useContext(WebsiteBuilderContext)
  if (context === undefined) {
    throw new Error('useWebsiteBuilder must be used within a WebsiteBuilderProvider')
  }
  return context
}
