import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/types/auth'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}