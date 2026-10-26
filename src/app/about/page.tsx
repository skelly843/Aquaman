'use client'

import { useEffect, useState } from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { InlineText } from '@/components/admin/InlineText'
import { createClient } from '@/utils/supabase/client'
import { Shield, Award, Droplet, CheckCircle2, User, Plus, Trash2 } from 'lucide-react'

export default function AboutPage() {
  const supabase = createClient()
  const {
    editMode,
    previewMode,
    isGlobalAdmin,
    loading
  } = useWebsiteBuilder()

  const [about, setAbout] = useState({
    heading: 'About Aquaman Plumbing & General Contracting',
    subtitle: 'Providing high-quality plumbing and contracting services with integrity, reliability, and precision.',
    storyTitle: 'Our Story & Mission',
    storyBody: 'Founded with a commitment to premium craftsmanship, Aquaman has grown from a local plumbing team into a premier general contracting firm. We specialize in handling complex residential and commercial water systems, high-efficiency upgrades, custom bathroom & kitchen remodeling, and general maintenance.',
    mission: 'Our mission is to safeguard our clients\' homes and commercial investments by delivering robust plumbing engineering, professional project management, and completely transparent pricing on every job.',
    team: [
      { name: 'David "Aquaman" Carter', role: 'Founder & Master Plumber', bio: 'Over 15 years of complex water treatment & mechanical engineering experience.' },
      { name: 'Marcus Rodriguez', role: 'Lead Contracting Estimator', bio: 'Expert in structural design, kitchen remodeling, and customer logistics.' }
    ] as { name: string; role: string; bio: string }[],
    service_areas: ['Ocean City', 'Beverly Hills', 'Malibu', 'Santa Monica']
  })

  // Load about content block
  useEffect(() => {
    async function loadAbout() {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 'about_page')
          .single()
        if (data?.content) {
          setAbout(prev => ({ ...prev, ...(data.content as any) }))
        }
      } catch (err) {
        console.warn('Failed to load about details:', err)
      }
    }
    loadAbout()
  }, [supabase])

  const saveAboutChanges = async () => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: 'about_page',
          content: about,
          updated_at: new Date().toISOString()
        })
      if (error) throw error
      alert('About page draft saved successfully!')
    } catch (e: any) {
      alert(`Save failed: ${e.message}`)
    }
  }

  const isEditingActive = editMode && !previewMode

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16 px-6 relative">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <InlineText
            element="h1"
            value={about.heading}
            onChange={(text) => setAbout({ ...about, heading: text })}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white block focus:outline-none"
          />
          <InlineText
            element="p"
            value={about.subtitle}
            onChange={(text) => setAbout({ ...about, subtitle: text })}
            className="text-slate-400 text-lg max-w-2xl mx-auto block"
          />
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Save button floating bar if editing about page */}
        {isEditingActive && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="text-xs font-bold text-blue-700">
              ⚡ You are currently visually editing the About page. Click on any text to modify!
            </div>
            <button
              onClick={saveAboutChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Save About Changes
            </button>
          </div>
        )}

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <InlineText
              element="h2"
              value={about.storyTitle}
              onChange={(text) => setAbout({ ...about, storyTitle: text })}
              className="text-3xl font-bold text-slate-900 block"
            />
            <InlineText
              element="p"
              value={about.storyBody}
              onChange={(text) => setAbout({ ...about, storyBody: text })}
              className="text-slate-600 leading-relaxed block text-sm"
            />
            <InlineText
              element="p"
              value={about.mission}
              onChange={(text) => setAbout({ ...about, mission: text })}
              className="text-slate-600 leading-relaxed block text-sm font-semibold border-l-4 border-blue-500 pl-4 italic"
            />
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

        {/* Accreditations */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Licenses & Accreditations</h2>
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

        {/* Team Members List */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {about.team?.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4 relative group">
                {isEditingActive && (
                  <button
                    onClick={() => setAbout({
                      ...about,
                      team: about.team.filter((_, idx) => idx !== index)
                    })}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="w-20 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <User size={36} />
                </div>
                <div>
                  <InlineText
                    element="h4"
                    value={member.name}
                    onChange={(text) => {
                      const newTeam = [...about.team]
                      newTeam[index].name = text
                      setAbout({ ...about, team: newTeam })
                    }}
                    className="font-bold text-slate-900 text-sm block"
                  />
                  <InlineText
                    element="p"
                    value={member.role}
                    onChange={(text) => {
                      const newTeam = [...about.team]
                      newTeam[index].role = text
                      setAbout({ ...about, team: newTeam })
                    }}
                    className="text-xs text-blue-600 font-bold uppercase mt-1 block"
                  />
                  <InlineText
                    element="p"
                    value={member.bio}
                    onChange={(text) => {
                      const newTeam = [...about.team]
                      newTeam[index].bio = text
                      setAbout({ ...about, team: newTeam })
                    }}
                    className="text-xs text-slate-500 mt-2 block leading-relaxed"
                  />
                </div>
              </div>
            ))}

            {isEditingActive && (
              <button
                type="button"
                onClick={() => setAbout({
                  ...about,
                  team: [...about.team, { name: 'New Colleague', role: 'Staff role', bio: 'Short bio details...' }]
                })}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 hover:border-blue-500 group transition-all text-slate-400 hover:text-blue-500 h-full min-h-[200px]"
              >
                <Plus size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Add Team Member</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
