import { useState } from 'react'

export function NotificationPreferencesPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/xxx/yyy/zzz')
  const [onFailureOnly, setOnFailureOnly] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Notification preferences saved successfully!')
  }

  return (
    <div className="max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Preferences</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure how and when you receive pipeline status updates and error alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Channels</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive summaries and failure reports in your email inbox.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="size-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Slack Webhook</p>
              <p className="text-xs text-slate-500">Push real-time alerts directly to a Slack channel.</p>
            </div>
            <input
              type="checkbox"
              checked={slackAlerts}
              onChange={(e) => setSlackAlerts(e.target.checked)}
              className="size-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </div>

          {slackAlerts && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Alert Rules</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Notify on Failures Only</p>
              <p className="text-xs text-slate-500">Mute success notifications and only alert on pipeline errors.</p>
            </div>
            <input
              type="checkbox"
              checked={onFailureOnly}
              onChange={(e) => setOnFailureOnly(e.target.checked)}
              className="size-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-4 text-right">
          <button
            type="submit"
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-500"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}