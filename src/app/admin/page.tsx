import { createClient } from '@/utils/supabase/server'
import {
  Wrench,
  Image as ImageIcon,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Monitor
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })

  const { count: galleryCount } = await supabase
    .from('gallery_items')
    .select('*', { count: 'exact', head: true })

  const { data: recentServices } = await supabase
    .from('services')
    .select('title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(3)

  const { data: recentGallery } = await supabase
    .from('gallery_items')
    .select('title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(3)

  const typedRecentServices = (recentServices as any[]) || []
  const typedRecentGallery = (recentGallery as any[]) || []

  const stats = [
    { label: 'Total Services', value: serviceCount || 0, icon: Wrench, color: 'bg-blue-500', href: '/admin/services' },
    { label: 'Gallery Items', value: galleryCount || 0, icon: ImageIcon, color: 'bg-purple-500', href: '/admin/gallery' },
    { label: 'Site Sections', value: 4, icon: Monitor, color: 'bg-orange-500', href: '/admin/content' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Manage your website content and track updates.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Updates */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Clock className="mr-2 text-slate-400" size={20} />
              Recently Updated
            </h2>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="divide-y divide-slate-50">
            {typedRecentServices.map((item) => (
              <div key={item.title} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Service Module</p>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  {new Date(item.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {typedRecentGallery.map((item) => (
              <div key={item.title} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Gallery Item</p>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  {new Date(item.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(typedRecentServices.length === 0 && typedRecentGallery.length === 0) && (
              <div className="p-12 text-center">
                <p className="text-slate-400">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/services?action=new"
              className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all text-center"
            >
              <Wrench size={24} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-tight">Add Service</span>
            </Link>
            <Link
              href="/admin/gallery?action=new"
              className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all text-center"
            >
              <ImageIcon size={24} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-tight">Add Gallery</span>
            </Link>
          </div>

          <div className="p-4 bg-blue-600 rounded-2xl text-white">
            <h3 className="font-bold">Pro Tip</h3>
            <p className="text-sm text-blue-100 mt-1">Keep your slug names descriptive and keyword-rich for better SEO performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
