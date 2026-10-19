import type { ReactNode } from 'react'

type Tone = 'gray' | 'green' | 'red' | 'yellow' | 'blue'

const tones: Record<Tone, string> = {
  gray: 'bg-slate-500/15 text-slate-600 ring-slate-500/20 dark:text-slate-300',
  green: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300',
  red: 'bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300',
  yellow: 'bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300',
  blue: 'bg-sky-500/15 text-sky-700 ring-sky-500/25 dark:text-sky-300',
}

export function Badge({
  tone = 'gray',
  children,
  pulse = false,
}: {
  tone?: Tone
  children: ReactNode
  pulse?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors duration-300 ${tones[tone]}`}
    >
      {pulse && (
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse-ring rounded-full bg-current"
        />
      )}
      {children}
    </span>
  )
}