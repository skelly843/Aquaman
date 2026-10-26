'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ContactFormEditor() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [settings, setSettings] = useState<any>({
    company_name: 'Aquaman Plumbing & General Contracting',
    phone: '1-800-555-PLUM',
    email: 'contact@aquamanservices.com',
    address: '123 Waterway Ln, Ocean City, CA 90210',
    emergency_service_notice: 'Our dispatch team is on-call 24/7 for burst pipes, water heater failure & active sewer backups.',
    business_hours_text: 'Monday - Friday: 7:00 AM - 6:00 PM\nSaturday: 8:00 AM - 4:00 PM\nSunday: Closed'
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('company_settings')
          .select('*')
          .eq('id', 'default')
          .single()
        if (data) {
          setSettings(data)
        }
      } catch (err) {
        console.warn('Failed to fetch contact settings.', err)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          id: 'default',
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      alert(`Error saving contact settings: ${err.message}`)
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
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Contact & Settings Form Editor</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dispatch Business Hours</label>
            <textarea
              value={settings.business_hours_text || ''}
              onChange={(e) => setSettings({ ...settings, business_hours_text: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm font-semibold h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Help Announcement Notice</label>
            <textarea
              value={settings.emergency_service_notice || ''}
              onChange={(e) => setSettings({ ...settings, emergency_service_notice: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm font-semibold h-20"
              placeholder="e.g. Active backups alert..."
            />
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            {success && (
              <div className="text-green-600 font-bold text-sm flex items-center">
                <CheckCircle size={16} className="mr-1" />
                <span>Contact and settings updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow flex items-center space-x-2 disabled:opacity-50 ml-auto"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
