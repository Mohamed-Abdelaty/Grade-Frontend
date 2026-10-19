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
      title="Forgot password?"
      subtitle="Enter your email to receive a password reset link"
    >
      {mutation.isSuccess ? (
        <div className="flex flex-col items-center gap-4 text-center animate-fade-up">
          <div className="flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xl font-bold text-emerald-400">
            ✓
          </div>
          <p role="status" className="text-sm font-medium text-slate-300">
            If an account exists for that email, a reset link has been sent.
          </p>
          <Link
            to="/login"
            className="mt-2 text-sm font-bold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
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
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {mutation.error && (
            <p role="alert" className="text-xs font-semibold text-rose-400">
              {mutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            loading={mutation.isPending}
            className="mt-2 w-full bg-indigo-600 font-bold text-white shadow-indigo-600/25 shadow-lg hover:bg-indigo-500 active:scale-[0.98]"
          >
            Send reset link
          </Button>

          <div className="mt-2 text-center text-sm text-slate-400">
            Remembered your password?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  )
}