import { createClient } from '@/utils/supabase/server'
import {
  Wrench,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Monitor,
  Calendar,
  Users,
  Inbox,
  Briefcase,
  FileText,
  DollarSign,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get current user role
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'customer'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role || 'customer'
  }

  // Count active stats
  const { count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })

  const { count: galleryCount } = await supabase
    .from('gallery_items')
    .select('*', { count: 'exact', head: true })

  const { count: pendingAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: newRequests } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  const { count: activeJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')

  const { count: awaitingEstimates } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'estimate_pending')

  const { count: unpaidInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent')

  const { data: recentCustomers } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: recentNotes } = await supabase
    .from('notes')
    .select('id, content, created_at, visibility')
    .order('created_at', { ascending: false })
    .limit(3)

  // Calculate monthly income/expense summaries for global_admin
  let monthlyIncome = 0
  let monthlyExpense = 0

  if (role === 'global_admin') {
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
    if (payments) {
      monthlyIncome = payments.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)
    }

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
    if (expenses) {
      monthlyExpense = expenses.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)
    }
  }

  const stats = [
    { label: 'Pending Appointments', value: pendingAppointments || 0, icon: Calendar, color: 'bg-blue-500', href: '/admin/calendar' },
    { label: 'New Requests', value: newRequests || 0, icon: Inbox, color: 'bg-indigo-500', href: '/admin/service-requests' },
    { label: 'Active Jobs', value: activeJobs || 0, icon: Briefcase, color: 'bg-emerald-500', href: '/admin/jobs' },
    { label: 'Awaiting Estimates', value: awaitingEstimates || 0, icon: Wrench, color: 'bg-amber-500', href: '/admin/jobs' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CRM Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time scheduling, billing, and customer insights.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/calendar" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Calendar View
          </Link>
          <Link href="/admin/service-requests" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            View New Requests
          </Link>
        </div>
      </div>

      {/* Financial Info (Global Admin Only) */}
      {role === 'global_admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Company Income Summary</span>
              <p className="text-3xl font-black text-slate-900">${monthlyIncome.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total processed client payments</p>
            </div>
            <div className="p-4 bg-emerald-500 text-white rounded-2xl">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Company Expense Summary</span>
              <p className="text-3xl font-black text-slate-900">${monthlyExpense.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total material & vendor expenses</p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-2xl">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Core Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={18} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Customers & Leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Users className="mr-2 text-slate-400" size={18} />
              Recent Customers
            </h2>
            <Link href="/admin/customers" className="text-xs font-bold text-blue-600 hover:underline">Manage Customers</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentCustomers?.map((customer: any) => (
              <div key={customer.id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{customer.first_name} {customer.last_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{customer.email}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {new Date(customer.created_at || '').toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!recentCustomers || recentCustomers.length === 0) && (
              <div className="p-12 text-center text-slate-400 text-sm italic">
                No recent customer profiles found.
              </div>
            )}
          </div>
        </div>

        {/* Recent CRM Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Clock className="mr-2 text-slate-400" size={18} />
              Recent Notes
            </h2>
            <Link href="/admin/notes" className="text-xs font-bold text-blue-600 hover:underline">View Notes</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentNotes?.map((note: any) => (
              <div key={note.id} className="p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    note.visibility === 'customer_visible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {note.visibility}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(note.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{note.content}</p>
              </div>
            ))}
            {(!recentNotes || recentNotes.length === 0) && (
              <div className="p-12 text-center text-slate-400 text-sm italic">
                No CRM notes added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
