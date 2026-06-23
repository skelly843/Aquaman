import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Globe, Lock, Image as ImageIcon, Wrench } from 'lucide-react'
import { Database } from '@/types/database.types'

type Service = Database['public']['Tables']['services']['Row']

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-500 mt-1">Manage the services offered on your public website.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
        >
          <Plus size={20} />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sort</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {services?.map((service: Service) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                        {service.featured_image ? (
                          <img src={service.featured_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{service.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{service.short_description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-slate-500">/{service.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    {service.is_published ? (
                      <span className="inline-flex items-center space-x-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">
                        <Globe size={12} />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">
                        <Lock size={12} />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {service.sort_order}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!services?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                        <Wrench size={48} />
                      </div>
                      <p className="text-slate-500 font-medium">No services created yet.</p>
                      <Link href="/admin/services/new" className="text-blue-600 font-bold mt-2 hover:underline">
                        Create your first service
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
