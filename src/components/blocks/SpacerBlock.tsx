'use client'

import React from 'react'
import type { BlockProps } from './types'

const SIZES: Record<string, { className: string; label: string }> = {
  sm: { className: 'h-8', label: 'Small' },
  md: { className: 'h-16', label: 'Medium' },
  lg: { className: 'h-32', label: 'Large' }
}
const ORDER = ['sm', 'md', 'lg']

export default function SpacerBlock({ data, editable, update }: BlockProps) {
  const size = SIZES[data.size] ? data.size : 'md'

  return (
    <div className={`${SIZES[size].className} flex items-center justify-center`} aria-hidden={!editable}>
      {editable && (
        <button
          type="button"
          onClick={() => update({ size: ORDER[(ORDER.indexOf(size) + 1) % ORDER.length] })}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full"
        >
          Spacer: {SIZES[size].label} (click to change)
        </button>
      )}
    </div>
  )
}
