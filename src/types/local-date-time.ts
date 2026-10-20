import { CalEngineError } from '../errors.js'
import { assertLocalDate, type LocalDate } from './local-date.js'

/** Local date-time without time zone. */
export interface LocalDateTime {
  date: LocalDate
  hour: number
  minute: number
  second?: number
  millisecond?: number
}

export function assertLocalDateTime(value: LocalDateTime): Required<LocalDateTime> {
  const date = assertLocalDate(value.date)
  const hour = value.hour
  const minute = value.minute
  const second = value.second ?? 0
  const millisecond = value.millisecond ?? 0
  if (
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23 ||
    !Number.isInteger(minute) ||
    minute < 0 ||
    minute > 59 ||
    !Number.isInteger(second) ||
    second < 0 ||
    second > 59 ||
    !Number.isInteger(millisecond) ||
    millisecond < 0 ||
    millisecond > 999
  ) {
    throw new CalEngineError(
      'INVALID_LOCAL_DATE_TIME',
      `Invalid LocalDateTime clock fields: ${hour}:${minute}:${second}.${millisecond}`,
    )
  }
  return { date, hour, minute, second, millisecond }
}
