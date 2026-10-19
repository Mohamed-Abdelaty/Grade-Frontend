export type Role = 'admin' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}