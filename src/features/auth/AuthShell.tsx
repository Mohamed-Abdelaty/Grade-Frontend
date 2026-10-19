import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes floatRotated1 {
          0%, 100% { transform: translate(0, 0) rotate(-12deg); }
          50% { transform: translate(25px, -30px) rotate(-4deg); }
        }
        @keyframes floatRotated2 {
          0%, 100% { transform: translate(0, 0) rotate(15deg); }
          50% { transform: translate(-30px, 25px) rotate(5deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        .animate-float-shape-1 { animation: floatRotated1 6s ease-in-out infinite; }
        .animate-float-shape-2 { animation: floatRotated2 7.5s ease-in-out infinite; }
        .animate-glow-bg { animation: glowPulse 5s ease-in-out infinite; }
      `}</style>

      {/* زر تبديل الثيم المثبت في أعلى الشاشة */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* خلفية التوهج الداعمة للوضع الفاتح والداكن (Teal / Cyan / Emerald) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-glow-bg absolute top-1/4 left-1/6 size-[600px] rounded-full bg-teal-300/35 blur-[140px] dark:bg-teal-900/25" />
        <div className="animate-glow-bg absolute -bottom-20 right-1/4 size-[550px] rounded-full bg-cyan-300/30 blur-[150px] dark:bg-cyan-900/20" />
        <div className="animate-glow-bg absolute -top-20 right-10 size-[450px] rounded-full bg-emerald-300/35 blur-[130px] dark:bg-emerald-900/20" />
      </div>

      {/* المربعات المتحركة الجمالية في الخلفية */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-float-shape-1 absolute top-12 left-8 size-48 rounded-3xl border border-teal-300/60 bg-gradient-to-br from-teal-400/20 via-emerald-300/15 to-cyan-400/20 backdrop-blur-md shadow-xl shadow-teal-200/40 dark:border-teal-800/40 dark:shadow-none" />
        <div className="animate-float-shape-2 absolute bottom-16 left-1/3 size-64 rounded-3xl border border-cyan-300/60 bg-gradient-to-br from-cyan-400/20 via-teal-300/15 to-emerald-400/20 backdrop-blur-md shadow-xl shadow-cyan-200/40 dark:border-cyan-800/40 dark:shadow-none" />
        <div className="animate-float-shape-1 absolute -bottom-10 right-12 size-72 rounded-3xl border border-emerald-300/60 bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-cyan-300/20 backdrop-blur-md shadow-xl shadow-emerald-200/40 dark:border-emerald-800/40 dark:shadow-none" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-2">
        {/* الجانب الأيسر: الشعار والمقدمة */}
        <aside className="relative hidden flex-col justify-between p-12 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 font-bold text-white text-xl shadow-lg shadow-teal-600/25 transition-transform duration-300 hover:scale-105">
              C
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              ChaosFlow
            </span>
          </div>

          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight dark:text-slate-100">
              Build pipelines. <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400">
                Break them safely.
              </span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed dark:text-slate-400">
              Design big data pipelines visually, run them, and watch how they survive controlled failures.
            </p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Graduation project
          </p>
        </aside>

        {/* الجانب الأيمن: الكارت المحتوي على الفورم (Login / Register / Forgot Password) */}
        <main className="relative flex items-center justify-center p-6 lg:p-12">
          <div className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}