/**
 * Per-key turn serialisation — tasks.md T016, spec FR-014.
 *
 * Two turns on one session key must never interleave: they share a conversation, and
 * interleaving them corrupts it. Different keys run freely in parallel.
 */

export class TurnQueue {
  readonly #tails = new Map<string, Promise<unknown>>()

  /** Run `work` after anything already queued for `key`. Failures do not block the queue. */
  run<T>(key: string, work: () => Promise<T>): Promise<T> {
    const previous = this.#tails.get(key) ?? Promise.resolve()
    const next = previous.then(work, work)
    // Keep the chain alive even when a turn throws; the next turn still gets its slot.
    this.#tails.set(
      key,
      next.then(
        () => undefined,
        () => undefined,
      ),
    )
    return next
  }

  /** How many keys currently have work queued or running. */
  activeKeys(): number {
    return this.#tails.size
  }

  /** Drop finished chains so the map does not grow without bound. */
  async settle(key: string): Promise<void> {
    await this.#tails.get(key)
    this.#tails.delete(key)
  }
}
