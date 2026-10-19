import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/auth'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from './AuthShell'
import { loginSchema } from './schemas'
import type { LoginForm } from './schemas'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation<Awaited<ReturnType<typeof login>>, ApiError, LoginForm>({
    mutationFn: login,
    onSuccess: (res) => {
      setSession(res)
      navigate(from, { replace: true })
    },
  })

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your ChaosFlow workspace">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="re@gmail.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {mutation.error && (
          <div
            role="alert"
            className="animate-shake rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400"
          >
            {mutation.error.message}
          </div>
        )}

        <Button
          type="submit"
          loading={mutation.isPending}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 py-3.5 font-bold text-sm text-white shadow-lg shadow-teal-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-500 hover:shadow-teal-600/40 active:translate-y-0 disabled:opacity-60"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs font-semibold">
        <Link
          to="/forgot-password"
          className="font-bold !text-teal-600 transition hover:!text-teal-700 hover:underline dark:!text-teal-400 dark:hover:!text-teal-300"
        >
          Forgot password?
        </Link>
        <Link
          to="/register"
          style={{ color: '#14b8a6', textDecorationColor: '#14b8a6' }}
          className="font-bold !text-[#14b8a6]  transition-opacity hover:opacity-80 dark:!text-[#14b8a6]"
        >
          Create account
        </Link>
      </div>
    </AuthShell>
  )
}