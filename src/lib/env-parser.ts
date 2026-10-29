
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
    let value = normalized.slice(separator + 1).trim()

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
      let closingQuote = -1
      let searchFrom = 1

      const findClosingQuote = (): number => {
        while (searchFrom < value.length) {
          const candidate = value.indexOf(quote, searchFrom)

          if (candidate === -1) return -1

          if (
            quote === '"' &&
            candidate > 0 &&
            value[candidate - 1] === '\\'
          ) {
            searchFrom = candidate + 1
            continue
          }

          return candidate
        }

        return -1
      }


      while (closingQuote === -1 && index + 1 < lines.length) {
        const nextLine = lines[index + 1]

        // Recover if the current quote is unclosed and a new
        // environment-variable assignment begins on the next line.
        if (
          /^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/.test(
            nextLine,
          )
        ) {
          break
        }

        index++
        value += `\n${lines[index]}`

        searchFrom = value.length - lines[index].length
        closingQuote = findClosingQuote()
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
      const commentIndex = value.indexOf(' #')

      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trimEnd()
      }
    }

    seenKeys.add(key)
    entries.push({ key, value, line: lineNumber })
    index++
  }

  return { entries, errors }
}
