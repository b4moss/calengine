import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('v0.1.0 scaffold', () => {
  it('TC-SCAF-01: test runner exits green', () => {
    expect(true).toBe(true)
  })

  it('TC-SCAF-03: package name is @b4moss/calengine', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      name: string
      type?: string
      license?: string
      publishConfig?: { access?: string; registry?: string }
    }
    expect(pkg.name).toBe('@b4moss/calengine')
    expect(pkg.type).toBe('module')
    expect(pkg.license).toBe('MIT')
    expect(pkg.publishConfig?.access).toBe('public')
    expect(pkg.publishConfig?.registry).toBeUndefined()
  })

  it('TC-SCAF-04: test environment has no DOM globals', () => {
    const g = globalThis as Record<string, unknown>
    expect(typeof g['document']).toBe('undefined')
    expect(typeof g['window']).toBe('undefined')
    expect(typeof g['HTMLElement']).toBe('undefined')
  })
})
