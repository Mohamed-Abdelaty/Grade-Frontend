import { useState } from 'react'
import type { Schedule } from '@/types/phase2'

const mockSchedules: Schedule[] = [
  {
    id: 'sch-1',
    pipeline_id: 'pipe-101',
    cron: '0 2 * * *',
    timezone: 'Africa/Cairo',
    enabled: true,
    next_run_at: '2026-10-21T02:00:00+02:00',
    last_run_status: 'succeeded',
  },
  {
    id: 'sch-2',
    pipeline_id: 'pipe-102',
    cron: '0 */6 * * *',
    timezone: 'UTC',
    enabled: false,
    next_run_at: '2026-10-21T06:00:00Z',
    last_run_status: 'failed',
  },
]

export function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules)

  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Overview of all automated pipeline triggers and cron schedules.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Pipeline ID</th>
              <th className="px-6 py-4">Cron Expression</th>
              <th className="px-6 py-4">Timezone</th>
              <th className="px-6 py-4">Next Run</th>
              <th className="px-6 py-4">Last Status</th>
              <th className="px-6 py-4 text-right">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {schedule.pipeline_id}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-teal-600 dark:text-teal-400">
                  {schedule.cron}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{schedule.timezone}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {new Date(schedule.next_run_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      schedule.last_run_status === 'succeeded'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {schedule.last_run_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      schedule.enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                        schedule.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}