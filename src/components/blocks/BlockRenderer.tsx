'use client'

import React from 'react'
import { PageBlock, useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import EditableBlockWrapper from '@/components/admin/EditableBlockWrapper'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { TextImageBlock } from '@/components/blocks/TextImageBlock'
import { FeaturesBlock } from '@/components/blocks/FeaturesBlock'
import { TeamBlock } from '@/components/blocks/TeamBlock'
import { GalleryGridBlock } from '@/components/blocks/GalleryGridBlock'
import { ServicesGridBlock } from '@/components/blocks/ServicesGridBlock'
import { ContactInfoBlock } from '@/components/blocks/ContactInfoBlock'
import { ContactFormBlock } from '@/components/blocks/ContactFormBlock'
import { RequestFormBlock } from '@/components/blocks/RequestFormBlock'
import { CtaBannerBlock } from '@/components/blocks/CtaBannerBlock'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { SpacerBlock } from '@/components/blocks/SpacerBlock'

interface BlockRendererProps {
  block: PageBlock
  index: number
  totalBlocks: number
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, index, totalBlocks }) => {
  const { editMode, updateBlockData } = useWebsiteBuilder()

  // Use draft_data when in edit mode, otherwise fallback to published_data or draft_data
  const data = editMode ? (block.draft_data || {}) : (block.published_data || block.draft_data || {})

  const handleUpdate = (updatedFields: any) => {
    updateBlockData(block.id, updatedFields)
  }

  const renderBlockContent = () => {
    switch (block.block_type) {
      case 'hero':
        return <HeroBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'text_image':
      case 'text':
        return <TextImageBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'features':
        return <FeaturesBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'team':
        return <TeamBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'gallery_grid':
        return <GalleryGridBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'services_grid':
        return <ServicesGridBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'contact_info':
        return <ContactInfoBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'contact_form':
        return <ContactFormBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'request_form':
        return <RequestFormBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'cta_banner':
        return <CtaBannerBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'image':
        return <ImageBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      case 'spacer':
        return <SpacerBlock id={block.id} data={data} editMode={editMode} onUpdate={handleUpdate} />
      default:
        return (
          <div className="p-8 bg-amber-50 border border-amber-200 text-amber-900 text-center rounded-xl my-4">
            <p className="font-bold text-sm">Unknown Block Type: "{block.block_type}"</p>
          </div>
        )
    }
  }

  // Hide invisible blocks for regular visitors when not in edit mode
  if (!block.is_visible && !editMode) {
    return null
  }

  if (editMode) {
    return (
      <EditableBlockWrapper
        block={block}
        index={index}
        totalBlocks={totalBlocks}
      >
        {renderBlockContent()}
      </EditableBlockWrapper>
    )
  }

  return renderBlockContent()
}
