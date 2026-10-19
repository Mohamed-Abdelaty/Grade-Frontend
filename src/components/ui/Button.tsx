import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
}

const styles: Record<Variant, string> = {
  primary:
    'bg-linear-to-r from-from to-to text-white shadow-md shadow-teal-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30',
  secondary:
    'border border-line bg-surface text-fg hover:-translate-y-0.5 hover:bg-surface-2',
  danger:
    'bg-rose-600 text-white shadow-md shadow-rose-500/25 hover:-translate-y-0.5 hover:bg-rose-500',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition duration-200 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-app disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}
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