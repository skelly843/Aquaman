import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function ServicesPage() {
  const { blocks, persisted } = await loadPageBlocks('services')
  return <EditablePage pageId="services" initialBlocks={blocks} persisted={persisted} />
}
