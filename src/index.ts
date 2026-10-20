/**
 * @b4m/calengine public API — v0.4.1 adds LocalDate string format/parse.
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

export { type HolidayFlag, type IsHoliday } from './holidays/types.js'

export type {
  CalendarDay,
  CalendarWeek,
  MonthGrid,
  MonthGridInput,
  WeekGridInput,
  YearGridInput,
} from './grid/types.js'

export { buildMonthGrid } from './grid/month.js'
export { buildWeekGrid } from './grid/week.js'
export { buildYearGrids } from './grid/year.js'

export type {
  CalendarEvent,
  EventLayoutSegment,
  NormalizedEvent,
  NormalizedTimedEvent,
  NormalizedAllDayEvent,
} from './events/types.js'

export { normalizeEvent } from './events/normalize.js'
export { layoutEvents, type LayoutEventsInput } from './events/layout.js'

export {
  selectDateRange,
  normalizeDateRange as normalizeSelectionRange,
} from './range/selection.js'

export { formatLocalDate, parseLocalDate } from './ops/local-date-string.js'
