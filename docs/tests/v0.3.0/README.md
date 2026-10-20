---
title: "tests-v0.3.0"
type: TestSpec
status: draft
milestone: v0.3.0
timestamp: 2026-10-20
---

# v0.3.0 テスト仕様 — グリッド

| ID | 区分 | 入力 | 期待 | 決定 |
|----|------|------|------|------|
| TC-GRID-M-01 | 正常 | 2024-02, weekStartsOn=1 | 週は各 7 日。必要週のみ 4–6 | D-08 |
| TC-GRID-M-02 | 境界 | うるう 2 月 | 29 日が当月 | |
| TC-GRID-M-03 | 正常 | weekStartsOn=0 | 先頭列が日曜 | |
| TC-GRID-M-04 | 正常 | 前月・翌月セル | isCurrentMonth false | |
| TC-GRID-M-05 | 正常 | isHoliday 省略 | isHoliday === 'unknown' | D-07 |
| TC-GRID-M-06 | 正常 | isHoliday が true | 該当日 isHoliday true | |
| TC-GRID-M-07 | 正常 | today 省略 | isToday なし | |
| TC-GRID-W-01 | 正常 | 指定日の週 | 長さ 7 | |
| TC-GRID-Y-01 | 正常 | 年グリッド | 12 か月。月 API と同規則 | |
| TC-GRID-NO-PX | 制約 | 戻り値 | ピクセル・CSS クラスなし | |

----

以上
