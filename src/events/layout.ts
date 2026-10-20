import { assertCalendarConfig, type Weekday } from '../types/config.js'
import { assertDateRange, type DateRange } from '../types/range.js'
import type { Instant, TimeZone } from '../types/instant.js'
import { zonedTimeToInstant } from '../dst/resolve.js'
import { normalizeEvent } from './normalize.js'
import { splitAllDayEvent, splitTimedEvent } from './split.js'
import { assignAllDayLanes, assignTimedLanes } from './lanes.js'
import type { CalendarEvent, EventLayoutSegment } from './types.js'

export interface LayoutEventsInput {
  events: CalendarEvent[]
  /** Display date window `[start, end)` (used for all-day clipping/split). */
  range: DateRange
  /** IANA TZ for timed day splits and default instant window. */
  timeZone: TimeZone
  weekStartsOn?: Weekday
  /**
   * Optional timed display window. When omitted, derived from `range` midnights in `timeZone`.
   */
  instantRange?: { start: Instant; end: Instant }
}

function defaultInstantRange(range: DateRange, timeZone: TimeZone): { start: Instant; end: Instant } {
  return {
    start: zonedTimeToInstant(
      { date: range.start, hour: 0, minute: 0, second: 0, millisecond: 0 },
      timeZone,
    ),
    end: zonedTimeToInstant(
      { date: range.end, hour: 0, minute: 0, second: 0, millisecond: 0 },
      timeZone,
    ),
  }
}

/**
 * Layout events for a display window: clip, split (multi-day / week), assign lanes.
 * Returns no pixel/CSS data (D-09 / D-14).
 */
export function layoutEvents(input: LayoutEventsInput): EventLayoutSegment[] {
  const range = assertDateRange(input.range)
  const weekStartsOn = input.weekStartsOn ?? 1
  // Validate weekStartsOn via a minimal config when provided through assert path
  assertCalendarConfig({ timeZone: input.timeZone, weekStartsOn })

  const instantRange =
    input.instantRange ?? defaultInstantRange(range, input.timeZone)

  const timedSegs = []
  const allDaySegs = []

  for (const raw of input.events) {
    const event = normalizeEvent(raw)
    if (event.allDay) {
      allDaySegs.push(...splitAllDayEvent(event, range.start, range.end, weekStartsOn))
    } else {
      timedSegs.push(
        ...splitTimedEvent(event, instantRange.start, instantRange.end, input.timeZone),
      )
    }
  }

  const timedLaned = assignTimedLanes(timedSegs)
  const allDayLaned = assignAllDayLanes(allDaySegs)

  const result: EventLayoutSegment[] = []

  for (const { segment, lane, laneCount } of timedLaned) {
    result.push({
      eventId: segment.eventId,
      allDay: false,
      start: segment.start,
      end: segment.end,
      lane,
      laneCount,
      isSegmentStart: segment.isSegmentStart,
      isSegmentEnd: segment.isSegmentEnd,
    })
  }

  for (const { segment, lane, laneCount } of allDayLaned) {
    result.push({
      eventId: segment.eventId,
      allDay: true,
      startDate: segment.startDate,
      endDate: segment.endDate,
      lane,
      laneCount,
      isSegmentStart: segment.isSegmentStart,
      isSegmentEnd: segment.isSegmentEnd,
    })
  }

  return result
}
