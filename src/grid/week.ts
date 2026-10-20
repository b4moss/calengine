import { addDays } from '../ops/add.js'
import { startOfWeek } from '../ops/week-number.js'
import { assertCalendarConfig } from '../types/config.js'
import { assertLocalDate } from '../types/local-date.js'
import { buildCalendarDay } from './day.js'
import type { CalendarDay, WeekGridInput } from './types.js'

/** Build the 7-day week containing `date`, ordered by `weekStartsOn`. */
export function buildWeekGrid(input: WeekGridInput): CalendarDay[] {
  const config = assertCalendarConfig(input.config)
  const date = assertLocalDate(input.date)
  const today = input.today !== undefined ? assertLocalDate(input.today) : undefined
  const weekStart = startOfWeek(date, config.weekStartsOn)
  const days: CalendarDay[] = []
  for (let i = 0; i < 7; i += 1) {
    const d = addDays(weekStart, i)
    const isCurrentMonth =
      input.currentMonth !== undefined
        ? d.month === input.currentMonth
        : true
    days.push(
      buildCalendarDay({
        date: d,
        isCurrentMonth,
        ...(today !== undefined ? { today } : {}),
        ...(input.isHoliday !== undefined ? { isHoliday: input.isHoliday } : {}),
      }),
    )
  }
  return days
}
