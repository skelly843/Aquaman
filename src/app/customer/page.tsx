import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'

type Appointment = Database['public']['Tables']['appointments']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']

export default async function CustomerOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user!.id)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(3)

  const { data: recentInvoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const typedAppointments = (upcomingAppointments as unknown as Appointment[]) || []
  const typedInvoices = (recentInvoices as unknown as Invoice[]) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h1>
        <p className="text-gray-500">Here's what's happening with your services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Upcoming</p>
              <p className="text-2xl font-bold">{typedAppointments.length} Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold">
                {typedInvoices.filter(i => i.status === 'unpaid').length} Invoices
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold">Recently</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {typedAppointments.length ? typedAppointments.map((app) => (
              <div key={app.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{app.service_type}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(app.scheduled_at), 'PPP p')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {app.status}
                </span>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                No upcoming appointments.
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <Link href="/customer/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all appointments
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-semibold">Recent Invoices</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {typedInvoices.length ? typedInvoices.map((inv) => (
              <div key={inv.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">${inv.amount}</p>
                  <p className="text-sm text-gray-500">{inv.description || 'Service'}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inv.status}
                  </span>
                  {inv.status !== 'paid' && (
                    <button className="text-sm font-medium text-blue-600 hover:underline">
                      Pay
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                No invoices found.
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <Link href="/customer/invoices" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all invoices
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
