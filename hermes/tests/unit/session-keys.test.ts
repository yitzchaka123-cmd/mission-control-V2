import { describe, expect, it } from 'vitest'
import { InvalidSessionKey, isValidSessionKey, parseSessionKey } from '../../src/sessions/keys.js'

describe('session keys (spec FR-007)', () => {
  it('parses the four shapes', () => {
    expect(parseSessionKey('hermes:main')).toEqual({ kind: 'main' })
    expect(parseSessionKey('hermes:police')).toEqual({ kind: 'police' })
    expect(parseSessionKey('hermes:room:yesh-magnetim')).toEqual({
      kind: 'room',
      slug: 'yesh-magnetim',
    })
    expect(parseSessionKey('hermes:room:development:w:friday')).toEqual({
      kind: 'worker',
      slug: 'development',
      worker: 'friday',
    })
  })

  it('rejects a malformed key rather than inventing a room', () => {
    for (const bad of ['', 'main', 'hermes:', 'hermes:room:', 'hermes:room:Bad Slug', 'hermes:x:y']) {
      expect(() => parseSessionKey(bad), bad).toThrow(InvalidSessionKey)
      expect(isValidSessionKey(bad)).toBe(false)
    }
  })

  it('names the problem in the error, in plain words', () => {
    expect(() => parseSessionKey('hermes:room:Bad Slug')).toThrow(/not a valid slug/)
  })
})
