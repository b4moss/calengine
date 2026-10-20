import { CalEngineError } from '../errors.js'
import type { TimeZone } from './instant.js'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CalendarConfig {
  timeZone: TimeZone
  /** 0 = Sunday … 6 = Saturday */
  weekStartsOn: Weekday
  locale?: string
  /** Day of January that must be in week 1. ISO default is 4. */
  firstWeekContainsDate?: number
}

export function assertCalendarConfig(config: CalendarConfig): CalendarConfig {
  if (typeof config.timeZone !== 'string' || config.timeZone.length === 0) {
    throw new CalEngineError('INVALID_CONFIG', 'CalendarConfig.timeZone must be a non-empty IANA id')
  }
  const w = config.weekStartsOn
  if (!Number.isInteger(w) || w < 0 || w > 6) {
    throw new CalEngineError('INVALID_CONFIG', `Invalid weekStartsOn: ${String(w)}`)
  }
  const first = config.firstWeekContainsDate
  if (first !== undefined && (!Number.isInteger(first) || first < 1 || first > 7)) {
    throw new CalEngineError(
      'INVALID_CONFIG',
      `Invalid firstWeekContainsDate: ${String(first)} (expected 1–7)`,
    )
  }
  try {
    // Validate IANA id via Intl
    new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone }).format(0)
  } catch {
    throw new CalEngineError('INVALID_CONFIG', `Unknown timeZone: ${config.timeZone}`)
  }
  const result: CalendarConfig = {
    timeZone: config.timeZone,
    weekStartsOn: w as Weekday,
  }
  if (config.locale !== undefined) {
    result.locale = config.locale
  }
  if (first !== undefined) {
    result.firstWeekContainsDate = first
  }
  return result
}

/** ISO 8601 defaults used when config omits week fields for weekNumber helpers. */
export const ISO_WEEK_DEFAULTS = {
  weekStartsOn: 1 as Weekday,
  firstWeekContainsDate: 4,
} as const
