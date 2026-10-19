import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { register as registerApi } from '@/api/auth'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from './AuthShell'
import { registerSchema } from './schemas'
import type { RegisterForm } from './schemas'

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const mutation = useMutation<Awaited<ReturnType<typeof registerApi>>, ApiError, RegisterForm>({
    mutationFn: registerApi,
    onSuccess: (res) => {
      setSession(res)
      navigate('/', { replace: true })
    },
  })

  return (
    <AuthShell title="Create your account" subtitle="Start building resilient pipelines today">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {mutation.error && (
          <div
            role="alert"
            className="animate-shake rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600"
          >
            {mutation.error.message}
          </div>
        )}

        {/* زر إنشاء الحساب بنفس لون وزر صفحة الـ Login */}
        <Button
          type="submit"
          loading={mutation.isPending}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 py-3.5 font-bold text-sm text-white shadow-lg shadow-teal-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-500 hover:shadow-teal-600/40 active:translate-y-0 disabled:opacity-60"
        >
          Create account
        </Button>
      </form>

      {/* رابط Sign in باللون الأسود */}
     <div className="mt-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-teal-600 underline underline-offset-4 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  )
}