import Link from 'next/link'
import { Droplet, Shield, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  const { data: heroData } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'homepage_hero')
    .single()

  const hero = (heroData?.content as any) || {
    title: 'Premium Water Solutions for Modern Homes',
    subtitle: 'Expert maintenance, repair, and installation services at your fingertips. Manage your home services with our state-of-the-art portal.',
    ctaText: 'Book a Service'
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Droplet className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Aquaman</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <Link href="#services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-blue-600 transition-colors">Gallery</Link>
          <Link href="#about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="#contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 whitespace-pre-line">
                {hero.title.split('Modern Homes')[0]}
                <span className="text-blue-600">Modern Homes</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{hero.ctaText}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/gallery"
                  className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-20 hidden lg:block" />
        </section>

        {/* Services Grid (Dynamic) */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-slate-600">Professional solutions for all your water and pool needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service) => (
                <div key={service.id} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors overflow-hidden">
                    {service.featured_image ? (
                      <img src={service.featured_image} className="w-full h-full object-cover" />
                    ) : (
                      <Droplet size={28} />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.short_description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center text-blue-600 font-bold hover:space-x-2 transition-all"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={18} className="ml-1" />
                  </Link>
                </div>
              ))}
              {!services?.length && (
                 <div className="col-span-full py-12 text-center text-slate-400 italic">
                    Loading our latest services...
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white shadow-sm text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Reliable Service</h3>
                <p className="text-slate-600 px-4">Our technicians are certified and fully insured, ensuring your home is in safe hands.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white shadow-sm text-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Scheduling</h3>
                <p className="text-slate-600 px-4">Book, reschedule, and track your appointments through our online portal.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white shadow-sm text-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Droplet size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
                <p className="text-slate-600 px-4">Get clear invoices and pay securely online. No hidden fees, ever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <Droplet className="text-blue-400" size={24} />
              <span className="text-xl font-bold">Aquaman</span>
            </div>
            <div className="flex space-x-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Aquaman Services Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
