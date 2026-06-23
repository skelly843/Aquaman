'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, X, Loader2, Check } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  label?: string
  bucket?: string
}

export default function ImageUpload({
  onUpload,
  label = 'Upload Image',
  bucket = 'images'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUpload(data.publicUrl)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      <div className="flex items-center space-x-4">
        <label className="relative flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
          {uploading ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : (
            <Upload className="mr-2" size={16} />
          )}
          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}
