'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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

interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
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
  hasUnsavedChanges: boolean
  toasts: ToastNotification[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  saveDraft: () => Promise<void>
  publishLive: () => Promise<void>
  undo: () => void
  redo: () => void
  pushState: (newBlocks: PageBlock[]) => void
  updateBlockData: (id: string, updatedData: any) => void
  moveBlock: (index: number, direction: 'up' | 'down') => void
  reorderBlocks: (fromIndex: number, toIndex: number) => void
  addBlock: (blockType: string) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  toggleBlockVisibility: (id: string) => void
  canUndo: boolean
  canRedo: boolean
}

const WebsiteBuilderContext = createContext<WebsiteBuilderContextType | undefined>(undefined)

export const WebsiteBuilderProvider: React.FC<{
  children: React.ReactNode
  initialIsGlobalAdmin?: boolean
}> = ({ children, initialIsGlobalAdmin = false }) => {
  const supabase = createClient()
  const pathname = usePathname()
  const [editMode, setEditMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [currentPage, setCurrentPage] = useState('home')

  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([])
  const [styles, setStyles] = useState({
    primary_color: '#2563eb',
    secondary_color: '#0f172a',
    accent_color: '#f59e0b',
    heading_font: 'Geist Sans',
    body_font: 'Geist Sans',
    border_radius: '0.75rem',
    logo_url: '',
    favicon_url: ''
  })
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(initialIsGlobalAdmin)
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Stack state
  const [undoStack, setUndoStack] = useState<PageBlock[][]>([])
  const [redoStack, setRedoStack] = useState<PageBlock[][]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Exact Route / Path to page_id Mapping
  useEffect(() => {
    if (!pathname) return
    let slug = 'home'
    if (pathname === '/' || pathname === '') {
      slug = 'home'
    } else if (pathname === '/request-service' || pathname === '/request-service/') {
      slug = 'request-service'
    } else {
      slug = pathname.replace(/^\//, '').replace(/\/*$/, '').replace(/\//g, '_')
    }
    setCurrentPage(slug)
  }, [pathname])

  // Warn before leaving page if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Check admin role client-side
  useEffect(() => {
    async function checkUserRole(sessionUser: any) {
      if (!sessionUser) {
        setIsGlobalAdmin(false)
        return
      }
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', sessionUser.id)
          .single()

        const metaRole = sessionUser.user_metadata?.role || sessionUser.app_metadata?.role
        const activeRole = profile?.role || metaRole
        const isActive = profile?.is_active !== false

        setIsGlobalAdmin(activeRole === 'global_admin' && isActive)
      } catch (e) {
        const metaRole = sessionUser.user_metadata?.role || sessionUser.app_metadata?.role
        setIsGlobalAdmin(metaRole === 'global_admin')
      }
    }

    try {
      supabase.auth.getSession().then(({ data }: any) => {
        if (data?.session?.user) {
          checkUserRole(data.session.user)
        }
      })

      const { data } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
          checkUserRole(session.user)
        } else {
          setIsGlobalAdmin(false)
        }
      })
      return () => {
        data?.subscription?.unsubscribe()
      }
    } catch (err) {
      console.warn('Auth listener init error:', err)
    }
  }, [supabase])

  // Fetch Page Blocks
  useEffect(() => {
    async function loadPageBlocks() {
      if (!currentPage) return
      try {
        setLoading(true)
        const { data: dbBlocks, error } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', currentPage)
          .order('display_order', { ascending: true })

        if (error) throw error

        if (dbBlocks) {
          setBlocks(dbBlocks as PageBlock[])
          setDeletedBlockIds([])
          setUndoStack([])
          setRedoStack([])
          setHasUnsavedChanges(false)
        }
      } catch (err: any) {
        console.warn('Error loading page blocks:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPageBlocks()
  }, [currentPage, supabase])

  const pushState = (newBlocks: PageBlock[]) => {
    setUndoStack(prev => [...prev, blocks])
    setRedoStack([])
    setBlocks(newBlocks)
    setHasUnsavedChanges(true)
  }

  const undo = () => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(prevStack => prevStack.slice(0, -1))
    setRedoStack(prevRedo => [...prevRedo, blocks])
    setBlocks(prev)
    setHasUnsavedChanges(true)
  }

  const redo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(prevRedo => prevRedo.slice(0, -1))
    setUndoStack(prevUndo => [...prevUndo, blocks])
    setBlocks(next)
    setHasUnsavedChanges(true)
  }

  const updateBlockData = (id: string, updatedData: any) => {
    const updated = blocks.map(b => {
      if (b.id === id) {
        return { ...b, draft_data: { ...b.draft_data, ...updatedData } }
      }
      return b
    })
    pushState(updated)
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= blocks.length) return

    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIdx]
    newBlocks[targetIdx] = temp

    const updated = newBlocks.map((b, idx) => ({
      ...b,
      display_order: (idx + 1) * 10
    }))
    pushState(updated)
  }

  const reorderBlocks = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) return
    const newBlocks = [...blocks]
    const [moved] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, moved)

    const updated = newBlocks.map((b, idx) => ({
      ...b,
      display_order: (idx + 1) * 10
    }))
    pushState(updated)
  }

  const addBlock = (blockType: string) => {
    let defaultData: any = {}
    if (blockType === 'hero') {
      defaultData = {
        title: 'New Section Header',
        subtitle: 'Add subtitle context...',
        ctaText: 'Get Started',
        ctaUrl: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
      }
    } else if (blockType === 'text_image') {
      defaultData = {
        title: 'Section Heading',
        body_content: 'Edit paragraph details...',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80',
        layout: 'text_left'
      }
    } else if (blockType === 'features') {
      defaultData = {
        title: 'Key Features Grid',
        subtitle: 'Why choose our services',
        items: [{ title: 'Feature Point', desc: 'Detail context...' }]
      }
    } else if (blockType === 'team') {
      defaultData = {
        title: 'Meet Our Team',
        subtitle: 'Dedicated specialists',
        members: [{ name: 'Team Member', role: 'Specialist', photo: '', bio: 'Bio details...' }]
      }
    } else if (blockType === 'cta_banner') {
      defaultData = {
        title: 'Ready to Start?',
        subtitle: 'Contact us today for a free estimate.',
        buttonText: 'Contact Us',
        buttonUrl: '/contact'
      }
    } else if (blockType === 'image') {
      defaultData = {
        image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
        caption: ''
      }
    } else if (blockType === 'spacer') {
      defaultData = { height: '64px' }
    } else {
      defaultData = { title: 'New Section', subtitle: 'Add details...' }
    }

    const newBlock: PageBlock = {
      id: `temp-${Date.now()}-${Math.random()}`,
      page_id: currentPage,
      block_type: blockType,
      display_order: (blocks.length + 1) * 10,
      is_visible: true,
      draft_data: defaultData,
      published_data: defaultData
    }
    pushState([...blocks, newBlock])
  }

  const deleteBlock = (id: string) => {
    if (!id.startsWith('temp-')) {
      setDeletedBlockIds(prev => [...prev, id])
    }
    pushState(blocks.filter(b => b.id !== id))
  }

  const duplicateBlock = (id: string) => {
    const target = blocks.find(b => b.id === id)
    if (!target) return
    const duplicated: PageBlock = {
      ...target,
      id: `temp-dup-${Date.now()}-${Math.random()}`,
      display_order: target.display_order + 1
    }
    const idx = blocks.indexOf(target)
    const newBlocks = [...blocks]
    newBlocks.splice(idx + 1, 0, duplicated)
    pushState(newBlocks.map((b, i) => ({ ...b, display_order: (i + 1) * 10 })))
  }

  const toggleBlockVisibility = (id: string) => {
    pushState(blocks.map(b => (b.id === id ? { ...b, is_visible: !b.is_visible } : b)))
  }

  // Save Draft
  const saveDraft = async () => {
    try {
      setLoading(true)

      // 1. Execute DB deletions for deleted blocks
      if (deletedBlockIds.length > 0) {
        const { error: delErr } = await supabase
          .from('page_blocks')
          .delete()
          .in('id', deletedBlockIds)
        if (delErr) throw delErr
        setDeletedBlockIds([])
      }

      // 2. Insert/Update remaining blocks
      for (const b of blocks) {
        const isNew = b.id.startsWith('temp-')
        const payload: any = {
          page_id: currentPage,
          block_type: b.block_type,
          display_order: b.display_order,
          is_visible: b.is_visible,
          draft_data: b.draft_data
        }

        if (isNew) {
          const { error } = await supabase.from('page_blocks').insert([payload])
          if (error) throw error
        } else {
          const { error } = await supabase.from('page_blocks').update(payload).eq('id', b.id)
          if (error) throw error
        }
      }

      // Re-fetch to normalize IDs
      const { data: freshBlocks } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', currentPage)
        .order('display_order', { ascending: true })

      if (freshBlocks) setBlocks(freshBlocks as PageBlock[])

      setHasUnsavedChanges(false)
      showToast('Draft saved successfully!', 'success')
    } catch (e: any) {
      console.error('Draft save error:', e)
      showToast(`Save failed: ${e.message || 'Database error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Publish Live
  const publishLive = async () => {
    try {
      setLoading(true)

      // Get user id for revision log
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id || null

      // 1. Delete removed blocks from database
      if (deletedBlockIds.length > 0) {
        const { error: delErr } = await supabase
          .from('page_blocks')
          .delete()
          .in('id', deletedBlockIds)
        if (delErr) throw delErr
        setDeletedBlockIds([])
      }

      // 2. Write content_revisions snapshot
      const { error: revErr } = await supabase
        .from('content_revisions')
        .insert([{
          page_id: currentPage,
          blocks_snapshot: blocks,
          created_by: userId
        }])
      if (revErr) {
        console.warn('Content revision log notice:', revErr.message)
      }

      // 3. Upsert page_blocks with published_data = draft_data
      for (const b of blocks) {
        const isNew = b.id.startsWith('temp-')
        const payload: any = {
          page_id: currentPage,
          block_type: b.block_type,
          display_order: b.display_order,
          is_visible: b.is_visible,
          draft_data: b.draft_data,
          published_data: b.draft_data
        }

        if (isNew) {
          const { error } = await supabase.from('page_blocks').insert([payload])
          if (error) throw error
        } else {
          const { error } = await supabase.from('page_blocks').update(payload).eq('id', b.id)
          if (error) throw error
        }
      }

      // Re-fetch normalized blocks
      const { data: freshBlocks } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', currentPage)
        .order('display_order', { ascending: true })

      if (freshBlocks) setBlocks(freshBlocks as PageBlock[])

      setHasUnsavedChanges(false)
      showToast('Page published live to public visitors!', 'success')
    } catch (e: any) {
      console.error('Publish error:', e)
      showToast(`Publish failed: ${e.message || 'Database error'}`, 'error')
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
        hasUnsavedChanges,
        toasts,
        showToast,
        removeToast,
        saveDraft,
        publishLive,
        undo,
        redo,
        pushState,
        updateBlockData,
        moveBlock,
        reorderBlocks,
        addBlock,
        deleteBlock,
        duplicateBlock,
        toggleBlockVisibility,
        canUndo,
        canRedo
      }}
    >
      {children}

      {/* Inline Toast Notifications Container */}
      <div className="fixed bottom-20 right-6 z-[100000] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white flex items-center space-x-2 border backdrop-blur transition-all animate-bounce-short cursor-pointer ${
              t.type === 'success'
                ? 'bg-emerald-600/90 border-emerald-400'
                : t.type === 'error'
                ? 'bg-red-600/90 border-red-400'
                : 'bg-slate-800/90 border-slate-700'
            }`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
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
