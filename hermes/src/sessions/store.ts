/**
 * The session store — tasks.md T015, plan.md D4.
 *
 * Durable on disk, keyed by session key. FIRST USE CREATES: a room is conversational the
 * moment it is addressed, with no provisioning, no migration and no restart (ripple R2).
 *
 * Hermes holds no roster. Mission Control owns who exists; this only namespaces
 * conversations. The architecture test in tests/architecture/ keeps it that way.
 */

import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Session, SessionKey } from '../contract/types.js'
import { parseSessionKey } from './keys.js'

export interface SessionRecord {
  readonly key: SessionKey
  label: string
  model?: string
  /** Lifetime tokens as reported by the brain. Usage — never currency (flat rate). */
  lifetimeTokens: number
  createdAt: string
  lastTurnAt?: string
}

/** Turn a key into the label the owner sees, without consulting any roster. */
function labelFor(key: SessionKey): string {
  const p = parseSessionKey(key)
  switch (p.kind) {
    case 'main':
      return 'Office Manager'
    case 'police':
      return 'Police Station'
    case 'room':
      return p.slug
    case 'worker':
      return `${p.slug} · ${p.worker}`
  }
}

export class SessionStore {
  readonly #dir: string
  readonly #records = new Map<SessionKey, SessionRecord>()

  constructor(dir: string) {
    this.#dir = dir
    mkdirSync(dir, { recursive: true })
    this.#load()
  }

  #file(): string {
    return join(this.#dir, 'sessions.json')
  }

  #load(): void {
    try {
      const raw = JSON.parse(readFileSync(this.#file(), 'utf8')) as SessionRecord[]
      for (const r of raw) this.#records.set(r.key, r)
    } catch {
      // No file yet is the normal first-run state, not an error.
    }
  }

  /** Atomic write — a crash mid-save must not leave a truncated file. */
  #persist(): void {
    const tmp = this.#file() + '.tmp'
    writeFileSync(tmp, JSON.stringify([...this.#records.values()], null, 1))
    renameSync(tmp, this.#file())
  }

  /**
   * Get the session for a key, creating it if this is its first use.
   * Throws InvalidSessionKey for a malformed key — a typo must not silently create a room.
   */
  ensure(key: SessionKey): SessionRecord {
    parseSessionKey(key) // validates; throws on nonsense
    const existing = this.#records.get(key)
    if (existing) return existing

    const created: SessionRecord = {
      key,
      label: labelFor(key),
      lifetimeTokens: 0,
      createdAt: new Date().toISOString(),
    }
    this.#records.set(key, created)
    this.#persist()
    return created
  }

  has(key: SessionKey): boolean {
    return this.#records.has(key)
  }

  /** Record the outcome of a turn. Token counts only ever move forward. */
  noteTurn(key: SessionKey, tokensNow: number, model?: string): void {
    const r = this.ensure(key)
    if (tokensNow > r.lifetimeTokens) r.lifetimeTokens = tokensNow
    if (model !== undefined) r.model = model
    r.lastTurnAt = new Date().toISOString()
    this.#persist()
  }

  /**
   * Rename a room, carrying its history. Under Hermes this is a key remap, not a
   * migration — v1 needed a whole flip for this (tasks.md T060).
   */
  renameRoom(oldSlug: string, newSlug: string): number {
    const from = `hermes:room:${oldSlug}`
    let moved = 0
    for (const [key, rec] of [...this.#records]) {
      if (key !== from && !key.startsWith(from + ':')) continue
      const nextKey = `hermes:room:${newSlug}` + key.slice(from.length)
      parseSessionKey(nextKey)
      this.#records.delete(key)
      this.#records.set(nextKey, { ...rec, key: nextKey, label: labelFor(nextKey) })
      moved++
    }
    if (moved) this.#persist()
    return moved
  }

  list(): Session[] {
    const now = Date.now()
    return [...this.#records.values()].map((r) => ({
      key: r.key,
      label: r.label,
      ...(r.model !== undefined ? { model: r.model } : {}),
      lifetimeTokens: r.lifetimeTokens,
      ageSeconds: Math.floor((now - Date.parse(r.createdAt)) / 1000),
    }))
  }
}
