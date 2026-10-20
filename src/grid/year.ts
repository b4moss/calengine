import { assertCalendarConfig } from '../types/config.js'
import { assertLocalDate } from '../types/local-date.js'
import { buildMonthGrid } from './month.js'
import type { MonthGrid, YearGridInput } from './types.js'

/** Build 12 month grids for a year, reusing month grid rules. */
export function buildYearGrids(input: YearGridInput): MonthGrid[] {
  const config = assertCalendarConfig(input.config)
  const today = input.today !== undefined ? assertLocalDate(input.today) : undefined
  const months: MonthGrid[] = []
  for (let month = 1; month <= 12; month += 1) {
    months.push(
      buildMonthGrid({
        year: input.year,
        month,
        config,
        ...(today !== undefined ? { today } : {}),
        ...(input.isHoliday !== undefined ? { isHoliday: input.isHoliday } : {}),
      }),
    )
  }
  return months
}
