
import { describe, expect, it } from 'vitest'
import { generateZodSchema } from '../lib/generate-zod'
import type { SchemaField } from '../lib/generate-zod'

describe('generateZodSchema', () => {
  it('generates a schema with the correct import and exports', () => {
    const output = generateZodSchema([
      { key: 'API_URL', type: 'url', required: true },
      { key: 'PORT', type: 'port', required: true },
    ])

    expect(output).toContain("import { z } from 'zod'")
    expect(output).toContain('export const envSchema = z.object({')
    expect(output).toContain('export type Env = z.infer<typeof envSchema>')
  })

  it('generates the appropriate validator for each supported type', () => {
    const fields: SchemaField[] = [
      { key: 'NAME', type: 'string', required: true },
      { key: 'COUNT', type: 'number', required: true },
      { key: 'DEBUG', type: 'boolean', required: true },
      { key: 'SITE', type: 'url', required: true },
      { key: 'EMAIL', type: 'email', required: true },
      { key: 'PORT', type: 'port', required: true },
    ]

    const output = generateZodSchema(fields)

    expect(output).toContain('"NAME": z.string()')
    expect(output).toContain('"COUNT": z.coerce.number()')
    expect(output).toContain('"DEBUG": z.enum(["true", "false"])')
    expect(output).toContain('"SITE": z.string().url()')
    expect(output).toContain('"EMAIL": z.string().email()')
    expect(output).toContain('"PORT": z.coerce.number().int().min(1).max(65535)')
  })

  it('marks optional fields with optional()', () => {
    const output = generateZodSchema([
      { key: 'OPTIONAL_KEY', type: 'string', required: false },
    ])

    expect(output).toContain('"OPTIONAL_KEY": z.string().optional()')
  })

  it('handles an empty field list', () => {
    const output = generateZodSchema([])

    expect(output).toContain('export const envSchema = z.object({')
    expect(output).toContain('export type Env = z.infer<typeof envSchema>')
  })

  it('safely quotes unusual key strings', () => {
    const output = generateZodSchema([
      { key: 'KEY-WITH-DASH', type: 'string', required: true },
    ])

    expect(output).toContain('"KEY-WITH-DASH": z.string()')
  })
})
