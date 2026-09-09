import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

/**
 * Constitution Principle IV — One Seam To The Runtime.
 *
 * Mission Control talks to Hermes and to nothing else that runs agents. Hermes itself is
 * the seam that absorbs vendor coupling, and that coupling is allowed to live in exactly
 * one place: `src/adapters/`.
 *
 * This test is why that stays true. v1's failure was not a decision — fourteen vendor
 * subsystems leaked into every screen over months because nothing said no. This says no.
 *
 * Spec: 001 SC-007 · plan.md D2 · tasks.md T005
 */

const SRC = new URL('../../src/', import.meta.url).pathname
const ADAPTERS = join(SRC, 'adapters')

/** Vendor product names. If a name is here, it may only appear under src/adapters/. */
const VENDOR_NAMES = [
  'openai',
  'chatgpt',
  'codex',
  'anthropic',
  'claude',
  'openclaw',
  'gpt-',
  'sonnet',
  'opus',
]

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (full.endsWith('.ts')) out.push(full)
  }
  return out
}

describe('Principle IV: vendor coupling stays inside src/adapters/', () => {
  it('names no vendor anywhere in src/ outside adapters/', () => {
    const offenders: string[] = []

    for (const file of walk(SRC)) {
      if (file.startsWith(ADAPTERS + sep)) continue // the one allowed place

      const text = readFileSync(file, 'utf8').toLowerCase()
      for (const name of VENDOR_NAMES) {
        if (!text.includes(name)) continue
        const line = text.split('\n').findIndex((l) => l.includes(name)) + 1
        offenders.push(`${relative(SRC, file)}:${line} mentions "${name}"`)
      }
    }

    expect(
      offenders,
      offenders.length
        ? `Vendor names leaked outside src/adapters/:\n  ${offenders.join('\n  ')}\n\n` +
            'Move the vendor-specific part into an adapter. The rest of Hermes must not ' +
            'know which brain it is talking to — that is the whole point of the seam.'
        : undefined,
    ).toEqual([])
  })

  it('keeps adapters behind a shared interface rather than importing them directly', () => {
    const offenders: string[] = []

    for (const file of walk(SRC)) {
      if (file.startsWith(ADAPTERS + sep)) continue

      const text = readFileSync(file, 'utf8')
      // Importing the interface is fine. Importing a concrete adapter is not.
      const bad = /from\s+['"][^'"]*adapters\/(?!adapter['"])[^'"]+['"]/g
      for (const m of text.matchAll(bad)) {
        offenders.push(`${relative(SRC, file)} imports ${m[0]}`)
      }
    }

    expect(
      offenders,
      offenders.length
        ? `Concrete adapters imported outside adapters/:\n  ${offenders.join('\n  ')}\n\n` +
            'Depend on the BrainAdapter interface and let the registry choose.'
        : undefined,
    ).toEqual([])
  })
})
