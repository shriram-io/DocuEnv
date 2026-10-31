
import { afterEach, describe, expect, it } from 'vitest'
import { generateCiScript } from '../lib/generate-ci'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

describe('generateCiScript', () => {
  let tempDirectory: string | undefined

  afterEach(() => {
    if (tempDirectory) {
      rmSync(tempDirectory, { recursive: true, force: true })
      tempDirectory = undefined
    }
  })

  function runValidator(actual: string, required: string) {
    tempDirectory = mkdtempSync(join(tmpdir(), 'docuenv-ci-'))

    const scriptPath = join(tempDirectory, 'validate-env.mjs')
    const actualPath = join(tempDirectory, '.env')
    const requiredPath = join(tempDirectory, '.env.example')

    writeFileSync(scriptPath, generateCiScript(), 'utf8')
    writeFileSync(actualPath, actual, 'utf8')
    writeFileSync(requiredPath, required, 'utf8')

    return spawnSync(process.execPath, [scriptPath], {
      cwd: tempDirectory,
      encoding: 'utf8',
      env: {
        ...process.env,
        ENV_FILE: actualPath,
        REQUIRED_ENV_FILE: requiredPath,
      },
    })
  }

  it('generates a Node.js script', () => {
    const output = generateCiScript()

    expect(output).toContain("import { readFileSync } from 'node:fs'")
    expect(output).toContain('function readEntries(file)')
  })

  it('supports configurable input file paths', () => {
    const output = generateCiScript()

    expect(output).toContain("process.env.ENV_FILE ?? '.env'")
    expect(output).toContain("process.env.REQUIRED_ENV_FILE ?? '.env.example'")
  })

  it('passes when all required values are present', () => {
    const result = runValidator(
      'APP_NAME=DocuEnv\nAPI_KEY=demo-value\n',
      'APP_NAME=\nAPI_KEY=\n',
    )

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Environment validation passed.')
  })

  it('fails when required keys are missing', () => {
    const result = runValidator(
      'APP_NAME=DocuEnv\n',
      'APP_NAME=\nAPI_KEY=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Missing required keys: API_KEY')
  })

  it('detects empty double-quoted values', () => {
    const result = runValidator(
      'API_KEY=""\n',
      'API_KEY=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Empty required keys: API_KEY')
  })

  it('detects empty single-quoted values', () => {
    const result = runValidator(
      "API_KEY=''\n",
      'API_KEY=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Empty required keys: API_KEY')
  })

  it('ignores inline comments when checking unquoted values', () => {
    const result = runValidator(
      'APP_NAME=   # application name\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Empty required keys: APP_NAME')
  })

  it('accepts quoted values containing equals signs', () => {
    const result = runValidator(
      'API_KEY="abc=123"\n',
      'API_KEY=\n',
    )

    expect(result.status).toBe(0)
  })

  it('rejects duplicate environment keys', () => {
    const result = runValidator(
      'APP_NAME=DocuEnv\nAPP_NAME=AnotherName\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Duplicate environment key')
  })

  it('rejects invalid environment variable names', () => {
    const result = runValidator(
      '1INVALID=value\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Invalid environment key')
  })

  it('does not print environment values', () => {
    const secret = 'private-demo-secret-987654'
    const result = runValidator(
      `API_KEY=${secret}\n`,
      'API_KEY=\n',
    )

    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain(secret)
    expect(result.stderr).not.toContain(secret)
  })

  it('fails safely when an input file is missing', () => {
    tempDirectory = mkdtempSync(join(tmpdir(), 'docuenv-ci-'))

    const scriptPath = join(tempDirectory, 'validate-env.mjs')
    const requiredPath = join(tempDirectory, '.env.example')

    writeFileSync(scriptPath, generateCiScript(), 'utf8')
    writeFileSync(requiredPath, 'APP_NAME=\n', 'utf8')

    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: tempDirectory,
      encoding: 'utf8',
      env: {
        ...process.env,
        ENV_FILE: join(tempDirectory, 'missing.env'),
        REQUIRED_ENV_FILE: requiredPath,
      },
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Environment validation failed:')
  })

  it('does not include environment values in generated source', () => {
    const output = generateCiScript()

    expect(output).not.toContain('console.log(value)')
    expect(output).not.toContain('console.error(value)')
  })

  it('supports multiline quoted values', () => {
    const result = runValidator(
      'DESCRIPTION="First line\nSecond line"\n',
      'DESCRIPTION=\n',
    )

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Environment validation passed.')
  })

  it('supports escaped quotes inside double-quoted values', () => {
    const result = runValidator(
      'MESSAGE="He said \\"hello\\""\n',
      'MESSAGE=\n',
    )

    expect(result.status).toBe(0)
  })

  it('supports comments after quoted values', () => {
    const result = runValidator(
      'APP_NAME="DocuEnv" # application name\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(0)
  })

  it('rejects unclosed quoted values', () => {
    const result = runValidator(
      'APP_NAME="DocuEnv\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unclosed quoted value')
  })

  it('rejects unexpected text after quoted values', () => {
    const result = runValidator(
      'APP_NAME="DocuEnv" unexpected\n',
      'APP_NAME=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unexpected text after quoted value')
  })

  it('reports an unclosed quoted value before a following assignment', () => {
    const result = runValidator(
      'APP_NAME="unfinished\nAPI_KEY=valid-value\n',
      'APP_NAME=\nAPI_KEY=\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unclosed quoted value')
  })

  it('preserves hash characters without preceding whitespace', () => {
    const result = runValidator(
      'API_KEY=#abc123\n',
      'API_KEY=\n',
    )

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Environment validation passed.')
  })
})
