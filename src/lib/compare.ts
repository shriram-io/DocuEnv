
import type { EnvEntry } from './env-parser'

export interface EnvComparison {
  missing: string[]
  extra: string[]
  shared: string[]
}

export function compareEnv(
  actualEntries: EnvEntry[],
  exampleEntries: EnvEntry[],
): EnvComparison {
  const actualKeys = new Set(actualEntries.map((entry) => entry.key))
  const exampleKeys = new Set(exampleEntries.map((entry) => entry.key))

  return {
    missing: [...exampleKeys].filter((key) => !actualKeys.has(key)),
    extra: [...actualKeys].filter((key) => !exampleKeys.has(key)),
    shared: [...exampleKeys].filter((key) => actualKeys.has(key)),
  }
}
