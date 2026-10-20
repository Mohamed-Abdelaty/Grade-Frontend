import { useState } from 'react'
import type { PipelineTemplate } from '@/types/phase2'

const mockTemplates: PipelineTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Standard ETL Pipeline',
    category: 'ETL',
    description: 'Extracts data from PostgreSQL, transforms fields, and loads to BigQuery.',
    config: {},
    usage_count: 42,
  },
  {
    id: 'tmpl-2',
    name: 'Real-time Analytics Sync',
    category: 'Analytics',
    description: 'Stream events from Kafka into Elasticsearch with error fallback routing.',
    config: {},
    usage_count: 19,
  },
]

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'ETL' | 'Analytics' | 'Sync'>('All')

  const filtered = activeCategory === 'All' 
    ? mockTemplates 
    : mockTemplates.filter((t) => t.category === activeCategory)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Template Gallery</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Clone pre-built pipeline architectures to kickstart your workflows.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {(['All', 'ETL', 'Analytics', 'Sync'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  {tmpl.category}
                </span>
                <span className="text-xs text-slate-400">{tmpl.usage_count} uses</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{tmpl.description}</p>
            </div>
            <button
              onClick={() => alert(`Cloning ${tmpl.name}...`)}
              className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}