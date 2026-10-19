import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { register as registerApi } from '@/api/auth'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
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

  // كلاس موحد لحقول الإدخال باللون الأبيض الناصع
  const whiteInputClass =
    'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* أنيميشن حركة المربعات والتوهج */}
      <style>{`
        @keyframes floatSquare1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(45px, -55px) rotate(25deg) scale(1.1); }
        }
        @keyframes floatSquare2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-50px, 40px) rotate(-20deg) scale(1.05); }
        }
        @keyframes floatSquare3 {
          0%, 100% { transform: translate(0, 0) rotate(45deg) scale(1); }
          50% { transform: translate(35px, 45px) rotate(70deg) scale(1.12); }
        }
        @keyframes floatSquare4 {
          0%, 100% { transform: translate(0, 0) rotate(12deg) scale(1); }
          50% { transform: translate(-30px, -40px) rotate(-15deg) scale(0.95); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.2); }
        }

        .square-float-1 { animation: floatSquare1 12s ease-in-out infinite; }
        .square-float-2 { animation: floatSquare2 15s ease-in-out infinite; }
        .square-float-3 { animation: floatSquare3 10s ease-in-out infinite; }
        .square-float-4 { animation: floatSquare4 14s ease-in-out infinite; }
        .glow-pulse { animation: pulseGlow 8s ease-in-out infinite; }
      `}</style>

      {/* 1. خلفية مع بقع إضاءة متوهجة عريضة */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="glow-pulse absolute -top-32 -left-32 size-[600px] rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="glow-pulse absolute -bottom-32 -right-32 size-[650px] rounded-full bg-violet-500/15 blur-[150px]" />
        <div className="glow-pulse absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      {/* 2. المربعات المتحركة الزجاجية في الخلفية */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* مربع 1: أعلى اليسار */}
        <div className="square-float-1 absolute top-16 left-12 size-32 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 backdrop-blur-md shadow-2xl shadow-indigo-500/10" />

        {/* مربع 2: أسفل اليمين */}
        <div className="square-float-2 absolute bottom-20 right-16 size-44 rounded-3xl border border-purple-400/20 bg-purple-500/10 backdrop-blur-md shadow-2xl shadow-purple-500/10" />

        {/* مربع 3: المنتصف/أعلى اليمين */}
        <div className="square-float-3 absolute top-1/4 right-1/3 size-24 rounded-2xl border border-violet-400/25 bg-violet-500/10 backdrop-blur-md shadow-xl shadow-violet-500/10" />

        {/* مربع 4: أسفل اليسار */}
        <div className="square-float-4 absolute bottom-1/4 left-1/4 size-36 rounded-3xl border border-indigo-300/15 bg-indigo-400/5 backdrop-blur-md shadow-2xl shadow-indigo-400/5" />
      </div>

      {/* 3. المحتوى الرئيسي فوق الخلفية الموحدة */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        
        {/* الجانب الأيسر: شعار ونصوص ChaosFlow */}
        <aside className="flex flex-col justify-between p-8 lg:p-16">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 font-bold text-white text-xl shadow-lg shadow-indigo-500/30 transition duration-300 hover:rotate-6 hover:scale-110">
              C
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ChaosFlow</span>
          </div>

          <div className="my-auto py-12">
            <h2 className="animate-fade-up text-4xl font-extrabold leading-tight text-white lg:text-5xl">
              Build pipelines. <br />
              <span className="bg-linear-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                Break them safely.
              </span>
            </h2>
            <p className="animate-fade-up mt-6 max-w-md text-base text-slate-400 leading-relaxed" style={{ animationDelay: '150ms' }}>
              Design big data pipelines visually, run them seamlessly, and watch how they survive controlled failures in real time.
            </p>
          </div>

          <p className="animate-fade-up text-sm font-medium text-slate-500" style={{ animationDelay: '300ms' }}>
            Graduation project
          </p>
        </aside>

        {/* الجانب الأيمن: نموذج التسجيل */}
        <main className="flex items-center justify-center p-6 lg:p-12">
          <div className="animate-fade-up w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="mt-1 text-sm text-slate-400">Start building resilient pipelines today</p>
            </div>

            <form
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              className="flex flex-col gap-4"
              noValidate
            >
              {/* Name Input */}
              <Input
                label="Name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={whiteInputClass}
                error={errors.name?.message}
                {...register('name')}
              />

              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={whiteInputClass}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={whiteInputClass}
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Confirm Password Input */}
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={whiteInputClass}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {/* Error Alert */}
              {mutation.error && (
                <p role="alert" className="animate-shake text-sm font-medium text-rose-400">
                  {mutation.error.message}
                </p>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  loading={mutation.isPending}
                  className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.98]"
                >
                  Create account
                </Button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}