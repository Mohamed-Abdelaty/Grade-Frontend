import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex animate-fade-up flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <div
        aria-hidden="true"
        className="flex size-12 animate-bob items-center justify-center rounded-full bg-brand-soft text-xl text-brand"
      >
        ✦
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}