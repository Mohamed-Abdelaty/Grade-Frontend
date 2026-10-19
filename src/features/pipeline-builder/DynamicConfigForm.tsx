import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ObjectSchema } from '@/utils/schemaForm'

interface Props {
  schema: ObjectSchema
  values: Record<string, unknown>
  errors: Record<string, string>
  onChange: (key: string, value: unknown) => void
}

export function DynamicConfigForm({ schema, values, errors, onChange }: Props) {
  const entries = Object.entries(schema.properties ?? {})
  const required = new Set(schema.required ?? [])

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">This plugin has no settings.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([key, prop]) => {
        const label = `${prop.title ?? key}${required.has(key) ? ' *' : ''}`
        const raw = values[key] ?? prop.default
        const error = errors[key]

        if (prop.enum) {
          return (
            <div key={key}>
              <Select
                label={label}
                value={String(raw ?? '')}
                onChange={(e) => onChange(key, e.target.value)}
                options={[{ value: '', label: 'Select…' }, ...prop.enum.map((v) => ({ value: v, label: v }))]}
              />
              {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
          )
        }

        if (prop.type === 'boolean') {
          return (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(raw)}
                onChange={(e) => onChange(key, e.target.checked)}
              />
              {label}
            </label>
          )
        }

        const numeric = prop.type === 'number' || prop.type === 'integer'
        return (
          <Input
            key={key}
            label={label}
            type={numeric ? 'number' : 'text'}
            value={raw === undefined || raw === null ? '' : String(raw)}
            error={error}
            onChange={(e) => {
              const v = e.target.value
              if (!numeric) onChange(key, v)
              else onChange(key, v === '' ? undefined : Number(v))
            }}
          />
        )
      })}
    </div>
  )
}