import { useAuthStore } from '@/store/authStore'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  // إحصائيات الاستخدام والعمليات للمستخدم
  const userStats = {
    totalPipelines: 12,
    totalProcessings: 148,
    activeSchedules: 4,
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-3xl px-4 py-8 animate-page-enter space-y-8">
        
        {/* 1. Header & Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            User Profile
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Personal registration details and pipeline execution metrics
          </p>
        </div>

        {/* 2. Avatar & Registration Summary */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-4xl font-extrabold text-white shadow-md shadow-teal-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              type="button"
              title="Edit avatar"
              className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-md transition hover:scale-110 hover:bg-teal-700 cursor-pointer"
            >
              ✏
            </button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            {user?.name || 'Demo User'}
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {user?.email || `${user?.name?.toLowerCase().replace(/\s+/g, '') || 'admin'}@chaosflow.io`}
          </span>
        </div>

        {/* 3. User Pipelines & Processing Stats (الارقام بالاسود) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Pipelines
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {userStats.totalPipelines}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Processings
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {userStats.totalProcessings}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Schedules
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {userStats.activeSchedules}
            </p>
          </div>
        </div>

        {/* 4. Registration Data Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Registration Information
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 dark:border-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Account
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Full Name
              </span>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || 'Demo User'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Email Address
              </span>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {user?.email || `${user?.name?.toLowerCase().replace(/\s+/g, '') || 'admin'}@chaosflow.io`}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Account Role
              </span>
              <p className="mt-1 text-sm font-bold text-teal-600 dark:text-teal-400 capitalize">
                {user?.role || 'Admin'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Account Status
              </span>
              <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Active Session
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}