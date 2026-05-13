'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ProductSpecs({ specs }: { specs: Record<string, string> }) {
  const [open, setOpen] = useState(true)
  const entries = Object.entries(specs)

  if (entries.length === 0) return null

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-[17px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
      >
        Specifications
        <ChevronDown size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-outline-variant/20">
          {entries.map(([key, value], i) => (
            <div
              key={key}
              className={`flex items-center justify-between px-5 py-3.5 ${i < entries.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
            >
              <span className="text-[13px] text-on-surface-variant">{key}</span>
              <span className="text-[14px] text-on-surface text-right font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
