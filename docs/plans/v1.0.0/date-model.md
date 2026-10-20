---
title: "date-model"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# 日付・時刻モデル

状態: 仕様詳細（未実装）。PO 初期ドキュメント §4 の意図を維持。

## LocalDate

タイムゾーンや時刻を持たない暦日。

```ts
interface LocalDate {
  year: number
  month: number // 1-12
  day: number
}
```

用途: 日単位の予定、カレンダー各日、休日、日付範囲。

## LocalDateTime

タイムゾーンを持たないローカル日時。

```ts
interface LocalDateTime {
  date: LocalDate
  hour: number
  minute: number
  second?: number
  millisecond?: number
}
```

用途: ローカル入力された予定日時、TZ 適用前のデータ。

## Instant

UTC 基準の絶対時刻。TypeScript では Unix epoch milliseconds。

```ts
type Instant = number
```

Go 移植時は `time.Time` 等へ対応させる（[portability.md](portability.md)）。

## TimeZone

IANA Time Zone Database の識別子（例: `Asia/Tokyo`）。

ローカル日時 ↔ Instant の変換は**明示的操作**とする。DST による存在しない時刻・重複時刻は [open-questions.md](open-questions.md) U-06（決定: 存在しない→直後、重複→早い方。厳密モードはオプション）。

## 日付範囲・日時範囲

原則として半開区間 `[start, end)`。

```ts
interface DateRange {
  start: LocalDate
  end: LocalDate // 排他
}
```

`start` は含む、`end` は含まない。隣接期間の境界を統一するため。日時範囲も同様。

## 不変条件

- `LocalDate` は実在する暦日であること（うるう年を含む）
- 範囲は `start < end`（空範囲は別途明示しない限り不正）
- 演算結果に曜日名・月名などの表示文字列を含めない

----

以上
