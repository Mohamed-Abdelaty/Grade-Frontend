import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeType } from '@/types/pipeline'
import type { FlowNode } from '@/types/flow'
import { Badge } from '@/components/ui/Badge'

const kindStyles: Record<NodeType, { border: string; bg: string; text: string; iconBg: string }> = {
  source: {
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/90',
    text: 'text-emerald-950',
    iconBg: 'bg-emerald-500 text-white',
  },
  transform: {
    border: 'border-teal-300',
    bg: 'bg-teal-50/90',
    text: 'text-teal-950',
    iconBg: 'bg-teal-600 text-white',
  },
  sink: {
    border: 'border-cyan-300',
    bg: 'bg-cyan-50/90',
    text: 'text-cyan-950',
    iconBg: 'bg-cyan-600 text-white',
  },
}

const kindIcon: Record<NodeType, string> = {
  source: '⇥',
  transform: '⚙',
  sink: '⇤',
}

export function PipelineNodeView({ id, data, selected }: NodeProps<FlowNode>) {
  const configured = Object.keys(data.config || {}).length > 0
  const theme = kindStyles[data.kind] || kindStyles.transform

  return (
    <div
      className={`min-w-48 rounded-2xl border-2 bg-white p-3.5 shadow-md backdrop-blur-md transition-all duration-200 ${
        theme.border
      } ${selected ? 'scale-[1.02] shadow-xl ring-2 ring-teal-500 ring-offset-2' : 'hover:shadow-lg'}`}
    >
      {data.kind !== 'source' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!size-3.5 !bg-teal-600 !border-2 !border-white shadow-xs"
        />
      )}

      <div className="flex items-center gap-2.5">
        <span className={`flex size-7 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${theme.iconBg}`}>
          {kindIcon[data.kind]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-extrabold text-slate-900">{data.plugin}</div>
          <div className="truncate text-[11px] font-mono font-medium text-slate-400">{id}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <Badge tone={configured ? 'green' : 'yellow'}>
          {configured ? 'Configured' : 'Needs config'}
        </Badge>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {data.kind}
        </span>
      </div>

      {data.kind !== 'sink' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!size-3.5 !bg-teal-600 !border-2 !border-white shadow-xs"
        />
      )}
    </div>
  )
}