'use client'

import React from 'react'
import { useWebsiteBuilder, PageBlock } from '@/context/WebsiteBuilderContext'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Loader2 } from 'lucide-react'

const fallbackContactBlocks: PageBlock[] = [
  {
    id: 'fallback-contact-hero',
    page_id: 'contact',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team for questions, estimates, or service requests.',
      ctaText: 'Dispatch Emergency Request',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80'
    },
    published_data: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team for questions, estimates, or service requests.',
      ctaText: 'Dispatch Emergency Request',
      ctaUrl: '/request-service',
      backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'fallback-contact-info',
    page_id: 'contact',
    block_type: 'contact_info',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Reach Out Directly',
      subtitle: 'We are available 24/7 for urgent plumbing emergencies.',
      phone: '(555) 234-5678',
      email: 'info@aquamanplumbing.com',
      address: '123 Ocean Boulevard, Suite 100, Atlantis, CA 90210',
      hours: '24/7 Emergency Service Available | Mon-Fri 7am-6pm'
    },
    published_data: {
      title: 'Reach Out Directly',
      subtitle: 'We are available 24/7 for urgent plumbing emergencies.',
      phone: '(555) 234-5678',
      email: 'info@aquamanplumbing.com',
      address: '123 Ocean Boulevard, Suite 100, Atlantis, CA 90210',
      hours: '24/7 Emergency Service Available | Mon-Fri 7am-6pm'
    }
  },
  {
    id: 'fallback-contact-form',
    page_id: 'contact',
    block_type: 'contact_form',
    display_order: 30,
    is_visible: true,
    draft_data: {
      title: 'Send Us a Message',
      subtitle: 'Fill out the form below and we will respond within 1 business hour.'
    },
    published_data: {
      title: 'Send Us a Message',
      subtitle: 'Fill out the form below and we will respond within 1 business hour.'
    }
  }
]

export default function ContactPage() {
  const { blocks, loading } = useWebsiteBuilder()

  const activeBlocks = (blocks && blocks.length > 0) ? blocks : fallbackContactBlocks

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
