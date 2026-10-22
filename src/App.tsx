import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { PipelinesPage } from '@/features/pipelines/PipelinesPage'

// Phase 2 Real Components
import { ApiKeysPage } from '@/features/api-keys/ApiKeysPage'
import { SchedulesPage } from '@/features/schedules/SchedulesPage'
import { TemplatesPage } from '@/features/templates/TemplatesPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import { AuditLogPage } from '@/features/audit-log/AuditLogPage'
import { HistoryPage } from '@/features/history/HistoryPage'

// Phase 2 Preferences Placeholder
const NotificationPreferencesPage = () => (
  <div className="p-6 font-bold text-slate-900 dark:text-white">Notification Preferences Page</div>
)

// Admin Guard Component
function AdminGuard({ children }: { children: ReactNode }) {
  const userRole = localStorage.getItem('user_role') || 'admin'

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected App Routes with Relative Pathing to prevent 404s */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pipelines" element={<PipelinesPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/preferences" element={<NotificationPreferencesPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route
            path="audit-log"
            element={
              <AdminGuard>
                <AuditLogPage />
              </AdminGuard>
            }
          />
        </Route>

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}