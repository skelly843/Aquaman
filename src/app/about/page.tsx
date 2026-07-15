import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Droplet, Award, Shield, CheckCircle2, User } from 'lucide-react'

export default async function AboutPage() {
  const supabase = await createClient()

  // We can fetch from company_settings if populated
  const { data: settings } = await supabase
    .from('company_settings')
    .select('*')
    .eq('id', 'default')
    .single()

  const companyName = settings?.company_name || 'Aquaman Plumbing & General Contracting'
  const serviceAreas = settings?.service_areas || ['Ocean City', 'Beverly Hills', 'Malibu', 'Santa Monica']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About {companyName}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Providing high-quality plumbing and contracting services with integrity, reliability, and precision.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Core Values / History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Our Story & Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Founded with a commitment to premium craftsmanship, {companyName} has grown from a local plumbing team into a premier general contracting firm. We specialize in handling complex residential and commercial water systems, high-efficiency upgrades, custom bathroom & kitchen remodeling, and general maintenance.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our mission is to safeguard our clients' homes and commercial investments by delivering robust plumbing engineering, professional project management, and completely transparent pricing on every job.
            </p>
          </div>
          <div className="bg-blue-600 text-white p-8 rounded-3xl space-y-6 shadow-xl shadow-blue-100">
            <h3 className="text-xl font-bold">Why Homeowners Trust Us:</h3>
            <ul className="space-y-4">
              {[
                'Licensed & Insured Plumbing & Contracting experts',
                'Comprehensive scheduling & digital client portal tracking',
                'Advanced hydro-jetting, drain camera scans, and leak diagnostics',
                '24/7 emergency support for pipe bursts, backups & failures'
              ].map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-blue-100">
                  <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accreditations / Certifications */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Licenses, Certifications & Services Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Shield size={24} />
              </div>
              <h4 className="font-bold text-slate-800">Licensed Plumber</h4>
              <p className="text-xs text-slate-500">Fully compliant with California State Licensing Board regulations.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-slate-800">General B Contractor</h4>
              <p className="text-xs text-slate-500">Qualified to execute structural alterations, plumbing upgrades & framing.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Droplet size={24} />
              </div>
              <h4 className="font-bold text-slate-800">Water Treatment Certified</h4>
              <p className="text-xs text-slate-500">Specialized in filtration systems, leak detection & pool diagnostics.</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Meet Our Leadership & Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <User size={48} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">David "Aquaman" Carter</h4>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">Founder & Master Plumber</p>
                <p className="text-xs text-slate-500 mt-2">Over 15 years of complex water treatment & mechanical engineering experience.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <User size={48} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Marcus Rodriguez</h4>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">Lead Contracting Estimator</p>
                <p className="text-xs text-slate-500 mt-2">Expert in structural design, kitchen remodeling, and customer logistics.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <User size={48} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Sarah Jenkins</h4>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">Client Relations Manager</p>
                <p className="text-xs text-slate-500 mt-2">Ensures seamless scheduling, billing integration & client support in the portal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas Info */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-bold">Our Service Locations</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            We actively dispatch plumbing technicians and general contracting crews across:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area: string) => (
              <span key={area} className="px-3.5 py-1.5 bg-slate-800 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700">
                {area}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
