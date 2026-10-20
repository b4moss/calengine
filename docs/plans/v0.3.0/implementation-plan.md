---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.3.0
timestamp: 2026-10-20
---

# v0.3.0 実装計画 — カレンダーグリッド

## 目的

月間・週間・年間グリッドを返す。週数は必要分のみ（D-08）。休日は注入 IF（D-07）。

## 対象ファイル・モジュール構成（案）

```
src/
  grid/
    month.ts            # MonthGridInput → MonthGrid
    week.ts
    year.ts             # 12 × month 再利用
  holidays/
    types.ts            # (date) => boolean | 'unknown'
```

正本: [../v1.0.0/calendar-grid.md](../v1.0.0/calendar-grid.md) / [holidays.md](../v1.0.0/holidays.md)。

## API / 型（要約）

```ts
type HolidayFlag = boolean | 'unknown'
type IsHoliday = (date: LocalDate) => HolidayFlag

interface MonthGridInput {
  year: number
  month: number
  config: CalendarConfig
  today?: LocalDate
  isHoliday?: IsHoliday
}
// MonthGrid / CalendarWeek / CalendarDay … calendar-grid.md どおり
```

ピクセル・CSS・5/6 週固定 UI は持たない（final-calendar 側）。

## 実装ステップ

1. 月グリッド（weekStartsOn、前月翌月穴埋め、必要週 4–6）
2. 週グリッド
3. 年グリッド（月の再利用）
4. isHoliday 未指定時は `'unknown'`
5. today 省略時は isToday を付けない

## リスク

週数計算の off-by-one → 境界テスト（うるう・1 月・12 月）。

## 受け入れ対応

[../../tests/v0.3.0/](../../tests/v0.3.0/)

## 依存

v0.2.0。利用側: final-calendar v0.2.0。

----

以上
