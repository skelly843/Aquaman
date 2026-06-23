'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2, AlertCircle, Monitor, Type, Image as ImageIcon } from 'lucide-react'

export default function SiteContentPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const [heroContent, setHeroContent] = useState({
    title: 'Premium Water Solutions for Modern Homes',
    subtitle: 'Expert maintenance, repair, and installation services at your fingertips. Manage your home services with our state-of-the-art portal.',
    backgroundImage: '',
    ctaText: 'Book a Service',
  })

  useEffect(() => {
    async function loadContent() {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'homepage_hero')
        .single()

      if (data) {
        setHeroContent(data.content as any)
      }
      setFetching(false)
    }
    loadContent()
  }, [supabase])

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'homepage_hero',
        content: heroContent as any,
        updated_at: new Date().toISOString()
      })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Site Content</h1>
        <p className="text-slate-500 mt-1">Manage static text and images across your website.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
          <Monitor size={20} className="text-slate-400" />
          <h2 className="font-bold text-slate-800">Homepage Hero Section</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Type size={14} className="mr-1.5 text-slate-400" />
              Hero Title
            </label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Type size={14} className="mr-1.5 text-slate-400" />
              Hero Subtitle
            </label>
            <textarea
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <ImageIcon size={14} className="mr-1.5 text-slate-400" />
                Background Image URL
              </label>
              <input
                type="text"
                value={heroContent.backgroundImage}
                onChange={(e) => setHeroContent(prev => ({ ...prev, backgroundImage: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-mono"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Type size={14} className="mr-1.5 text-slate-400" />
                Button Text
              </label>
              <input
                type="text"
                value={heroContent.ctaText}
                onChange={(e) => setHeroContent(prev => ({ ...prev, ctaText: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        {error && (
          <div className="flex items-center text-red-600 text-sm font-medium">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircle2 size={16} className="mr-1" />
            Changes published!
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}
