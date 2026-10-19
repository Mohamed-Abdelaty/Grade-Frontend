import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/api/auth'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToastStore } from '@/store/toastStore'
import { AuthShell } from './AuthShell'
import { resetSchema } from './schemas'
import type { ResetForm } from './schemas'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const mutation = useMutation<void, ApiError, ResetForm>({
    mutationFn: ({ password }) => resetPassword(token, password),
    onSuccess: () => {
      useToastStore.getState().show('success', 'Password updated. Please sign in.')
      navigate('/login', { replace: true })
    },
  })

  return (
    <AuthShell title="Reset your password" subtitle="Choose a new password for your account">
      {!token ? (
        <p role="alert" className="text-sm text-rose-500">
          This reset link is invalid or has expired.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {mutation.error && (
            <p role="alert" className="text-sm text-rose-500">
              {mutation.error.message}
            </p>
          )}
          <Button type="submit" loading={mutation.isPending}>
            Update password
          </Button>
        </form>
      )}

      <Link to="/login" className="text-sm text-brand hover:underline">
        Back to sign in
      </Link>
    </AuthShell>
  )
}