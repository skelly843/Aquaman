import defaultPages from '@/components/blocks/defaultPages.json'
import type { PageBlock } from '@/components/blocks/types'

/** Public pages that are built from page_blocks and editable in place. */
export const EDITABLE_PAGES = {
  home: { path: '/', label: 'Home' },
  about: { path: '/about', label: 'About' },
  services: { path: '/services', label: 'Services' },
  gallery: { path: '/gallery', label: 'Gallery' },
  contact: { path: '/contact', label: 'Contact' },
  'request-service': { path: '/request-service', label: 'Request Service' }
} as const

export type PageId = keyof typeof EDITABLE_PAGES

export function pathToPageId(pathname: string | null | undefined): PageId | null {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/'
  for (const [id, page] of Object.entries(EDITABLE_PAGES)) {
    if (page.path === clean) return id as PageId
  }
  return null
}

/** Built-in content used until the page has rows in page_blocks (mirrors the 003 seed). */
export function getDefaultBlocks(pageId: PageId): PageBlock[] {
  const defs = (defaultPages as Record<string, { block_type: string; data: any }[]>)[pageId] || []
  return defs.map((def, i) => ({
    id: `default-${pageId}-${i + 1}`,
    page_id: pageId,
    block_type: def.block_type,
    display_order: (i + 1) * 10,
    is_visible: true,
    draft_data: def.data,
    published_data: def.data
  }))
}
