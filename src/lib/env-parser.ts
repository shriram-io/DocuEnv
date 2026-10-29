
export interface EnvEntry {
  key: string
  value: string
  line: number
}

export interface EnvParseError {
  line: number
  message: string
}

export interface EnvParseResult {
  entries: EnvEntry[]
  errors: EnvParseError[]
}

export function parseEnv(content: string): EnvParseResult {
  const entries: EnvEntry[] = []
  const errors: EnvParseError[] = []
  const seenKeys = new Set<string>()

  const lines = content.split(/\r?\n/)

  lines.forEach((rawLine, index) => {
    const line = index + 1
    const trimmed = rawLine.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    const normalized = trimmed.startsWith('export ')
      ? trimmed.slice(7).trim()
      : trimmed

    const separator = normalized.indexOf('=')

    if (separator === -1) {
      errors.push({
        line,
        message: 'Missing "=" separator.',
      })
      return
    }

    const key = normalized.slice(0, separator).trim()
    let value = normalized.slice(separator + 1).trim()

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      errors.push({
        line,
        message: 'Invalid environment variable name.',
      })
      return
    }

    if (seenKeys.has(key)) {
  errors.push({
    line,
    message: `Duplicate environment variable "${key}".`,
  })
  return
}

const quote = value[0]

    if (quote === '"' || quote === "'") {
      let closingQuote = -1

for (let i = 1; i < value.length; i++) {
  if (value[i] === '\\' && quote === '"') {
    i++
    continue
  }

  if (value[i] === quote) {
    closingQuote = i
    break
  }
}

      if (closingQuote === -1) {
        errors.push({
          line,
          message: 'Unclosed quoted value.',
        })
        return
      }

      const trailing = value.slice(closingQuote + 1).trim()

      if (trailing && !trailing.startsWith('#')) {
        errors.push({
          line,
          message: 'Unexpected text after quoted value.',
        })
        return
      }

      value = value.slice(1, closingQuote)

if (quote === '"') {
  value = value.replace(/\\(["\\])/g, '$1')
}
    } else {
      const commentIndex = value.indexOf(' #')

      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trimEnd()
      }
    }
seenKeys.add(key)
    entries.push({ key, value, line })
  })

  return { entries, errors }
}
