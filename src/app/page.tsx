import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function HomePage() {
  const { blocks, persisted } = await loadPageBlocks('home')
  return <EditablePage pageId="home" initialBlocks={blocks} persisted={persisted} />
}
