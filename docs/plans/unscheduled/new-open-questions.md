---
title: "new-open-questions"
type: Plan
status: 仕様詳細
milestone: unscheduled
timestamp: 2026-10-20
---

# 計画作成中に判明した未決事項（PO 判断待ち）

## N-C1 終日予定の型フィールド（D-09 の具体化）

`events-layout.md` は Instant + `allDay` だが、D-09 は LocalDate 範囲を正とする。

| 案 | 内容 |
|----|------|
| A | `allDay: true` のとき `startDate`/`endDate: LocalDate`（end 排他）必須。Instant は派生または省略可 |
| B | Instant + `allDay` のみ。解釈は呼び出し元 TZ の 0:00〜翌 0:00 |
| C | LocalDate と Instant を常に両方必須 |

**推奨: A。** D-09 と「TZ で日付がずれない」を満たす。B は表示ずれリスク。

----

以上
