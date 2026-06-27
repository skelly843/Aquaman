import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  History,
  ArrowRight,
  Droplet
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Database } from '@/types/database.types'

type Appointment = Database['public']['Tables']['appointments']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']

export default async function CustomerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: appointmentsData } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)
    .order('scheduled_at', { ascending: false })
    .limit(3)

  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const appointments = (appointmentsData as Appointment[]) || []
  const invoices = (invoicesData as Invoice[]) || []

  const stats = [
    { label: 'Upcoming Jobs', value: appointments.filter(a => ['pending', 'confirmed', 'in-progress'].includes(a.status || '')).length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Visits', value: appointments.filter(a => a.status === 'completed').length, icon: History, color: 'bg-green-500' },
    { label: 'Unpaid Invoices', value: invoices.filter(i => i.status === 'unpaid').length, icon: FileText, color: 'bg-red-500' },
  ]

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {profile?.full_name?.split(' ')[0] || 'there'}!</h1>
          <p className="text-slate-500 mt-1">Manage your Aquaman home services and history.</p>
        </div>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2"
        >
          <Droplet size={20} />
          <span>Request New Service</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Clock className="mr-2 text-slate-400" size={20} />
              Recent Appointments
            </h2>
            <Link href="/customer/appointments" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                   <div className={`w-2 h-12 rounded-full ${apt.status === 'completed' ? 'bg-green-400' : 'bg-blue-400'}`} />
                   <div>
                     <p className="font-bold text-slate-800">{apt.service_type}</p>
                     <p className="text-xs text-slate-500">{format(new Date(apt.scheduled_at), 'PPP p')}</p>
                   </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  apt.status === 'completed' ? 'text-green-600 bg-green-50 border-green-100' : 'text-blue-600 bg-blue-50 border-blue-100'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No appointment history yet.
              </div>
            )}
          </div>
        </div>

        {/* Latest Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <FileText className="mr-2 text-slate-400" size={20} />
              Recent Invoices
            </h2>
            <Link href="/customer/invoices" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">${inv.amount}</p>
                  <p className="text-xs text-slate-500">{inv.description || 'Service Invoice'}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    inv.status === 'paid' ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'
                  }`}>
                    {inv.status}
                  </span>
                  <Link href={`/customer/invoices/${inv.id}`} className="p-2 text-slate-300 hover:text-blue-600">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
             {invoices.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No invoices found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support / Help Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
           <h3 className="text-2xl font-bold mb-3 text-white">Need help or have questions?</h3>
           <p className="text-slate-400 mb-6 leading-relaxed">
             Our team is here to help with any questions about your service history, upcoming appointments, or technical issues.
           </p>
           <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2">
             <MessageSquare size={20} />
             <span>Message Support</span>
           </button>
        </div>
        <Droplet className="absolute -right-12 -bottom-12 text-blue-600/10" size={300} />
      </div>
    </div>
  )
}
