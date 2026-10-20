import { compareLocalDate } from '../ops/compare.js'
import { diffDays } from '../ops/add.js'
import { dateIntervalsOverlap, timedIntervalsOverlap } from './overlap.js'
import type { AllDaySegment, TimedSegment } from './split.js'

export interface Laned<T> {
  segment: T
  lane: number
  laneCount: number
}

function assignLanes<T>(
  items: T[],
  overlaps: (a: T, b: T) => boolean,
  compare: (a: T, b: T) => number,
): Laned<T>[] {
  const sorted = [...items].sort(compare)
  const laneEnds: T[] = []
  const placed: { segment: T; lane: number }[] = []

  for (const item of sorted) {
    let lane = 0
    while (lane < laneEnds.length) {
      const occupant = laneEnds[lane]!
      if (!overlaps(occupant, item)) break
      lane += 1
    }
    laneEnds[lane] = item
    placed.push({ segment: item, lane })
  }

  // laneCount = max concurrent overlap group size per item (use global max among overlapping set)
  const result: Laned<T>[] = placed.map((p) => {
    let laneCount = 1
    for (const other of placed) {
      if (other.segment === p.segment) continue
      if (overlaps(p.segment, other.segment)) {
        laneCount = Math.max(laneCount, other.lane + 1, p.lane + 1)
      }
    }
    // Also consider how many lanes were used in the connected overlap component
    const stack = [p]
    const seen = new Set<T>([p.segment])
    let maxLane = p.lane
    while (stack.length > 0) {
      const cur = stack.pop()!
      for (const other of placed) {
        if (seen.has(other.segment)) continue
        if (overlaps(cur.segment, other.segment)) {
          seen.add(other.segment)
          stack.push(other)
          maxLane = Math.max(maxLane, other.lane)
        }
      }
    }
    laneCount = maxLane + 1
    return { segment: p.segment, lane: p.lane, laneCount }
  })

  return result
}

/** D-14: start asc → longer duration → id asc */
export function compareTimedSegments(a: TimedSegment, b: TimedSegment): number {
  if (a.start !== b.start) return a.start - b.start
  const durA = a.end - a.start
  const durB = b.end - b.start
  if (durA !== durB) return durB - durA // longer first
  return a.eventId < b.eventId ? -1 : a.eventId > b.eventId ? 1 : 0
}

export function compareAllDaySegments(a: AllDaySegment, b: AllDaySegment): number {
  const startCmp = compareLocalDate(a.startDate, b.startDate)
  if (startCmp !== 0) return startCmp
  const durA = diffDays(a.startDate, a.endDate)
  const durB = diffDays(b.startDate, b.endDate)
  if (durA !== durB) return durB - durA
  return a.eventId < b.eventId ? -1 : a.eventId > b.eventId ? 1 : 0
}

export function assignTimedLanes(segments: TimedSegment[]): Laned<TimedSegment>[] {
  return assignLanes(
    segments,
    (a, b) => timedIntervalsOverlap(a.start, a.end, b.start, b.end),
    compareTimedSegments,
  )
}

export function assignAllDayLanes(segments: AllDaySegment[]): Laned<AllDaySegment>[] {
  return assignLanes(
    segments,
    (a, b) => dateIntervalsOverlap(a.startDate, a.endDate, b.startDate, b.endDate),
    compareAllDaySegments,
  )
}
