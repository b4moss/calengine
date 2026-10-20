---
title: "v0.4.0"
type: Plan
status: 方針確定
milestone: v0.4.0
timestamp: 2026-10-20
---

# v0.4.0 — 予定配置と期間選択

## 目的

予定の配置計算と、期間選択に必要な範囲処理を提供する。

## 含む機能

- [events-layout.md](../v1.0.0/events-layout.md): 終日は LocalDate 正規、レーン割り当て（start→長い→id）
- [range-selection.md](../v1.0.0/range-selection.md)

## 受け入れ条件

- 重なり予定のレーンが決定的
- 終日が TZ 変換で日付ずれしない設計になっていること（テストで固定）

## 依存関係

- **前提:** v0.3.0
- **利用側:** final-calendar の週表示・イベント機能

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.4.0/](../../tests/v0.4.0/)

----

以上
