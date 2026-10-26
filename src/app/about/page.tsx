'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackAboutBlocks: PageBlock[] = [
  {
    id: 'fallback-about-hero',
    page_id: 'about',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'About Aquaman Plumbing',
      subtitle: 'Over 15 Years of Excellence in Plumbing & General Contracting',
      ctaText: 'Schedule Service',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'About Aquaman Plumbing',
      subtitle: 'Over 15 Years of Excellence in Plumbing & General Contracting',
      ctaText: 'Schedule Service',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-about-textimage',
    page_id: 'about',
    block_type: 'text_image',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Our Story & Commitment',
      body_content: 'Founded in 2010, Aquaman Plumbing & General Contracting has built a reputation on integrity, quality craftsmanship, and exceptional customer service. From emergency pipe repairs to full home kitchen and bathroom remodels, our master plumbers and contractors handle every job with extreme attention to detail.',
      image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80',
      layout: 'text_left'
    },
    published_data: {
      title: 'Our Story & Commitment',
      body_content: 'Founded in 2010, Aquaman Plumbing & General Contracting has built a reputation on integrity, quality craftsmanship, and exceptional customer service. From emergency pipe repairs to full home kitchen and bathroom remodels, our master plumbers and contractors handle every job with extreme attention to detail.',
      image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80',
      layout: 'text_left'
    }
  },
  {
    id: 'fallback-about-team',
    page_id: 'about',
    block_type: 'team',
    display_order: 30,
    is_visible: true,
    draft_data: {
      title: 'Meet Our Leadership',
      subtitle: 'Dedicated professionals ensuring top-tier quality on every job site.',
      members: [
        { name: 'Arthur Curry', role: 'Master Plumber & Founder', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80', bio: '18+ years of commercial and residential plumbing experience.' },
        { name: 'Mera Pelagios', role: 'Head of Contracting & Remodeling', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80', bio: 'General contractor specialized in luxury bathroom and kitchen structural build-outs.' }
      ]
    },
    published_data: {
      title: 'Meet Our Leadership',
      subtitle: 'Dedicated professionals ensuring top-tier quality on every job site.',
      members: [
        { name: 'Arthur Curry', role: 'Master Plumber & Founder', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80', bio: '18+ years of commercial and residential plumbing experience.' },
        { name: 'Mera Pelagios', role: 'Head of Contracting & Remodeling', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80', bio: 'General contractor specialized in luxury bathroom and kitchen structural build-outs.' }
      ]
    }
  }
]

export default function AboutPage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackAboutBlocks

  if (loading && (!blocks || blocks.length === 0)) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <main className="flex-1">
      {activeBlocks.map((block, idx) => (
        <BlockRenderer
          key={block.id}
          block={block}
          index={idx}
          totalBlocks={activeBlocks.length}
        />
      ))}
    </main>
  )
}
