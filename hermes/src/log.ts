/**
 * Structured logging with secret redaction AT THE SOURCE — tasks.md T019, spec FR-019.
 *
 * Redacting at display is not redaction: the secret has already been written somewhere by
 * then. Everything goes through here, and here is where it is removed.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** Registered secrets. Values are never stored elsewhere and never read back. */
const secrets = new Set<string>()

/** Tell the logger about a secret so it can be scrubbed from every future line. */
export function registerSecret(value: string): void {
  if (value && value.length >= 8) secrets.add(value)
}

/** Patterns that look like credentials even when we were never told about them. */
const PATTERNS: readonly RegExp[] = [
  /\b(sk|pk|rk)-[A-Za-z0-9_-]{16,}\b/g, // common key prefixes
  /\bBearer\s+[A-Za-z0-9._~+/-]{16,}=*/gi,
  /\b[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{16,}\b/g, // JWT-shaped
  /\b\d{6,10}:[A-Za-z0-9_-]{30,}\b/g, // bot-token shaped
]

export function redact(input: string): string {
  let out = input
  for (const s of secrets) out = out.split(s).join('[redacted]')
  for (const p of PATTERNS) out = out.replace(p, '[redacted]')
  return out
}

export interface LogLine {
  readonly at: string
  readonly level: LogLevel
  readonly msg: string
  readonly fields?: Readonly<Record<string, unknown>>
}

type Sink = (line: LogLine) => void
let sink: Sink = (line) => process.stdout.write(JSON.stringify(line) + '\n')

/** Swap the destination (tests, or the rolling feed the bridge reads). */
export function setSink(next: Sink): void {
  sink = next
}

function emit(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
  const safeFields = fields
    ? Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, typeof v === 'string' ? redact(v) : v]),
      )
    : undefined
  sink({
    at: new Date().toISOString(),
    level,
    msg: redact(msg),
    ...(safeFields ? { fields: safeFields } : {}),
  })
}

export const log = {
  debug: (m: string, f?: Record<string, unknown>) => emit('debug', m, f),
  info: (m: string, f?: Record<string, unknown>) => emit('info', m, f),
  warn: (m: string, f?: Record<string, unknown>) => emit('warn', m, f),
  error: (m: string, f?: Record<string, unknown>) => emit('error', m, f),
}
