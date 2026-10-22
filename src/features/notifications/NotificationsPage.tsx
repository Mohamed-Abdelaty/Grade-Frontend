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

  // تعليم الإشعار كمقروء فقط
  const markAsRead = (id: string) => {
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
    e.stopPropagation() // منع جعل الرسالة مقروءة عند الضغط على الحذف
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  // مسح كافة الإشعارات
  const clearAll = () => {
    setNotifications([])
  }

  // الضغط على النص للتوجيه المباشر
  const handleTextClick = (e: React.MouseEvent, link?: string) => {
    e.stopPropagation() // عدم التضارب مع الضغط على الكارت
    if (link) {
      navigate(link)
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
            Click anywhere on a notification to mark as read, or click the text to open the target page.
          </p>
        </div>

        {/* Global Controls - Clear All button is set to White in Dark Mode */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <svg className="size-3.5 text-slate-600 dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 dark:border-slate-800">
            <p className="text-sm font-medium">No notifications available.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const typeStyles = {
              error: {
                indicator: 'bg-rose-500',
              },
              success: {
                indicator: 'bg-emerald-500',
              },
              warning: {
                indicator: 'bg-amber-500',
              },
              info: {
                indicator: 'bg-teal-500',
              },
            }[item.type]

            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`group relative flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  item.read
                    ? 'border-slate-200/80 bg-slate-50/60 dark:border-slate-800/60 dark:bg-slate-900/30'
                    : 'border-teal-500/30 bg-white shadow-xs dark:border-teal-500/30 dark:bg-slate-900'
                }`}
              >
                {/* Side Bar for Unread Status */}
                {!item.read && (
                  <span className="absolute top-4 left-0 h-8 w-1 rounded-r-full bg-teal-500" />
                )}

                <div className="flex items-start gap-3.5 pl-1.5">
                  <span className={`mt-1 flex size-2.5 shrink-0 rounded-full ${typeStyles.indicator}`} />
                  
                  {/* Text Container: Clickable to Navigate */}
                  <div 
                    onClick={(e) => handleTextClick(e, item.link)}
                    className="space-y-1 hover:opacity-80 transition"
                    title={item.link ? 'Click text to open resource' : ''}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm tracking-tight ${
                          item.read
                            ? 'font-medium text-slate-700 dark:text-slate-300'
                            : 'font-bold text-slate-900 dark:text-white'
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
                  </div>
                </div>

                {/* Trash Icon for Single Delete */}
                <button
                  type="button"
                  title="Delete notification"
                  onClick={(e) => deleteNotification(item.id, e)}
                  className="rounded-xl p-2 text-slate-400 opacity-60 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 group-hover:opacity-100"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}