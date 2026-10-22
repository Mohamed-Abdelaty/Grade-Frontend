import { useState } from 'react'

interface PipelineVersion {
  id: string
  version: string
  author: string
  createdAt: string
  changelog: string
  status: 'active' | 'archived'
  changesSummary: {
    added: number
    modified: number
    removed: number
  }
}

export function HistoryPage() {
  const [versions] = useState<PipelineVersion[]>([
    {
      id: 'v-3',
      version: 'v1.2.0',
      author: 'Mohamed Abdelaty',
      createdAt: '10/22/2026, 3:30 PM',
      changelog: 'Added database connection timeout retry logic and error node handling.',
      status: 'active',
      changesSummary: { added: 2, modified: 1, removed: 0 },
    },
    {
      id: 'v-2',
      version: 'v1.1.0',
      author: 'Demo Admin',
      createdAt: '10/20/2026, 11:15 AM',
      changelog: 'Updated analytics output schema and changed API endpoint URL.',
      status: 'archived',
      changesSummary: { added: 0, modified: 3, removed: 1 },
    },
    {
      id: 'v-1',
      version: 'v1.0.0',
      author: 'Mohamed Abdelaty',
      createdAt: '10/15/2026, 09:00 AM',
      changelog: 'Initial pipeline version baseline creation.',
      status: 'archived',
      changesSummary: { added: 8, modified: 0, removed: 0 },
    },
  ])

  const [selectedVersion, setSelectedVersion] = useState<PipelineVersion>(versions[0])
  const [showRollbackModal, setShowRollbackModal] = useState(false)
  const [rollbackSuccess, setRollbackSuccess] = useState(false)

  const handleRollback = () => {
    setRollbackSuccess(true)
    setTimeout(() => {
      setShowRollbackModal(false)
      setRollbackSuccess(false)
    }, 1500)
  }

  return (
    <div className="max-w-6xl space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Version History & Diff</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Compare pipeline versions, view added/removed nodes, and rollback to previous stable versions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timeline Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-base">Versions Timeline</h2>
          <div className="relative space-y-6 border-l-2 border-slate-200 pl-4 dark:border-slate-800">
            {versions.map((v) => {
              const isSelected = selectedVersion.id === v.id
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVersion(v)}
                  className={`group relative cursor-pointer transition-all ${
                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Circle Marker */}
                  <span
                    className={`absolute -left-[21px] top-1.5 size-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500 ring-4 ring-teal-500/20'
                        : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'
                    }`}
                  />

                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {v.version}
                    </span>
                    {v.status === 'active' && (
                      <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        Current Active
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    By <span className="font-medium text-slate-700 dark:text-slate-300">{v.author}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">{v.createdAt}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Version Detail & Side-by-Side Diff Canvas View */}
        <div className="space-y-6 lg:col-span-2">
          {/* Version Details Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedVersion.version} Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedVersion.changelog}
                </p>
              </div>

              {selectedVersion.status !== 'active' && (
                <button
                  type="button"
                  onClick={() => setShowRollbackModal(true)}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  ↺ Rollback to this version
                </button>
              )}
            </div>

            {/* Changes Summary Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{selectedVersion.changesSummary.added} Nodes Added
              </span>
              <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                ~{selectedVersion.changesSummary.modified} Nodes Modified
              </span>
              <span className="rounded-lg bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                -{selectedVersion.changesSummary.removed} Nodes Removed
              </span>
            </div>
          </div>

          {/* Canvas Comparison (Visual Diff) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Visual Pipeline Canvas Diff</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Current Active Canvas */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Current (v1.2.0)</p>
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                    Source: Postgres DB
                  </div>
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-300 font-medium">
                    Transform: Timeout Retry (Modified)
                  </div>
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-300 font-medium">
                    Destination: S3 Bucket (Added)
                  </div>
                </div>
              </div>

              {/* Selected Target Version Canvas */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Target ({selectedVersion.version})</p>
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                    Source: Postgres DB
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                    Transform: Default Sync
                  </div>
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-rose-700 dark:text-rose-300 font-medium">
                    Destination: Redshift (Removed)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Rollback */}
      {showRollbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Confirm Pipeline Rollback
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Are you sure you want to rollback to <strong className="text-teal-600 dark:text-teal-400">{selectedVersion.version}</strong>? A new pipeline version (e.g., v1.2.1) will be generated automatically to maintain full history traceability.
            </p>

            {rollbackSuccess && (
              <div className="mt-3 rounded-lg bg-emerald-500/10 p-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Successfully rolled back to {selectedVersion.version}!
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRollbackModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRollback}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}