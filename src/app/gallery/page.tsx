import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { Database } from '@/types/database.types'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

export default async function GalleryPage() {
  const supabase = await createClient()

  // Public gallery items: visible if is_published is true and is_private is false
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_published', true)
    .eq('is_private', false)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Main Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Project Gallery</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our professional plumbing installations, bathroom transformations, and general contracting work.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items?.map((item: GalleryItem) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Before</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    {item.before_image ? (
                      <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs">No image</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center">After</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-blue-100 shadow-lg shadow-blue-50">
                    {item.after_image ? (
                      <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs">No image</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.completion_date && format(new Date(item.completion_date), 'MMM yyyy')}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {item.service_category && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.service_category}
                    </span>
                  )}
                  {item.location && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!items?.length && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 italic">No published project gallery images found. Check back soon for our completed transformations!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
