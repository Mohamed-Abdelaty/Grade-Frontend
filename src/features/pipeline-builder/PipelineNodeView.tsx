import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeType } from '@/types/pipeline'
import type { FlowNode } from '@/types/flow'
import { Badge } from '@/components/ui/Badge'

const kindStyles: Record<NodeType, string> = {
  source: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  transform: 'border-violet-500 bg-violet-50 text-violet-900 dark:bg-violet-950 dark:text-violet-100',
  sink: 'border-orange-500 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-100',
}

const kindIcon: Record<NodeType, string> = {
  source: '⇥',
  transform: '⚙',
  sink: '⇤',
}

export function PipelineNodeView({ id, data, selected }: NodeProps<FlowNode>) {
  // مؤقتًا: الـ badge بيعتمد على إن الـ config فاضي ولا لأ.
  // هنستبدله بـ validation حقيقي من الـ JSON Schema في الجزء الجاي.
  const configured = Object.keys(data.config).length > 0

  return (
    <div
      className={`min-w-44 animate-pop rounded-lg border-2 px-3 py-2 shadow-sm transition duration-200 hover:shadow-lg ${
        kindStyles[data.kind]
      } ${selected ? 'scale-[1.03] shadow-lg ring-2 ring-blue-500' : ''}`}
    >
      {data.kind !== 'source' && <Handle type="target" position={Position.Left} />}

      <div className="flex items-center gap-2">
        <span aria-hidden="true">{kindIcon[data.kind]}</span>
        <div>
          <div className="text-sm font-semibold">{data.plugin}</div>
          <div className="text-xs opacity-70">{id}</div>
        </div>
      </div>
      <div className="mt-2">
        <Badge tone={configured ? 'green' : 'yellow'}>
          {configured ? 'Configured' : 'Needs config'}
        </Badge>
      </div>

      {data.kind !== 'sink' && <Handle type="source" position={Position.Right} />}
    </div>
  )
}