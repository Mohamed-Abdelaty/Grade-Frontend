import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { PipelineBuilderPage } from '@/features/pipeline-builder/PipelineBuilderPage'
import { PipelinesPage } from '@/features/pipelines/PipelinesPage'
import { RunDetailsPage } from '@/features/runs/RunDetailsPage'
import { Placeholder } from './Placeholder'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <Placeholder title="Forgot password" /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/pipelines', element: <PipelinesPage /> },
          { path: '/pipelines/:id/edit', element: <PipelineBuilderPage /> },
          { path: '/runs/:id', element: <RunDetailsPage /> },
        ],
      },
    ],
  },
])