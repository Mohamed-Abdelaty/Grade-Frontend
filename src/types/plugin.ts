import type { NodeType } from './pipeline'

export interface PluginDefinition {
  name: string
  kind: NodeType
  label: string
  schema: Record<string, unknown> // JSON Schema (هنستخدمه في الفورم)
}