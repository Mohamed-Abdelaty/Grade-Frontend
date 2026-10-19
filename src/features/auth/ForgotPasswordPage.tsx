import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '@/api/auth'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthShell } from './AuthShell'
import { forgotSchema } from './schemas'
import type { ForgotForm } from './schemas'

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) })

  const mutation = useMutation<void, ApiError, ForgotForm>({
    mutationFn: ({ email }) => forgotPassword(email),
  })

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your name and email address to reset your password"
    >
      {mutation.isSuccess ? (
        <div className="flex flex-col items-center gap-4 text-center animate-fade-up">
          <div className="flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            ✓
          </div>
          <p role="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            If an account exists for that email, a password reset link has been sent.
          </p>
          <Link
            to="/login"
            className="mt-2 text-sm font-extrabold text-teal-600 transition-colors hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
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
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {mutation.error && (
            <p role="alert" className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {mutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            loading={mutation.isPending}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 py-3.5 font-bold text-sm text-white shadow-lg shadow-teal-600/25 hover:from-teal-500 hover:to-cyan-500 active:scale-[0.98]"
          >
            Send Reset Link
          </Button>

          <div className="mt-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            Remembered your password?{' '}
            <Link
              to="/login"
              className="font-extrabold text-teal-600 transition-colors hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  )
}