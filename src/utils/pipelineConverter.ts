import type { Edge } from '@xyflow/react'
import type { NodeType, Pipeline } from '@/types/pipeline'
import type { FlowNode } from '@/types/flow'

const COLUMN_X: Record<NodeType, number> = {
  source: 0,
  transform: 320,
  sink: 640,
}

export type PipelineMeta = Omit<Pipeline, 'nodes' | 'edges'>

export function emptyPipeline(): Pipeline {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled pipeline',
    version: 1,
    schedule: null,
    nodes: [],
    edges: [],
    retry: { max_attempts: 3, backoff_seconds: 5 },
  }
}

// الـ contract مفيهوش positions، فبنرتب الـ nodes في 3 أعمدة حسب النوع
export function pipelineToFlow(p: Pipeline): { nodes: FlowNode[]; edges: Edge[] } {
  const rows: Record<NodeType, number> = { source: 0, transform: 0, sink: 0 }
  const nodes: FlowNode[] = p.nodes.map((n) => {
    const row = rows[n.type]++
    return {
      id: n.id,
      type: 'pipelineNode',
      position: { x: COLUMN_X[n.type], y: row * 140 },
      data: { kind: n.type, plugin: n.plugin, config: n.config },
    }
  })
  const edges: Edge[] = p.edges.map((e) => ({
    id: `${e.from}->${e.to}`,
    source: e.from,
    target: e.to,
  }))
  return { nodes, edges }
}

export function flowToPipeline(
  meta: PipelineMeta,
  nodes: FlowNode[],
  edges: Edge[],
): Pipeline {
  return {
    ...meta,
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.data.kind,
      plugin: n.data.plugin,
      config: n.data.config,
    })),
    edges: edges.map((e) => ({ from: e.source, to: e.target })),
  }
}

const PREFIX: Record<NodeType, string> = {
  source: 'src',
  transform: 'tr',
  sink: 'snk',
}

export function nextNodeId(kind: NodeType, nodes: FlowNode[]): string {
  const ids = new Set(nodes.map((n) => n.id))
  let i = 1
  while (ids.has(`${PREFIX[kind]}_${i}`)) i++
  return `${PREFIX[kind]}_${i}`
}