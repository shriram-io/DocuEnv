
import { describe, expect, it } from 'vitest'
import { inferType } from '../lib/infer-type'

describe('inferType', () => {
  it('infers boolean values', () => {
    expect(inferType('DEBUG', 'true').type).toBe('boolean')
    expect(inferType('ENABLED', 'false').type).toBe('boolean')
  })

  it('infers numeric values', () => {
    expect(inferType('RETRY_COUNT', '3').type).toBe('number')
    expect(inferType('THRESHOLD', '-1.5').type).toBe('number')
  })

  it('infers valid ports from port-like names', () => {
    expect(inferType('PORT', '3000').type).toBe('port')
    expect(inferType('DB_PORT', '5432').type).toBe('port')
  })

  it('does not infer out-of-range ports', () => {
    expect(inferType('PORT', '70000').type).toBe('number')
    expect(inferType('PORT', '0').type).toBe('number')
  })

  it('infers URLs', () => {
    expect(inferType('API_URL', 'https://example.com').type).toBe('url')
  })

  it('infers email addresses when the key indicates email', () => {
    expect(inferType('ADMIN_EMAIL', 'admin@example.com').type).toBe('email')
  })

  it('defaults to string when no specific type is reliable', () => {
    expect(inferType('API_KEY', 'abc123').type).toBe('string')
    expect(inferType('CONTACT', 'admin@example.com').type).toBe('string')
  })

  it('provides a reason and confidence for every suggestion', () => {
    const result = inferType('DEBUG', 'true')

    expect(result.reason.length).toBeGreaterThan(0)
    expect(['high', 'medium']).toContain(result.confidence)
  })
})
