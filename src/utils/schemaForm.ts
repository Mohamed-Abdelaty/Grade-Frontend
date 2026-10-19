export interface SchemaProperty {
  type?: 'string' | 'number' | 'integer' | 'boolean'
  title?: string
  description?: string
  default?: unknown
  enum?: string[]
}

export interface ObjectSchema {
  type?: 'object'
  required?: string[]
  properties?: Record<string, SchemaProperty>
}

export function asObjectSchema(schema: Record<string, unknown>): ObjectSchema {
  return schema as ObjectSchema
}

export function validateConfig(
  schema: ObjectSchema,
  config: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const props = schema.properties ?? {}
  const required = new Set(schema.required ?? [])

  for (const [key, prop] of Object.entries(props)) {
    const value = config[key]
    const label = prop.title ?? key
    const empty = value === undefined || value === null || value === ''

    if (empty) {
      if (required.has(key)) errors[key] = `${label} is required`
      continue
    }
    if (prop.type === 'number' || prop.type === 'integer') {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        errors[key] = `${label} must be a number`
      } else if (prop.type === 'integer' && !Number.isInteger(value)) {
        errors[key] = `${label} must be an integer`
      }
    }
    if (prop.enum && !prop.enum.includes(String(value))) {
      errors[key] = `${label} must be one of: ${prop.enum.join(', ')}`
    }
  }
  return errors
}