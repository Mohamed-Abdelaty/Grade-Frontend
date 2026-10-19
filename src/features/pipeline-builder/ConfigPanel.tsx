import { Button } from '@/components/ui/Button'
import type { FlowNode } from '@/types/flow'
import type { PluginDefinition } from '@/types/plugin'
import { asObjectSchema, validateConfig } from '@/utils/schemaForm'
import { DynamicConfigForm } from './DynamicConfigForm'

interface Props {
  node: FlowNode | null
  plugin: PluginDefinition | undefined
  onChange: (nodeId: string, config: Record<string, unknown>) => void
  onDelete: (nodeId: string) => void
}

export function ConfigPanel({ node, plugin, onChange, onDelete }: Props) {
  return (
    <aside
      aria-label="Node configuration"
      className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 p-4 dark:border-gray-700"
    >
      {!node || !plugin ? (
        <p className="text-sm text-gray-500">Select a node to edit its configuration.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">{plugin.label}</h2>
            <p className="text-xs text-gray-500">{node.id} · {node.data.kind}</p>
          </div>
          <DynamicConfigForm
            schema={asObjectSchema(plugin.schema)}
            values={node.data.config}
            errors={validateConfig(asObjectSchema(plugin.schema), node.data.config)}
            onChange={(key, value) => onChange(node.id, { ...node.data.config, [key]: value })}
          />
          <Button variant="danger" onClick={() => onDelete(node.id)}>
            Delete node
          </Button>
        </div>
      )}
    </aside>
  )
}