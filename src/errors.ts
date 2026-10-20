export type CalEngineErrorCode =
  | 'INVALID_LOCAL_DATE'
  | 'INVALID_LOCAL_DATE_TIME'
  | 'INVALID_DATE_RANGE'
  | 'INVALID_CONFIG'
  | 'INVALID_EVENT'
  | 'DST_GAP'
  | 'DST_OVERLAP'

export class CalEngineError extends Error {
  readonly code: CalEngineErrorCode

  constructor(code: CalEngineErrorCode, message: string) {
    super(message)
    this.name = 'CalEngineError'
    this.code = code
  }
}
