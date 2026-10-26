'use client'

import React, { useState } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { createClient } from '@/utils/supabase/client'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface ContactFormBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const title = data?.title || 'Send Us a Message'
  const subtitle = data?.subtitle || 'Fill out the form below and we will respond within 1 business hour.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) return

    try {
      setSubmitting(true)
      setErrorMessage('')
      setSuccess(false)

      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'pending'
        }])

      if (error) throw error

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setErrorMessage(err?.message || 'Failed to submit message. Please try calling us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            <InlineText
              value={title}
              onChange={(val) => onUpdate({ title: val })}
            />
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            <InlineText
              value={subtitle}
              onChange={(val) => onUpdate({ subtitle: val })}
            />
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
            <p className="text-sm text-emerald-800">
              Thank you for contacting Aquaman Plumbing. Our team will get back to you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  required
                  disabled={editMode}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={editMode}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  required
                  disabled={editMode}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <select
                  disabled={editMode}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Plumbing Repair">Plumbing Repair</option>
                  <option value="Water Heater Service">Water Heater Service</option>
                  <option value="Remodeling Estimate">Remodeling Estimate</option>
                  <option value="Emergency Service">Emergency Service</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message *</label>
              <textarea
                rows={4}
                required
                disabled={editMode}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or project details..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || editMode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
