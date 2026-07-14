'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Droplet, Calendar, ShieldAlert, Loader2, CheckCircle2, AlertCircle, Phone, ArrowLeft } from 'lucide-react'

export default function PublicRequestServicePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<any[]>([])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    serviceRequested: '',
    problemDescription: '',
    preferredDate: '',
    preferredTimeWindow: 'any_time',
    isEmergency: false,
    permissionToContact: true,
  })

  useEffect(() => {
    async function loadServices() {
      const { data } = await supabase
        .from('services')
        .select('title')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (data) {
        setServices(data)
      }
    }
    loadServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Attempt to associate with an existing customer with matching email/phone
    let matchedCustomerId: string | null = null
    const { data: matchedCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', formData.email.trim().toLowerCase())
      .limit(1)
      .maybeSingle()

    if (matchedCustomer) {
      matchedCustomerId = matchedCustomer.id
    }

    const { error: requestErr } = await supabase
      .from('service_requests')
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          service_requested: formData.serviceRequested,
          problem_description: formData.problemDescription,
          preferred_date: formData.preferredDate || null,
          preferred_time_window: formData.preferredTimeWindow,
          is_emergency: formData.isEmergency,
          permission_to_contact: formData.permissionToContact,
          status: 'new',
          customer_id: matchedCustomerId
        }
      ])

    if (requestErr) {
      setError(requestErr.message)
    } else {
      setSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        serviceRequested: '',
        problemDescription: '',
        preferredDate: '',
        preferredTimeWindow: 'any_time',
        isEmergency: false,
        permissionToContact: true,
      })
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
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
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

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 space-x-1">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white p-8 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Book / Request a Service</h1>
            <p className="text-slate-400 text-sm">
              Please fill out the form below. Once submitted, our dispatch coordinators will contact you to finalize the schedule.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">1. Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="(555) 555-5555"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Service Address */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">2. Service Address</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ocean City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="CA"
                    required
                  />
                </div>
              </div>

              <div className="w-1/2 space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="90210"
                  required
                />
              </div>
            </div>

            {/* Service Requirements */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">3. Service Requested & Issue</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Service Type</label>
                <select
                  value={formData.serviceRequested}
                  onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  required
                >
                  <option value="">-- Select a Service offering --</option>
                  {services.map((svc) => (
                    <option key={svc.title} value={svc.title}>{svc.title}</option>
                  ))}
                  <option value="General Plumbing Repair">General Plumbing Repair</option>
                  <option value="Sewer/Drain Cleaning">Sewer/Drain Cleaning</option>
                  <option value="Water Filtration Upgrade">Water Filtration Upgrade</option>
                  <option value="Home Tiling/Contracting">Home Tiling/Contracting</option>
                  <option value="Other / Custom Request">Other / Custom Request</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Problem Description</label>
                <textarea
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-28"
                  placeholder="Please describe leaks, water backup, heater issues, or remodel ideas..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preferred Time Window</label>
                  <select
                    value={formData.preferredTimeWindow}
                    onChange={(e) => setFormData({ ...formData, preferredTimeWindow: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="any_time">Any Time (7:00 AM - 6:00 PM)</option>
                    <option value="morning">Morning (7:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="evening">Evening (4:00 PM - 6:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkbox triggers */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={formData.isEmergency}
                  onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                  className="w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500 shrink-0 mt-0.5"
                />
                <div>
                  <label htmlFor="isEmergency" className="text-sm font-bold text-red-900 cursor-pointer flex items-center">
                    <ShieldAlert size={16} className="mr-1.5 shrink-0" />
                    This is an Emergency Plumbing Request
                  </label>
                  <p className="text-red-700 text-xs mt-1">
                    Select this if you have active flooding, failure of drinking water, or major sewer backup.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <input
                  type="checkbox"
                  id="permissionToContact"
                  checked={formData.permissionToContact}
                  onChange={(e) => setFormData({ ...formData, permissionToContact: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="permissionToContact" className="text-xs font-bold text-slate-700 cursor-pointer">
                  I agree to receive automated messages or phone confirmation for this service dispatch request.
                </label>
              </div>
            </div>

            {/* Success/Error displays */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2 text-xs font-bold">
                {success && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 size={18} className="mr-1" />
                    Booking request submitted! We will contact you soon.
                  </div>
                )}
                {error && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle size={18} className="mr-1" />
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>Submit Service Request</span>
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
