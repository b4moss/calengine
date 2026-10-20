---
title: "tests"
type: Index
status: draft
timestamp: 2026-10-19
---

# tests

テスト仕様書の置き場（憲章 TDD）。実装版に入るときにドメイン別に書く。

予定ドメイン例:

- `date-model` — LocalDate / Instant / 範囲境界
- `date-ops` — 加算・比較・月末丸め
- `calendar-grid` — 月間・週間・年間グリッド
- `event-layout` — 分割・レーン割り当て
- `holidays` — 休日プロバイダの結合

フォーマットは [charter/tdd.md](../charter/tdd.md) に従う。境界値は [plans/v1.0.0/testing.md](../plans/v1.0.0/testing.md) の必須ケースを起点にする。

----

以上
