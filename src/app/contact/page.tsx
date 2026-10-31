import EditablePage from '@/components/blocks/EditablePage'
import { loadPageBlocks } from '@/utils/supabase/loadPageBlocks'

export default async function ContactPage() {
  const { blocks, persisted } = await loadPageBlocks('contact')
  return <EditablePage pageId="contact" initialBlocks={blocks} persisted={persisted} />
}
