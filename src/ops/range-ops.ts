import { assertDateRange, type DateRange } from '../types/range.js'
import { assertLocalDate, type LocalDate } from '../types/local-date.js'
import { addDays, diffDays } from './add.js'
import { compareLocalDate, isSameLocalDate } from './compare.js'

/** Ensure `[start, end)` with start < end; swaps if needed when both ends provided unordered. */
export function normalizeDateRange(a: LocalDate, b: LocalDate): DateRange {
  const left = assertLocalDate(a)
  const right = assertLocalDate(b)
  if (isSameLocalDate(left, right)) {
    // Single-day selection → [d, d+1)
    return assertDateRange({ start: left, end: addDays(left, 1) })
  }
  if (compareLocalDate(left, right) < 0) {
    return assertDateRange({ start: left, end: right })
  }
  return assertDateRange({ start: right, end: left })
}

export function dateRangesOverlap(a: DateRange, b: DateRange): boolean {
  const left = assertDateRange(a)
  const right = assertDateRange(b)
  return compareLocalDate(left.start, right.end) < 0 && compareLocalDate(right.start, left.end) < 0
}

export function intersectDateRange(a: DateRange, b: DateRange): DateRange | null {
  const left = assertDateRange(a)
  const right = assertDateRange(b)
  const start =
    compareLocalDate(left.start, right.start) >= 0 ? left.start : right.start
  const end = compareLocalDate(left.end, right.end) <= 0 ? left.end : right.end
  if (compareLocalDate(start, end) >= 0) return null
  return { start, end }
}

export function clampDateRange(range: DateRange, bounds: DateRange): DateRange | null {
  return intersectDateRange(range, bounds)
}

export function containsLocalDate(range: DateRange, date: LocalDate): boolean {
  const r = assertDateRange(range)
  const d = assertLocalDate(date)
  return compareLocalDate(d, r.start) >= 0 && compareLocalDate(d, r.end) < 0
}

export function enumerateLocalDates(range: DateRange): LocalDate[] {
  const r = assertDateRange(range)
  const out: LocalDate[] = []
  const n = diffDays(r.start, r.end)
  for (let i = 0; i < n; i += 1) {
    out.push(addDays(r.start, i))
  }
  return out
}
