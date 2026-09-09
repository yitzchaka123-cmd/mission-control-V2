import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { SessionStore } from '../../src/sessions/store.js'
import { InvalidSessionKey } from '../../src/sessions/keys.js'

let dir: string
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'hermes-sessions-'))
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('session store (plan.md D4, ripple R2)', () => {
  it('creates a room on FIRST USE — no provisioning step', () => {
    const s = new SessionStore(dir)
    expect(s.has('hermes:room:newmans')).toBe(false)
    const rec = s.ensure('hermes:room:newmans')
    expect(rec.key).toBe('hermes:room:newmans')
    expect(rec.lifetimeTokens).toBe(0)
    expect(s.has('hermes:room:newmans')).toBe(true)
  })

  it('survives a restart', () => {
    new SessionStore(dir).ensure('hermes:room:tzviair')
    const reopened = new SessionStore(dir)
    expect(reopened.has('hermes:room:tzviair')).toBe(true)
  })

  it('refuses a malformed key instead of creating a junk room', () => {
    const s = new SessionStore(dir)
    expect(() => s.ensure('hermes:room:Not A Slug')).toThrow(InvalidSessionKey)
    expect(s.list()).toHaveLength(0)
  })

  it('never moves token counts backwards', () => {
    const s = new SessionStore(dir)
    s.noteTurn('hermes:main', 500)
    s.noteTurn('hermes:main', 120) // a restart reporting a lower lifetime figure
    expect(s.list()[0]?.lifetimeTokens).toBe(500)
  })

  it('renames a room and carries its workers with it (T060)', () => {
    const s = new SessionStore(dir)
    s.ensure('hermes:room:studio')
    s.ensure('hermes:room:studio:w:wanda')
    s.ensure('hermes:room:other')
    expect(s.renameRoom('studio', 'cluecrafter')).toBe(2)
    expect(s.has('hermes:room:cluecrafter')).toBe(true)
    expect(s.has('hermes:room:cluecrafter:w:wanda')).toBe(true)
    expect(s.has('hermes:room:studio')).toBe(false)
    expect(s.has('hermes:room:other')).toBe(true)
  })
})
