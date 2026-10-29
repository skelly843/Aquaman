'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface Toast {
  id: number
  kind: 'success' | 'error' | 'info'
  message: string
}

const STYLES: Record<Toast['kind'], string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-900 text-white'
}

export const ToastViewport: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[10002] flex flex-col items-center gap-2 w-[min(92vw,32rem)] pointer-events-none"
      style={{ top: 'calc(var(--editor-toolbar-h, 0px) + 1rem)' }}
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = t.kind === 'success' ? CheckCircle2 : t.kind === 'error' ? AlertCircle : Info
        return (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto w-full rounded-xl shadow-2xl px-4 py-3 text-sm font-semibold flex items-start gap-3 ${STYLES[t.kind]}`}
          >
            <Icon size={18} className="shrink-0 mt-0.5" />
            <span className="flex-1 break-words">{t.message}</span>
            <button type="button" onClick={() => onDismiss(t.id)} className="opacity-80 hover:opacity-100" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
