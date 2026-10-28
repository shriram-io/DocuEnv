
export type InferredType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'url'
  | 'email'
  | 'port'

export interface TypeInference {
  type: InferredType
  confidence: 'high' | 'medium'
  reason: string
}

export function inferType(
  key: string,
  value: string,
): TypeInference {
  const normalizedKey = key.toLowerCase()
  const trimmedValue = value.trim()

  if (
    /(^|_)(port|_port)$/.test(normalizedKey) &&
    /^\d+$/.test(trimmedValue) &&
    Number(trimmedValue) >= 1 &&
    Number(trimmedValue) <= 65535
  ) {
    return {
      type: 'port',
      confidence: 'high',
      reason: 'The variable name suggests a port and the value is in the valid port range.',
    }
  }

  if (/^(true|false)$/i.test(trimmedValue)) {
    return {
      type: 'boolean',
      confidence: 'high',
      reason: 'The value is true or false.',
    }
  }

  if (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue) &&
    /email|e_mail/i.test(normalizedKey)
  ) {
    return {
      type: 'email',
      confidence: 'medium',
      reason: 'The variable name and value resemble an email address.',
    }
  }

  try {
    const url = new URL(trimmedValue)

    if (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname.includes('.')
    ) {
      return {
        type: 'url',
        confidence: 'medium',
        reason: 'The value resembles an HTTP or HTTPS URL.',
      }
    }
  } catch {
    // Not a valid absolute URL; continue checking other types.
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmedValue)) {
    return {
      type: 'number',
      confidence: 'high',
      reason: 'The value is numeric.',
    }
  }

  return {
    type: 'string',
    confidence: 'medium',
    reason: 'No more specific type could be inferred reliably.',
  }
}
