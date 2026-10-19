import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId()
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-xs font-bold text-slate-700">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:text-slate-900 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15'
              : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/15'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-rose-600 animate-fade-up">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'