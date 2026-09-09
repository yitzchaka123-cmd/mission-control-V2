/**
 * The Hermes contract.
 *
 * This file is the entire agreement between Mission Control and whatever runs the agents.
 * Nothing outside `src/adapters/` may know which brain is behind it.
 *
 * Spec: 001 FR-001..FR-021 · plan.md D1, D2 · tasks.md T006
 */

// ─── Capabilities ────────────────────────────────────────────────────────────
// The honesty mechanism (Constitution I). An absent capability locks its UI with a
// reason. It never fails silently and it never fakes.

export type CapabilityState = 'healthy' | 'degraded' | 'absent'

export interface Capability {
  /** e.g. 'channels.telegram', 'cron', 'mcp', 'browser' */
  readonly name: string
  readonly state: CapabilityState
  /**
   * Plain-language sentence for the owner, required whenever state is not healthy.
   * Written for a non-technical reader: "Hermes on your PC can't reach Telegram yet."
   */
  readonly reason?: string
}

// ─── Brains ──────────────────────────────────────────────────────────────────
// Every brain is flat-rate. A metered option must never appear here (FR-021).

export type LoginState = 'signed-in' | 'expiring' | 'signed-out'

export interface Brain {
  readonly id: string
  readonly label: string
  /** Always true. A metered brain is a spec violation, not a config choice. */
  readonly flatRate: true
  readonly login: LoginState
}

// ─── Sessions ────────────────────────────────────────────────────────────────
// A room IS a session namespace. There is no roster here — Mission Control owns that.

/**
 * `hermes:main` · `hermes:room:<slug>` · `hermes:room:<slug>:w:<worker>` · `hermes:police`
 */
export type SessionKey = string

export interface Session {
  readonly key: SessionKey
  readonly label: string
  readonly model?: string
  /** Lifetime tokens, as reported. Usage — never currency. The plan is flat-rate. */
  readonly lifetimeTokens: number
  readonly ageSeconds: number
}

// ─── Turns ───────────────────────────────────────────────────────────────────

export type ThinkingLevel = 'quick' | 'balanced' | 'deep'

export interface TurnRequest {
  readonly sessionKey: SessionKey
  readonly message: string
  /** Rulebook chapters + agent page + mood line + one office-status text (FR-008). */
  readonly briefing?: string
  readonly model?: string
  readonly thinking?: ThinkingLevel
}

/**
 * Exactly one terminal status per turn, and it is always REPORTED — never inferred by the
 * caller. This is what deletes v1's silent-turn watcher (ripple R6).
 */
export type TurnStatus = 'ok' | 'empty' | 'error' | 'interrupted' | 'awaiting-approval'

export type TurnEvent =
  | { readonly type: 'turn.started'; readonly turnId: string; readonly at: string }
  | { readonly type: 'tool.called'; readonly turnId: string; readonly tool: string }
  | { readonly type: 'text.delta'; readonly turnId: string; readonly text: string }
  | {
      readonly type: 'turn.ended'
      readonly turnId: string
      readonly status: TurnStatus
      readonly at: string
      /** Present when status is not 'ok'. Plain language, for the owner. */
      readonly reason?: string
    }

// ─── The gate ────────────────────────────────────────────────────────────────
// Constitution V. Enforced inside tool execution, never in the UI.

export type GatePosition = 'off' | 'ask' | 'ask-when-it-costs-money' | 'free'

export interface Power {
  readonly name: string
  readonly gate: GatePosition
  /**
   * Real outward currency only — a paid service, a purchase, a payment.
   * Agent thinking is NEVER a money action: the plan is flat-rate.
   * Undeclared defaults to `true` (the safe direction) — see 008 FR-017.
   */
  readonly costsMoney: boolean
}

// ─── Scheduler ───────────────────────────────────────────────────────────────

export interface Job {
  readonly id: string
  readonly schedule: string
  readonly target: SessionKey
  readonly enabled: boolean
  readonly lastFiredAt?: string
  /**
   * Supplied by the caller, not computed here. Hermes stays ignorant of the Jewish
   * calendar; feature 013 owns Shabbos times (plan.md D8).
   */
  readonly holdWindow?: { readonly fromIso: string; readonly toIso: string }
}

// ─── The five verbs ──────────────────────────────────────────────────────────

export interface HelloResponse {
  readonly version: string
  readonly capabilities: readonly Capability[]
  readonly brains: readonly Brain[]
}

export interface HealthResponse {
  readonly ok: boolean
  readonly heartbeatAt: string
  readonly capabilities: readonly Capability[]
  readonly login: LoginState
  /** Named problem rather than a mystery failure — e.g. 'clock-skew'. */
  readonly problems: readonly { readonly kind: string; readonly reason: string }[]
}
