
import { describe, expect, it } from 'vitest'
import { compareEnv } from '../lib/compare'
import type { EnvEntry } from '../lib/env-parser'

function entry(key: string, value = 'test'): EnvEntry {
  return { key, value, line: 1 }
}

describe('compareEnv', () => {
  it('identifies missing, extra, and shared keys', () => {
    const actual = [
      entry('API_URL', 'https://example.com'),
      entry('LOCAL_DEBUG', 'true'),
    ]

    const example = [
      entry('API_URL'),
      entry('DATABASE_URL'),
      entry('PORT'),
    ]

    expect(compareEnv(actual, example)).toEqual({
      missing: ['DATABASE_URL', 'PORT'],
      extra: ['LOCAL_DEBUG'],
      shared: ['API_URL'],
    })
  })

  it('returns empty lists when both files have the same keys', () => {
    const entries = [entry('API_URL'), entry('PORT')]

    expect(compareEnv(entries, entries)).toEqual({
      missing: [],
      extra: [],
      shared: ['API_URL', 'PORT'],
    })
  })

  it('handles two empty files', () => {
    expect(compareEnv([], [])).toEqual({
      missing: [],
      extra: [],
      shared: [],
    })
  })

  it('does not treat different values as different keys', () => {
    expect(
      compareEnv([entry('PORT', '3000')], [entry('PORT', '8080')]),
    ).toEqual({
      missing: [],
      extra: [],
      shared: ['PORT'],
    })
  })
})
