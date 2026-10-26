'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackServicesBlocks: PageBlock[] = [
  {
    id: 'fallback-services-hero',
    page_id: 'services',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Professional Services',
      subtitle: 'Explore our comprehensive plumbing, water heating, and general contracting services.',
      ctaText: 'Book Service Now',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'Professional Services',
      subtitle: 'Explore our comprehensive plumbing, water heating, and general contracting services.',
      ctaText: 'Book Service Now',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-services-grid',
    page_id: 'services',
    block_type: 'services_grid',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Our Complete Service Catalog',
      subtitle: 'Select a service below to learn more or request an immediate quote.'
    },
    published_data: {
      title: 'Our Complete Service Catalog',
      subtitle: 'Select a service below to learn more or request an immediate quote.'
    }
  }
]

export default function ServicesPage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackServicesBlocks

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
