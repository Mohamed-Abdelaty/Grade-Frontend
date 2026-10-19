import type { RunStatus } from '@/types/run'

interface StatusBadgeProps {
  status: RunStatus | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase()

  if (normalized === 'running') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">
        <span className="size-1.5 animate-pulse rounded-full bg-sky-500" />
        running
      </span>
    )
  }

  if (normalized === 'success' || normalized === 'succeeded') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        success
      </span>
    )
  }

  if (normalized === 'failed' || normalized === 'failure') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
        <span className="size-1.5 rounded-full bg-rose-500" />
        failed
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
      {status}
    </span>
  )
}