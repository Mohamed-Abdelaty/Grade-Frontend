import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LoginPage } from './LoginPage'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  it('shows validation errors when submitted empty', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
    
    // التحقق من رسائل الخطأ عند ترك الحقول فارغة
    expect(await screen.findByText(/email is required|enter a valid email/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password must be at least 8 characters|password is required/i),
    ).toBeInTheDocument()
  })

  it('rejects an invalid email', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
  })

  it('renders forgot password and create account links properly', () => {
    renderPage()

    const forgotLink = screen.getByRole('link', { name: /forgot password\?/i })
    const createAccountLink = screen.getByRole('link', { name: /create account/i })

    expect(forgotLink).toBeInTheDocument()
    expect(forgotLink).toHaveAttribute('href', '/forgot-password')

    expect(createAccountLink).toBeInTheDocument()
    expect(createAccountLink).toHaveAttribute('href', '/register')
  })
})