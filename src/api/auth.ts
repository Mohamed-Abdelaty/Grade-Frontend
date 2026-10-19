import { api } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth'

export async function login(body: LoginRequest): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', body)
    return data
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      console.warn('Backend server unavailable or returned error. Falling back to dev mock login.')
      return {
        token: 'mock-jwt-auth-token-123456',
        user: {
          id: 'usr_123',
          name: 'Demo User',
          email: body.email,
          role: 'admin',
        },
      }
    }
    throw error
  }
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', body)
    return data
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      return {
        token: 'mock-jwt-auth-token-123456',
        user: {
          id: 'usr_123',
          name: body.name || 'New User',
          email: body.email,
          role: 'user',
        },
      }
    }
    throw error
  }
}

export async function fetchMe(): Promise<User> {
  try {
    const { data } = await api.get<User>('/auth/me')
    return data
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      return {
        id: 'usr_123',
        name: 'Demo User',
        email: 're@gmail.com',
        role: 'admin',
      }
    }
    throw error
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await api.post('/auth/forgot-password', { email })
  } catch (error: unknown) {
    if (import.meta.env.DEV) return
    throw error
  }
}

export async function resetPassword(token: string, password: string): Promise<void> {
  try {
    await api.post('/auth/reset-password', { token, password })
  } catch (error: unknown) {
    if (import.meta.env.DEV) return
    throw error
  }
}