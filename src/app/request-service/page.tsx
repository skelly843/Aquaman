'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackRequestBlocks: PageBlock[] = [
  {
    id: 'fallback-request-hero',
    page_id: 'request-service',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Request Service Online',
      subtitle: 'Schedule plumbing repairs or request a detailed project estimate.',
      ctaText: 'Fill Form Below',
      ctaUrl: '#service-form',
      backgroundImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'Request Service Online',
      subtitle: 'Schedule plumbing repairs or request a detailed project estimate.',
      ctaText: 'Fill Form Below',
      ctaUrl: '#service-form',
      backgroundImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-request-form',
    page_id: 'request-service',
    block_type: 'request_form',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Service Dispatch Form',
      subtitle: 'Tell us about your issue and preferred appointment time.'
    },
    published_data: {
      title: 'Service Dispatch Form',
      subtitle: 'Tell us about your issue and preferred appointment time.'
    }
  }
]

export default function RequestServicePage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackRequestBlocks

  if (loading && (!blocks || blocks.length === 0)) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <main className="flex-1" id="service-form">
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
