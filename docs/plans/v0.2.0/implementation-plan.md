---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.2.0
timestamp: 2026-10-20
---

# v0.2.0 実装計画 — 日付モデルと基本演算

## 目的

LocalDate / Instant / TimeZone と基本演算を実装する（D-06, D-11, D-12, D-13）。

## 対象ファイル・モジュール構成（案）

```
src/
  index.ts
  types/
    local-date.ts
    local-date-time.ts
    instant.ts
    range.ts
    config.ts           # weekStartsOn, firstWeekContainsDate 等
  ops/
    compare.ts
    add.ts              # 月末クランプ = D-11
    week-number.ts      # ISO 既定 = D-12
    convert.ts          # LocalDateTime ↔ Instant（明示、Intl）
  dst/
    resolve.ts          # 存在しない→直後、重複→早い方。strict オプション = D-13
  errors.ts
```

正本: [../v1.0.0/date-model.md](../v1.0.0/date-model.md) / [date-ops.md](../v1.0.0/date-ops.md)。

## API / 型（要約）

```ts
interface LocalDate { year: number; month: number; day: number }
type Instant = number // epoch ms
type TimeZone = string // IANA

interface DateRange { start: LocalDate; end: LocalDate } // [start, end)

interface CalendarConfig {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  firstWeekContainsDate?: number // ISO 既定 4
}

// 例（具体名は実装時に index で揃える）
function addMonths(date: LocalDate, months: number): LocalDate
function weekNumber(date: LocalDate, config?: CalendarConfig): number
function toInstant(local: LocalDateTime, tz: TimeZone, opts?: { strict?: boolean }): Instant
```

大きな日付ライブラリは使わない。`Intl` + 必要なら小さな補助（D-06）。

## 実装ステップ

1. LocalDate 妥当性（うるう含む）と Range 半開区間
2. 加減算・月末クランプ
3. ISO 週番号 + 設定上書き
4. TZ 変換と DST ポリシー（strict オプション）
5. 現在時刻・デフォルト TZ への暗黙依存がないことをテストで固定

## リスク

| リスク | 緩和 |
|--------|------|
| Intl の環境差 | 主要 IANA をフィクスチャ化。Node 24（devcontainer）で固定 |
| DST 境界の解釈差 | D-13 をテストで固定。strict でエラーにもできる |

## 受け入れ対応

[testing.md](../v1.0.0/testing.md) の日付演算系必須ケース → [../../tests/v0.2.0/](../../tests/v0.2.0/)

## 依存

v0.1.0。

----

以上
