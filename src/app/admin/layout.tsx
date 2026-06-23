import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Wrench,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronRight,
  Monitor
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return redirect('/')
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Site Content', href: '/admin/content', icon: Monitor },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group"
            >
              <item.icon size={20} className="text-slate-400 group-hover:text-blue-400" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 mb-2">
            <ChevronRight size={20} className="text-slate-500 rotate-180" />
            <span className="text-sm font-medium">Public Site</span>
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center space-x-3 px-3 py-2 w-full rounded-md hover:bg-red-900/20 text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
