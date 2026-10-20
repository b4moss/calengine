import { describe, expect, it } from 'vitest'
import {
  CalEngineError,
  formatLocalDate,
  localDate,
  parseLocalDate,
} from '../src/index.js'

describe('v0.4.1 LocalDate string format/parse', () => {
  it('formatLocalDate: YYYY-MM-DD with zero-padded month/day', () => {
    expect(formatLocalDate(localDate(2024, 3, 5))).toBe('2024-03-05')
    expect(formatLocalDate(localDate(2024, 12, 31))).toBe('2024-12-31')
    expect(formatLocalDate({ year: 1, month: 1, day: 1 })).toBe('1-01-01')
  })

  it('parseLocalDate: round-trips with formatLocalDate', () => {
    const iso = '2024-02-29'
    expect(formatLocalDate(parseLocalDate(iso))).toBe(iso)
    expect(parseLocalDate(iso)).toEqual({ year: 2024, month: 2, day: 29 })
  })

  it('parseLocalDate: rejects bad shape', () => {
    expect(() => parseLocalDate('2024/03/05')).toThrow(CalEngineError)
    expect(() => parseLocalDate('2024-3-5')).toThrow(CalEngineError)
    expect(() => parseLocalDate('')).toThrow(CalEngineError)
    expect(() => parseLocalDate('not-a-date')).toThrow(CalEngineError)
  })

  it('parseLocalDate: rejects non-existent calendar days', () => {
    expect(() => parseLocalDate('2023-02-29')).toThrow(CalEngineError)
    expect(() => parseLocalDate('2024-13-01')).toThrow(CalEngineError)
    expect(() => parseLocalDate('2024-00-01')).toThrow(CalEngineError)
  })
})
