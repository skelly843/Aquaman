'use client'

import React, { useState } from 'react'
import { InlineText } from '@/components/admin/InlineText'
import { ImageCropperModal } from '@/components/admin/ImageCropperModal'
import { Camera, LayoutList } from 'lucide-react'

interface TextImageBlockProps {
  id: string
  data: any
  editMode: boolean
  onUpdate: (updatedData: any) => void
}

export const TextImageBlock: React.FC<TextImageBlockProps> = ({ id, data, editMode, onUpdate }) => {
  const [showImageCropper, setShowImageCropper] = useState(false)

  const title = data?.title || 'Section Heading'
  const bodyContent = data?.body_content || 'Detailed text paragraph content goes here...'
  const imageUrl = data?.image_url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80'
  const layout = data?.layout || 'text_left'

  const toggleSide = () => {
    onUpdate({ layout: layout === 'text_left' ? 'text_right' : 'text_left' })
  }

  return (
    <div className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-100 relative">
      {editMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
          <button
            type="button"
            onClick={toggleSide}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow"
          >
            <LayoutList size={14} className="text-blue-400" />
            <span>Swap Image Side ({layout === 'text_left' ? 'Right Image' : 'Left Image'})</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className={`space-y-6 ${layout === 'text_right' ? 'lg:order-2' : 'lg:order-1'}`}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              <InlineText
                value={title}
                onChange={(val) => onUpdate({ title: val })}
              />
            </h2>

            <div className="text-base sm:text-lg text-slate-600 leading-relaxed">
              <InlineText
                value={bodyContent}
                onChange={(val) => onUpdate({ body_content: val })}
              />
            </div>
          </div>

          <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 ${layout === 'text_right' ? 'lg:order-1' : 'lg:order-2'}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[350px] sm:h-[450px] object-cover"
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
