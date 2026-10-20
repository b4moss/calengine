import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addMonths,
  assertDateRange,
  CalEngineError,
  compareLocalDate,
  containsLocalDate,
  isValidLocalDate,
  localDate,
  normalizeDateRange,
  weekNumber,
  weekYear,
} from '../src/index.js'

describe('v0.2.0 date ops', () => {
  it('TC-DATE-LEAP-01: 2024-02-29 is valid', () => {
    expect(isValidLocalDate({ year: 2024, month: 2, day: 29 })).toBe(true)
    expect(localDate(2024, 2, 29)).toEqual({ year: 2024, month: 2, day: 29 })
  })

  it('TC-DATE-LEAP-02: 2023-02-29 is invalid', () => {
    expect(isValidLocalDate({ year: 2023, month: 2, day: 29 })).toBe(false)
    expect(() => localDate(2023, 2, 29)).toThrow(CalEngineError)
  })

  it('TC-DATE-ADD-01: 2024-01-31 + 1 month → 2024-02-29 (D-11)', () => {
    expect(addMonths(localDate(2024, 1, 31), 1)).toEqual({ year: 2024, month: 2, day: 29 })
  })

  it('TC-DATE-ADD-02: 2023-01-31 + 1 month → 2023-02-28 (D-11)', () => {
    expect(addMonths(localDate(2023, 1, 31), 1)).toEqual({ year: 2023, month: 2, day: 28 })
  })

  it('TC-DATE-RANGE-01: half-open [d, d+1) contains d only', () => {
    const d = localDate(2024, 6, 1)
    const next = localDate(2024, 6, 2)
    const range = assertDateRange({ start: d, end: next })
    expect(containsLocalDate(range, d)).toBe(true)
    expect(containsLocalDate(range, next)).toBe(false)
  })

  it('TC-DATE-RANGE-02: start >= end is an error', () => {
    const d = localDate(2024, 6, 1)
    expect(() => assertDateRange({ start: d, end: d })).toThrow(CalEngineError)
    expect(() =>
      assertDateRange({ start: localDate(2024, 6, 2), end: localDate(2024, 6, 1) }),
    ).toThrow(CalEngineError)
  })

  it('TC-WEEK-ISO-01: default config uses ISO week numbers (D-12)', () => {
    // 2024-01-04 is Thursday → ISO week 1
    expect(weekNumber(localDate(2024, 1, 4))).toBe(1)
    // 2024-01-01 is Monday → ISO week 1
    expect(weekNumber(localDate(2024, 1, 1))).toBe(1)
    // Known ISO: 2020-12-28 is week 53
    expect(weekNumber(localDate(2020, 12, 28))).toBe(53)
  })

  it('TC-WEEK-OVERRIDE: weekStartsOn=0 changes week boundaries (D-12)', () => {
    // 2024-01-07 is Sunday. With Sunday start, week containing Jan 7 starts on Jan 7.
    const sun = localDate(2024, 1, 7)
    const iso = weekNumber(sun) // Monday-based ISO
    const sunBased = weekNumber(sun, { weekStartsOn: 0, firstWeekContainsDate: 4 })
    // Both should be deterministic integers; Sunday-start week number can differ near boundaries
    expect(Number.isInteger(iso)).toBe(true)
    expect(Number.isInteger(sunBased)).toBe(true)
    // 2024-01-06 (Sat) is still in prior week when weekStartsOn=0 (week starts Jan 7)
    // vs ISO week that started Jan 1.
    expect(weekNumber(localDate(2024, 1, 6), { weekStartsOn: 0, firstWeekContainsDate: 1 })).not.toBe(
      weekNumber(localDate(2024, 1, 7), { weekStartsOn: 0, firstWeekContainsDate: 1 }),
    )
  })

  it('TC-WEEK-YEAR: year-boundary weeks are consistent', () => {
    // 2015-01-01 is Thursday → ISO week 1 of 2015
    expect(weekNumber(localDate(2015, 1, 1))).toBe(1)
    expect(weekYear(localDate(2015, 1, 1))).toBe(2015)
    // 2014-12-29 is Monday → ISO week 1 of 2015
    expect(weekNumber(localDate(2014, 12, 29))).toBe(1)
    expect(weekYear(localDate(2014, 12, 29))).toBe(2015)
    // 2021-01-01 is Friday → ISO week 53 of 2020
    expect(weekNumber(localDate(2021, 1, 1))).toBe(53)
    expect(weekYear(localDate(2021, 1, 1))).toBe(2020)
  })

  it('TC-NO-NOW: operations do not read system current time', () => {
    const dateSpy = vi.spyOn(Date, 'now')
    const d = localDate(2024, 3, 15)
    addMonths(d, 1)
    compareLocalDate(d, localDate(2024, 3, 16))
    weekNumber(d)
    normalizeDateRange(d, localDate(2024, 3, 20))
    expect(dateSpy).not.toHaveBeenCalled()
    dateSpy.mockRestore()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
