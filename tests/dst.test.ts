import { describe, expect, it } from 'vitest'
import {
  CalEngineError,
  instantToZonedTime,
  zonedTimeToInstant,
} from '../src/index.js'

const NY = 'America/New_York'

describe('v0.2.0 DST / TZ', () => {
  it('TC-DST-GAP: nonexistent spring-forward time maps to next valid (D-13)', () => {
    // 2024-03-10 02:30 does not exist in America/New_York (jumps 02:00 → 03:00)
    const instant = zonedTimeToInstant(
      { date: { year: 2024, month: 3, day: 10 }, hour: 2, minute: 30 },
      NY,
    )
    const local = instantToZonedTime(instant, NY)
    // Should land at 03:00 (start of valid after gap) or later that morning, not 02:30
    expect(local.date).toEqual({ year: 2024, month: 3, day: 10 })
    expect(local.hour).toBe(3)
    expect(local.minute).toBe(0)
  })

  it('TC-DST-OVERLAP: ambiguous fall-back time prefers earlier offset (D-13)', () => {
    // 2024-11-03 01:30 occurs twice in America/New_York
    const instant = zonedTimeToInstant(
      { date: { year: 2024, month: 11, day: 3 }, hour: 1, minute: 30 },
      NY,
    )
    // Earlier occurrence is EDT (UTC-4) → 01:30-04:00 = 05:30Z = 1730619000000
    // Later occurrence is EST (UTC-5) → 01:30-05:00 = 06:30Z
    const earlier = Date.UTC(2024, 10, 3, 5, 30, 0) // Nov is month 10
    const later = Date.UTC(2024, 10, 3, 6, 30, 0)
    expect(instant).toBe(earlier)
    expect(instant).toBeLessThan(later)
    const roundTrip = instantToZonedTime(instant, NY)
    expect(roundTrip.hour).toBe(1)
    expect(roundTrip.minute).toBe(30)
  })

  it('TC-DST-STRICT: gap and overlap throw when strict (D-13)', () => {
    expect(() =>
      zonedTimeToInstant(
        { date: { year: 2024, month: 3, day: 10 }, hour: 2, minute: 30 },
        NY,
        { strict: true },
      ),
    ).toThrow(CalEngineError)

    expect(() =>
      zonedTimeToInstant(
        { date: { year: 2024, month: 11, day: 3 }, hour: 1, minute: 30 },
        NY,
        { strict: true },
      ),
    ).toThrow(CalEngineError)
  })

  it('TC-TZ-EXPLICIT: conversion requires explicit tz (no default)', () => {
    expect(() =>
      // @ts-expect-error intentional missing tz
      zonedTimeToInstant({ date: { year: 2024, month: 1, day: 1 }, hour: 0, minute: 0 }),
    ).toThrow()

    expect(() =>
      zonedTimeToInstant(
        { date: { year: 2024, month: 1, day: 1 }, hour: 9, minute: 0 },
        '' as never,
      ),
    ).toThrow(CalEngineError)

    // Asia/Tokyo has no DST; 09:00 → 00:00Z
    const tokyo = zonedTimeToInstant(
      { date: { year: 2024, month: 6, day: 1 }, hour: 9, minute: 0 },
      'Asia/Tokyo',
    )
    expect(tokyo).toBe(Date.UTC(2024, 5, 1, 0, 0, 0))
  })
})
