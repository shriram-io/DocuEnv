
export function generateCiScript(): string {
  return `#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const envFile = process.env.ENV_FILE ?? '.env'
const requiredFile = process.env.REQUIRED_ENV_FILE ?? '.env.example'

function readEntries(file) {
  const content = readFileSync(file, 'utf8')
  const entries = new Map()

  const lines = content.split(/\\r?\\n/)

  let index = 0

  while (index < lines.length) {
    const lineNumber = index + 1
    const trimmed = lines[index].trim()

    if (!trimmed || trimmed.startsWith('#')) {
      index++
      continue
    }

    const normalized = trimmed.startsWith('export ')
      ? trimmed.slice(7).trim()
      : trimmed

    const separator = normalized.indexOf('=')

    if (separator === -1) {
      throw new Error(
        \`Malformed environment entry on line \${lineNumber} in \${file}\`,
      )
    }

    const key = normalized.slice(0, separator).trim()
    const rawValue = normalized.slice(separator + 1)
    let value = rawValue.trim()

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(
        \`Invalid environment key on line \${lineNumber} in \${file}\`,
      )
    }

    if (entries.has(key)) {
      throw new Error(
        \`Duplicate environment key on line \${lineNumber} in \${file}\`,
      )
    }

    const quote = value[0]

    if (quote === '"' || quote === "'") {
      const findClosingQuote = (start) => {
        for (let i = start; i < value.length; i++) {
          if (
            quote === '"' &&
            value[i] === '\\\\' &&
            i + 1 < value.length
          ) {
            i++
            continue
          }

          if (value[i] === quote) {
            return i
          }
        }

        return -1
      }

      let closingQuote = findClosingQuote(1)

      while (closingQuote === -1 && index + 1 < lines.length) {
        const nextLine = lines[index + 1]

        if (
          /^\\s*(?:export\\s+)?[A-Za-z_][A-Za-z0-9_]*\\s*=/.test(
            nextLine,
          )
        ) {
          break
        }

        index++
        value += \`\\n\${lines[index]}\`
        closingQuote = findClosingQuote(value.length - lines[index].length)
      }

      if (closingQuote === -1) {
        throw new Error(
          \`Unclosed quoted value on line \${lineNumber} in \${file}\`,
        )
      }

      const trailing = value.slice(closingQuote + 1).trim()

      if (trailing && !trailing.startsWith('#')) {
        throw new Error(
          \`Unexpected text after quoted value on line \${lineNumber} in \${file}\`,
        )
      }

      value = value.slice(1, closingQuote)

      if (quote === '"') {
        value = value.replace(/\\\\(["\\\\])/g, '$1')
      }
        } else {
      const commentIndex = rawValue.search(/\\s+#/)

      if (commentIndex !== -1) {
        value = rawValue.slice(0, commentIndex).trim()
      }
    }

    entries.set(key, value)
    index++
  }

  return entries
}

try {
  const actual = readEntries(envFile)
  const required = readEntries(requiredFile)

  const missing = [...required.keys()].filter(
    (key) => !actual.has(key),
  )

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
