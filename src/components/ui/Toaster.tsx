import { useToastStore } from '@/store/toastStore'
import type { ToastKind } from '@/store/toastStore'

const styles: Record<ToastKind, string> = {
  success: 'bg-emerald-600',
  error: 'bg-rose-600',
  info: 'bg-teal-600',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`animate-slide-in flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${styles[t.kind]}`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            className="ml-2 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}