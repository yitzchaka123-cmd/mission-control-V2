/**
 * Session keys — tasks.md T058 (parsing), used from T015 onward.
 *
 * A room IS a session namespace. First use creates it; there is no provisioning step and
 * no migration. This is ripple R2: v1 kept "who exists" in two places and needed a flip it
 * never dared run. Hermes holds no roster at all.
 */

import type { SessionKey } from '../contract/types.js'

export type ParsedKey =
  | { readonly kind: 'main' }
  | { readonly kind: 'police' }
  | { readonly kind: 'room'; readonly slug: string }
  | { readonly kind: 'worker'; readonly slug: string; readonly worker: string }

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/

export class InvalidSessionKey extends Error {
  constructor(key: string, why: string) {
    super(`Not a valid session key: "${key}" — ${why}`)
    this.name = 'InvalidSessionKey'
  }
}

export function parseSessionKey(key: SessionKey): ParsedKey {
  if (key === 'hermes:main') return { kind: 'main' }
  if (key === 'hermes:police') return { kind: 'police' }

  const worker = /^hermes:room:([^:]+):w:([^:]+)$/.exec(key)
  if (worker) {
    const [, slug, w] = worker as unknown as [string, string, string]
    if (!SLUG.test(slug)) throw new InvalidSessionKey(key, `room "${slug}" is not a valid slug`)
    if (!SLUG.test(w)) throw new InvalidSessionKey(key, `worker "${w}" is not a valid slug`)
    return { kind: 'worker', slug, worker: w }
  }

  const room = /^hermes:room:([^:]+)$/.exec(key)
  if (room) {
    const [, slug] = room as unknown as [string, string]
    if (!SLUG.test(slug)) throw new InvalidSessionKey(key, `room "${slug}" is not a valid slug`)
    return { kind: 'room', slug }
  }

  throw new InvalidSessionKey(
    key,
    'expected hermes:main, hermes:police, hermes:room:<slug> or hermes:room:<slug>:w:<worker>',
  )
}

export function isValidSessionKey(key: string): boolean {
  try {
    parseSessionKey(key)
    return true
  } catch {
    return false
  }
}
