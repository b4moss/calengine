import { CalEngineError } from '../errors.js'
import type { Instant, TimeZone } from '../types/instant.js'
import { assertLocalDateTime, type LocalDateTime } from '../types/local-date-time.js'

export interface ZonedConvertOptions {
  /** When true, nonexistent (gap) or ambiguous (overlap) local times throw. */
  strict?: boolean
}

interface LocalParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}

function partsFromLocal(local: Required<LocalDateTime>): LocalParts {
  return {
    year: local.date.year,
    month: local.date.month,
    day: local.date.day,
    hour: local.hour,
    minute: local.minute,
    second: local.second,
    millisecond: local.millisecond,
  }
}

function formatParts(instant: Instant, timeZone: TimeZone): LocalParts {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  const bag: Record<string, string> = {}
  for (const { type, value } of dtf.formatToParts(new Date(instant))) {
    if (type !== 'literal') bag[type] = value
  }
  let hour = Number(bag['hour'])
  if (hour === 24) hour = 0
  return {
    year: Number(bag['year']),
    month: Number(bag['month']),
    day: Number(bag['day']),
    hour,
    minute: Number(bag['minute']),
    second: Number(bag['second']),
    millisecond: Number(bag['fractionalSecond'] ?? '0'),
  }
}

function partsEqual(a: LocalParts, b: LocalParts): boolean {
  return (
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.hour === b.hour &&
    a.minute === b.minute &&
    a.second === b.second &&
    a.millisecond === b.millisecond
  )
}

/** Offset of `timeZone` at `instant`: local = UTC + offset. */
export function getTimeZoneOffsetMs(instant: Instant, timeZone: TimeZone): number {
  const p = formatParts(instant, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second, p.millisecond)
  return asUtc - instant
}

function guessUtcMs(parts: LocalParts): number {
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  )
}

function assertTimeZone(timeZone: TimeZone): void {
  if (typeof timeZone !== 'string' || timeZone.length === 0) {
    throw new CalEngineError('INVALID_CONFIG', 'timeZone is required (no implicit default)')
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0)
  } catch {
    throw new CalEngineError('INVALID_CONFIG', `Unknown timeZone: ${timeZone}`)
  }
}

/**
 * Discover UTC offsets around a point, expanding through candidate instants
 * so both sides of a DST transition are visible.
 */
function discoverOffsets(around: Instant, timeZone: TimeZone): number[] {
  const offsets = new Set<number>()
  const probes = new Set<Instant>([around])
  // ±14h covers typical single transitions relative to a local-as-UTC guess
  for (let h = -14; h <= 14; h += 1) {
    probes.add(around + h * 3_600_000)
  }
  for (const probe of probes) {
    const offset = getTimeZoneOffsetMs(probe, timeZone)
    offsets.add(offset)
    // Also probe the instant implied by interpreting `around` with this offset
    probes.add(around - offset)
  }
  // Second pass for any newly added probes
  for (const probe of probes) {
    offsets.add(getTimeZoneOffsetMs(probe, timeZone))
  }
  return [...offsets]
}

/** Instants whose wall time in `timeZone` equals `wanted`. */
function matchingInstants(wanted: LocalParts, timeZone: TimeZone): Instant[] {
  const utcAsIf = guessUtcMs(wanted)
  const found = new Set<Instant>()
  for (const offset of discoverOffsets(utcAsIf, timeZone)) {
    const candidate = utcAsIf - offset
    if (partsEqual(formatParts(candidate, timeZone), wanted)) {
      found.add(candidate)
    }
  }
  return [...found].sort((a, b) => a - b)
}

function addMinutes(parts: LocalParts, minutes: number): LocalParts {
  const utc = guessUtcMs(parts) + minutes * 60_000
  const d = new Date(utc)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds(),
  }
}

/**
 * Convert local wall time in `timeZone` to Instant.
 * DST policy (D-13 / U-06):
 * - gap (nonexistent): map to the first valid instant after the gap
 * - overlap (ambiguous): prefer the earlier offset (first occurrence)
 * - `strict: true`: throw on gap/overlap
 */
export function zonedTimeToInstant(
  local: LocalDateTime,
  timeZone: TimeZone,
  opts?: ZonedConvertOptions,
): Instant {
  assertTimeZone(timeZone)
  const normalized = assertLocalDateTime(local)
  const wanted = partsFromLocal(normalized)
  const strict = opts?.strict === true

  const matches = matchingInstants(wanted, timeZone)

  if (matches.length === 1) {
    return matches[0]!
  }

  if (matches.length >= 2) {
    if (strict) {
      throw new CalEngineError(
        'DST_OVERLAP',
        `Ambiguous local time ${wanted.year}-${wanted.month}-${wanted.day} ${wanted.hour}:${wanted.minute} in ${timeZone}`,
      )
    }
    // Earlier Instant = earlier offset occurrence
    return matches[0]!
  }

  // Gap: no exact match
  if (strict) {
    throw new CalEngineError(
      'DST_GAP',
      `Nonexistent local time ${wanted.year}-${wanted.month}-${wanted.day} ${wanted.hour}:${wanted.minute} in ${timeZone}`,
    )
  }

  // Walk forward minute-by-minute until a wall time round-trips (immediately after the gap).
  for (let addMin = 1; addMin <= 180; addMin += 1) {
    const trial = addMinutes(wanted, addMin)
    const trialMatches = matchingInstants(trial, timeZone)
    if (trialMatches.length > 0) {
      return trialMatches[0]!
    }
  }

  throw new CalEngineError(
    'DST_GAP',
    `Could not resolve local time ${wanted.year}-${wanted.month}-${wanted.day} ${wanted.hour}:${wanted.minute} in ${timeZone}`,
  )
}

/** Convert Instant to local wall time in `timeZone` (tz required; no default). */
export function instantToZonedTime(instant: Instant, timeZone: TimeZone): Required<LocalDateTime> {
  assertTimeZone(timeZone)
  if (!Number.isFinite(instant)) {
    throw new CalEngineError('INVALID_LOCAL_DATE_TIME', `Invalid instant: ${String(instant)}`)
  }
  const p = formatParts(instant, timeZone)
  return {
    date: { year: p.year, month: p.month, day: p.day },
    hour: p.hour,
    minute: p.minute,
    second: p.second,
    millisecond: p.millisecond,
  }
}
