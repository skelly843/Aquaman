'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function AboutFormEditor() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [about, setAbout] = useState({
    heading: 'About Aquaman Plumbing & General Contracting',
    subtitle: 'Providing high-quality plumbing and contracting services with integrity, reliability, and precision.',
    storyTitle: 'Our Story & Mission',
    storyBody: 'Founded with a commitment to premium craftsmanship, Aquaman has grown from a local plumbing team into a premier general contracting firm.',
    mission: 'Our mission is to safeguard our clients\' homes and commercial investments by delivering robust plumbing engineering.'
  })

  useEffect(() => {
    async function loadAbout() {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 'about_page')
          .single()
        if (data?.content) {
          setAbout(prev => ({ ...prev, ...(data.content as any) }))
        }
      } catch (err) {
        console.warn('Failed to load about data.', err)
      }
    }
    loadAbout()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: 'about_page',
          content: about,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      alert(`Error saving about content: ${err.message}`)
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
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">About Page Form Editor</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Page Heading</label>
            <input
              type="text"
              value={about.heading}
              onChange={(e) => setAbout({ ...about, heading: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subtitle</label>
            <input
              type="text"
              value={about.subtitle}
              onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Story Section Title</label>
            <input
              type="text"
              value={about.storyTitle}
              onChange={(e) => setAbout({ ...about, storyTitle: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Story Body text</label>
            <textarea
              value={about.storyBody}
              onChange={(e) => setAbout({ ...about, storyBody: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mission Statement</label>
            <textarea
              value={about.mission}
              onChange={(e) => setAbout({ ...about, mission: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm h-24"
              required
            />
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            {success && (
              <div className="text-green-600 font-bold text-sm flex items-center">
                <CheckCircle size={16} className="mr-1" />
                <span>About details updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow flex items-center space-x-2 disabled:opacity-50 ml-auto"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              <span>Save & Publish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
