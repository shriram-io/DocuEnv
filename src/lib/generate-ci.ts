
export function generateCiScript(): string {
  return `#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const envFile = process.env.ENV_FILE ?? '.env'
const requiredFile = process.env.REQUIRED_ENV_FILE ?? '.env.example'

function readKeys(file) {
  const content = readFileSync(file, 'utf8')
  const keys = new Set()

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

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(
        \`Invalid environment key on line \${index + 1} in \${file}\`,
      )
    }

    keys.add(key)
  }

  return keys
}

try {
  const actual = readKeys(envFile)
  const required = readKeys(requiredFile)
  const missing = [...required].filter((key) => !actual.has(key))

  if (missing.length > 0) {
    console.error('Environment validation failed.')
    console.error('Missing required keys:', missing.join(', '))
    process.exitCode = 1
  } else {
    console.log('Environment validation passed.')
  }
} catch {
  console.error('Environment validation failed. Check the input files and format.')
  process.exitCode = 1
}
`
}
