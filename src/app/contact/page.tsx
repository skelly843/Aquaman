'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Droplet, Phone, Mail, MapPin, Clock, ShieldAlert, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function PublicContactPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [settings, setSettings] = useState<any>({
    company_name: 'Aquaman Plumbing & General Contracting',
    phone: '1-800-555-PLUM',
    email: 'contact@aquamanservices.com',
    address: '123 Waterway Ln, Ocean City, CA 90210',
    emergency_service_notice: 'Our dispatch team is on-call 24/7 for burst pipes, water heater failure & active sewer backups.',
  })

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('company_settings')
        .select('*')
        .eq('id', 'default')
        .single()
      if (data) {
        setSettings(data)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error: submitErr } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          status: 'new'
        }
      ])

    if (submitErr) {
      setError(submitErr.message)
    } else {
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-white sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Droplet className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Aquaman</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-blue-600 transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Log in
          </Link>
          <Link
            href="/request-service"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Book a Service
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Got a plumbing emergency, leak, or home remodel in mind? Get in touch with our certified team.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact info column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
            <p className="text-slate-500 text-sm">
              Complete the form or contact us via phone/email. We look forward to working with you.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone Number</p>
                  <p className="text-blue-600 font-medium mt-1">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Address</p>
                  <p className="text-blue-600 font-medium mt-1">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Business Address</p>
                  <p className="mt-1">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Business Hours</p>
                  <p className="mt-1">Monday - Friday: 7:00 AM - 6:00 PM<br />Saturday: 8:00 AM - 4:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Alert Panel */}
          {settings.emergency_service_notice && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start space-x-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0 mt-0.5">
                <ShieldAlert size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-900 text-sm">Emergency Dispatch</h4>
                <p className="text-red-700 text-xs leading-relaxed">{settings.emergency_service_notice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Form column */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-32"
                placeholder="How can we help you?"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-xs">
                {success && (
                  <div className="flex items-center text-green-600 font-bold">
                    <CheckCircle2 size={16} className="mr-1" />
                    Message submitted successfully!
                  </div>
                )}
                {error && (
                  <div className="flex items-center text-red-600 font-bold">
                    <AlertCircle size={16} className="mr-1" />
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Droplet className="text-blue-400" size={24} />
            <span className="text-xl font-bold">Aquaman</span>
          </div>
          <div className="flex space-x-8 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
