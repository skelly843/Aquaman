'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackGalleryBlocks: PageBlock[] = [
  {
    id: 'fallback-gallery-hero',
    page_id: 'gallery',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Project Gallery',
      subtitle: 'Take a look at our recent plumbing installs and home remodeling transformations.',
      ctaText: 'Start Your Project',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'Project Gallery',
      subtitle: 'Take a look at our recent plumbing installs and home remodeling transformations.',
      ctaText: 'Start Your Project',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-gallery-grid',
    page_id: 'gallery',
    block_type: 'gallery_grid',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Our Completed Work',
      subtitle: 'Filter by category to view our craftsmanship in detail.'
    },
    published_data: {
      title: 'Our Completed Work',
      subtitle: 'Filter by category to view our craftsmanship in detail.'
    }
  }
]

export default function GalleryPage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackGalleryBlocks

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
