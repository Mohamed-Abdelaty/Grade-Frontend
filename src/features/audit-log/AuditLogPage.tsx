import type { AuditEvent } from '@/types/phase2'

const mockAuditEvents: AuditEvent[] = [
  {
    id: 'aud-1',
    actor: 'admin@chaosflow.io',
    action: 'pipeline.update',
    target_type: 'pipeline',
    target_id: 'pipe-101',
    ip: '192.168.1.1',
    created_at: '2026-10-20T19:00:00Z',
  },
  {
    id: 'aud-2',
    actor: 'developer@chaosflow.io',
    action: 'apikey.create',
    target_type: 'apikey',
    target_id: 'key-55',
    ip: '10.0.0.12',
    created_at: '2026-10-20T16:22:00Z',
  },
]

export function AuditLogPage() {
  const exportCSV = () => {
    alert('Exporting Audit Logs to CSV file...')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Log (Admin Only)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            System security actions, user activities, and modifications history.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-500"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target Type</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {mockAuditEvents.map((event) => (
              <tr key={event.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{event.actor}</td>
                <td className="px-6 py-4 font-mono text-xs text-teal-600 dark:text-teal-400">{event.action}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{event.target_type}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{event.ip}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {new Date(event.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}