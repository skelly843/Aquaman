export interface PageBlock {
  id: string
  page_id: string
  block_type: string
  display_order: number
  is_visible: boolean
  draft_data: any
  published_data: any
}

export interface BlockProps {
  block: PageBlock
  /** draft_data while editing, published_data for visitors */
  data: any
  /** true only for an active global admin in edit mode (not preview) */
  editable: boolean
  /** Merges a patch into the block's draft_data (one undo step) */
  update: (patch: Record<string, any>) => void
}
