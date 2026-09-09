#!/usr/bin/env node
/**
 * THROWAWAY SPIKE — Hermes brain adapter (001 tasks T007–T012)
 *
 * This is not part of Hermes. It is deleted once its findings are recorded.
 * Its only job is to answer four questions BEFORE anything is built on top of them:
 *
 *   Q1  Can a first-party runner sign in with the ChatGPT plan and complete a turn,
 *       without a browser step every single time?
 *   Q2  Can a STRUCTURED result be read (text, tool calls, completion status), or is
 *       console scraping the only option?
 *   Q3  What does an expired plan login look like from outside, and can it be detected?
 *   Q4  Do two sessions work at once, or is there a single-session limit?
 *
 * It DISCOVERS rather than assumes: it probes for whichever runners are actually
 * installed and reports what it finds, instead of hard-coding a guess.
 *
 * HOW TO RUN (Windows, in a terminal):
 *     node spike\plan-adapter-spike.mjs
 *
 * It writes spike/out/findings.json and prints a summary. Send both back.
 * It makes no changes to your machine and installs nothing.
 */

import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(import.meta.dirname, 'out')
mkdirSync(OUT, { recursive: true })

/** Candidate first-party runners. We report which exist; we assume none. */
const CANDIDATES = [
  // lane: which brain plan this runner rides. THIS MATTERS — see the note below.
  { id: 'codex',  lane: 'chatgpt-plan', probe: ['codex',  ['--version']], turn: (p) => ['codex',  ['exec', p]] },
  { id: 'openai', lane: 'chatgpt-plan', probe: ['openai', ['--version']], turn: (p) => ['openai', ['api', p]] },
  { id: 'claude', lane: 'claude-max',   probe: ['claude', ['--version']], turn: (p) => ['claude', ['-p', p]] },
]

/**
 * A runner from the WRONG lane must never stand in for the right one.
 *
 * The first draft of this spike tested whichever runner it found first. On a machine with
 * Claude Code installed — which Issac's PC has, for the Dev Room — it would have tested
 * the Claude lane and reported "YES, the ChatGPT plan works". A false pass on the single
 * assumption the whole milestone rests on.
 *
 * So: every runner found is tested, and every result is labelled with its lane.
 */

const TIMEOUT_MS = 120_000

function run(cmd, args, { timeout = TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    const started = Date.now()
    let stdout = '', stderr = '', settled = false
    let child
    try {
      child = spawn(cmd, args, { shell: process.platform === 'win32' })
    } catch (err) {
      return resolve({ ok: false, error: String(err), elapsedMs: 0 })
    }
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      child.kill()
      resolve({ ok: false, timedOut: true, stdout, stderr, elapsedMs: Date.now() - started })
    }, timeout)

    child.stdout?.on('data', (d) => (stdout += d))
    child.stderr?.on('data', (d) => (stderr += d))
    child.on('error', (err) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ ok: false, error: String(err), elapsedMs: Date.now() - started })
    })
    child.on('close', (code) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ ok: code === 0, code, stdout, stderr, elapsedMs: Date.now() - started })
    })
  })
}

/** Does the output look like machine-readable structure, or just prose? (Q2) */
function looksStructured(text) {
  const t = (text || '').trim()
  if (!t) return { structured: false, why: 'empty output' }
  try { JSON.parse(t); return { structured: true, why: 'whole output parses as JSON' } } catch {}
  const lines = t.split('\n').filter(Boolean)
  const jsonLines = lines.filter((l) => { try { JSON.parse(l); return true } catch { return false } })
  if (jsonLines.length >= Math.max(2, lines.length * 0.5)) {
    return { structured: true, why: `${jsonLines.length}/${lines.length} lines parse as JSON (JSONL)` }
  }
  return { structured: false, why: 'plain prose — an adapter would have to parse text' }
}

/** Does this output indicate a login problem rather than a real failure? (Q3) */
function looksLikeLoginProblem(text) {
  const t = (text || '').toLowerCase()
  const signals = ['not logged in', 'sign in', 'login', 'unauthorized', 'unauthenticated',
                   'authenticate', 'expired', '401', 'please run', 'auth']
  const hits = signals.filter((s) => t.includes(s))
  return { likely: hits.length > 0, signals: hits }
}

const findings = {
  spike: '001 brain adapter',
  ranAt: new Date().toISOString(),
  platform: `${process.platform} ${process.arch}`,
  node: process.version,
  runnersFound: [],
  notes: [],
}

console.log('\nHermes brain-adapter spike')
console.log('='.repeat(60))
console.log(`Platform: ${findings.platform}   Node: ${findings.node}\n`)

// ── Which runners are actually installed? ───────────────────────────────────
console.log('Looking for first-party runners...')
const available = []
for (const c of CANDIDATES) {
  const r = await run(c.probe[0], c.probe[1], { timeout: 20_000 })
  const found = r.ok || /version|\d+\.\d+/i.test((r.stdout || '') + (r.stderr || ''))
  console.log(`  ${found ? '✓' : '·'} ${c.id}${found ? ` — ${(r.stdout || r.stderr || '').trim().split('\n')[0]}` : ' — not found'}`)
  if (found) { available.push(c); findings.runnersFound.push({ id: c.id, version: (r.stdout || r.stderr || '').trim().split('\n')[0] }) }
}

if (available.length === 0) {
  findings.notes.push('No first-party runner found on PATH. Install one, or tell Claude which tool you use to talk to your ChatGPT plan.')
  console.log('\n⚠  No runner found. Nothing else can be tested.')
  console.log('   This is a useful answer, not a failure — it tells us what to install.\n')
  writeFileSync(join(OUT, 'findings.json'), JSON.stringify(findings, null, 2))
  process.exit(0)
}

findings.perRunner = {}

for (const target of available) {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Testing: ${target.id}   (lane: ${target.lane})`)
  console.log('─'.repeat(60))
  const f = {}

  // Q1 — a non-interactive turn
  const [c1, a1] = target.turn('Reply with exactly the word: pomegranate')
  const t1 = await run(c1, a1)
  const said = /pomegranate/i.test((t1.stdout || '') + (t1.stderr || ''))
  f.Q1_noninteractive_turn = {
    answer: t1.ok && said ? 'YES' : t1.timedOut ? 'NO - timed out' : 'NO',
    exitCode: t1.code ?? null,
    elapsedMs: t1.elapsedMs,
    sawExpectedWord: said,
    stdoutSample: (t1.stdout || '').slice(0, 1500),
    stderrSample: (t1.stderr || '').slice(0, 1500),
  }
  console.log(`  Q1 turn completes     ${f.Q1_noninteractive_turn.answer}  (${t1.elapsedMs} ms)`)

  // Q2 — structured output
  const s2 = looksStructured(t1.stdout)
  f.Q2_structured_output = { answer: s2.structured ? 'STRUCTURED' : 'PROSE ONLY', why: s2.why }
  console.log(`  Q2 structured output  ${f.Q2_structured_output.answer}  (${s2.why})`)

  // Q3 — login expiry
  const login = looksLikeLoginProblem((t1.stderr || '') + (t1.stdout || ''))
  f.Q3_login_expiry_detectable = {
    answer: t1.ok ? 'NOT SEEN (login currently valid)' : login.likely ? 'YES - detectable' : 'UNCLEAR',
    signalsSeen: login.signals,
    note: 'To test properly, sign out of this plan and re-run the spike.',
  }
  console.log(`  Q3 login detectable   ${f.Q3_login_expiry_detectable.answer}`)

  // Q4 — two at once
  const [c2, a2] = target.turn('Reply with exactly the word: alpha')
  const [c3, a3] = target.turn('Reply with exactly the word: beta')
  const started = Date.now()
  const [r2, r3] = await Promise.all([run(c2, a2), run(c3, a3)])
  f.Q4_concurrent_sessions = {
    answer: r2.ok && r3.ok ? 'YES - both completed' : 'NO or LIMITED',
    wallClockMs: Date.now() - started,
    first: { ok: r2.ok, code: r2.code ?? null, elapsedMs: r2.elapsedMs },
    second: { ok: r3.ok, code: r3.code ?? null, elapsedMs: r3.elapsedMs },
    stderrSample: ((r2.stderr || '') + (r3.stderr || '')).slice(0, 1000),
  }
  console.log(`  Q4 two at once        ${f.Q4_concurrent_sessions.answer}`)

  f.lane = target.lane
  findings.perRunner[target.id] = f
}

// The critical-path lane is chatgpt-plan. Say plainly whether IT was proven.
const chatgptRunners = Object.entries(findings.perRunner).filter(([, f]) => f.lane === 'chatgpt-plan')
const chatgptProven = chatgptRunners.some(([, f]) => f.Q1_noninteractive_turn.answer === 'YES')
findings.verdict = {
  chatgptPlanLaneProven: chatgptProven,
  claudeMaxLaneProven: Object.entries(findings.perRunner)
    .some(([, f]) => f.lane === 'claude-max' && f.Q1_noninteractive_turn.answer === 'YES'),
  recommendation: chatgptProven
    ? 'Proceed with chatgpt-plan as the critical-path adapter (001 T012).'
    : chatgptRunners.length === 0
      ? 'No ChatGPT-plan runner found. Either install one, or switch the critical path to claude-max (already proven on this PC for the Dev Room).'
      : 'A ChatGPT-plan runner exists but did not complete a turn. See its stderrSample. Fallback: claude-max.',
}

writeFileSync(join(OUT, 'findings.json'), JSON.stringify(findings, null, 2))

console.log(`\n${'='.repeat(60)}`)
console.log('VERDICT')
console.log(`  ChatGPT-plan lane proven?  ${findings.verdict.chatgptPlanLaneProven ? 'YES' : 'NO'}`)
console.log(`  Claude Max lane proven?    ${findings.verdict.claudeMaxLaneProven ? 'YES' : 'NO'}`)
console.log(`\n  ${findings.verdict.recommendation}`)
console.log(`\nWritten to: ${join(OUT, 'findings.json')}`)
console.log('Send that file back. Nothing on your machine was changed.\n')
