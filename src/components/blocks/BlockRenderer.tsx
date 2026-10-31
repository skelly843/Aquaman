'use client'

import React from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import HeroBlock from './HeroBlock'
import TextImageBlock from './TextImageBlock'
import FeaturesBlock from './FeaturesBlock'
import TeamBlock from './TeamBlock'
import GalleryGridBlock from './GalleryGridBlock'
import ServicesGridBlock from './ServicesGridBlock'
import ContactInfoBlock from './ContactInfoBlock'
import ContactFormBlock from './ContactFormBlock'
import RequestFormBlock from './RequestFormBlock'
import CtaBannerBlock from './CtaBannerBlock'
import ImageBlock from './ImageBlock'
import SpacerBlock from './SpacerBlock'
import type { BlockProps, PageBlock } from './types'

const COMPONENTS: Record<string, React.ComponentType<BlockProps>> = {
  hero: HeroBlock,
  text_image: TextImageBlock,
  features: FeaturesBlock,
  team: TeamBlock,
  gallery_grid: GalleryGridBlock,
  services_grid: ServicesGridBlock,
  contact_info: ContactInfoBlock,
  contact_form: ContactFormBlock,
  request_form: RequestFormBlock,
  cta_banner: CtaBannerBlock,
  image: ImageBlock,
  spacer: SpacerBlock
}

export function BlockRenderer({ block }: { block: PageBlock }) {
  const { editMode, previewMode, updateBlockData } = useWebsiteBuilder()
  const Component = COMPONENTS[block.block_type]
  const editable = editMode && !previewMode

  if (!Component) {
    return editable ? (
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-amber-700">
        Unknown section type “{block.block_type}”. Delete it or add a component for it in BlockRenderer.
      </div>
    ) : null
  }

  return (
    <Component
      block={block}
      data={(editMode ? block.draft_data : block.published_data) || {}}
      editable={editable}
      update={(patch) => updateBlockData(block.id, patch)}
    />
  )
}
