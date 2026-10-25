import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const UPSTREAM_PR_SKIP_IF =
  "if: ${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}"

function readWorkflow(name: string): string {
  return readFileSync(join(root, '.gitea', 'workflows', name), 'utf8')
}

function between(yaml: string, start: string, end: string): string {
  const startIdx = yaml.indexOf(start)
  if (startIdx < 0) {
    throw new Error(`missing start marker: ${start}`)
  }
  const endIdx = yaml.indexOf(end, startIdx + start.length)
  if (endIdx < 0) {
    throw new Error(`missing end marker: ${end}`)
  }
  return yaml.slice(startIdx, endIdx)
}

describe('CI workflow contract', () => {
  const ci = readWorkflow('ci.yml')
  const publish = readWorkflow('npm-publish.yml')

  it('TC-CI-01: pull_request branches are main, develop, dev-*, cursor/**', () => {
    const pullRequest = between(ci, '  pull_request:', '  workflow_dispatch:')
    expect(pullRequest).toContain('\n      - main\n')
    expect(pullRequest).toContain('\n      - develop\n')
    expect(pullRequest).toContain("\n      - 'dev-*'\n")
    expect(pullRequest).toContain("\n      - 'cursor/**'\n")
  })

  it('TC-CI-02: paths-ignore skips docs and markdown', () => {
    const ignored = between(ci, '    paths-ignore:', '  workflow_dispatch:')
    expect(ignored).toContain("\n      - 'docs/**'\n")
    expect(ignored).toContain("\n      - '**/*.md'\n")
  })

  it('TC-CI-03: concurrency cancels in-progress runs for the same PR or ref', () => {
    expect(ci).toMatch(
      /^concurrency:\n {2}group: ci-\$\{\{ github\.event\.pull_request\.number \|\| github\.ref \}\}\n {2}cancel-in-progress: true\n/m,
    )
  })

  it('TC-CI-04: workflow_dispatch remains for manual runs', () => {
    expect(ci).toMatch(/^ {2}workflow_dispatch: \{\}\s*$/m)
  })

  it('TC-CI-05: upstream develop to main PR is skipped at job level', () => {
    const job = between(ci, '\njobs:', '\n    steps:')
    expect(job).toMatch(new RegExp(`^ {4}${UPSTREAM_PR_SKIP_IF.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'))
  })

  it('TC-CI-06: steps run npm ci, lint, typecheck, test, then build', () => {
    const steps = ci.slice(ci.indexOf('\n    steps:'))
    const runs = [...steps.matchAll(/^ {8}run: (.+)$/gm)].map((match) => {
      const command = match[1]
      if (command === undefined) {
        throw new Error('missing run command')
      }
      return command
    })
    expect(runs).toEqual([
      'npm ci',
      'npm run lint',
      'npm run typecheck',
      'npm test',
      'npm run build',
    ])
  })

  it('TC-CI-07: setup-node caches npm', () => {
    const setup = between(ci, '      - name: Setup Node', '      - name: Install')
    expect(setup).toContain('uses: actions/setup-node@v4')
    expect(setup).toMatch(/^ {10}cache: npm\s*$/m)
  })

  it('TC-CI-08: job runs on ubuntu-latest with Node 24', () => {
    const job = between(ci, '\njobs:', '\n    steps:')
    expect(job).toMatch(/^ {4}runs-on: ubuntu-latest\s*$/m)
    const setup = between(ci, '      - name: Setup Node', '      - name: Install')
    expect(setup).toMatch(/^ {10}node-version: "24"\s*$/m)
  })

  it('TC-CI-09: CI does not run E2E', () => {
    expect(ci).not.toMatch(/e2e|playwright/i)
  })

  it('TC-CI-10: npm-publish stays tag push and workflow_dispatch only', () => {
    const on = between(publish, '\non:', '\njobs:')
    expect(on).toMatch(/^ {2}push:\n {4}tags:\n {6}- 'v\*'\s*$/m)
    expect(on).toMatch(/^ {2}workflow_dispatch:\s*$/m)
    expect(publish).not.toMatch(/pull_request:/)
    const triggers = [...on.matchAll(/^ {2}([a-z_]+):/gm)].map((match) => {
      const name = match[1]
      if (name === undefined) {
        throw new Error('missing trigger name')
      }
      return name
    })
    expect(triggers).toEqual(['push', 'workflow_dispatch'])
  })
})
