'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Droplet } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Footer() {
  const pathname = usePathname()
  const [footer, setFooter] = useState({
    brandName: 'Aquaman Plumbing & Contracting',
    description: 'Expert plumbing, water heater installations, drain cleaning, and general contracting remodeling.',
    copyright: `© ${new Date().getFullYear()} Aquaman Services Inc. All rights reserved.`
  })

  useEffect(() => {
    async function loadFooter() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 'footer_settings')
          .single()
        if (data?.content) {
          const content = data.content as any
          setFooter({
            brandName: content.brandName || 'Aquaman Plumbing & Contracting',
            description: content.description || 'Expert plumbing, water heater installations, drain cleaning, and general contracting remodeling.',
            copyright: content.copyright || `© ${new Date().getFullYear()} Aquaman Services Inc. All rights reserved.`
          })
        }
      } catch (e) {
        console.warn('Footer settings fetch not available:', e)
      }
    }
    loadFooter()
  }, [])

  // Don't render public footer on admin layout routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/employee')) {
    return null
  }

  return (
    <footer className="bg-slate-900 text-white py-12 px-6 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <Droplet className="text-blue-400" size={24} />
          <span className="text-xl font-bold tracking-tight">{footer.brandName}</span>
        </div>
        <p className="text-slate-400 text-xs text-center max-w-md md:text-left">{footer.description}</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
          <Link href="/services" className="hover:text-white transition-colors font-medium">Services</Link>
          <Link href="/gallery" className="hover:text-white transition-colors font-medium">Gallery</Link>
          <Link href="/about" className="hover:text-white transition-colors font-medium">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors font-medium">Contact</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        {footer.copyright}
      </div>
    </footer>
  )
}
