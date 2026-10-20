import type { Instant } from '../types/instant.js'
import type { LocalDate } from '../types/local-date.js'

/**
 * Calendar event (UI-agnostic).
 * - `allDay: true` → `startDate` / `endDate` required (`endDate` exclusive) — N-C1
 * - `allDay: false` → `start` / `end` Instant required (`end` exclusive)
 */
export interface CalendarEvent {
  id: string
  title?: string
  allDay: boolean
  /** allDay === false のとき必須（epoch ms、end 排他） */
  start?: Instant
  end?: Instant
  /** allDay === true のとき必須（endDate 排他） */
  startDate?: LocalDate
  endDate?: LocalDate
}

export interface EventLayoutSegment {
  eventId: string
  allDay: boolean
  /** Timed segment (clipped, end exclusive). */
  start?: Instant
  end?: Instant
  /** All-day segment (clipped, endDate exclusive). */
  startDate?: LocalDate
  endDate?: LocalDate
  lane: number
  laneCount: number
  /** True when this segment includes the event's original start. */
  isSegmentStart: boolean
  /** True when this segment includes the last unit before the event's exclusive end. */
  isSegmentEnd: boolean
}

export interface NormalizedTimedEvent {
  id: string
  title?: string
  allDay: false
  start: Instant
  end: Instant
}

export interface NormalizedAllDayEvent {
  id: string
  title?: string
  allDay: true
  startDate: LocalDate
  endDate: LocalDate
}

export type NormalizedEvent = NormalizedTimedEvent | NormalizedAllDayEvent
