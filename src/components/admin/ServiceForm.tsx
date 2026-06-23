'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Save,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import ImageUpload from './ImageUpload'
import { Database } from '@/types/database.types'

type Service = Database['public']['Tables']['services']['Row']

interface ServiceFormProps {
  initialData?: Service | null
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    price_range: initialData?.price_range || '',
    featured_image: initialData?.featured_image || '',
    is_published: initialData?.is_published ?? false,
    sort_order: initialData?.sort_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      ...formData,
      updated_at: new Date().toISOString(),
    }

    let result
    if (initialData?.id) {
      result = await supabase
        .from('services')
        .update(payload)
        .eq('id', initialData.id)
    } else {
      result = await supabase
        .from('services')
        .insert([payload])
    }

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push('/admin/services')
        router.refresh()
      }, 1500)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setFormData(prev => ({ ...prev, title, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Service Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Pool Maintenance"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-400 text-sm">/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="pool-maintenance"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Short Description</label>
          <textarea
            value={formData.short_description}
            onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-20"
            placeholder="Brief overview for cards and lists..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Full Description</label>
          <textarea
            value={formData.full_description}
            onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-40"
            placeholder="Detailed description for service page..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Price Range (Optional)</label>
            <input
              type="text"
              value={formData.price_range}
              onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Starting at $99"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700">Featured Image</label>
          {formData.featured_image && (
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200">
              <img src={formData.featured_image} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <X size={14} className="text-red-500" />
              </button>
            </div>
          )}
          <ImageUpload
            onUpload={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
            label="Upload Featured Image"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_published" className="text-sm font-bold text-slate-700 cursor-pointer">
            Published (Visible on public site)
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <X size={20} />
          <span>Cancel</span>
        </button>

        <div className="flex items-center space-x-4">
          {error && (
            <div className="flex items-center text-red-600 text-sm font-medium">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center text-green-600 text-sm font-medium">
              <CheckCircle2 size={16} className="mr-1" />
              Saved successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{initialData?.id ? 'Update Service' : 'Create Service'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
