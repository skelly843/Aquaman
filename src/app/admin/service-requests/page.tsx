'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Inbox, ShieldAlert, CheckCircle2, AlertCircle, Loader2, Calendar, UserPlus, Check, X, FileText } from 'lucide-react'

export default function AdminServiceRequestsPage() {
  const supabase = createClient()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadRequests = async () => {
    setLoading(true)
    const { data, error: fetchErr } = await supabase
      .from('service_requests')
      .select('*, customers(id, first_name, last_name, email)')
      .order('created_at', { ascending: false })

    if (fetchErr) {
      setError(fetchErr.message)
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setError(null)
    setSuccess(null)
    const { error: updateErr } = await supabase
      .from('service_requests')
      .update({ status: newStatus })
      .eq('id', id)

    if (updateErr) {
      setError(updateErr.message)
    } else {
      setSuccess(`Request status updated to ${newStatus}!`)
      loadRequests()
    }
  }

  const handleConvertCustomer = async (req: any) => {
    setError(null)
    setSuccess(null)

    // Check if customer already exists for this email
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', req.email.trim().toLowerCase())
      .limit(1)
      .maybeSingle()

    if (existing) {
      // Already a customer. Associate request.
      const { error: assocErr } = await supabase
        .from('service_requests')
        .update({ customer_id: existing.id, status: 'reviewed' })
        .eq('id', req.id)

      if (assocErr) {
        setError(assocErr.message)
      } else {
        setSuccess('Matching customer found! Associated request with their existing CRM profile.')
        loadRequests()
      }
      return;
    }

    // Otherwise create customer from the request fields
    const { data: newCust, error: createErr } = await supabase
      .from('customers')
      .insert([
        {
          first_name: req.first_name,
          last_name: req.last_name,
          email: req.email.trim().toLowerCase(),
          phone: req.phone,
          billing_address: `${req.address}, ${req.city}, ${req.state} ${req.zip_code}`,
          account_status: 'active'
        }
      ])
      .select()
      .single()

    if (createErr) {
      setError(createErr.message)
    } else if (newCust) {
      // Add property address automatically as customer_properties
      await supabase
        .from('customer_properties')
        .insert([
          {
            customer_id: newCust.id,
            property_type: 'primary_residence',
            address_line: req.address,
            city: req.city,
            state: req.state,
            zip_code: req.zip_code,
            notes: 'Created automatically from public service booking request.'
          }
        ])

      // Associate request to new customer
      await supabase
        .from('service_requests')
        .update({ customer_id: newCust.id, status: 'reviewed' })
        .eq('id', req.id)

      setSuccess(`Created a new customer profile for ${req.first_name} ${req.last_name}!`)
      loadRequests()
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Service Requests & Bookings</h1>
        <p className="text-slate-500 mt-1">Review public service requests, promote them to customer records, or schedule direct dispatches.</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center text-sm font-semibold text-green-700">
          <CheckCircle2 size={18} className="mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-sm font-semibold text-red-700">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Dispatch Booking Inbox</span>
            <span className="text-xs font-semibold text-slate-500">{requests.length} Requests Total</span>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.map((req) => (
              <div key={req.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-slate-900">
                        {req.first_name} {req.last_name}
                      </span>
                      {req.is_emergency && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          <ShieldAlert size={10} />
                          Emergency
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        req.status === 'new'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : req.status === 'declined' || req.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      {req.email} &bull; {req.phone}
                    </p>

                    <p className="text-sm font-semibold text-blue-600">
                      Requested: <span className="text-slate-800">{req.service_requested}</span>
                    </p>

                    <p className="text-sm text-slate-600 max-w-2xl bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {req.problem_description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-500">
                      <span>Address: <span className="font-semibold text-slate-700">{req.address}, {req.city}, {req.state}</span></span>
                      {req.preferred_date && (
                        <span>Pref Date: <span className="font-semibold text-slate-700">{req.preferred_date} ({req.preferred_time_window})</span></span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0 self-end md:self-start">
                    {/* Convert/promote trigger button */}
                    {!req.customer_id ? (
                      <button
                        onClick={() => handleConvertCustomer(req)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <UserPlus size={14} />
                        <span>Promote to Customer</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                        <Check size={14} className="text-green-600" />
                        <span>CRM Associated</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(req.id, 'scheduled')}
                      className="bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      Mark Scheduled
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(req.id, 'declined')}
                      className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic">
                Your scheduling inbox is empty. No online service requests received yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
