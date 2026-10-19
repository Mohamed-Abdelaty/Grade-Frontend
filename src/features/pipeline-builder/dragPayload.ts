import type { NodeType } from '@/types/pipeline'

export const DRAG_MIME = 'application/chaosflow-node'

export interface DragPayload {
  kind: NodeType
  plugin: string
}
