import { CalEngineError } from '../errors.js'
import { addDays } from '../ops/add.js'
import { startOfWeek, weekNumber } from '../ops/week-number.js'
import { assertCalendarConfig } from '../types/config.js'
import { assertLocalDate, daysInMonth } from '../types/local-date.js'
import { buildCalendarDay } from './day.js'
import type { CalendarWeek, MonthGrid, MonthGridInput } from './types.js'

export function buildMonthGrid(input: MonthGridInput): MonthGrid {
  const config = assertCalendarConfig(input.config)
  const { year, month } = input
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new CalEngineError('INVALID_LOCAL_DATE', `Invalid year/month: ${year}-${month}`)
  }
  const today = input.today !== undefined ? assertLocalDate(input.today) : undefined

  const first = { year, month, day: 1 }
  const dim = daysInMonth(year, month)
  const last = { year, month, day: dim }

  const gridStart = startOfWeek(first, config.weekStartsOn)
  // Include through the week that contains the last day of the month
  const lastWeekStart = startOfWeek(last, config.weekStartsOn)
  const gridEndExclusive = addDays(lastWeekStart, 7)

  const weeks: CalendarWeek[] = []
  let cursor = gridStart
  while (
    cursor.year < gridEndExclusive.year ||
    (cursor.year === gridEndExclusive.year && cursor.month < gridEndExclusive.month) ||
    (cursor.year === gridEndExclusive.year &&
      cursor.month === gridEndExclusive.month &&
      cursor.day < gridEndExclusive.day)
  ) {
    const days = []
    for (let i = 0; i < 7; i += 1) {
      const date = addDays(cursor, i)
      days.push(
        buildCalendarDay({
          date,
          isCurrentMonth: date.year === year && date.month === month,
          ...(today !== undefined ? { today } : {}),
          ...(input.isHoliday !== undefined ? { isHoliday: input.isHoliday } : {}),
        }),
      )
    }
    weeks.push({
      weekNumber: weekNumber(days[0]!.date, config),
      days,
    })
    cursor = addDays(cursor, 7)
  }

  if (weeks.length < 4 || weeks.length > 6) {
    throw new CalEngineError(
      'INVALID_CONFIG',
      `Month grid week count out of expected 4–6: got ${weeks.length} for ${year}-${month}`,
    )
  }

  return { year, month, weeks }
}
