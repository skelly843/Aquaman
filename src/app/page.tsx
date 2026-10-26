'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackHomeBlocks: PageBlock[] = [
  {
    id: 'fallback-home-hero',
    page_id: 'home',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Master Plumbing & Premium Remodeling Services',
      subtitle: '24/7 Emergency Repairs, Water Heater Installs & Custom Kitchen/Bathroom Solutions',
      ctaText: 'Request Service',
      ctaUrl: '/request-service',
      secondaryCtaText: 'Explore Services',
      secondaryCtaUrl: '/services',
      backgroundImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'Master Plumbing & Premium Remodeling Services',
      subtitle: '24/7 Emergency Repairs, Water Heater Installs & Custom Kitchen/Bathroom Solutions',
      ctaText: 'Request Service',
      ctaUrl: '/request-service',
      secondaryCtaText: 'Explore Services',
      secondaryCtaUrl: '/services',
      backgroundImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-home-features',
    page_id: 'home',
    block_type: 'features',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Why Aquaman Contracting?',
      subtitle: 'Delivering reliable craftsmanship and transparent upfront pricing on every project.',
      items: [
        { title: 'Licensed & Insured', desc: 'Master plumbers and certified general contractors fully equipped for residential and commercial jobs.' },
        { title: '24/7 Emergency Dispatch', desc: 'Immediate rapid response team ready for urgent burst pipes, leaks, and sewer line backups.' },
        { title: 'Upfront Transparent Pricing', desc: 'Detailed transparent estimates before work begins with zero hidden fees or unexpected charges.' }
      ]
    },
    published_data: {
      title: 'Why Aquaman Contracting?',
      subtitle: 'Delivering reliable craftsmanship and transparent upfront pricing on every project.',
      items: [
        { title: 'Licensed & Insured', desc: 'Master plumbers and certified general contractors fully equipped for residential and commercial jobs.' },
        { title: '24/7 Emergency Dispatch', desc: 'Immediate rapid response team ready for urgent burst pipes, leaks, and sewer line backups.' },
        { title: 'Upfront Transparent Pricing', desc: 'Detailed transparent estimates before work begins with zero hidden fees or unexpected charges.' }
      ]
    }
  },
  {
    id: 'fallback-home-services',
    page_id: 'home',
    block_type: 'services_grid',
    display_order: 30,
    is_visible: true,
    draft_data: {
      title: 'Our Premier Services',
      subtitle: 'Comprehensive plumbing and renovation solutions tailored to your property.'
    },
    published_data: {
      title: 'Our Premier Services',
      subtitle: 'Comprehensive plumbing and renovation solutions tailored to your property.'
    }
  },
  {
    id: 'fallback-home-cta',
    page_id: 'home',
    block_type: 'cta_banner',
    display_order: 40,
    is_visible: true,
    draft_data: {
      title: 'Ready to Start Your Project?',
      subtitle: 'Contact our master technicians today for a fast estimate or emergency service.',
      buttonText: 'Schedule Online Now',
      buttonUrl: '/request-service'
    },
    published_data: {
      title: 'Ready to Start Your Project?',
      subtitle: 'Contact our master technicians today for a fast estimate or emergency service.',
      buttonText: 'Schedule Online Now',
      buttonUrl: '/request-service'
    }
  }
]

export default function HomePage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackHomeBlocks

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
