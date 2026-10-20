import { CalEngineError } from '../errors.js'
import { localDate, type LocalDate } from '../types/local-date.js'

/** Format `LocalDate` as `YYYY-MM-DD` (zero-padded month/day). */
export function formatLocalDate(date: LocalDate): string {
  const mm = String(date.month).padStart(2, '0')
  const dd = String(date.day).padStart(2, '0')
  return `${date.year}-${mm}-${dd}`
}

/**
 * Parse `YYYY-MM-DD` into a validated `LocalDate`.
 * Invalid shape or non-existent calendar day throws `CalEngineError`.
 */
export function parseLocalDate(iso: string): LocalDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) {
    throw new CalEngineError('INVALID_LOCAL_DATE', `Invalid LocalDate string: ${iso}`)
  }
  return localDate(Number(m[1]), Number(m[2]), Number(m[3]))
}
