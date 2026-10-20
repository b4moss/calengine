import type { LocalDate } from '../types/local-date.js'
import type { DateRange } from '../types/range.js'
import {
  clampDateRange,
  dateRangesOverlap,
  intersectDateRange,
  normalizeDateRange,
} from '../ops/range-ops.js'

/**
 * Build a half-open selection range from two picks (order-independent).
 * Same-day pick → `[d, d+1)`.
 */
export function selectDateRange(a: LocalDate, b: LocalDate): DateRange {
  return normalizeDateRange(a, b)
}

export {
  normalizeDateRange,
  dateRangesOverlap,
  intersectDateRange,
  clampDateRange,
}
