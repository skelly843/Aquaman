import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Droplet, ArrowLeft, ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'

type Service = Database['public']['Tables']['services']['Row']

export default async function PublicServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
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
          <Link href="/services" className="text-blue-600 hover:text-blue-700 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-blue-600 transition-colors">Gallery</Link>
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

      <main className="flex-1 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Our Services</h1>
            <p className="text-slate-500 text-lg">
              Professional plumbing and general contracting solutions designed for residential & commercial needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service: Service) => (
              <div key={service.id} className="group p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:shadow-blue-50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors overflow-hidden">
                    {service.featured_image ? (
                      <img src={service.featured_image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <Droplet size={28} />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 mb-6 text-sm line-clamp-3">{service.short_description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {service.price_range && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{service.price_range}</span>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center text-blue-600 font-bold hover:space-x-2 transition-all text-sm ml-auto"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
            {!services?.length && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 italic">No published services found. Please check back later or contact us directly.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Droplet className="text-blue-400" size={24} />
            <span className="text-xl font-bold">Aquaman</span>
          </div>
          <div className="flex space-x-8 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
