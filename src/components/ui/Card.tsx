import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** تأخير ظهور الكارت بالميلّي ثانية (للـ stagger) */
  delay?: number
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-up group relative rounded-2xl border border-line bg-surface p-5 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10 ${className}`}
    >
      {children}
    </div>
  )
}