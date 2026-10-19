import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Role } from '@/types/auth'

interface NavItem {
  to: string
  label: string
  icon: string
  roles?: Role[]
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '◧' },
  { to: '/pipelines', label: 'Pipelines', icon: '⎇' },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const visible = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  )

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* أنيميشن مدمج داخل الكود ليعمل على أي جهاز تلقائياً */}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatRotated1 {
          0%, 100% { transform: translate(0, 0) rotate(-12deg) scale(1); }
          50% { transform: translate(35px, -40px) rotate(-3deg) scale(1.08); }
        }
        @keyframes floatRotated2 {
          0%, 100% { transform: translate(0, 0) rotate(15deg) scale(1); }
          50% { transform: translate(-40px, 35px) rotate(4deg) scale(1.05); }
        }
        @keyframes floatRotated3 {
          0%, 100% { transform: translate(0, 0) rotate(45deg) scale(1); }
          50% { transform: translate(25px, 30px) rotate(60deg) scale(1.1); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.2); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(13, 148, 136, 0.25); }
          50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.45); }
        }

        .animate-page-enter { animation: pageFadeIn 0.35s ease-out forwards; }
        .animate-slide-item { animation: slideInLeft 0.4s ease-out forwards; }
        .animate-float-shape-1 { animation: floatRotated1 6.5s ease-in-out infinite; }
        .animate-float-shape-2 { animation: floatRotated2 8s ease-in-out infinite; }
        .animate-float-shape-3 { animation: floatRotated3 7s ease-in-out infinite; }
        .animate-glow-bg { animation: glowPulse 5.5s ease-in-out infinite; }
        .animate-logo-glow { animation: logoPulse 4s ease-in-out infinite; }
      `}</style>

      {/* أشكال الأضواء والأشكال العائمة المدمجة */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-glow-bg absolute -top-24 left-1/4 size-[550px] rounded-full bg-teal-300/35 blur-[140px] dark:bg-teal-900/20" />
        <div className="animate-glow-bg absolute -bottom-24 right-1/4 size-[600px] rounded-full bg-cyan-300/30 blur-[150px] dark:bg-cyan-900/20" />
        <div className="animate-glow-bg absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/25 blur-[130px] dark:bg-emerald-900/15" />

        <div className="animate-float-shape-1 absolute top-16 left-72 size-48 rounded-3xl border border-teal-300/60 bg-gradient-to-br from-teal-400/20 via-emerald-300/15 to-cyan-400/20 backdrop-blur-md shadow-lg shadow-teal-200/40 dark:border-teal-700/40 dark:from-teal-900/20 dark:shadow-none" />
        <div className="animate-float-shape-2 absolute bottom-20 right-16 size-64 rounded-3xl border border-cyan-300/60 bg-gradient-to-br from-cyan-400/20 via-sky-300/15 to-teal-400/20 backdrop-blur-md shadow-lg shadow-cyan-200/40 dark:border-cyan-700/40 dark:from-cyan-900/20 dark:shadow-none" />
        <div className="animate-float-shape-3 absolute top-1/3 right-1/3 size-36 rounded-2xl border border-emerald-300/50 bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-cyan-300/20 backdrop-blur-md shadow-md shadow-emerald-200/30 dark:border-emerald-700/40 dark:from-emerald-900/20 dark:shadow-none" />
      </div>

      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-teal-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar القائمة الجانبية */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-slate-800/80 dark:bg-slate-900/90 lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-1">
          <div
            aria-hidden="true"
            className="animate-logo-glow flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 font-bold text-lg text-white shadow-lg shadow-teal-600/20 transition-transform duration-300 hover:rotate-6 hover:scale-110"
          >
            C
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">ChaosFlow</div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">Resilient pipelines</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav aria-label="Main navigation" className="flex flex-col gap-2">
          {visible.map((item, i) => (
            <NavLink
              key={item.to}
              style={{ animationDelay: `${100 + i * 80}ms` }}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `animate-slide-item relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  isActive
                    ? 'border border-teal-200/80 bg-teal-50 text-teal-700 shadow-xs font-bold dark:border-teal-800/60 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'text-slate-600 hover:bg-teal-50/60 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-teal-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-teal-600 shadow-xs" />
                  )}
                  <span aria-hidden="true" className="text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Card */}
        {user && (
          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 shadow-xs transition-all duration-200 hover:border-teal-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800">
            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 font-bold text-sm text-white shadow-xs transition-transform duration-300 hover:scale-105"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
              <div className="text-xs font-medium text-slate-400 capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Content Area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-xs transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-slate-800 active:scale-95 lg:hidden"
          >
            ☰
          </button>

          {/* أدوات الهيدر: زر تغيير الثيم وزر تسجيل الخروج */}
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-slate-800 active:scale-95"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Page Container */}
        <main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="animate-page-enter flex-1 p-4 focus:outline-none lg:p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}