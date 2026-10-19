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
            className="animate-shake rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400"
          >
            {mutation.error.message}
          </div>
        )}

        <Button
          type="submit"
          loading={mutation.isPending}
          className="mt-2 w-full rounded-xl bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 py-3.5 font-bold text-sm text-white shadow-lg shadow-purple-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-purple-600/40 active:translate-y-0 disabled:opacity-60"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs font-semibold">
        <span className="text-xs font-medium text-slate-500 cursor-default select-none">
  Forgot password?
</span>
        <Link
          to="/register"
          className="text-violet-400 transition hover:text-violet-300 hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthShell>
  )
}