
import { describe, expect, it } from 'vitest'
import { generateCiScript } from '../lib/generate-ci'

describe('generateCiScript', () => {
  it('generates a Node.js script', () => {
    const output = generateCiScript()

    expect(output).toContain("import { readFileSync } from 'node:fs'")
    expect(output).toContain('function readEntries(file)')
  })

  it('supports configurable input file paths', () => {
    const output = generateCiScript()

    expect(output).toContain("process.env.ENV_FILE ?? '.env'")
    expect(output).toContain("process.env.REQUIRED_ENV_FILE ?? '.env.example'")
  })

  it('checks for missing required keys', () => {
    const output = generateCiScript()

    expect(output).toContain('const missing = [...required.keys()].filter')
    expect(output).toContain('Environment validation failed.')
    expect(output).toContain('Environment validation passed.')
  })

  it('checks for empty required values', () => {
    const output = generateCiScript()

    expect(output).toContain('const empty = [...required.keys()].filter')
    expect(output).toContain("actual.get(key).trim() === ''")
    expect(output).toContain('Empty required keys:')
  })

  it('rejects duplicate environment keys', () => {
    const output = generateCiScript()

    expect(output).toContain('if (entries.has(key))')
    expect(output).toContain('Duplicate environment key')
  })

  it('does not print environment values', () => {
    const output = generateCiScript()

    expect(output).not.toContain('console.log(value)')
    expect(output).not.toContain('console.error(value)')
  })

  it('validates environment variable names', () => {
    const output = generateCiScript()

    expect(output).toContain(
      '/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)',
    )
  })
})
