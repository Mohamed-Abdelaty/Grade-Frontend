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
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (plugins.error || pipeline.error || !plugins.data || !initial) {
    return (
      <EmptyState
        title="Could not load the builder"
        description="Check your connection or that the pipeline exists, then try again."
      />
    )
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <Palette plugins={plugins.data} />
      <ReactFlowProvider>
        <BuilderCanvas key={initial.id} initial={initial} plugins={plugins.data} />
      </ReactFlowProvider>
    </div>
  )
}