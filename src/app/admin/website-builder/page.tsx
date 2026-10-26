import { getProfile } from '@/utils/supabase/getProfile'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Settings,
  Home,
  Wrench,
  Image as ImageIcon,
  BookOpen,
  Mail,
  ArrowRight,
  Sparkles,
  FileEdit,
  History,
  CheckCircle2,
  FolderLock
} from 'lucide-react'

export default async function WebsiteBuilderDashboard() {
  const profile = await getProfile()

  // Guard: Strict server-side validation.
  if (!profile || profile.role !== 'global_admin' || !profile.is_active) {
    return redirect('/login')
  }

  const editorCards = [
    {
      title: 'Home Page Editor',
      desc: 'Modify visual overlays, dynamic titles, hero backdrops, CTAs, benefits, and list featured services.',
      slug: 'home',
      icon: Home,
      formId: 'home-editor-form',
      publishMark: 'publish-page-button'
    },
    {
      title: 'Services Page Editor',
      desc: 'Add, structure, categorize, and upload descriptive details for plumbing and general contracting services.',
      slug: 'services',
      icon: Wrench,
      formId: 'services-editor-form',
      publishMark: 'add-service-button'
    },
    {
      title: 'Gallery Page Editor',
      desc: 'Upload structural before-and-after transformations, configure metadata, and select visible folders.',
      slug: 'gallery',
      icon: ImageIcon,
      formId: 'gallery-editor-form',
      publishMark: 'upload-gallery-button'
    },
    {
      title: 'About Page Editor',
      desc: 'Manage milestones, mission assertions, accredited trade certificates, and visible leader biographies.',
      slug: 'about',
      icon: BookOpen,
      formId: 'about-editor-form',
      publishMark: 'publish-page-button'
    },
    {
      title: 'Contact Page Editor',
      desc: 'Edit emergency help announcements, active cities, business dispatch hours, phone, and address lines.',
      slug: 'contact',
      icon: Mail,
      formId: 'contact-editor-form',
      publishMark: 'publish-page-button'
    }
  ]

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="text-blue-600 animate-spin-slow" />
            <span>Website Builder Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visual editor and structured form controller hub for Aquaman General Contracting.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            Go Visually Edit Pages
          </Link>
        </div>
      </div>

      {/* Grid of Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {editorCards.map((card) => (
          <div
            key={card.slug}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <card.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                Live & Syncing
              </span>
              <Link
                href={`/admin/website-builder/${card.slug}`}
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center space-x-1"
              >
                <span>Open Form Editor</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}

        {/* Global styles panel */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 text-blue-400 rounded-xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">Global Style Branding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quickly rebrand primary palettes, container border-radii, logo assets, and layout typography rules.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Branding Synced
            </span>
            <Link
              href="/"
              className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Manage Globally</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
