import type { LocalDate } from '../types/local-date.js'

/** Holiday flag: true/false when known, `'unknown'` when not provided. */
export type HolidayFlag = boolean | 'unknown'

/** Injected holiday predicate (harenohi etc.). Not a package dependency. */
export type IsHoliday = (date: LocalDate) => HolidayFlag
