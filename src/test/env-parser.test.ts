
import { describe, expect, it } from 'vitest'
import { parseEnv } from '../lib/env-parser'

describe('parseEnv', () => {
  it('parses basic key-value pairs', () => {
    const result = parseEnv('API_URL=https://example.com\nPORT=3000')

    expect(result.entries).toEqual([
      { key: 'API_URL', value: 'https://example.com', line: 1 },
      { key: 'PORT', value: '3000', line: 2 },
    ])
    expect(result.errors).toEqual([])
  })

  it('ignores blank lines and full-line comments', () => {
    const result = parseEnv('# config\n\nAPP_NAME=DocuEnv')

    expect(result.entries).toEqual([
      { key: 'APP_NAME', value: 'DocuEnv', line: 3 },
    ])
    expect(result.errors).toEqual([])
  })

  it('supports the export prefix', () => {
    const result = parseEnv('export NODE_ENV=development')

    expect(result.entries).toEqual([
      { key: 'NODE_ENV', value: 'development', line: 1 },
    ])
  })

  it('preserves additional equals signs in values', () => {
    const result = parseEnv('TOKEN=abc=def==')

    expect(result.entries[0]?.value).toBe('abc=def==')
  })

  it('reports lines missing an equals sign', () => {
    const result = parseEnv('VALID=yes\nINVALID_LINE')

    expect(result.errors).toEqual([
      { line: 2, message: 'Missing "=" separator.' },
    ])
  })

  it('rejects invalid variable names', () => {
    const result = parseEnv('1INVALID=value')

    expect(result.errors).toEqual([
      { line: 1, message: 'Invalid environment variable name.' },
    ])
  })

  it('supports single- and double-quoted values', () => {
    const result = parseEnv('SINGLE=\'hello world\'\nDOUBLE="hello world"')

    expect(result.entries.map((entry) => entry.value)).toEqual([
      'hello world',
      'hello world',
    ])
  })

  it('supports escaped quotes inside double-quoted values', () => {
    const result = parseEnv('MESSAGE="He said \\"hello\\""')

    expect(result.entries).toEqual([
      { key: 'MESSAGE', value: 'He said "hello"', line: 1 },
    ])
    expect(result.errors).toEqual([])
  })

  it('preserves Windows-style paths in double-quoted values', () => {
    const result = parseEnv(
      'APP_PATH="C:\\Users\\Student\\Documents"',
    )

    expect(result.entries).toEqual([
      {
        key: 'APP_PATH',
        value: 'C:\\Users\\Student\\Documents',
        line: 1,
      },
    ])

    expect(result.errors).toEqual([])
  })

  it('reports unclosed quoted values', () => {
    const result = parseEnv('API_KEY="unfinished')

    expect(result.errors).toEqual([
      { line: 1, message: 'Unclosed quoted value.' },
    ])
  })

  it('detects duplicate variable names', () => {
    const result = parseEnv('PORT=3000\nPORT=4000')

    expect(result.entries).toEqual([
      { key: 'PORT', value: '3000', line: 1 },
    ])
    expect(result.errors).toEqual([
      {
        line: 2,
        message: 'Duplicate environment variable "PORT".',
      },
    ])
  })

  it('removes inline comments from unquoted values', () => {
    const result = parseEnv('PORT=3000 # server port')

    expect(result.entries[0]?.value).toBe('3000')
  })

  it('supports comments after quoted values', () => {
    const result = parseEnv('APP_NAME="DocuEnv" # application name')

    expect(result.entries[0]?.value).toBe('DocuEnv')
    expect(result.errors).toEqual([])
  })

  it('rejects unexpected text after quoted values', () => {
    const result = parseEnv('APP_NAME="DocuEnv" unexpected')

    expect(result.entries).toEqual([])
    expect(result.errors).toEqual([
      {
        line: 1,
        message: 'Unexpected text after quoted value.',
      },
    ])
  })

  it('preserves empty values', () => {
    const result = parseEnv('DATABASE_URL=')

    expect(result.entries).toEqual([
      { key: 'DATABASE_URL', value: '', line: 1 },
    ])
    expect(result.errors).toEqual([])
  })

  it('does not reserve keys from invalid entries', () => {
    const result = parseEnv(
      'API_KEY="unfinished\nAPI_KEY=valid-value',
    )

    expect(result.entries).toEqual([
      { key: 'API_KEY', value: 'valid-value', line: 2 },
    ])

    expect(result.errors).toEqual([
      { line: 1, message: 'Unclosed quoted value.' },
    ])
  })
})
