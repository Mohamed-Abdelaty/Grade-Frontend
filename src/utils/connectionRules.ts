import type { Edge } from '@xyflow/react'
import type { FlowNode } from '@/types/flow'

function reaches(from: string, to: string, edges: Edge[]): boolean {
  const stack = [from]
  const seen = new Set<string>()
  while (stack.length > 0) {
    const current = stack.pop() as string
    if (current === to) return true
    if (seen.has(current)) continue
    seen.add(current)
    for (const e of edges) if (e.source === current) stack.push(e.target)
  }
  return false
}

export function canConnect(
  conn: { source: string; target: string },
  nodes: FlowNode[],
  edges: Edge[],
): boolean {
  if (conn.source === conn.target) return false
  const s = nodes.find((n) => n.id === conn.source)
  const t = nodes.find((n) => n.id === conn.target)
  if (!s || !t) return false
  if (s.data.kind === 'sink' || t.data.kind === 'source') return false
  if (edges.some((e) => e.source === conn.source && e.target === conn.target)) return false
  // لو الـ target يوصل للـ source يبقى الربط ده هيعمل cycle
  return !reaches(conn.target, conn.source, edges)
}