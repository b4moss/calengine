import { assertLocalDate, daysInMonth, type LocalDate } from '../types/local-date.js'

function toOrdinal(date: LocalDate): number {
  // Days since a fixed epoch (year 1-01-01) using proleptic Gregorian via UTC noon.
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day, 12, 0, 0) / 86_400_000)
}

function fromOrdinal(ordinal: number): LocalDate {
  const d = new Date(ordinal * 86_400_000)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  }
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const base = assertLocalDate(date)
  if (!Number.isInteger(days)) {
    throw new RangeError(`days must be an integer, got ${days}`)
  }
  return fromOrdinal(toOrdinal(base) + days)
}

export function addMonths(date: LocalDate, months: number): LocalDate {
  const base = assertLocalDate(date)
  if (!Number.isInteger(months)) {
    throw new RangeError(`months must be an integer, got ${months}`)
  }
  const total = base.year * 12 + (base.month - 1) + months
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  const dim = daysInMonth(year, month)
  const day = Math.min(base.day, dim) // D-11 / U-02: clamp to month end
  return { year, month, day }
}

export function addYears(date: LocalDate, years: number): LocalDate {
  if (!Number.isInteger(years)) {
    throw new RangeError(`years must be an integer, got ${years}`)
  }
  return addMonths(date, years * 12)
}

export function startOfMonth(date: LocalDate): LocalDate {
  const d = assertLocalDate(date)
  return { year: d.year, month: d.month, day: 1 }
}

export function endOfMonth(date: LocalDate): LocalDate {
  const d = assertLocalDate(date)
  return { year: d.year, month: d.month, day: daysInMonth(d.year, d.month) }
}

/** Day of week: 0 = Sunday … 6 = Saturday (UTC-based calendar math). */
export function weekday(date: LocalDate): number {
  const d = assertLocalDate(date)
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
}

export function diffDays(a: LocalDate, b: LocalDate): number {
  return toOrdinal(assertLocalDate(b)) - toOrdinal(assertLocalDate(a))
}
