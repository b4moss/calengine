import { CalEngineError } from '../errors.js'
import { assertLocalDate, type LocalDate } from './local-date.js'
import { compareLocalDate } from '../ops/compare.js'

/** Half-open date range `[start, end)`. */
export interface DateRange {
  start: LocalDate
  /** Exclusive end. */
  end: LocalDate
}

export function assertDateRange(range: DateRange): DateRange {
  const start = assertLocalDate(range.start)
  const end = assertLocalDate(range.end)
  if (compareLocalDate(start, end) >= 0) {
    throw new CalEngineError(
      'INVALID_DATE_RANGE',
      `DateRange requires start < end (got start=${start.year}-${start.month}-${start.day}, end=${end.year}-${end.month}-${end.day})`,
    )
  }
  return { start, end }
}
