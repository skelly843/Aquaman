'use client'

import React, { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { createClient } from '@/utils/supabase/client'
import {
  X,
  Crop,
  RefreshCw,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'

interface ImageCropperModalProps {
  onSave: (croppedImageUrl: string) => void
  onClose: () => void
  bucket?: string
  /** initial aspect ratio; the admin can still change it */
  aspect?: number
}

const ASPECTS = [
  { label: 'Square (1:1)', val: 1 },
  { label: 'Portrait (4:5)', val: 4 / 5 },
  { label: 'Standard (4:3)', val: 4 / 3 },
  { label: 'Wide (16:9)', val: 16 / 9 },
  { label: 'Banner (3:1)', val: 3 / 1 }
]

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image file.'))
    img.src = src
  })
}

/** Renders the selected crop (with rotation) to a JPEG blob, capped at 2400px wide. */
async function cropToBlob(src: string, area: Area, rotation: number): Promise<Blob> {
  const image = await loadImage(src)
  const rad = (rotation * Math.PI) / 180
  const sin = Math.abs(Math.sin(rad))
  const cos = Math.abs(Math.cos(rad))
  const boundW = image.width * cos + image.height * sin
  const boundH = image.width * sin + image.height * cos

  // Draw the rotated image onto a canvas the size of its bounding box
  const rotated = document.createElement('canvas')
  rotated.width = boundW
  rotated.height = boundH
  const rctx = rotated.getContext('2d')
  if (!rctx) throw new Error('Canvas is not supported in this browser.')
  rctx.translate(boundW / 2, boundH / 2)
  rctx.rotate(rad)
  rctx.drawImage(image, -image.width / 2, -image.height / 2)

  // Copy the cropped area out, scaling down very large images
  const scale = Math.min(1, 2400 / area.width)
  const out = document.createElement('canvas')
  out.width = Math.round(area.width * scale)
  out.height = Math.round(area.height * scale)
  const octx = out.getContext('2d')
  if (!octx) throw new Error('Canvas is not supported in this browser.')
  octx.drawImage(rotated, area.x, area.y, area.width, area.height, 0, 0, out.width, out.height)

  return new Promise((resolve, reject) =>
    out.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the cropped image.'))), 'image/jpeg', 0.88)
  )
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  onSave,
  onClose,
  bucket = 'public-site-images',
  aspect: initialAspect = 16 / 9
}) => {
  const supabase = createClient()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState<number>(initialAspect)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG or WEBP).')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.addEventListener('load', () => setImageSrc(reader.result as string))
    reader.readAsDataURL(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) readFile(e.target.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) readFile(e.dataTransfer.files[0])
  }

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleCropAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      setUploading(true)
      setError(null)
      const blob = await cropToBlob(imageSrc, croppedAreaPixels, rotation)
      const filePath = `page-editor/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onSave(data.publicUrl)
      onClose()
    } catch (err: any) {
      setError(`Upload failed: ${err?.message || err}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[10001] flex items-center justify-center p-4 select-none text-left">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0 bg-slate-950 text-white">
          <h3 className="font-bold text-sm flex items-center">
            <Crop className="mr-2 text-blue-500" size={16} />
            <span>Replace photo</span>
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!imageSrc ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 rounded-2xl h-80 flex flex-col items-center justify-center text-slate-400 p-8 space-y-4 hover:border-blue-500 hover:bg-slate-800/20 transition-all relative"
            >
              <ImageIcon size={48} className="text-slate-500" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-200">Drag & drop an image here</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP</p>
              </div>
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer">
                <span>Browse files</span>
                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative h-80 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ASPECTS.map((opt) => (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => setAspect(opt.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          Math.abs(aspect - opt.val) < 0.001
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Zoom</span>
                      <span>{zoom.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Rotate</span>
                      <span>{rotation}°</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-950/60 border border-red-900 px-4 py-3 text-xs font-semibold text-red-200">
              <AlertCircle size={16} className="shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 shrink-0 bg-slate-950 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setImageSrc(null)}
            disabled={!imageSrc}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20"
          >
            <RefreshCw size={14} />
            <span>Choose another</span>
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropAndUpload}
              disabled={!imageSrc || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={14} /> : <Crop size={14} />}
              <span>{uploading ? 'Uploading...' : 'Crop & use photo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
