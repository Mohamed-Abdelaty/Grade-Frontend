import type { ReactNode } from 'react'

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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 font-sans text-slate-900">
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

      {/* توهج خلفية أزرق وسماوي */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-glow-bg absolute top-1/4 left-1/6 size-[600px] rounded-full bg-blue-300/45 blur-[140px]" />
        <div className="animate-glow-bg absolute -bottom-20 right-1/4 size-[550px] rounded-full bg-sky-300/40 blur-[150px]" />
        <div className="animate-glow-bg absolute -top-20 right-10 size-[450px] rounded-full bg-indigo-300/45 blur-[130px]" />
      </div>

      {/* مربعات متحركة زرقاء وسماوية */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-float-shape-1 absolute top-12 left-8 size-48 rounded-3xl border border-blue-300/80 bg-gradient-to-br from-blue-400/25 via-indigo-300/20 to-sky-400/25 backdrop-blur-md shadow-xl shadow-blue-200/60" />
        <div className="animate-float-shape-2 absolute bottom-16 left-1/3 size-64 rounded-3xl border border-sky-300/80 bg-gradient-to-br from-sky-400/25 via-blue-300/20 to-indigo-400/25 backdrop-blur-md shadow-xl shadow-sky-200/60" />
        <div className="animate-float-shape-1 absolute -bottom-10 right-12 size-72 rounded-3xl border border-indigo-300/80 bg-gradient-to-br from-indigo-400/25 via-blue-300/20 to-sky-300/25 backdrop-blur-md shadow-xl shadow-indigo-200/60" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between p-12 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 font-bold text-white text-xl shadow-lg shadow-blue-600/25 transition-transform duration-300 hover:scale-105">
              C
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">ChaosFlow</span>
          </div>

          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Build pipelines. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Break them safely.
              </span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Design big data pipelines visually, run them, and watch how they survive controlled failures.
            </p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Graduation project
          </p>
        </aside>

        <main className="relative flex items-center justify-center p-6 lg:p-12">
          <div className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
              {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}