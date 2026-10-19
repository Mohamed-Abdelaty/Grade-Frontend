import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRun } from '@/api/runs'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate, formatDuration } from '@/utils/format'
import { LogViewer } from './LogViewer'
import { useRunStream } from './useRunStream'

function Metric({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  return (
    <Card delay={delay} className="p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </Card>
  )
}

export function RunDetailsPage() {
  const { id = '' } = useParams()
  const run = useQuery({ queryKey: ['run', id], queryFn: () => getRun(id) })

  const live = run.data?.status === 'running' || run.data?.status === 'queued'
  const stream = useRunStream(id, live)

  if (run.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (run.error || !run.data) {
    return (
      <EmptyState
        title="Run not found"
        description="It may have been deleted, or the connection failed."
        action={
          <Link to="/pipelines" className="text-blue-600 hover:underline">
            Back to pipelines
          </Link>
        }
      />
    )
  }

  const data = run.data
  const status = stream.status ?? data.status
  const progress = stream.progress ?? data.progress
  const records = stream.records ?? data.records_processed

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{data.pipeline_name}</h1>
        <StatusBadge status={status} />
        {live && (
          <Badge
            tone={stream.connection === 'open' ? 'green' : 'yellow'}
            pulse={stream.connection === 'open'}
          >
            {stream.connection === 'open' ? 'Live' : stream.connection}
          </Badge>
        )}
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Run progress"
          className="h-3 overflow-hidden rounded-full bg-surface-2"
        >
          <div
            className="relative h-full overflow-hidden rounded-full bg-linear-to-r from-from to-to transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {live && <div className="progress-stripes absolute inset-0 animate-stripes" />}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Records processed" value={records.toLocaleString()} />
        <Metric label="Duration" value={formatDuration(data.duration_seconds)} delay={100} />
        <Metric label="Started" value={formatDate(data.started_at)} delay={200} />
      </div>

      <LogViewer logs={stream.logs} />
    </div>
  )
}