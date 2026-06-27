import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Clock,
  ShieldAlert,
  Save,
  MessageSquare,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Appointment = Database['public']['Tables']['appointments']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: appointmentsData } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', id)
    .order('scheduled_at', { ascending: false })

  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  const appointments = (appointmentsData as Appointment[]) || []
  const invoices = (invoicesData as Invoice[]) || []

  return (
    <div className="p-8 space-y-8">
      <Link
        href="/admin/customers"
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Users
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* User Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 border border-slate-200 flex items-center justify-center text-slate-300 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={48} />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
            <p className="text-sm text-slate-500 font-medium capitalize">{profile.role}</p>

            <div className="mt-6 pt-6 border-t border-slate-50 space-y-3 text-left">
              <div className="flex items-center text-sm text-slate-600">
                <Mail size={16} className="mr-3 text-slate-400" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone size={16} className="mr-3 text-slate-400" />
                <span>{profile.phone || 'No phone set'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Clock size={16} className="mr-3 text-slate-400" />
                <span>Joined {new Date(profile.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
              <ShieldAlert size={16} className="mr-2 text-orange-500" />
              Manage Permissions
            </h3>
            <form action="/api/admin/update-role" method="POST" className="space-y-4">
              <input type="hidden" name="userId" value={profile.id} />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Assign Role</label>
                <select
                  name="role"
                  defaultValue={profile.role || 'customer'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center"
              >
                <Save size={16} className="mr-2" />
                Update Role
              </button>
            </form>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Invoices</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {invoices.filter((i: Invoice) => i.status === 'paid').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unpaid Balance</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${invoices.filter((i: Invoice) => i.status === 'unpaid').reduce((acc: number, i: Invoice) => acc + (Number(i.amount) || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* History Tabs / Sections */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button className="px-6 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50/30">Service History</button>
              <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50">Invoices</button>
              <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50">Private Notes</button>
              <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50">Messages</button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900">Recent Appointments</h4>
                <Link
                  href={`/admin/appointments/new?customer_id=${profile.id}`}
                  className="flex items-center space-x-1 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  <span>Create Appointment</span>
                </Link>
              </div>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-blue-600">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{apt.service_type}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(apt.scheduled_at).toLocaleDateString()} at {new Date(apt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {apt.status}
                      </span>
                      <ArrowRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400 italic">No appointment history found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <MessageSquare size={20} className="text-blue-500" />
                <span>Message Customer</span>
             </button>
             <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <FileText size={20} className="text-purple-500" />
                <span>Create Invoice</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
