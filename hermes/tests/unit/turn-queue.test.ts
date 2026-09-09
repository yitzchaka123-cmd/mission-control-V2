import { describe, expect, it } from 'vitest'
import { TurnQueue } from '../../src/sessions/queue.js'

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('turn queue (spec FR-014)', () => {
  it('never interleaves two turns on the same key', async () => {
    const q = new TurnQueue()
    const order: string[] = []
    const a = q.run('hermes:main', async () => {
      order.push('a:start'); await tick(20); order.push('a:end')
    })
    const b = q.run('hermes:main', async () => {
      order.push('b:start'); await tick(1); order.push('b:end')
    })
    await Promise.all([a, b])
    expect(order).toEqual(['a:start', 'a:end', 'b:start', 'b:end'])
  })

  it('runs different keys in parallel', async () => {
    const q = new TurnQueue()
    const started = Date.now()
    await Promise.all([
      q.run('hermes:room:a', () => tick(30)),
      q.run('hermes:room:b', () => tick(30)),
    ])
    expect(Date.now() - started).toBeLessThan(55)
  })

  it('a failed turn does not block the next one on that key', async () => {
    const q = new TurnQueue()
    await expect(q.run('k', async () => { throw new Error('boom') })).rejects.toThrow('boom')
    await expect(q.run('k', async () => 'fine')).resolves.toBe('fine')
  })
})
