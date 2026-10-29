import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function AboutPage() {
  const { blocks, persisted } = await loadPageBlocks('about')
  return <EditablePage pageId="about" initialBlocks={blocks} persisted={persisted} />
}
