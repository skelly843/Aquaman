'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Droplet } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Don't render public footer on admin layout routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/employee')) {
    return null
  }

  return (
    <footer className="bg-slate-900 text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <Droplet className="text-blue-400" size={24} />
          <span className="text-xl font-bold tracking-tight">Aquaman Plumbing & Contracting</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
          <Link href="/services" className="hover:text-white transition-colors font-medium">Services</Link>
          <Link href="/gallery" className="hover:text-white transition-colors font-medium">Gallery</Link>
          <Link href="/about" className="hover:text-white transition-colors font-medium">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors font-medium">Contact</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Aquaman Services Inc. All rights reserved.
      </div>
    </footer>
  )
}
