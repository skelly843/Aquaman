'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  Settings,
  Layers,
  Eye,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Loader2,
  Monitor,
  Type
} from 'lucide-react'

export default function WebsiteBuilderManager() {
  const supabase = createClient()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPages() {
      try {
        const { data: blocks } = await supabase
          .from('page_blocks')
          .select('page_id, updated_at')

        // Group blocks by page_id to show status
        const uniquePages = Array.from(new Set(blocks?.map((b: any) => b.page_id) || []))

        const mapped = uniquePages.map((pageId: any) => {
          const pageBlocks = blocks?.filter((b: any) => b.page_id === pageId) || []
          const lastEdited = pageBlocks.reduce((max: any, b: any) => {
            return b.updated_at > max ? b.updated_at : max
          }, '')

          return {
            id: pageId,
            name: pageId.charAt(0).toUpperCase() + pageId.slice(1) + ' Page',
            slug: pageId === 'home' ? '/' : `/${pageId}`,
            blocksCount: pageBlocks.length,
            lastEdited: lastEdited ? new Date(lastEdited).toLocaleString() : 'N/A'
          }
        })

        setPages(mapped)
      } catch (err) {
        console.warn('Failed to load page lists:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPages()
  }, [supabase])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">WordPress-style Website Builder</h1>
        <p className="text-slate-500 mt-1">Manage pages, launch direct on-page visual edit modes, and publish snapshots.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
          <Layers size={20} className="text-slate-400" />
          <h2 className="font-bold text-slate-800">Available Public Pages</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {pages.map((p) => (
            <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900">{p.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full flex items-center space-x-0.5">
                    <CheckCircle2 size={10} />
                    <span>Live published</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Slug: {p.slug}</p>
                <p className="text-xs text-slate-500 font-medium">Structure: {p.blocksCount} database blocks</p>
              </div>

              <div className="flex flex-col sm:items-end space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">Last edited: {p.lastEdited}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={p.slug}
                    className="flex items-center space-x-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Eye size={12} />
                    <span>View Site</span>
                  </Link>

                  <Link
                    href={`${p.slug}?edit=true`}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
                  >
                    <Monitor size={12} />
                    <span>Visual Edit</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {pages.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic text-sm">
              No page blocks found. Please run the SQL migration or seed default page_blocks rows.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
