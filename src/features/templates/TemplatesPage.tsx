import { useState } from 'react'
import type { PipelineTemplate } from '@/types/phase2'

// إضافة عدد العقد nodesCount للكروت لتطابق المطلوب في الملف
interface ExtendedTemplate extends PipelineTemplate {
  nodesCount?: number
}

const mockTemplates: ExtendedTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Standard ETL Pipeline',
    category: 'ETL',
    description: 'Extracts data from PostgreSQL, transforms fields, and loads to BigQuery.',
    config: {},
    usage_count: 42,
    nodesCount: 5,
  },
  {
    id: 'tmpl-2',
    name: 'Real-time Analytics Sync',
    category: 'Analytics',
    description: 'Stream events from Kafka into Elasticsearch with error fallback routing.',
    config: {},
    usage_count: 19,
    nodesCount: 8,
  },
  {
    id: 'tmpl-3',
    name: 'CRM Database Sync',
    category: 'Sync',
    description: 'Bi-directional background synchronization for enterprise customer records.',
    config: {},
    usage_count: 27,
    nodesCount: 4,
  },
]

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'ETL' | 'Analytics' | 'Sync'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null)

  // تصفية القوالب حسب الفئة والبحث
  const filtered = mockTemplates.filter((tmpl) => {
    const matchesCategory = activeCategory === 'All' || tmpl.category === activeCategory
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="animate-page-enter space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Template Gallery</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Clone pre-built pipeline architectures to kickstart your workflows.
        </p>
      </div>

      {/* Controls: Search & Category Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        {/* Category Tabs */}
        <div className="flex gap-2">
          {(['All', 'ETL', 'Analytics', 'Sync'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 shadow-2xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  {tmpl.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>{tmpl.nodesCount || 4} Nodes</span>
                  <span>•</span>
                  <span>{tmpl.usage_count} uses</span>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {tmpl.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplate(tmpl)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => alert(`Cloning ${tmpl.name}...`)}
                className="flex-1 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700 shadow-xs cursor-pointer"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal (Read-only Pipeline Canvas) */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedTemplate.name}
                </h2>
                <span className="mt-1 inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  {selectedTemplate.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">
              {selectedTemplate.description}
            </p>

            {/* Read-only Pipeline Canvas Preview Area */}
            <div className="my-6 flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <span className="rounded-md bg-teal-100 px-2 py-1 dark:bg-teal-900/40">Source</span>
                →
                <span className="rounded-md bg-cyan-100 px-2 py-1 dark:bg-cyan-900/40">Transform</span>
                →
                <span className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/40">Destination</span>
              </div>
              <span className="text-2xs text-slate-400">
                [ Read-Only Pipeline Canvas Preview ]
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Cloning ${selectedTemplate.name}...`)
                  setSelectedTemplate(null)
                }}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 shadow-xs cursor-pointer"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}