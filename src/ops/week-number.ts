import {
  assertCalendarConfig,
  ISO_WEEK_DEFAULTS,
  type CalendarConfig,
  type Weekday,
} from '../types/config.js'
import { assertLocalDate, type LocalDate } from '../types/local-date.js'
import { addDays, weekday } from './add.js'

function resolveWeekRules(config?: Partial<CalendarConfig>): {
  weekStartsOn: Weekday
  firstWeekContainsDate: number
} {
  if (config === undefined) {
    return {
      weekStartsOn: ISO_WEEK_DEFAULTS.weekStartsOn,
      firstWeekContainsDate: ISO_WEEK_DEFAULTS.firstWeekContainsDate,
    }
  }
  if (config.timeZone !== undefined) {
    assertCalendarConfig(config as CalendarConfig)
  } else if (config.weekStartsOn !== undefined) {
    const w = config.weekStartsOn
    if (!Number.isInteger(w) || w < 0 || w > 6) {
      throw new Error(`Invalid weekStartsOn: ${String(w)}`)
    }
  }
  return {
    weekStartsOn: (config.weekStartsOn ?? ISO_WEEK_DEFAULTS.weekStartsOn) as Weekday,
    firstWeekContainsDate:
      config.firstWeekContainsDate ?? ISO_WEEK_DEFAULTS.firstWeekContainsDate,
  }
}

/** Start of the week containing `date`, according to `weekStartsOn`. */
export function startOfWeek(date: LocalDate, weekStartsOn: Weekday = 1): LocalDate {
  const d = assertLocalDate(date)
  const wd = weekday(d)
  const delta = (wd - weekStartsOn + 7) % 7
  return addDays(d, -delta)
}

export function endOfWeek(date: LocalDate, weekStartsOn: Weekday = 1): LocalDate {
  return addDays(startOfWeek(date, weekStartsOn), 6)
}

/**
 * Week number for `date`.
 * Default is ISO 8601 (Monday start, first week contains Jan 4).
 * Override via `weekStartsOn` / `firstWeekContainsDate` (D-12 / U-03).
 */
export function weekNumber(date: LocalDate, config?: Partial<CalendarConfig>): number {
  const d = assertLocalDate(date)
  const { weekStartsOn, firstWeekContainsDate } = resolveWeekRules(config)

  const weekStart = startOfWeek(d, weekStartsOn)
  // The week that contains January `firstWeekContainsDate` is week 1 of that year.
  // Determine week-year: if weekStart is before the week containing Jan FWC of year Y,
  // it may belong to previous year; similarly for next year.
  let weekYear = d.year
  const thisYearWeek1Start = startOfWeek(
    { year: weekYear, month: 1, day: firstWeekContainsDate },
    weekStartsOn,
  )
  const nextYearWeek1Start = startOfWeek(
    { year: weekYear + 1, month: 1, day: firstWeekContainsDate },
    weekStartsOn,
  )
  const prevYearWeek1Start = startOfWeek(
    { year: weekYear - 1, month: 1, day: firstWeekContainsDate },
    weekStartsOn,
  )

  let week1 = thisYearWeek1Start
  if (toDayKey(weekStart) >= toDayKey(nextYearWeek1Start)) {
    weekYear += 1
    week1 = nextYearWeek1Start
  } else if (toDayKey(weekStart) < toDayKey(thisYearWeek1Start)) {
    weekYear -= 1
    week1 = prevYearWeek1Start
  }

  const days = Math.round(
    (Date.UTC(weekStart.year, weekStart.month - 1, weekStart.day) -
      Date.UTC(week1.year, week1.month - 1, week1.day)) /
      86_400_000,
  )
  return Math.floor(days / 7) + 1
}

/** ISO week-year for `date` (may differ from calendar year near year boundaries). */
export function weekYear(date: LocalDate, config?: Partial<CalendarConfig>): number {
  const d = assertLocalDate(date)
  const { weekStartsOn, firstWeekContainsDate } = resolveWeekRules(config)
  const weekStart = startOfWeek(d, weekStartsOn)
  const y = d.year
  const thisYearWeek1Start = startOfWeek(
    { year: y, month: 1, day: firstWeekContainsDate },
    weekStartsOn,
  )
  const nextYearWeek1Start = startOfWeek(
    { year: y + 1, month: 1, day: firstWeekContainsDate },
    weekStartsOn,
  )
  if (toDayKey(weekStart) >= toDayKey(nextYearWeek1Start)) return y + 1
  if (toDayKey(weekStart) < toDayKey(thisYearWeek1Start)) return y - 1
  return y
}

function toDayKey(d: LocalDate): number {
  return d.year * 10_000 + d.month * 100 + d.day
}
