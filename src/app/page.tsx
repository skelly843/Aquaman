import Link from 'next/link'
import { Droplet, Shield, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

type Service = Database['public']['Tables']['services']['Row']

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
    title: 'Premium Water & General Contracting Solutions',
    subtitle: 'Professional plumbing maintenance, fast leak repairs, and full-scale home construction, kitchen remodeling, and general contracting services.',
    ctaText: 'Request Service',
    ctaUrl: '/request-service',
    secondaryCtaText: 'View Our Work',
    secondaryCtaUrl: '/gallery',
    backgroundImage: ''
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 min-h-[600px] flex items-center">
          {hero.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <img src={hero.backgroundImage} alt="" className="w-full h-full object-cover brightness-[0.9] filter saturate-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
            </div>
          )}
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight ${hero.backgroundImage ? 'text-white' : 'text-slate-900'}`}>
                {hero.title}
              </h1>
              <p className={`text-lg md:text-xl mb-10 leading-relaxed max-w-2xl ${hero.backgroundImage ? 'text-slate-200' : 'text-slate-600'}`}>
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={hero.ctaUrl || '/request-service'}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                >
                  <span>{hero.ctaText || 'Request Service'}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href={hero.secondaryCtaUrl || '/gallery'}
                  className={`px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center border ${
                    hero.backgroundImage
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  {hero.secondaryCtaText || 'View Our Work'}
                </Link>
              </div>
            </div>
          </div>
          {!hero.backgroundImage && (
            <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-20 hidden lg:block" />
          )}
        </section>

        {/* Services Grid (Dynamic) */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Professional Services</h2>
              <p className="text-slate-600 mt-3 text-lg font-medium">Expert plumbing maintenance, diagnostics, and general remodeling layouts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service: Service) => (
                <div key={service.id} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors overflow-hidden border border-blue-50">
                      {service.featured_image ? (
                        <img src={service.featured_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Droplet size={28} />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{service.short_description}</p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center text-blue-600 font-bold hover:space-x-2 transition-all mt-auto"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={18} className="ml-1" />
                  </Link>
                </div>
              ))}
              {(!services || services.length === 0) && (
                 <div className="col-span-full py-16 text-center text-slate-400 italic font-medium">
                    No active services published yet. Please log in as administrator to manage services.
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white shadow-md text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Reliable Service</h3>
                <p className="text-slate-600 px-4 text-sm leading-relaxed">Our technicians are certified and fully insured, ensuring your home is in safe hands.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white shadow-md text-green-600 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Easy Scheduling</h3>
                <p className="text-slate-600 px-4 text-sm leading-relaxed">Book, reschedule, and track your appointments through our online portal.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white shadow-md text-purple-600 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <Droplet size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Transparent Pricing</h3>
                <p className="text-slate-600 px-4 text-sm leading-relaxed">Get clear invoices and pay securely online. No hidden fees, ever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
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
