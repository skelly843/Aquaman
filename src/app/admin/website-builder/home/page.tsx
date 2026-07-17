'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function HomeEditorForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [heading, setHeading] = useState('Premium Plumbing & General Contracting')
  const [subtitle, setSubtitle] = useState('Expert maintenance, urgent emergency dispatch, and custom remodeling services at your fingertips.')
  const [ctaText, setCtaText] = useState('Book a Service')
  const [ctaUrl, setCtaUrl] = useState('/request-service')
  const [secondaryCtaText, setSecondaryCtaText] = useState('View Our Work')
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('/gallery')

  useEffect(() => {
    async function loadContent() {
      try {
        const { data } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', 'home')
          .eq('block_type', 'hero')
          .single()

        if (data?.draft_data) {
          setHeading(data.draft_data.title || '')
          setSubtitle(data.draft_data.subtitle || '')
          setCtaText(data.draft_data.ctaText || '')
          setCtaUrl(data.draft_data.ctaUrl || '')
          setSecondaryCtaText(data.draft_data.secondaryCtaText || '')
          setSecondaryCtaUrl(data.draft_data.secondaryCtaUrl || '')
        }
      } catch (err) {
        console.warn('Fallback settings used.', err)
      }
    }
    loadContent()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const payload = {
      title: heading,
      subtitle,
      ctaText,
      ctaUrl,
      secondaryCtaText,
      secondaryCtaUrl
    }

    try {
      const { error } = await supabase
        .from('page_blocks')
        .upsert({
          id: 'b-home-1',
          page_id: 'home',
          block_type: 'hero',
          draft_data: payload,
          published_data: payload,
          is_visible: true,
          display_order: 10
        })

      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      alert(`Error saving home blocks: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold text-slate-400">Back</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Home Page Form Editor</h2>

        <form onSubmit={handleSave} data-testid="home-editor-form" className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hero Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hero Subtitle</label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-semibold h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Button URL</label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secondary Button Text</label>
              <input
                type="text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secondary Button URL</label>
              <input
                type="text"
                value={secondaryCtaUrl}
                onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center space-x-2">
              {success && (
                <div className="flex items-center text-green-600 font-bold text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Draft and Published settings synced successfully!</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="publish-page-button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
