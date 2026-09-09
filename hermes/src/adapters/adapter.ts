/**
 * The BrainAdapter interface — plan.md D2, tasks.md T013.
 *
 * This is the ONLY thing the rest of Hermes knows about a brain. Everything vendor-specific
 * lives in an implementation under this directory, and the architecture test in
 * tests/architecture/ keeps it that way.
 *
 * PROVISIONAL: written before the spike (T008–T012) reported. The spike may amend it —
 * particularly `run()`, if a runner turns out to emit prose rather than structure.
 */

import type { Brain, LoginState, TurnEvent, TurnRequest } from '../contract/types.js'

export interface BrainAdapter {
  /** Stable id, e.g. 'chatgpt-plan' | 'claude-max'. */
  readonly id: string

  /** Every brain is flat-rate. A metered adapter is a spec violation (001 FR-021). */
  readonly flatRate: true

  /** Current plan-login state. A stale login is a NORMAL state, not an outage (FR-019). */
  login(): Promise<LoginState>

  /** Run one turn, streaming events. Must emit exactly one terminal `turn.ended`. */
  run(turn: TurnRequest, signal?: AbortSignal): AsyncIterable<TurnEvent>

  /** What this brain can and cannot do, for the honesty layer (FR-013). */
  describe(): Promise<Brain>
}
