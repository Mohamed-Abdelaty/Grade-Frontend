import type { DragEvent } from 'react'
import type { NodeType } from '@/types/pipeline'
import type { PluginDefinition } from '@/types/plugin'

export const DRAG_MIME = 'application/chaosflow-node'

export interface DragPayload {
  kind: NodeType
  plugin: string
}

const groups: { kind: NodeType; title: string }[] = [
  { kind: 'source', title: 'Sources' },
  { kind: 'transform', title: 'Transforms' },
  { kind: 'sink', title: 'Sinks' },
]

export function Palette({ plugins }: { plugins: PluginDefinition[] }) {
  function onDragStart(e: DragEvent<HTMLDivElement>, payload: DragPayload) {
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside
      aria-label="Node palette"
      className="w-52 shrink-0 overflow-y-auto border-r border-gray-200 p-3 dark:border-gray-700"
    >
      {groups.map((g) => (
        <section key={g.kind} className="mb-4">
          <h2 className="mb-2 text-xs font-semibold uppercase text-gray-500">{g.title}</h2>
          <div className="flex flex-col gap-2">
            {plugins
              .filter((p) => p.kind === g.kind)
              .map((p) => (
                <div
                  key={p.name}
                  draggable
                  onDragStart={(e) => onDragStart(e, { kind: p.kind, plugin: p.name })}
                  className="cursor-grab rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  {p.label}
                </div>
              ))}
          </div>
        </section>
      ))}
    </aside>
  )
}