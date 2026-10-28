
import type { InferredType } from './infer-type'

export interface SchemaField {
  key: string
  type: InferredType
  required: boolean
}

function schemaForType(type: InferredType): string {
  switch (type) {
    case 'string':
      return 'z.string()'
    case 'number':
      return 'z.coerce.number()'
    case 'boolean':
      return 'z.enum(["true", "false"])'
    case 'url':
      return 'z.string().url()'
    case 'email':
      return 'z.string().email()'
    case 'port':
      return 'z.coerce.number().int().min(1).max(65535)'
  }
}

export function generateZodSchema(fields: SchemaField[]): string {
  const properties = fields.map(({ key, type, required }) => {
    const schema = schemaForType(type)
    const optionalSchema = required ? schema : `${schema}.optional()`

    return `  ${JSON.stringify(key)}: ${optionalSchema},`
  })

  return [
    "import { z } from 'zod'",
    '',
    'export const envSchema = z.object({',
    ...properties,
    '})',
    '',
    'export type Env = z.infer<typeof envSchema>',
    '',
  ].join('\n')
}
