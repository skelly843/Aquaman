'use client'

import React, { useState } from 'react'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { Camera } from 'lucide-react'

interface ImageBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const [showImageCropper, setShowImageCropper] = useState(false)

  const imageUrl = data?.image_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
  const caption = data?.caption || ''

  return (
    <div className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-slate-100">
          <img
            src={imageUrl}
            alt={caption || 'Full width section image'}
            className="w-full h-auto max-h-[500px] object-cover"
          />

          {editMode && (
            <button
              type="button"
              onClick={() => setShowImageCropper(true)}
              className="absolute top-4 right-4 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg backdrop-blur"
            >
              <Camera size={14} className="text-blue-400" />
              <span>Replace Photo</span>
            </button>
          )}
        </div>
      </div>

      {showImageCropper && (
        <ImageCropperModal
          bucket="public-site-images"
          onSave={(url) => {
            onUpdate({ image_url: url })
            setShowImageCropper(false)
          }}
          onClose={() => setShowImageCropper(false)}
        />
      )}
    </div>
  )
}
