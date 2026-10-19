import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
}

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-md shadow-teal-600/20 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-teal-600/35 active:translate-y-0',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-xs hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 active:translate-y-0',
  danger:
    'bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 active:translate-y-0',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
}