'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Calendar, Receipt, User, Home } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar({ role }: { role: 'customer' | 'employee' | 'admin' }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = role === 'customer'
    ? [
        { href: '/customer', label: 'Overview', icon: Home },
        { href: '/customer/appointments', label: 'Appointments', icon: Calendar },
        { href: '/customer/invoices', label: 'Invoices', icon: Receipt },
      ]
    : [
        { href: '/employee', label: 'Dashboard', icon: Home },
        { href: '/employee/calendar', label: 'Calendar', icon: Calendar },
        { href: '/employee/customers', label: 'Customers', icon: User },
        { href: '/employee/invoices', label: 'Invoices', icon: Receipt },
      ]

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">Aquaman</h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{role} Portal</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-md hover:bg-red-900/30 text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
