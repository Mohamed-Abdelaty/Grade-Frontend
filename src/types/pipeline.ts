export type NodeType = 'source' | 'transform' | 'sink'

export interface PipelineNode {
  id: string
  type: NodeType
  plugin: string
  config: Record<string, unknown>
}

export interface PipelineEdge {
  from: string
  to: string
}

export interface RetryConfig {
  max_attempts: number
  backoff_seconds: number
}

export interface Pipeline {
  id: string
  name: string
  version: number
  schedule: string | null
  nodes: PipelineNode[]
  edges: PipelineEdge[]
  retry: RetryConfig
}

export interface PipelineEnvelope {
  pipeline: Pipeline
}
export type PipelineStatus = 'draft' | 'active' | 'running' | 'failed'

export interface PipelineSummary {
  id: string
  name: string
  version: number
  status: PipelineStatus
  nodes_count: number
  updated_at: string
}