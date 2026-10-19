import type { DragEvent } from 'react'
import type { NodeType } from '@/types/pipeline'
import type { PluginDefinition } from '@/types/plugin'

export const DRAG_MIME = 'application/chaosflow-node'

export interface DragPayload {
  kind: NodeType
  plugin: string
}

const groups: { kind: NodeType; title: string; colorClass: string; badgeClass: string }[] = [
  {
    kind: 'source',
    title: 'Sources',
    colorClass: 'border-emerald-200 bg-emerald-50/80 text-emerald-950 hover:bg-emerald-100/80 hover:border-emerald-300',
    badgeClass: 'bg-emerald-500',
  },
  {
    kind: 'transform',
    title: 'Transforms',
    colorClass: 'border-teal-200 bg-teal-50/80 text-teal-950 hover:bg-teal-100/80 hover:border-teal-300',
    badgeClass: 'bg-teal-600',
  },
  {
    kind: 'sink',
    title: 'Sinks',
    colorClass: 'border-cyan-200 bg-cyan-50/80 text-cyan-950 hover:bg-cyan-100/80 hover:border-cyan-300',
    badgeClass: 'bg-cyan-600',
  },
]

export function Palette({ plugins }: { plugins: PluginDefinition[] }) {
  function onDragStart(e: DragEvent<HTMLDivElement>, payload: DragPayload) {
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside
      aria-label="Node palette"
      className="w-56 shrink-0 overflow-y-auto border-r border-slate-200/80 bg-white/90 p-4 shadow-xs backdrop-blur-md font-sans text-slate-900"
    >
      <div className="mb-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Node Palette
        </h2>
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
          Drag & drop onto canvas
        </p>
      </div>

      {groups.map((g) => (
        <section key={g.kind} className="mb-5">
          <div className="mb-2 flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${g.badgeClass}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {g.title}
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {plugins
              .filter((p) => p.kind === g.kind)
              .map((p) => (
                <div
                  key={p.name}
                  draggable
                  onDragStart={(e) => onDragStart(e, { kind: p.kind, plugin: p.name })}
                  className={`flex cursor-grab items-center gap-2 rounded-xl border p-2.5 text-xs font-bold shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:cursor-grabbing ${g.colorClass}`}
                >
                  <span>{p.label}</span>
                </div>
              ))}
          </div>
        </section>
      ))}
    </aside>
  )
}