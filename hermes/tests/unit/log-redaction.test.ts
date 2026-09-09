import { describe, expect, it, beforeEach } from 'vitest'
import { log, redact, registerSecret, setSink, type LogLine } from '../../src/log.js'

let lines: LogLine[]
beforeEach(() => {
  lines = []
  setSink((l) => lines.push(l))
})

describe('secret redaction at the source (spec FR-019)', () => {
  it('scrubs a registered secret from the message', () => {
    registerSecret('super-secret-value-1234')
    log.info('connecting with super-secret-value-1234 now')
    expect(lines[0]?.msg).toBe('connecting with [redacted] now')
  })

  it('scrubs a registered secret from fields too', () => {
    registerSecret('another-secret-abcdefgh')
    log.warn('nope', { key: 'another-secret-abcdefgh', count: 3 })
    expect(lines[0]?.fields?.key).toBe('[redacted]')
    expect(lines[0]?.fields?.count).toBe(3)
  })

  it('catches credential-shaped strings it was never told about', () => {
    expect(redact('key sk-abcdefghijklmnopqrstuvwx here')).toBe('key [redacted] here')
    expect(redact('Authorization: Bearer abcdefghijklmnopqrstuvwxyz012345')).toContain('[redacted]')
    expect(redact('bot 123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')).toContain('[redacted]')
  })

  it('leaves ordinary text alone', () => {
    expect(redact('the office manager said hello')).toBe('the office manager said hello')
  })
})
