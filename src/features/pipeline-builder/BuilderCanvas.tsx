import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import type { Connection, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMutation } from '@tanstack/react-query'
import { savePipeline } from '@/api/pipelines'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { useToastStore } from '@/store/toastStore'
import type { FlowNode } from '@/types/flow'
import type { Pipeline } from '@/types/pipeline'
import type { PluginDefinition } from '@/types/plugin'
import { canConnect } from '@/utils/connectionRules'
import { flowToPipeline, nextNodeId, pipelineToFlow } from '@/utils/pipelineConverter'
import { asObjectSchema, validateConfig } from '@/utils/schemaForm'
import { ConfigPanel } from './ConfigPanel'
import { DRAG_MIME } from './dragPayload'
import type { DragPayload } from './dragPayload'
import { nodeTypes } from './nodeTypes'

interface Snapshot {
  nodes: FlowNode[]
  edges: Edge[]
}

const HISTORY_LIMIT = 50

export function BuilderCanvas({
  initial,
  plugins,
}: {
  initial: Pipeline
  plugins: PluginDefinition[]
}) {
  const theme = useThemeStore((s) => s.theme)
  const toast = useToastStore.getState().show
  const { screenToFlowPosition, fitView } = useReactFlow()

  const start = useMemo(() => pipelineToFlow(initial), [initial])
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(start.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(start.edges)
  const [name, setName] = useState(initial.name)
  const [dirty, setDirty] = useState(false)
  const [past, setPast] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const pluginByName = useMemo(
    () => new Map(plugins.map((p) => [`${p.kind}:${p.name}`, p])),
    [plugins],
  )

  const decorated = useMemo(
    () =>
      nodes.map((n) => {
        const plugin = pluginByName.get(`${n.data.kind}:${n.data.plugin}`)
        const count = plugin
          ? Object.keys(validateConfig(asObjectSchema(plugin.schema), n.data.config)).length
          : 1
        return n.data.errorCount === count ? n : { ...n, data: { ...n.data, errorCount: count } }
      }),
    [nodes, pluginByName],
  )

  const selected = decorated.find((n) => n.selected) ?? null
  const selectedPlugin = selected
    ? pluginByName.get(`${selected.data.kind}:${selected.data.plugin}`)
    : undefined

  const snapshot = useCallback(() => {
    setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), { nodes, edges }])
    setFuture([])
    setDirty(true)
  }, [nodes, edges])

  const undo = useCallback(() => {
    setPast((p) => {
      const prev = p[p.length - 1]
      if (!prev) return p
      setFuture((f) => [{ nodes, edges }, ...f])
      setNodes(prev.nodes)
      setEdges(prev.edges)
      return p.slice(0, -1)
    })
  }, [nodes, edges, setNodes, setEdges])

  const redo = useCallback(() => {
    setFuture((f) => {
      const next = f[0]
      if (!next) return f
      setPast((p) => [...p, { nodes, edges }])
      setNodes(next.nodes)
      setEdges(next.edges)
      return f.slice(1)
    })
  }, [nodes, edges, setNodes, setEdges])

  const onConnect = useCallback(
    (c: Connection) => {
      snapshot()
      setEdges((eds) => addEdge({ ...c, id: `${c.source}->${c.target}` }, eds))
    },
    [setEdges, snapshot],
  )

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const raw = e.dataTransfer.getData(DRAG_MIME)
    if (!raw) return
    const payload = JSON.parse(raw) as DragPayload
    snapshot()
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    setNodes((ns) => [
      ...ns,
      {
        id: nextNodeId(payload.kind, ns),
        type: 'pipelineNode',
        position,
        data: { kind: payload.kind, plugin: payload.plugin, config: {} },
      },
    ])
  }

  function updateConfig(nodeId: string, config: Record<string, unknown>) {
    setDirty(true)
    setNodes((ns) =>
      ns.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, config } } : n)),
    )
  }

  function deleteNode(nodeId: string) {
    snapshot()
    setNodes((ns) => ns.filter((n) => n.id !== nodeId))
    setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId))
  }

  function deleteSelected() {
    const ids = new Set(nodes.filter((n) => n.selected).map((n) => n.id))
    const edgeIds = new Set(edges.filter((e) => e.selected).map((e) => e.id))
    if (ids.size === 0 && edgeIds.size === 0) return
    snapshot()
    setNodes((ns) => ns.filter((n) => !ids.has(n.id)))
    setEdges((es) =>
      es.filter((e) => !edgeIds.has(e.id) && !ids.has(e.source) && !ids.has(e.target)),
    )
  }

  const { nodes: _n, edges: _e, ...meta } = initial
  void _n
  void _e
  const current = (): Pipeline => flowToPipeline({ ...meta, name }, decorated, edges)

  function validateAll(): string[] {
    const problems: string[] = []
    if (nodes.length === 0) problems.push('The pipeline is empty')
    if (!nodes.some((n) => n.data.kind === 'source')) problems.push('Add at least one source')
    if (!nodes.some((n) => n.data.kind === 'sink')) problems.push('Add at least one sink')
    for (const n of decorated) {
      if ((n.data.errorCount ?? 0) > 0) problems.push(`${n.id} has configuration issues`)
    }
    return problems
  }

  function runValidate() {
    const problems = validateAll()
    if (problems.length === 0) toast('success', 'Pipeline is valid')
    else toast('error', problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : ''))
    return problems.length === 0
  }

  const save = useMutation<Pipeline, ApiError, Pipeline>({
    mutationFn: savePipeline,
    onSuccess: () => {
      setDirty(false)
      toast('success', 'Pipeline saved')
    },
    onError: (e) => toast('error', e.message),
  })

  function runSave() {
    if (!runValidate()) return
    save.mutate(current())
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ pipeline: current() }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '-').toLowerCase() || 'pipeline'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as { pipeline?: Pipeline }
      const p = parsed.pipeline
      if (!p || !Array.isArray(p.nodes) || !Array.isArray(p.edges)) {
        throw new Error('invalid')
      }
      snapshot()
      const flow = pipelineToFlow(p)
      setNodes(flow.nodes)
      setEdges(flow.edges)
      setName(p.name)
      toast('success', 'Pipeline imported')
    } catch {
      toast('error', 'Invalid pipeline file')
    }
  }

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        runSave()
      } else if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  function autoLayout() {
    snapshot()
    const flow = pipelineToFlow(current())
    setNodes(flow.nodes)
    requestAnimationFrame(() => void fitView({ padding: 0.2 }))
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <input
          aria-label="Pipeline name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setDirty(true)
          }}
          className="mr-auto rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium hover:border-gray-300 focus:border-blue-500 focus:outline-none dark:hover:border-gray-600"
        />
        {dirty && <span className="text-xs text-yellow-600">Unsaved changes</span>}
        <Button variant="secondary" onClick={undo} disabled={past.length === 0}>Undo</Button>
        <Button variant="secondary" onClick={redo} disabled={future.length === 0}>Redo</Button>
        <Button variant="secondary" onClick={() => void fitView({ padding: 0.2 })}>Fit view</Button>
        <Button variant="secondary" onClick={autoLayout}>Auto-layout</Button>
        <Button variant="secondary" onClick={deleteSelected}>Delete selected</Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>Import</Button>
        <Button variant="secondary" onClick={exportJson}>Export</Button>
        <Button variant="secondary" onClick={runValidate}>Validate</Button>
        <Button loading={save.isPending} onClick={runSave}>Save</Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => void importJson(e)}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <ReactFlow
            nodes={decorated}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={snapshot}
            isValidConnection={(c) => canConnect(c, nodes, edges)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            deleteKeyCode={null}
            colorMode={theme}
            defaultEdgeOptions={{ animated: true }}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
        <ConfigPanel
          node={selected}
          plugin={selectedPlugin}
          onChange={updateConfig}
          onDelete={deleteNode}
        />
      </div>
    </div>
  )
}