import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function GalleryPage() {
  const { blocks, persisted } = await loadPageBlocks('gallery')
  return <EditablePage pageId="gallery" initialBlocks={blocks} persisted={persisted} />
}
