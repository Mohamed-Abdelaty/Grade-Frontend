import { useState } from 'react'

export function QualityPage() {
  const [activeTab, setActiveTab] = useState<'ui' | 'accessibility' | 'security'>('ui')

  return (
    <div className="max-w-5xl space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quality & System Standards</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-200">
          Verification of non-functional quality requirements, accessibility standards, theme responsiveness, and security guards.
        </p>
      </div>

      {/* Tabs with Clear Spacing & White Text in Dark Mode */}
      <div className="flex flex-wrap gap-8 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('ui')}
          className={`pb-3 text-sm font-bold transition-all duration-200 border-b-2 cursor-pointer ${
            activeTab === 'ui'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          UI States & Themes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accessibility')}
          className={`pb-3 text-sm font-bold transition-all duration-200 border-b-2 cursor-pointer ${
            activeTab === 'accessibility'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          Accessibility & ARIA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-bold transition-all duration-200 border-b-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          Role Guards & Security
        </button>
      </div>

      {/* Dynamic Content Switching with Hover Animations */}
      <div key={activeTab} className="animate-page-enter grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeTab === 'ui' && (
          <>
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Responsive Layout
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Fluid grid layout adapting down to tablet and mobile screens with a collapsible sidebar menu.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Dark & Light Mode
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Seamless contrast themes using Tailwind dark classes across all Phase 2 views and dialogs.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Empty & Loading States
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Graceful placeholders and skeletons for zero-data scenarios, errors, and background requests.
              </p>
            </div>
          </>
        )}

        {activeTab === 'accessibility' && (
          <>
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Keyboard Accessibility
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Full Tab navigation support and skip-to-content anchor for keyboard-only users.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                ARIA Attributes
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Screen-reader tags (`aria-expanded`, `aria-label`, `role="navigation"`) applied on custom controls.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Color Contrast
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                High contrast text ratios meeting WCAG requirements in both light and dark themes.
              </p>
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Role Guards (Admin)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Restricted routes like Audit Log are protected via AdminGuard and hidden from non-admin users.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Secret Storage Policy
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                API keys and secrets are revealed only once and never saved directly in plaintext local storage.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400/50">
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 text-sm">
                Secure Routes
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                Protected parent route checking auth state before rendering dashboard and features.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}