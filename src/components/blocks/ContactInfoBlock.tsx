'use client'

import React from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

interface ContactInfoBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const ContactInfoBlock: React.FC<ContactInfoBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const title = data?.title || 'Reach Out Directly'
  const subtitle = data?.subtitle || 'We are available 24/7 for urgent plumbing emergencies.'
  const phone = data?.phone || '(555) 234-5678'
  const email = data?.email || 'info@aquamanplumbing.com'
  const address = data?.address || '123 Ocean Boulevard, Suite 100, Atlantis, CA 90210'
  const hours = data?.hours || '24/7 Emergency Service Available | Mon-Fri 7am-6pm'

  return (
    <div className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            <InlineText
              value={title}
              onChange={(val) => onUpdate({ title: val })}
            />
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            <InlineText
              value={subtitle}
              onChange={(val) => onUpdate({ subtitle: val })}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-3 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</p>
            <p className="text-base font-bold text-white">
              <InlineText
                value={phone}
                onChange={(val) => onUpdate({ phone: val })}
              />
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-3 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</p>
            <p className="text-base font-bold text-white">
              <InlineText
                value={email}
                onChange={(val) => onUpdate({ email: val })}
              />
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-3 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</p>
            <p className="text-sm font-semibold text-white">
              <InlineText
                value={address}
                onChange={(val) => onUpdate({ address: val })}
              />
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-3 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hours</p>
            <p className="text-xs font-semibold text-white">
              <InlineText
                value={hours}
                onChange={(val) => onUpdate({ hours: val })}
              />
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
