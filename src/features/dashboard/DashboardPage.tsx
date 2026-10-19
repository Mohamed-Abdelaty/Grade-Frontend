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
  accentGlow = 'hover:border-indigo-500/60 hover:shadow-indigo-500/20',
  accentColor = 'text-white',
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
      className={`animate-fade-up group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 ${accentGlow}`}
    >
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
          {label}
        </span>
        <div className="mt-2 text-3xl font-extrabold tabular-nums text-white">
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
        className="font-semibold text-white transition hover:text-indigo-300 hover:underline"
      >
        {r.pipeline_name}
      </Link>
    ),
  },
  { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  {
    header: 'Started',
    render: (r) => <span className="text-slate-200">{formatDate(r.started_at)}</span>,
  },
  {
    header: 'Duration',
    render: (r) => <span className="text-slate-200">{formatDuration(r.duration_seconds)}</span>,
  },
  {
    header: 'Records',
    render: (r) => (
      <span className="font-mono text-white">{r.records_processed.toLocaleString()}</span>
    ),
  },
]

export function DashboardPage() {
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats })
  const runs = useQuery({ queryKey: ['runs'], queryFn: listRuns })

  return (
    <div className="relative min-h-full w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-[#080c14] p-6 font-sans text-slate-100 shadow-2xl">
      {/* أنيميشن التوهج الهادئ في الخلفية */}
      <style>{`
        @keyframes floatGlow1 {
          0%, 100% { opacity: 0.15; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.35; transform: translate(30px, -20px) scale(1.15); }
        }
        @keyframes floatGlow2 {
          0%, 100% { opacity: 0.2; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.4; transform: translate(-35px, 25px) scale(1.1); }
        }
        .bg-glow-1 { animation: floatGlow1 12s ease-in-out infinite; }
        .bg-glow-2 { animation: floatGlow2 15s ease-in-out infinite; }
      `}</style>

      {/* خلفية متدرجة مع أضواء ناعمة ومتحركة ببطء شديد */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="bg-glow-1 absolute -top-24 -left-24 size-[550px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="bg-glow-2 absolute -bottom-24 -right-24 size-[600px] rounded-full bg-purple-600/15 blur-[150px]" />
        <div className="bg-glow-1 absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[130px]" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* الهيدر والعنوان */}
        <div className="animate-fade-up border-b border-slate-800/80 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Overview of your pipeline activity and real-time metrics
          </p>
        </div>

        {/* كروت الإحصائيات */}
        <section aria-label="Summary" className="grid gap-5 sm:grid-cols-3">
          {stats.isLoading &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-800/40" />
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
                accentGlow="hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20"
                accentColor="text-white"
              />
              <StatCard
                label="Runs today"
                value={stats.data.runs_today}
                delay={200}
                accentGlow="hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20"
                accentColor="text-white"
              />
              <StatCard
                label="Success rate"
                value={stats.data.success_rate}
                suffix="%"
                delay={300}
                accentGlow="hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/20"
                accentColor="text-white"
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
            <h2 className="text-xl font-bold text-white">Recent runs</h2>
            <span className="text-xs font-medium text-slate-400">Live system updates</span>
          </div>

          {runs.isLoading && <Skeleton className="h-56 w-full rounded-2xl bg-slate-800/40" />}
          {runs.error && <EmptyState title="Could not load runs" />}
          {runs.data && runs.data.length === 0 && (
            <EmptyState title="No runs yet" description="Run a pipeline to see it here." />
          )}
          {runs.data && runs.data.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur-xl">
              <Table columns={columns} rows={runs.data.slice(0, 5)} rowKey={(r) => r.id} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}