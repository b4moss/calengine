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
    types.ts            # CalendarEvent（終日の正規は LocalDate — N-C1）
    overlap.ts
    split.ts            # 複数日・週境界
    lanes.ts            # start → 長い → id = D-14
    layout.ts           # 公開エントリ
  range/
    selection.ts        # 期間選択用範囲（UI イベントは対象外）
```

正本: [../v1.0.0/events-layout.md](../v1.0.0/events-layout.md) / [range-selection.md](../v1.0.0/range-selection.md)。

## API / 型

`events-layout.md` の Instant ベースに加え、**終日は LocalDate 範囲を正**（D-09）。具体フィールド形は N-C1（推奨: `allDay` + `startDate`/`endDate` 排他、Instant は派生または省略可）。

レーン順: `start` 昇順 → 期間長い順 → `id` 昇順（D-14）。

## 実装ステップ

1. イベント正規化（終日 / 時刻、start < end）
2. 表示期間との交差・切り詰め
3. 複数日・週境界分割
4. レーン割り当て
5. 期間選択ヘルパ

## リスク

| リスク | 緩和 |
|--------|------|
| 終日の型が Instant のみだと TZ ずれ | N-C1 で LocalDate 正規を確定 |
| レーン非決定性 | ソートキーをテスト固定 |

## 受け入れ対応

[../../tests/v0.4.0/](../../tests/v0.4.0/)

## 依存

v0.3.0。

----

以上
