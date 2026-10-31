import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function RequestServicePage() {
  const { blocks, persisted } = await loadPageBlocks('request-service')
  return <EditablePage pageId="request-service" initialBlocks={blocks} persisted={persisted} />
}
