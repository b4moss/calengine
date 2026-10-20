import { isSameLocalDate } from '../ops/compare.js'
import { weekday } from '../ops/add.js'
import type { LocalDate } from '../types/local-date.js'
import type { IsHoliday } from '../holidays/types.js'
import type { CalendarDay } from './types.js'

export function buildCalendarDay(options: {
  date: LocalDate
  isCurrentMonth: boolean
  today?: LocalDate
  isHoliday?: IsHoliday
}): CalendarDay {
  const { date, isCurrentMonth, today, isHoliday } = options
  const wd = weekday(date)
  const day: CalendarDay = {
    date: { year: date.year, month: date.month, day: date.day },
    weekday: wd,
    isCurrentMonth,
    isWeekend: wd === 0 || wd === 6,
    isHoliday: isHoliday ? isHoliday(date) : 'unknown',
  }
  if (today !== undefined && isSameLocalDate(date, today)) {
    day.isToday = true
  }
  return day
}
