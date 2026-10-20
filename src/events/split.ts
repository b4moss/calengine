import { addDays } from '../ops/add.js'
import { compareLocalDate } from '../ops/compare.js'
import { startOfWeek } from '../ops/week-number.js'
import { instantToZonedTime, zonedTimeToInstant } from '../dst/resolve.js'
import type { Instant, TimeZone } from '../types/instant.js'
import type { LocalDate } from '../types/local-date.js'
import type { Weekday } from '../types/config.js'
import type { NormalizedAllDayEvent, NormalizedTimedEvent } from './types.js'

export interface AllDaySegment {
  eventId: string
  startDate: LocalDate
  endDate: LocalDate
  isSegmentStart: boolean
  isSegmentEnd: boolean
}

export interface TimedSegment {
  eventId: string
  start: Instant
  end: Instant
  isSegmentStart: boolean
  isSegmentEnd: boolean
}

function maxDate(a: LocalDate, b: LocalDate): LocalDate {
  return compareLocalDate(a, b) >= 0 ? a : b
}

function minDate(a: LocalDate, b: LocalDate): LocalDate {
  return compareLocalDate(a, b) <= 0 ? a : b
}

/** Clip all-day event to display range, then split on week boundaries. */
export function splitAllDayEvent(
  event: NormalizedAllDayEvent,
  rangeStart: LocalDate,
  rangeEnd: LocalDate,
  weekStartsOn: Weekday,
): AllDaySegment[] {
  const clipStart = maxDate(event.startDate, rangeStart)
  const clipEnd = minDate(event.endDate, rangeEnd)
  if (compareLocalDate(clipStart, clipEnd) >= 0) return []

  const segments: AllDaySegment[] = []
  let cursor = clipStart
  while (compareLocalDate(cursor, clipEnd) < 0) {
    const weekStart = startOfWeek(cursor, weekStartsOn)
    const nextWeek = addDays(weekStart, 7)
    const segEnd = minDate(clipEnd, nextWeek)
    segments.push({
      eventId: event.id,
      startDate: cursor,
      endDate: segEnd,
      isSegmentStart: compareLocalDate(cursor, event.startDate) === 0,
      isSegmentEnd: compareLocalDate(segEnd, event.endDate) === 0,
    })
    cursor = segEnd
  }
  return segments
}

function startOfLocalDay(date: LocalDate, timeZone: TimeZone): Instant {
  return zonedTimeToInstant({ date, hour: 0, minute: 0, second: 0, millisecond: 0 }, timeZone)
}

/** Clip timed event to instant window, split at local midnights (covers multi-day + week edges). */
export function splitTimedEvent(
  event: NormalizedTimedEvent,
  rangeStart: Instant,
  rangeEnd: Instant,
  timeZone: TimeZone,
): TimedSegment[] {
  const clipStart = Math.max(event.start, rangeStart)
  const clipEnd = Math.min(event.end, rangeEnd)
  if (clipStart >= clipEnd) return []

  const segments: TimedSegment[] = []
  let cursor = clipStart
  while (cursor < clipEnd) {
    const local = instantToZonedTime(cursor, timeZone)
    const nextMidnight = startOfLocalDay(addDays(local.date, 1), timeZone)
    const segEnd = Math.min(clipEnd, nextMidnight)
    // Guard against zero-length if cursor is exactly at a pathological boundary
    if (segEnd <= cursor) break
    segments.push({
      eventId: event.id,
      start: cursor,
      end: segEnd,
      isSegmentStart: cursor === event.start,
      isSegmentEnd: segEnd === event.end,
    })
    cursor = segEnd
  }
  return segments
}
