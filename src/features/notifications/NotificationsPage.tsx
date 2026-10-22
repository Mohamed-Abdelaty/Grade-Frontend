import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'error' | 'success' | 'warning' | 'info'
  read: boolean
  link?: string
}

export function NotificationsPage() {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Pipeline Run Failed',
      message: 'Pipeline ETL-Sync failed due to database connection timeout.',
      timestamp: '10/20/2026, 9:30:00 PM',
      type: 'error',
      read: false,
      link: '/pipelines',
    },
    {
      id: '2',
      title: 'Pipeline Execution Succeeded',
      message: 'Analytics-Job completed in 42 seconds.',
      timestamp: '10/20/2026, 8:15:00 PM',
      type: 'success',
      read: false,
      link: '/runs/run-99201',
    },
    {
      id: '3',
      title: 'API Key Expiring Soon',
      message: 'Production API Key "prod-key-01" will expire in 3 days.',
      timestamp: '10/19/2026, 2:00:00 PM',
      type: 'warning',
      read: true,
      link: '/api-keys',
    },
  ])

  // تعليم إشعار واحد كمقروء
  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    )
  }

  // تعليم الجميع كمقروء
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  // حذف إشعار واحد
  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  // مسح جميع الإشعارات
  const clearAll = () => {
    setNotifications([])
  }

  // عند الضغط على الإشعار: تعليمه كمقروء والانتقال للرابط الخاص به
  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id)
    }
    if (item.link) {
      navigate(item.link)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-4xl space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Center</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-teal-500/15 px-3 py-0.5 text-xs font-bold text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time pipeline failure alerts and system notifications. Click to navigate.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-teal-200 bg-teal-50/50 px-3.5 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60"
            >
              ✓ Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
            >
              🗑 Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 dark:border-slate-800">
            <p className="text-3xl mb-2">🔔</p>
            <p className="text-sm font-semibold">No notifications available.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const typeStyles = {
              error: {
                badge: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800 dark:text-rose-400',
                indicator: 'bg-rose-500',
                border: 'hover:border-rose-300 dark:hover:border-rose-700',
              },
              success: {
                badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400',
                indicator: 'bg-emerald-500',
                border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
              },
              warning: {
                badge: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400',
                indicator: 'bg-amber-500',
                border: 'hover:border-amber-300 dark:hover:border-amber-700',
              },
              info: {
                badge: 'bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800 dark:text-teal-400',
                indicator: 'bg-teal-500',
                border: 'hover:border-teal-300 dark:hover:border-teal-700',
              },
            }[item.type]

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 shadow-xs ${typeStyles.border} ${
                  item.read
                    ? 'border-slate-200 bg-slate-100/80 dark:border-slate-800/80 dark:bg-slate-900/40'
                    : 'border-teal-500/40 bg-white dark:border-teal-500/40 dark:bg-slate-900'
                }`}
              >
                {/* Indicator Line for Unread */}
                {!item.read && (
                  <span className="absolute top-4 left-0 h-8 w-1 rounded-r-full bg-teal-500 shadow-xs" />
                )}

                <div className="flex items-start gap-3.5 pl-1.5">
                  <span className={`mt-1 flex size-2.5 shrink-0 rounded-full ${typeStyles.indicator}`} />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm tracking-tight ${
                          item.read
                            ? 'font-medium text-slate-700 dark:text-slate-300'
                            : 'font-extrabold text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        • {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.message}
                    </p>

                    {item.link && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 group-hover:underline dark:text-teal-400">
                        Go to resource →
                      </span>
                    )}
                  </div>
                </div>

                {/* Individual Actions (Mark as Read + Delete) */}
                <div className="flex shrink-0 items-center gap-1">
                  {!item.read && (
                    <button
                      type="button"
                      title="Mark as read"
                      onClick={(e) => markAsRead(item.id, e)}
                      className="rounded-lg p-1.5 text-xs font-bold text-slate-400 hover:bg-slate-200/60 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400 transition"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    type="button"
                    title="Delete notification"
                    onClick={(e) => deleteNotification(item.id, e)}
                    className="rounded-lg p-1.5 text-xs font-bold text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}