import { describe, expect, it } from 'vitest'
import {
  CalEngineError,
  layoutEvents,
  selectDateRange,
  type CalendarEvent,
  type DateRange,
} from '../src/index.js'

const TZ = 'UTC'
const range: DateRange = {
  start: { year: 2024, month: 3, day: 4 }, // Monday
  end: { year: 2024, month: 3, day: 18 }, // Monday + 2 weeks
}

function hasPixelKeys(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(hasPixelKeys)
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (/px|css|className|style|width|height|top|left/i.test(k)) return true
    if (hasPixelKeys(v)) return true
  }
  return false
}

describe('v0.4.0 event layout / selection', () => {
  it('TC-EV-ORDER: lane order is start → longer → id (D-14)', () => {
    const t0 = Date.UTC(2024, 2, 4, 10, 0)
    const events: CalendarEvent[] = [
      { id: 'b', allDay: false, start: t0, end: t0 + 60 * 60_000 },
      { id: 'a', allDay: false, start: t0, end: t0 + 60 * 60_000 },
      { id: 'long', allDay: false, start: t0, end: t0 + 3 * 60 * 60_000 },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ, weekStartsOn: 1 })
    const timed = layout.filter((s) => !s.allDay)
    // Same start: longer first → lane 0, then id a before b
    const long = timed.find((s) => s.eventId === 'long')!
    const a = timed.find((s) => s.eventId === 'a')!
    const b = timed.find((s) => s.eventId === 'b')!
    expect(long.lane).toBe(0)
    expect(a.lane).toBe(1)
    expect(b.lane).toBe(2)
  })

  it('TC-EV-SAME-START: identical starts get deterministic lanes', () => {
    const t0 = Date.UTC(2024, 2, 4, 9, 0)
    const events: CalendarEvent[] = [
      { id: 'z', allDay: false, start: t0, end: t0 + 30 * 60_000 },
      { id: 'm', allDay: false, start: t0, end: t0 + 30 * 60_000 },
      { id: 'a', allDay: false, start: t0, end: t0 + 30 * 60_000 },
    ]
    const first = layoutEvents({ events, range, timeZone: TZ })
    const second = layoutEvents({ events: [...events].reverse(), range, timeZone: TZ })
    const lanes = (layout: typeof first) =>
      Object.fromEntries(
        layout.filter((s) => !s.allDay).map((s) => [s.eventId, s.lane]),
      )
    expect(lanes(first)).toEqual(lanes(second))
    expect(lanes(first)).toEqual({ a: 0, m: 1, z: 2 })
  })

  it('TC-EV-NEST: nested periods get separate lanes', () => {
    const t0 = Date.UTC(2024, 2, 4, 10, 0)
    const events: CalendarEvent[] = [
      { id: 'outer', allDay: false, start: t0, end: t0 + 4 * 60 * 60_000 },
      { id: 'inner', allDay: false, start: t0 + 60 * 60_000, end: t0 + 2 * 60 * 60_000 },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ })
    const outer = layout.find((s) => s.eventId === 'outer')!
    const inner = layout.find((s) => s.eventId === 'inner')!
    expect(outer.lane).not.toBe(inner.lane)
    expect(Math.max(outer.laneCount, inner.laneCount)).toBeGreaterThanOrEqual(2)
  })

  it('TC-EV-MULTI: multi-day all-day splits with start/end flags', () => {
    const events: CalendarEvent[] = [
      {
        id: 'trip',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 5 },
        endDate: { year: 2024, month: 3, day: 8 },
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ, weekStartsOn: 1 })
    const segs = layout.filter((s) => s.eventId === 'trip')
    expect(segs.length).toBeGreaterThanOrEqual(1)
    expect(segs.some((s) => s.isSegmentStart)).toBe(true)
    expect(segs.some((s) => s.isSegmentEnd)).toBe(true)
  })

  it('TC-EV-WEEK: week boundary splits all-day events', () => {
    // Mon Mar 4 start; range covers two weeks. Event Wed–Tue spans week boundary Sun/Mon
    const events: CalendarEvent[] = [
      {
        id: 'cross',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 6 }, // Wed
        endDate: { year: 2024, month: 3, day: 13 }, // next Wed exclusive → through Tue 12
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ, weekStartsOn: 1 })
    const segs = layout.filter((s) => s.eventId === 'cross')
    expect(segs.length).toBe(2)
    expect(segs[0]!.endDate).toEqual({ year: 2024, month: 3, day: 11 }) // Monday of next week
    expect(segs[1]!.startDate).toEqual({ year: 2024, month: 3, day: 11 })
  })

  it('TC-EV-CLIP: clips segments outside the display range', () => {
    const events: CalendarEvent[] = [
      {
        id: 'wide',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 1 },
        endDate: { year: 2024, month: 3, day: 20 },
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ, weekStartsOn: 1 })
    for (const seg of layout.filter((s) => s.eventId === 'wide')) {
      expect(seg.startDate!.year).toBe(2024)
      expect(seg.startDate!.month).toBe(3)
      expect(seg.startDate!.day).toBeGreaterThanOrEqual(4)
      expect(seg.endDate!.day).toBeLessThanOrEqual(18)
    }
    expect(layout.some((s) => s.isSegmentStart)).toBe(false) // original start before range
    expect(layout.some((s) => s.isSegmentEnd)).toBe(false)
  })

  it('TC-EV-ALLDAY: allDay uses startDate/endDate without date drift (N-C1)', () => {
    const events: CalendarEvent[] = [
      {
        id: 'holiday',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 5 },
        endDate: { year: 2024, month: 3, day: 6 },
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: 'Asia/Tokyo', weekStartsOn: 1 })
    expect(layout).toHaveLength(1)
    expect(layout[0]!.startDate).toEqual({ year: 2024, month: 3, day: 5 })
    expect(layout[0]!.endDate).toEqual({ year: 2024, month: 3, day: 6 })
    expect(layout[0]!.allDay).toBe(true)
  })

  it('TC-EV-ALLDAY-REQ: missing startDate/endDate throws (N-C1)', () => {
    expect(() =>
      layoutEvents({
        events: [{ id: 'bad', allDay: true, start: 0, end: 1 }],
        range,
        timeZone: TZ,
      }),
    ).toThrow(CalEngineError)

    expect(() =>
      layoutEvents({
        events: [
          {
            id: 'partial',
            allDay: true,
            startDate: { year: 2024, month: 3, day: 5 },
          },
        ],
        range,
        timeZone: TZ,
      }),
    ).toThrow(CalEngineError)
  })

  it('TC-EV-END-EXCL: exclusive end does not occupy the end boundary day', () => {
    const events: CalendarEvent[] = [
      {
        id: 'one-day',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 5 },
        endDate: { year: 2024, month: 3, day: 6 },
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ, weekStartsOn: 1 })
    expect(layout).toHaveLength(1)
    expect(layout[0]!.endDate).toEqual({ year: 2024, month: 3, day: 6 })
    // Boundary day 6 is exclusive — segment must not claim day 6 as inclusive content
    // (endDate === 6 means last included day is 5)
    expect(layout[0]!.startDate).toEqual({ year: 2024, month: 3, day: 5 })
  })

  it('TC-EV-NO-PX: layout has no pixel/CSS fields', () => {
    const events: CalendarEvent[] = [
      {
        id: 'e',
        allDay: true,
        startDate: { year: 2024, month: 3, day: 5 },
        endDate: { year: 2024, month: 3, day: 6 },
      },
    ]
    const layout = layoutEvents({ events, range, timeZone: TZ })
    expect(hasPixelKeys(layout)).toBe(false)
  })

  it('TC-SEL-01: selectDateRange returns half-open interval', () => {
    const a = { year: 2024, month: 3, day: 10 }
    const b = { year: 2024, month: 3, day: 5 }
    const selected = selectDateRange(a, b)
    expect(selected.start).toEqual(b)
    expect(selected.end).toEqual(a)
    // same day → [d, d+1)
    expect(selectDateRange(a, a)).toEqual({
      start: a,
      end: { year: 2024, month: 3, day: 11 },
    })
  })
})
