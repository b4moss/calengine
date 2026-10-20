---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.4.0
timestamp: 2026-10-20
---

# v0.4.0 実装計画 — 予定配置と期間選択

## 目的

予定配置計算と期間選択ヘルパ（D-09, D-14）。ピクセルは返さない。

## 対象ファイル・モジュール構成（案）

```
src/
  events/
    types.ts            # CalendarEvent（終日は startDate/endDate 必須 — N-C1 決定）
    overlap.ts
    split.ts            # 複数日・週境界
    lanes.ts            # start → 長い → id = D-14
    layout.ts           # 公開エントリ
  range/
    selection.ts        # 期間選択用範囲（UI イベントは対象外）
```

正本: [../v1.0.0/events-layout.md](../v1.0.0/events-layout.md) / [range-selection.md](../v1.0.0/range-selection.md)。

## API / 型

**終日は LocalDate 範囲を正**（D-09 / **N-C1 決定**）:

```ts
interface CalendarEvent {
  id: string
  title?: string
  allDay: boolean
  /** allDay === false のとき必須（epoch ms、end 排他） */
  start?: number
  end?: number
  /** allDay === true のとき必須（endDate 排他） */
  startDate?: LocalDate
  endDate?: LocalDate
}
```

- `allDay: true` → `startDate` / `endDate` **必須**。Instant は派生または省略可
- `allDay: false` → `start` / `end` Instant 必須

レーン順: Instant イベントは `start` 昇順 → 期間長い順 → `id` 昇順。終日は `startDate` 昇順 → 期間長い順 → `id`（D-14）。

## 実装ステップ

1. イベント正規化（終日 / 時刻、start < end）
2. 表示期間との交差・切り詰め
3. 複数日・週境界分割
4. レーン割り当て
5. 期間選択ヘルパ

## リスク

| リスク | 緩和 |
|--------|------|
| 終日の TZ ずれ | N-C1 決定: `startDate`/`endDate` 必須で日付を固定 |
| レーン非決定性 | ソートキーをテスト固定 |

## 受け入れ対応

[../../tests/v0.4.0/](../../tests/v0.4.0/)

## 依存

v0.3.0。

----

以上
