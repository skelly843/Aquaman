import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { Database } from '@/types/database.types'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Our Work</h1>
          <p className="mt-4 text-slate-400 text-xl max-w-2xl mx-auto">
            Explore our project history through before and after transformations.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items?.map((item: GalleryItem) => (
            <div key={item.id} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Before</p>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    {item.before_image ? (
                      <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic">No image</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center">After</p>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-blue-100 shadow-xl shadow-blue-50">
                    {item.after_image ? (
                      <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 italic">No image</div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  <span className="text-sm font-medium text-slate-400">
                    {item.completion_date && format(new Date(item.completion_date), 'MMMM yyyy')}
                  </span>
                </div>
                <p className="mt-2 text-slate-600 leading-relaxed">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {item.service_category}
                  </span>
                  {item.location && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!items?.length && (
            <div className="col-span-full py-32 text-center">
              <p className="text-slate-400 text-xl italic">Check back soon for new project showcases.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
