import axios, { AxiosError } from 'axios'

export const TOKEN_KEY = 'chaosflow_token'

export interface ApiError {
  status: number
  message: string
  details?: unknown
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.response?.data?.detail ??
        error.message,
      details: error.response?.data,
    }
    return Promise.reject(apiError)
  },
)