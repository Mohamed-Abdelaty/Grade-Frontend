import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      aria-label="Toggle theme"
      className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-base shadow-xs transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-slate-800"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}