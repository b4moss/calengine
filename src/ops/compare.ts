import { assertLocalDate, type LocalDate } from '../types/local-date.js'

/** Negative if a < b, 0 if equal, positive if a > b. */
export function compareLocalDate(a: LocalDate, b: LocalDate): number {
  const left = assertLocalDate(a)
  const right = assertLocalDate(b)
  if (left.year !== right.year) return left.year - right.year
  if (left.month !== right.month) return left.month - right.month
  return left.day - right.day
}

export function isSameLocalDate(a: LocalDate, b: LocalDate): boolean {
  return compareLocalDate(a, b) === 0
}
