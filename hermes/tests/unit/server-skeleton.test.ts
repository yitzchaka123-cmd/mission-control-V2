import { describe, expect, it, afterEach } from 'vitest'
import { Hermes, LOOPBACK } from '../../src/server/index.js'
import { setSink } from '../../src/log.js'

setSink(() => {}) // quiet

let server: Hermes | undefined
afterEach(async () => {
  await server?.close()
  server = undefined
})

describe('server skeleton (tasks.md T017, spec FR-015)', () => {
  it('binds loopback only — never a public interface', async () => {
    server = new Hermes()
    const { host } = await server.listen(0)
    expect(host).toBe(LOOPBACK)
    expect(LOOPBACK).toBe('127.0.0.1')
  })

  it('exposes a fixed, enumerable route table — no "run anything" door', async () => {
    server = new Hermes()
    server.route('GET', '/hermes/hello', (_r, res) => { res.end('{}') })
    expect(server.routes().map((r) => `${r.method} ${r.path}`)).toEqual(['GET /hermes/hello'])
  })

  it('refuses an unknown endpoint plainly rather than guessing', async () => {
    server = new Hermes()
    const { port } = await server.listen(0)
    const res = await fetch(`http://${LOOPBACK}:${port}/hermes/anything`)
    expect(res.status).toBe(404)
    expect(await res.json()).toMatchObject({ error: 'no such endpoint' })
  })

  it('refuses to register the same route twice', () => {
    server = new Hermes()
    server.route('GET', '/hermes/hello', (_r, res) => { res.end('{}') })
    expect(() => server!.route('GET', '/hermes/hello', (_r, res) => { res.end('{}') })).toThrow(
      /already defined/,
    )
  })

  it('a throwing handler returns an error, never a hang', async () => {
    server = new Hermes()
    server.route('GET', '/hermes/boom', () => {
      throw new Error('deliberate')
    })
    const { port } = await server.listen(0)
    const res = await fetch(`http://${LOOPBACK}:${port}/hermes/boom`)
    expect(res.status).toBe(500)
  })
})
