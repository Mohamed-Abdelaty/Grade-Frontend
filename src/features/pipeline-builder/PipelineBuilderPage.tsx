import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ReactFlowProvider } from '@xyflow/react'
import { getPipeline } from '@/api/pipelines'
import { listPlugins } from '@/api/plugins'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { emptyPipeline } from '@/utils/pipelineConverter'
import { BuilderCanvas } from './BuilderCanvas'
import { Palette } from './Palette'

export function PipelineBuilderPage() {
  const { id = 'new' } = useParams()
  const isNew = id === 'new'

  const plugins = useQuery({ queryKey: ['plugins'], queryFn: listPlugins })
  const pipeline = useQuery({
    queryKey: ['pipeline', id],
    queryFn: () => getPipeline(id),
    enabled: !isNew,
  })

  const blank = useMemo(() => emptyPipeline(), [])
  const initial = isNew ? blank : pipeline.data

  if (plugins.isLoading || (!isNew && pipeline.isLoading)) {
    return (
      <div className="flex flex-col gap-4 p-6 font-sans">
        <Skeleton className="h-9 w-64 rounded-xl bg-slate-200/60" />
        <div className="flex h-[calc(100vh-10rem)] gap-4">
          <Skeleton className="h-full w-56 rounded-2xl bg-slate-200/60" />
          <Skeleton className="h-full flex-1 rounded-2xl bg-slate-200/60" />
        </div>
      </div>
    )
  }

  if (plugins.error || pipeline.error || !plugins.data || !initial) {
    return (
      <div className="p-6">
        <EmptyState
          title="Could not load the builder"
          description="Check your connection or that the pipeline exists, then try again."
        />
      </div>
    )
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Palette plugins={plugins.data} />
      <ReactFlowProvider>
        <BuilderCanvas key={initial.id} initial={initial} plugins={plugins.data} />
      </ReactFlowProvider>
    </div>
  )
}