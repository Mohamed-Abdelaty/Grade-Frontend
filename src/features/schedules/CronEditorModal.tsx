import { useState } from 'react'

interface CronEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (cron: string, timezone: string) => void
  initialCron?: string
  initialTimezone?: string
}

export function CronEditorModal({
  isOpen,
  onClose,
  onSave,
  initialCron = '0 2 * * *',
  initialTimezone = 'Africa/Cairo',
}: CronEditorModalProps) {
  const [cron, setCron] = useState(initialCron)
  const [timezone, setTimezone] = useState(initialTimezone)

  if (!isOpen) return null

  // معاينة المواعيد القادمة الحية (Mock preview)
  const nextRunsPreview = [
    '2026-10-21 02:00:00',
    '2026-10-22 02:00:00',
    '2026-10-23 02:00:00',
    '2026-10-24 02:00:00',
    '2026-10-25 02:00:00',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(cron, timezone)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Pipeline Schedule</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Set up automated execution triggers using Cron syntax.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Cron Expression</label>
            <input
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              required
              placeholder="e.g. 0 2 * * *"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm font-semibold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-400">Format: Minute Hour Day-of-Month Month Day-of-Week</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="Africa/Cairo">Africa/Cairo (UTC+2)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-50/50 p-4 dark:border-teal-500/20 dark:bg-slate-950">
            <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400">📅 Upcoming 5 Scheduled Runs</h4>
            <ul className="mt-2 space-y-1 font-mono text-xs text-slate-600 dark:text-slate-300">
              {nextRunsPreview.map((time, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-teal-500" />
                  {time} ({timezone})
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}