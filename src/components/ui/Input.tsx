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
        {/* عنوان الحقل: يظهر باللون الأبيض الناصع في الوضع الداكن */}
        <label
          htmlFor={id}
          className="text-xs font-bold text-slate-700 dark:text-white"
        >
          {label}
        </label>

        {/* حقل الإدخال: دعم الخلفيات، الحدود، والنصوص للـ Dark Mode والـ Teal Focus */}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:text-slate-900 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:text-white ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-rose-500'
              : 'border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-800 dark:focus:border-teal-400 dark:focus:ring-teal-400/20'
          } ${className}`}
          {...props}
        />

        {/* رسالة الخطأ */}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-fade-up"
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'