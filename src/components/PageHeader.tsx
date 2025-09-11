import React from 'react'
import TypeTagline from '@/components/TypeTagline'

interface PageHeaderProps {
  title: string
  actions?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-3">
        <h1
          className="text-xl md:text-2xl font-bold text-orange-600"
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.25)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {actions ? <div className="shrink-0 flex items-center gap-2">{actions}</div> : null}
      </div>
      <TypeTagline />
    </div>
  )
}
