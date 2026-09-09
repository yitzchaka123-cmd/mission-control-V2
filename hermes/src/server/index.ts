/**
 * The Hermes HTTP server — tasks.md T017, plan.md D1.
 *
 * Binds 127.0.0.1 ONLY. Never a public interface, not even behind a firewall: this process
 * holds the owner's plan login and can execute tools.
 *
 * The route table is FIXED and enumerable (spec FR-015). There is no "run anything" door,
 * and `routes()` exists so a test can prove it.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { log } from '../log.js'

export const LOOPBACK = '127.0.0.1'

export type Handler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

export interface Route {
  readonly method: 'GET' | 'POST'
  readonly path: string
  readonly handler: Handler
}

/**
 * The complete command surface. Adding a route means adding a line here, which means a
 * reviewer sees it. That is the point.
 */
export class Hermes {
  readonly #routes: Route[] = []
  #server: Server | undefined

  route(method: Route['method'], path: string, handler: Handler): this {
    if (this.#routes.some((r) => r.method === method && r.path === path)) {
      throw new Error(`Route already defined: ${method} ${path}`)
    }
    this.#routes.push({ method, path, handler })
    return this
  }

  /** The fixed surface, for the architecture test and for `hello`. */
  routes(): readonly Route[] {
    return [...this.#routes]
  }

  async #dispatch(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = (req.url ?? '/').split('?')[0] ?? '/'
    const match = this.#routes.find((r) => r.method === req.method && r.path === path)

    if (!match) {
      // Unknown route is refused plainly. It is never guessed at or forwarded anywhere.
      res.writeHead(404, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: 'no such endpoint', method: req.method, path }))
      return
    }

    try {
      await match.handler(req, res)
    } catch (err) {
      log.error('handler failed', { path, error: String(err) })
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'internal error' }))
      }
    }
  }

  /** Start listening. `host` is fixed to loopback and is not configurable by design. */
  listen(port: number): Promise<{ port: number; host: string }> {
    return new Promise((resolve, reject) => {
      this.#server = createServer((req, res) => void this.#dispatch(req, res))
      this.#server.once('error', reject)
      this.#server.listen(port, LOOPBACK, () => {
        const addr = this.#server?.address()
        const actual = typeof addr === 'object' && addr ? addr.port : port
        log.info('hermes listening', { host: LOOPBACK, port: actual, routes: this.#routes.length })
        resolve({ port: actual, host: LOOPBACK })
      })
    })
  }

  async close(): Promise<void> {
    const s = this.#server
    if (!s) return
    await new Promise<void>((resolve) => s.close(() => resolve()))
    this.#server = undefined
  }
}
