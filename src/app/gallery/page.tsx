import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'
import { Droplet } from 'lucide-react'
import { Database } from '@/types/database.types'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

export default async function GalleryPage() {
  const supabase = await createClient()

  // Public gallery items: visible if is_published is true and is_private is false
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_published', true)
    .eq('is_private', false)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-white sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Droplet className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Aquaman</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/gallery" className="text-blue-600 hover:text-blue-700 transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Log in
          </Link>
          <Link
            href="/request-service"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Book a Service
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Project Gallery</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our professional plumbing installations, bathroom transformations, and general contracting work.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items?.map((item: GalleryItem) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Before</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    {item.before_image ? (
                      <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs">No image</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center">After</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-blue-100 shadow-lg shadow-blue-50">
                    {item.after_image ? (
                      <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs">No image</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.completion_date && format(new Date(item.completion_date), 'MMM yyyy')}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {item.service_category && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.service_category}
                    </span>
                  )}
                  {item.location && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!items?.length && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 italic">No published project gallery images found. Check back soon for our completed transformations!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Droplet className="text-blue-400" size={24} />
            <span className="text-xl font-bold">Aquaman</span>
          </div>
          <div className="flex space-x-8 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
