
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
      errors.push({
        line: lineNumber,
        message: 'Missing "=" separator.',
      })
      index++
      continue
    }

    const key = normalized.slice(0, separator).trim()
    const rawValue = normalized.slice(separator + 1)
    let value = rawValue.trim()

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      errors.push({
        line: lineNumber,
        message: 'Invalid environment variable name.',
      })
      index++
      continue
    }

    if (seenKeys.has(key)) {
      errors.push({
        line: lineNumber,
        message: `Duplicate environment variable "${key}".`,
      })
      index++
      continue
    }

    const quote = value[0]

    if (quote === '"' || quote === "'") {

      const findClosingQuote = (start: number): number => {
        for (let i = start; i < value.length; i++) {
          if (
            quote === '"' &&
            value[i] === '\\' &&
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

        // Do not consume a new assignment when recovering from
        // an unclosed quoted value.
        if (
          /^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/.test(
            nextLine,
          )
        ) {
          break
        }

        index++
        value += `\n${lines[index]}`
        closingQuote = findClosingQuote(value.length - lines[index].length)
      }

      if (closingQuote === -1) {
        errors.push({
          line: lineNumber,
          message: 'Unclosed quoted value.',
        })
        index++
        continue
      }

      const trailing = value.slice(closingQuote + 1).trim()

      if (trailing && !trailing.startsWith('#')) {
        errors.push({
          line: lineNumber,
          message: 'Unexpected text after quoted value.',
        })
        index++
        continue
      }

      value = value.slice(1, closingQuote)

      if (quote === '"') {
        value = value.replace(/\\(["\\])/g, '$1')
      }
    } else {
      const commentIndex = rawValue.search(/\s+#/)

      if (commentIndex !== -1) {
        value = rawValue.slice(0, commentIndex).trim()
      }
    }

    seenKeys.add(key)
    entries.push({ key, value, line: lineNumber })
    index++
  }

  return { entries, errors }
}
