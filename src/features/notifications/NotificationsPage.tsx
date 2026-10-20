import { useState } from 'react'
import type { NotificationItem } from '@/types/phase2'

const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'run_failed',
    title: 'Pipeline Run Failed',
    body: 'Pipeline ETL-Sync failed due to database connection timeout.',
    run_id: 'run-99',
    read: false,
    created_at: '2026-10-20T18:30:00Z',
  },
  {
    id: 'n-2',
    type: 'run_succeeded',
    title: 'Pipeline Execution Succeeded',
    body: 'Analytics-Job completed in 42 seconds.',
    run_id: 'run-100',
    read: true,
    created_at: '2026-10-20T17:15:00Z',
  },
]

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications)

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time pipeline failure alerts and system notifications.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between rounded-2xl border p-4 transition ${
              item.read
                ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                : 'border-teal-500/30 bg-teal-50/30 dark:border-teal-500/30 dark:bg-slate-900/90'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full ${
                    item.type === 'run_failed' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.body}</p>
              <span className="mt-2 inline-block text-[10px] text-slate-400">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}