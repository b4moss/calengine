---
title: "new-open-questions"
type: Plan
status: 仕様詳細
milestone: unscheduled
timestamp: 2026-10-20
---

# 追加決定事項（計画作成時の確認項目）

PO 回答により **2026-10-20** に確定。未決のまま残っている項目は現状なし。

## N-C1 終日予定の型フィールド（D-09 の具体化）— 決定済み（2026-10-20 PO 回答）

| 案 | 内容 |
|----|------|
| A | `allDay: true` のとき `startDate`/`endDate: LocalDate`（end 排他）必須。Instant は派生または省略可 |
| B | Instant + `allDay` のみ。解釈は呼び出し元 TZ の 0:00〜翌 0:00 |
| C | LocalDate と Instant を常に両方必須 |

**決定: A。** 終日予定は `startDate` / `endDate`（`LocalDate`）を**必須フィールド**にする。`endDate` は排他。Instant（`start`/`end`）は派生または省略可。

## N-I1 公開関数名の固定（api.md の仮名）— 実装時追記（2026-10-20）

| 案 | 内容 |
|----|------|
| A | [api.md](../v1.0.0/api.md) の例どおり（`addDays` / `buildMonthGrid` / `layoutEvents` / `zonedTimeToInstant` 等） |
| B | 実装時に別名へ寄せる |

**推奨: A。** final-calendar が計画書の型・関数名に合わせて並行実装中のため、計画書（api.md / 各 implementation-plan）の名称を公開 API として固定する。PO 判断は不要と判断し A で進める。

----

以上
