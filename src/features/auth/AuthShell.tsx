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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#07070f] font-sans text-slate-100">
      {/* أنيميشن الأشكال الزجاجية العائمة والتوهج */}
      <style>{`
        @keyframes floatRotated1 {
          0%, 100% { transform: translate(0, 0) rotate(-12deg); }
          50% { transform: translate(15px, -20px) rotate(-6deg); }
        }
        @keyframes floatRotated2 {
          0%, 100% { transform: translate(0, 0) rotate(15deg); }
          50% { transform: translate(-20px, 15px) rotate(8deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
        .animate-float-shape-1 { animation: floatRotated1 12s ease-in-out infinite; }
        .animate-float-shape-2 { animation: floatRotated2 15s ease-in-out infinite; }
        .animate-glow-bg { animation: glowPulse 10s ease-in-out infinite; }
      `}</style>

      {/* خلفية التوهج الأرجواني والبنفسجي الداكن */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-glow-bg absolute top-1/4 left-1/6 size-[600px] rounded-full bg-purple-900/30 blur-[150px]" />
        <div className="animate-glow-bg absolute -bottom-20 right-1/4 size-[550px] rounded-full bg-indigo-900/25 blur-[160px]" />
        <div className="animate-glow-bg absolute -top-20 right-10 size-[450px] rounded-full bg-violet-800/20 blur-[140px]" />
      </div>

      {/* الكروت والمربعات الزجاجية العائمة بالحواف المائلة */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-float-shape-1 absolute top-12 left-8 size-48 rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md shadow-2xl" />
        <div className="animate-float-shape-2 absolute bottom-16 left-1/3 size-64 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md shadow-2xl" />
        <div className="animate-float-shape-1 absolute -bottom-10 right-12 size-72 rounded-3xl border border-violet-500/15 bg-violet-500/5 backdrop-blur-md shadow-2xl" />
      </div>

      {/* المخطط الرئيسي (Split Grid) */}
      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-2">
        {/* الجانب الأيسر - Hero Section */}
        <aside className="relative hidden flex-col justify-between p-12 lg:flex">
          {/* اللوجو */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 font-bold text-white text-xl shadow-lg shadow-violet-600/30 transition-transform duration-300 hover:scale-105">
              C
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">ChaosFlow</span>
          </div>

          {/* العنوان والوصف */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
              Build pipelines. <br />
              <span className="bg-linear-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Break them safely.
              </span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Design big data pipelines visually, run them, and watch how they survive controlled
              failures.
            </p>
          </div>

          {/* الفوتر */}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Graduation project
          </p>
        </aside>

        {/* الجانب الأيمن - Form Container */}
        <main className="relative flex items-center justify-center p-6 lg:p-12">
          {/* كارت النموذج الزجاجي الداكن */}
          <div className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-800/80 bg-[#0d0e1a]/85 p-8 shadow-2xl backdrop-blur-2xl">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
              {subtitle && <p className="mt-1 text-sm font-medium text-slate-400">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}