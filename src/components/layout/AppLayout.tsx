import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
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
    <div className="relative flex min-h-screen bg-[#070b14] font-sans text-slate-100">
      {/* أنيميشن مخصص للصفحة والقوائم */}
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes logoPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.25);
          }
          50% {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.45);
          }
        }
        .animate-page-enter {
          animation: pageFadeIn 0.35s ease-out forwards;
        }
        .animate-slide-item {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        .animate-logo-glow {
          animation: logoPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar الكحلي الفاخر */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-800/80 bg-[#0d1527] p-5 shadow-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Title */}
        <div className="mb-8 flex items-center gap-3 px-1">
          <div
            aria-hidden="true"
            className="animate-logo-glow flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-violet-600 font-bold text-lg text-white shadow-lg transition-transform duration-300 hover:rotate-6 hover:scale-110"
          >
            C
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight text-white">ChaosFlow</div>
            <div className="text-xs font-medium text-slate-400">Resilient pipelines</div>
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
                `animate-slide-item relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  isActive
                    ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300 shadow-indigo-500/10 shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* شريط المربعات المضيء عند الاختيار */}
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-indigo-400 shadow-sm shadow-indigo-400" />
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
          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 shadow-inner backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90">
            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-cyan-400 to-indigo-500 font-bold text-sm text-white shadow-md transition-transform duration-300 hover:scale-105"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">{user.name}</div>
              <div className="text-xs text-slate-400 capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-800/80 bg-[#070b14]/80 px-4 backdrop-blur-md lg:px-8">
          <Button
            variant="secondary"
            className="border-slate-800 bg-slate-900 text-slate-200 transition-colors duration-200 hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-95"
            >
              Log out
            </Button>
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