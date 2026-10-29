
export function generateCiScript(): string {
  return `#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const envFile = process.env.ENV_FILE ?? '.env'
const requiredFile = process.env.REQUIRED_ENV_FILE ?? '.env.example'

function readEntries(file) {
  const content = readFileSync(file, 'utf8')
  const entries = new Map()

  for (const [index, rawLine] of content.split(/\\r?\\n/).entries()) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) continue

    const normalized = line.startsWith('export ')
      ? line.slice(7).trim()
      : line

    const separator = normalized.indexOf('=')

    if (separator === -1) {
      throw new Error(
        \`Malformed environment entry on line \${index + 1} in \${file}\`,
      )
    }

    const key = normalized.slice(0, separator).trim()
    const value = normalized.slice(separator + 1).trim()

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(
        \`Invalid environment key on line \${index + 1} in \${file}\`,
      )
    }

    if (entries.has(key)) {
      throw new Error(
        \`Duplicate environment key on line \${index + 1} in \${file}\`,
      )
    }

    entries.set(key, value)
  }

  return entries
}

try {
  const actual = readEntries(envFile)
  const required = readEntries(requiredFile)
  const missing = [...required.keys()].filter((key) => !actual.has(key))
  const empty = [...required.keys()].filter(
    (key) => actual.has(key) && actual.get(key).trim() === '',
  )

  if (missing.length > 0 || empty.length > 0) {
    console.error('Environment validation failed.')

    if (missing.length > 0) {
      console.error('Missing required keys:', missing.join(', '))
    }

    if (empty.length > 0) {
      console.error('Empty required keys:', empty.join(', '))
    }

    process.exitCode = 1
  } else {
    console.log('Environment validation passed.')
  }
    } catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : 'Unknown validation error'

  console.error('Environment validation failed:', message)
  process.exitCode = 1
}
`
}