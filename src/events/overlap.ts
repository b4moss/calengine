import { compareLocalDate } from '../ops/compare.js'
import type { Instant } from '../types/instant.js'
import type { LocalDate } from '../types/local-date.js'

export function timedIntervalsOverlap(
  aStart: Instant,
  aEnd: Instant,
  bStart: Instant,
  bEnd: Instant,
): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function dateIntervalsOverlap(
  aStart: LocalDate,
  aEnd: LocalDate,
  bStart: LocalDate,
  bEnd: LocalDate,
): boolean {
  return compareLocalDate(aStart, bEnd) < 0 && compareLocalDate(bStart, aEnd) < 0
}
