/**
 * @b4m/calengine public API — v0.2.0 date model & operations.
 */

export { CalEngineError, type CalEngineErrorCode } from './errors.js'

export {
  type LocalDate,
  isLeapYear,
  daysInMonth,
  isValidLocalDate,
  assertLocalDate,
  localDate,
} from './types/local-date.js'

export {
  type LocalDateTime,
  assertLocalDateTime,
} from './types/local-date-time.js'

export { type Instant, type TimeZone } from './types/instant.js'

export { type DateRange, assertDateRange } from './types/range.js'

export {
  type Weekday,
  type CalendarConfig,
  assertCalendarConfig,
  ISO_WEEK_DEFAULTS,
} from './types/config.js'

export { compareLocalDate, isSameLocalDate } from './ops/compare.js'

export {
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  weekday,
  diffDays,
} from './ops/add.js'

export {
  startOfWeek,
  endOfWeek,
  weekNumber,
  weekYear,
} from './ops/week-number.js'

export {
  normalizeDateRange,
  dateRangesOverlap,
  intersectDateRange,
  clampDateRange,
  containsLocalDate,
  enumerateLocalDates,
} from './ops/range-ops.js'

export {
  zonedTimeToInstant,
  instantToZonedTime,
  getTimeZoneOffsetMs,
  type ZonedConvertOptions,
} from './dst/resolve.js'
