import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStats, listRuns } from '@/api/runs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table } from '@/components/ui/Table'
import type { Column } from '@/components/ui/Table'
import { useCountUp } from '@/hooks/useCountUp'
import type { Run } from '@/types/run'
import { formatDate, formatDuration } from '@/utils/format'

function StatCard({
  label,
  value,
  suffix = '',
  delay = 0,
  accentGlow = 'hover:border-teal-500/60 hover:shadow-md hover:shadow-teal-500/10 dark:hover:border-teal-500/80',
  accentColor = 'text-teal-600 dark:text-teal-400',
}: {
  label: string
  value: number
  suffix?: string
  delay?: number
  accentGlow?: string
  accentColor?: string
}) {
  const shown = useCountUp(value)
  const text = Number.isInteger(value) ? Math.round(shown).toString() : shown.toFixed(1)

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-up group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/90 ${accentGlow}`}
    >
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors duration-200 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
          {label}
        </span>
        <div className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
          {text}
          <span className={`ml-1 text-2xl font-bold ${accentColor}`}>{suffix}</span>
        </div>
      </div>
    </div>
  )
}

const columns: Column<Run>[] = [
  {
    header: 'Pipeline',
    render: (r) => (
      <Link
        to={`/runs/${r.id}`}
        className="font-bold text-slate-900 transition hover:text-teal-600 hover:underline dark:text-white dark:hover:text-teal-400"
      >
        {r.pipeline_name}
      </Link>
    ),
  },
  { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  {
    header: 'Started',
    render: (r) => <span className="text-slate-600 dark:text-slate-300">{formatDate(r.started_at)}</span>,
  },
  {
    header: 'Duration',
    render: (r) => <span className="text-slate-600 dark:text-slate-300">{formatDuration(r.duration_seconds)}</span>,
  },
  {
    header: 'Records',
    render: (r) => (
      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
        {r.records_processed.toLocaleString()}
      </span>
    ),
  },
]

export function DashboardPage() {
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats })
  const runs = useQuery({ queryKey: ['runs'], queryFn: listRuns })

  return (
    <div className="relative min-h-full w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 p-6 font-sans text-slate-900 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* أنيميشن التوهج الهادئ للألوان الفاتحة والداكنة */}
      <style>{`
        @keyframes floatGlow1 {
          0%, 100% { opacity: 0.25; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.5; transform: translate(30px, -20px) scale(1.15); }
        }
        @keyframes floatGlow2 {
          0%, 100% { opacity: 0.3; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.6; transform: translate(-35px, 25px) scale(1.1); }
        }
        .bg-glow-1 { animation: floatGlow1 12s ease-in-out infinite; }
        .bg-glow-2 { animation: floatGlow2 15s ease-in-out infinite; }
      `}</style>

      {/* خلفية مع أضواء ناعمة تتماشى مع الوضعين */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="bg-glow-1 absolute -top-24 -left-24 size-[550px] rounded-full bg-teal-300/30 blur-[140px] dark:bg-teal-900/20" />
        <div className="bg-glow-2 absolute -bottom-24 -right-24 size-[600px] rounded-full bg-cyan-300/25 blur-[150px] dark:bg-cyan-900/20" />
        <div className="bg-glow-1 absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-[130px] dark:bg-emerald-900/15" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* الهيدر والعنوان */}
        <div className="animate-fade-up border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Overview of your pipeline activity and real-time metrics
          </p>
        </div>

        {/* كروت الإحصائيات */}
        <section aria-label="Summary" className="grid gap-5 sm:grid-cols-3">
          {stats.isLoading &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800" />
            ))}
          {stats.error && (
            <div className="sm:col-span-3">
              <EmptyState title="Could not load statistics" />
            </div>
          )}
          {stats.data && (
            <>
              <StatCard
                label="Total pipelines"
                value={stats.data.total_pipelines}
                delay={100}
                accentGlow="hover:border-teal-500/60 hover:shadow-md hover:shadow-teal-500/10 dark:hover:border-teal-500/80"
                accentColor="text-teal-600 dark:text-teal-400"
              />
              <StatCard
                label="Runs today"
                value={stats.data.runs_today}
                delay={200}
                accentGlow="hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/10 dark:hover:border-cyan-500/80"
                accentColor="text-cyan-600 dark:text-cyan-400"
              />
              <StatCard
                label="Success rate"
                value={stats.data.success_rate}
                suffix="%"
                delay={300}
                accentGlow="hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/10 dark:hover:border-emerald-500/80"
                accentColor="text-emerald-600 dark:text-emerald-400"
              />
            </>
          )}
        </section>

        {/* جدول الأنشطة */}
        <section
          aria-label="Recent runs"
          className="animate-fade-up flex flex-col gap-4"
          style={{ animationDelay: '400ms' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent runs</h2>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Live system updates</span>
          </div>

          {runs.isLoading && <Skeleton className="h-56 w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800" />}
          {runs.error && <EmptyState title="Could not load runs" />}
          {runs.data && runs.data.length === 0 && (
            <EmptyState title="No runs yet" description="Run a pipeline to see it here." />
          )}
          {runs.data && runs.data.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
              <Table columns={columns} rows={runs.data.slice(0, 5)} rowKey={(r) => r.id} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}