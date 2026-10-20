import { CalEngineError } from '../errors.js'

/** Calendar date without time zone or clock time. */
export interface LocalDate {
  year: number
  /** 1–12 */
  month: number
  day: number
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new CalEngineError('INVALID_LOCAL_DATE', `Invalid month: ${month}`)
  }
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return lengths[month - 1]!
}

export function isValidLocalDate(date: LocalDate): boolean {
  const { year, month, day } = date
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false
  }
  if (month < 1 || month > 12) return false
  if (day < 1 || day > daysInMonth(year, month)) return false
  return true
}

export function assertLocalDate(date: LocalDate): LocalDate {
  if (!isValidLocalDate(date)) {
    throw new CalEngineError(
      'INVALID_LOCAL_DATE',
      `Invalid LocalDate: ${date.year}-${date.month}-${date.day}`,
    )
  }
  return { year: date.year, month: date.month, day: date.day }
}

export function localDate(year: number, month: number, day: number): LocalDate {
  return assertLocalDate({ year, month, day })
}
