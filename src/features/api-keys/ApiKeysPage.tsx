import { useState } from 'react'
import type { ApiKey } from '@/types/phase2'

// بيانات تجريبية مبدئية (Mock Data)
const initialKeys: ApiKey[] = [
  {
    id: '1',
    name: 'CI/CD Pipeline Key',
    prefix: 'cf_live_9a8b...',
    scopes: ['pipelines:read', 'pipelines:write'],
    last_used_at: '2026-10-19T14:20:00Z',
    expires_at: '2027-10-19T00:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Analytics Service',
    prefix: 'cf_live_3f2e...',
    scopes: ['metrics:read'],
    last_used_at: null,
    expires_at: '2026-12-31T23:59:59Z',
    status: 'active',
  },
]

export function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // إنشاء مفتاح جديد
  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    const generatedRawKey = `cf_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
    
    const newKeyItem: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      prefix: `${generatedRawKey.substring(0, 12)}...`,
      scopes: ['pipelines:read', 'runs:trigger'],
      last_used_at: null,
      expires_at: '2027-01-01T00:00:00Z',
      status: 'active',
    }

    setKeys([newKeyItem, ...keys])
    setIsCreateOpen(false)
    setNewKeyName('')
    setRevealedKey(generatedRawKey) // إظهار المفتاح لمرة واحدة
  }

  // إلغاء مفتاح (Revoke)
  const handleRevoke = (id: string) => {
    if (confirm('Are you sure you want to revoke this API Key? This action cannot be undone.')) {
      setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k))
    }
  }

  const handleCopy = () => {
    if (revealedKey) {
      navigator.clipboard.writeText(revealedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Keys</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage personal and service API keys for automated integrations.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
        >
          + Create New Key
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Key Prefix</th>
              <th className="px-6 py-4">Scopes</th>
              <th className="px-6 py-4">Last Used</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {keys.map((key) => (
              <tr key={key.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{key.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">{key.prefix}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {key.scopes.map((scope) => (
                      <span key={scope} className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                        {scope}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    key.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {key.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {key.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Key */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create API Key</h2>
            <form onSubmit={handleCreateKey} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white">Key Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Ingestion Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: One-time Reveal Dialog */}
      {revealedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-teal-500/30 bg-white p-6 shadow-2xl dark:border-teal-500/30 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Key Generated</h2>
            <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
              ⚠️ Copy this key now! For security reasons, it will never be shown to you again.
            </p>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-teal-400">
              <span className="truncate">{revealedKey}</span>
              <button
                onClick={handleCopy}
                className="ml-3 rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-500"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRevealedKey(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                I have saved this key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}