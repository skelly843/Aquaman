'use client'

import React, { useState } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { createClient } from '@/utils/supabase/client'
import { Calendar, Clock, Wrench, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface RequestFormBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const RequestFormBlock: React.FC<RequestFormBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: 'Emergency Plumbing Repair',
    address: '',
    preferredDate: '',
    preferredTimeSlot: 'Morning (8am - 12pm)',
    urgencyLevel: 'Standard',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const title = data?.title || 'Service Dispatch Form'
  const subtitle = data?.subtitle || 'Tell us about your issue and preferred appointment time.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) return

    try {
      setSubmitting(true)
      setErrorMessage('')
      setSuccess(false)

      const { error } = await supabase
        .from('service_requests')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.serviceType,
          address: formData.address,
          preferred_date: formData.preferredDate || null,
          preferred_time_slot: formData.preferredTimeSlot,
          urgency_level: formData.urgencyLevel,
          description: formData.description,
          status: 'pending'
        }])

      if (error) throw error

      setSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        serviceType: 'Emergency Plumbing Repair',
        address: '',
        preferredDate: '',
        preferredTimeSlot: 'Morning (8am - 12pm)',
        urgencyLevel: 'Standard',
        description: ''
      })
    } catch (err: any) {
      console.error('Service request submission error:', err)
      setErrorMessage(err?.message || 'Failed to submit service request. Please try calling us directly.')
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
            <h3 className="text-xl font-bold">Service Request Submitted!</h3>
            <p className="text-sm text-emerald-800">
              We have received your service request. A master technician will review your request and contact you shortly to confirm.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              Submit Another Request
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  disabled={editMode}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Jane Doe"
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
                  placeholder="jane@example.com"
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
                  placeholder="(555) 123-4567"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Service Needed *</label>
                <select
                  disabled={editMode}
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                >
                  <option value="Emergency Plumbing Repair">Emergency Plumbing Repair</option>
                  <option value="Water Heater Installation / Repair">Water Heater Installation / Repair</option>
                  <option value="Drain Cleaning & Hydro-Jetting">Drain Cleaning & Hydro-Jetting</option>
                  <option value="Bathroom / Kitchen Remodeling">Bathroom / Kitchen Remodeling</option>
                  <option value="Pipe Leak Detection">Pipe Leak Detection</option>
                  <option value="Sewer Line Inspection">Sewer Line Inspection</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Property Service Address *</label>
              <input
                type="text"
                required
                disabled={editMode}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, Apt 4B, City, State ZIP"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Date</label>
                <input
                  type="date"
                  disabled={editMode}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Time Slot</label>
                <select
                  disabled={editMode}
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                >
                  <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                  <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                  <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
                  <option value="ASAP (Emergency)">ASAP (Emergency)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urgency Level</label>
                <select
                  disabled={editMode}
                  value={formData.urgencyLevel}
                  onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                >
                  <option value="Standard">Standard</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Urgent (Active Leak)">Urgent (Active Leak)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description of Issue *</label>
              <textarea
                rows={4}
                required
                disabled={editMode}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe the issue or work required in detail..."
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
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Wrench size={18} />
                  <span>Submit Service Request</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
