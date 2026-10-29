import { unstable_rethrow } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getDefaultBlocks, type PageId } from '@/utils/pages'
import type { PageBlock } from '@/components/blocks/types'

/**
 * Server-side load of a page's sections. Falls back to the built-in defaults when
 * the page has no rows yet (or page_blocks is unavailable), so visitors never see a blank page.
 * `persisted` tells the editor whether the blocks already exist in the database.
 */
export async function loadPageBlocks(pageId: PageId): Promise<{ blocks: PageBlock[]; persisted: boolean }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('page_blocks')
      .select('id, page_id, block_type, display_order, is_visible, draft_data, published_data')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (error) {
      console.warn(`page_blocks load failed for "${pageId}":`, error.message)
    } else if (Array.isArray(data) && data.length > 0) {
      return { blocks: data as PageBlock[], persisted: true }
    }
  } catch (err: any) {
    // Let Next.js see its own dynamic-rendering signal (cookies()) so the page stays per-request
    unstable_rethrow(err)
    console.warn(`page_blocks load failed for "${pageId}":`, err?.message)
  }
  return { blocks: getDefaultBlocks(pageId), persisted: false }
}
