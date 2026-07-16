'use client'

import React, { useRef, useEffect } from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'

interface InlineTextProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  placeholder?: string
}

export const InlineText: React.FC<InlineTextProps> = ({
  value,
  onChange,
  className = '',
  element = 'p',
  placeholder = 'Type something...'
}) => {
  const { editMode, previewMode } = useWebsiteBuilder()
  const elementRef = useRef<HTMLDivElement>(null)

  // Sync ref text with value updates from undo/redo snaps
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value || ''
    }
  }, [value])

  const isEditable = editMode && !previewMode

  const handleBlur = () => {
    if (elementRef.current) {
      const text = elementRef.current.innerText
      onChange(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default line breaks on short headers
    if (e.key === 'Enter' && element !== 'p' && element !== 'div') {
      e.preventDefault()
      if (elementRef.current) elementRef.current.blur()
    }
  }

  const CustomTag = element as any

  if (!isEditable) {
    return (
      <CustomTag className={className}>
        {value || <span className="opacity-40 italic">{placeholder}</span>}
      </CustomTag>
    )
  }

  return (
    <CustomTag
      ref={elementRef}
      contentEditable={true}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning={true}
      className={`outline-none transition-all duration-150 rounded px-1 -mx-1 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-500 border border-transparent hover:border-blue-400 cursor-text select-text ${className}`}
      placeholder={placeholder}
    />
  )
}
