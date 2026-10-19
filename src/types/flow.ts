import type { Node } from '@xyflow/react'
import type { NodeType } from './pipeline'
export type FlowNodeData = {
  kind: NodeType
  plugin: string
  config: Record<string, unknown>
  errorCount?: number
}

export type FlowNode = Node<FlowNodeData, 'pipelineNode'>
