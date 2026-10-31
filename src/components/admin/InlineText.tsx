'use client'

import React, { useRef, useEffect } from 'react'
import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'

interface InlineTextProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  placeholder?: string
  /** allow line breaks (Enter); defaults to true for p/div */
  multiline?: boolean
}

export const InlineText: React.FC<InlineTextProps> = ({
  value,
  onChange,
  className = '',
  element = 'p',
  placeholder = 'Type something...',
  multiline
}) => {
  const { editMode, previewMode } = useWebsiteBuilder()
  const elementRef = useRef<HTMLElement>(null)
  const allowBreaks = multiline ?? (element === 'p' || element === 'div')
  const isEditable = editMode && !previewMode

  // Sync DOM text with value (initial edit-mode mount and undo/redo snapshots)
  useEffect(() => {
    if (isEditable && elementRef.current && elementRef.current.innerText !== (value || '')) {
      elementRef.current.innerText = value || ''
    }
  }, [value, isEditable])

  const CustomTag = element as any
  const breakClass = allowBreaks ? 'whitespace-pre-line' : ''

  if (!isEditable) {
    // Empty fields render nothing for visitors
    if (!value) return null
    return <CustomTag className={`${breakClass} ${className}`}>{value}</CustomTag>
  }

  const handleBlur = () => {
    if (!elementRef.current) return
    const text = elementRef.current.innerText.replace(/ /g, ' ').replace(/\n+$/, '')
    if (text !== (value || '')) onChange(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !allowBreaks) {
      e.preventDefault()
      elementRef.current?.blur()
    }
    if (e.key === 'Escape') {
      if (elementRef.current) elementRef.current.innerText = value || ''
      elementRef.current?.blur()
    }
  }

  // Keep pasted content as plain text
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, allowBreaks ? text : text.replace(/\s*\n\s*/g, ' '))
  }

  return (
    <CustomTag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className={`inline-text-editable outline-none transition-all duration-150 rounded px-1 -mx-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-dashed border-transparent hover:border-blue-400 cursor-text select-text min-w-[2ch] ${breakClass} ${className}`}
    />
  )
}
