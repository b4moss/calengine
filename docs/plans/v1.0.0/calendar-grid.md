---
title: "calendar-grid"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# カレンダーグリッド

状態: 仕様詳細（未実装）。PO 初期ドキュメント §7 の意図を維持。

## 月間グリッド

入力:

```ts
interface MonthGridInput {
  year: number
  month: number // 1-12
  config: CalendarConfig
  today?: LocalDate // 「今日」判定用。省略時は isToday を付けない
  isHoliday?: (date: LocalDate) => boolean | 'unknown'
}
```

出力（概念）:

```ts
interface CalendarDay {
  date: LocalDate
  weekday: number
  isCurrentMonth: boolean
  isToday?: boolean
  isWeekend: boolean
  isHoliday: boolean | 'unknown'
}

interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[] // 長さ 7
}

interface MonthGrid {
  year: number
  month: number
  weeks: CalendarWeek[]
}
```

要件:

- `weekStartsOn` に従って列を並べる
- 前月・翌月の日付を必要に応じて含める（穴埋め）
- すべての週は 7 日
- 週数は固定せず、表示規則に基づく（U-04。推奨: 必要週のみ 4〜6）
- 休日情報がない場合は未判定（`'unknown'`）を許す
- 「今日」は呼び出し元の基準日でのみ判定

## 週間グリッド

指定日を含む 1 週分の `CalendarDay[]`（長さ 7）。

- `weekStartsOn` で週初を決定
- TZ・週開始を変えても一貫した結果

## 年間ビュー用データ

指定年の 12 か月分の `MonthGrid` を返す。月間生成を再利用し、年間専用の日付演算を二重実装しない。

## final-calendar との境界

- 本パッケージはセルのピクセル位置・CSS・「5 週固定 / 6 週固定」の**表示選択 UI**を持たない
- final-calendar が「5 週表示・6 週表示を指定」する場合、本パッケージは (a) 呼び出し側が週数を制約するオプションを後から足すか、(b) 生成結果を表示側で切り詰めるかのどちらか（U-04 関連）。v1 推奨は (b) を許容しつつ、生成は必要週すべてを返す

----

以上
