import type { CalendarConfig } from '../types/config.js'
import type { LocalDate } from '../types/local-date.js'
import type { HolidayFlag, IsHoliday } from '../holidays/types.js'

export interface CalendarDay {
  date: LocalDate
  weekday: number
  isCurrentMonth: boolean
  isToday?: boolean
  isWeekend: boolean
  isHoliday: HolidayFlag
}

export interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
}

export interface MonthGrid {
  year: number
  month: number
  weeks: CalendarWeek[]
}

export interface MonthGridInput {
  year: number
  month: number
  config: CalendarConfig
  today?: LocalDate
  isHoliday?: IsHoliday
}

export interface WeekGridInput {
  date: LocalDate
  config: CalendarConfig
  today?: LocalDate
  isHoliday?: IsHoliday
  /** When set, marks `isCurrentMonth` relative to this month (1–12). */
  currentMonth?: number
}

export interface YearGridInput {
  year: number
  config: CalendarConfig
  today?: LocalDate
  isHoliday?: IsHoliday
}
