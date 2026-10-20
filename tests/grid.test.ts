import { describe, expect, it } from 'vitest'
import {
  buildMonthGrid,
  buildWeekGrid,
  buildYearGrids,
  type CalendarConfig,
  type LocalDate,
} from '../src/index.js'

const baseConfig: CalendarConfig = {
  timeZone: 'Asia/Tokyo',
  weekStartsOn: 1,
}

function hasPixelKeys(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (/px|css|className|style|width|height|top|left/i.test(k)) return true
    if (hasPixelKeys(v)) return true
  }
  if (Array.isArray(value)) return value.some(hasPixelKeys)
  return false
}

describe('v0.3.0 calendar grids', () => {
  it('TC-GRID-M-01: 2024-02 weekStartsOn=1 → weeks of 7, only 4–6 weeks (D-08)', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    expect(grid.weeks.length).toBeGreaterThanOrEqual(4)
    expect(grid.weeks.length).toBeLessThanOrEqual(6)
    for (const week of grid.weeks) {
      expect(week.days).toHaveLength(7)
    }
  })

  it('TC-GRID-M-02: leap February includes day 29 as current month', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    const days = grid.weeks.flatMap((w) => w.days)
    const feb29 = days.find(
      (d) => d.date.year === 2024 && d.date.month === 2 && d.date.day === 29,
    )
    expect(feb29).toBeDefined()
    expect(feb29!.isCurrentMonth).toBe(true)
  })

  it('TC-GRID-M-03: weekStartsOn=0 → first column is Sunday', () => {
    const grid = buildMonthGrid({
      year: 2024,
      month: 2,
      config: { ...baseConfig, weekStartsOn: 0 },
    })
    for (const week of grid.weeks) {
      expect(week.days[0]!.weekday).toBe(0)
    }
  })

  it('TC-GRID-M-04: leading/trailing cells have isCurrentMonth false', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    const first = grid.weeks[0]!.days[0]!
    const lastWeek = grid.weeks[grid.weeks.length - 1]!
    const last = lastWeek.days[6]!
    // Feb 2024 starts Thursday; with Mon start, first cell is Jan 29
    expect(first.isCurrentMonth).toBe(false)
    expect(first.date.month).toBe(1)
    // Ends on Thu; week continues into March
    expect(last.isCurrentMonth).toBe(false)
    expect(last.date.month).toBe(3)
  })

  it('TC-GRID-M-05: omitted isHoliday → isHoliday === unknown (D-07)', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    for (const day of grid.weeks.flatMap((w) => w.days)) {
      expect(day.isHoliday).toBe('unknown')
    }
  })

  it('TC-GRID-M-06: isHoliday true is reflected on matching days', () => {
    const holiday: LocalDate = { year: 2024, month: 2, day: 11 }
    const grid = buildMonthGrid({
      year: 2024,
      month: 2,
      config: baseConfig,
      isHoliday: (d) =>
        d.year === holiday.year && d.month === holiday.month && d.day === holiday.day,
    })
    const target = grid.weeks
      .flatMap((w) => w.days)
      .find((d) => d.date.day === 11 && d.isCurrentMonth)
    expect(target!.isHoliday).toBe(true)
    const other = grid.weeks
      .flatMap((w) => w.days)
      .find((d) => d.date.day === 12 && d.isCurrentMonth)
    expect(other!.isHoliday).toBe(false)
  })

  it('TC-GRID-M-07: omitted today → no isToday field', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    for (const day of grid.weeks.flatMap((w) => w.days)) {
      expect('isToday' in day).toBe(false)
    }
  })

  it('TC-GRID-W-01: week grid length is 7', () => {
    const days = buildWeekGrid({
      date: { year: 2024, month: 2, day: 14 },
      config: baseConfig,
    })
    expect(days).toHaveLength(7)
    expect(days[0]!.weekday).toBe(1)
  })

  it('TC-GRID-Y-01: year grid has 12 months with same month rules', () => {
    const months = buildYearGrids({ year: 2024, config: baseConfig })
    expect(months).toHaveLength(12)
    for (let i = 0; i < 12; i += 1) {
      expect(months[i]!.month).toBe(i + 1)
      expect(months[i]!.year).toBe(2024)
      const rebuilt = buildMonthGrid({ year: 2024, month: i + 1, config: baseConfig })
      expect(months[i]).toEqual(rebuilt)
    }
  })

  it('TC-GRID-NO-PX: grid results have no pixel/CSS fields', () => {
    const grid = buildMonthGrid({ year: 2024, month: 2, config: baseConfig })
    expect(hasPixelKeys(grid)).toBe(false)
  })
})
