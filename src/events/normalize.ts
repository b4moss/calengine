import { CalEngineError } from '../errors.js'
import { assertLocalDate } from '../types/local-date.js'
import { compareLocalDate } from '../ops/compare.js'
import type { CalendarEvent, NormalizedEvent } from './types.js'

export function normalizeEvent(event: CalendarEvent): NormalizedEvent {
  if (typeof event.id !== 'string' || event.id.length === 0) {
    throw new CalEngineError('INVALID_EVENT', 'CalendarEvent.id is required')
  }

  if (event.allDay) {
    if (event.startDate === undefined || event.endDate === undefined) {
      throw new CalEngineError(
        'INVALID_EVENT',
        `allDay event "${event.id}" requires startDate and endDate (N-C1)`,
      )
    }
    const startDate = assertLocalDate(event.startDate)
    const endDate = assertLocalDate(event.endDate)
    if (compareLocalDate(startDate, endDate) >= 0) {
      throw new CalEngineError(
        'INVALID_EVENT',
        `allDay event "${event.id}" requires startDate < endDate`,
      )
    }
    const normalized: NormalizedEvent = {
      id: event.id,
      allDay: true,
      startDate,
      endDate,
    }
    if (event.title !== undefined) normalized.title = event.title
    return normalized
  }

  if (event.start === undefined || event.end === undefined) {
    throw new CalEngineError(
      'INVALID_EVENT',
      `timed event "${event.id}" requires start and end Instants`,
    )
  }
  if (!Number.isFinite(event.start) || !Number.isFinite(event.end)) {
    throw new CalEngineError('INVALID_EVENT', `timed event "${event.id}" has non-finite start/end`)
  }
  if (event.start >= event.end) {
    throw new CalEngineError(
      'INVALID_EVENT',
      `timed event "${event.id}" requires start < end`,
    )
  }
  const normalized: NormalizedEvent = {
    id: event.id,
    allDay: false,
    start: event.start,
    end: event.end,
  }
  if (event.title !== undefined) normalized.title = event.title
  return normalized
}
