---
title: "tests-v0.4.1"
type: TestSpec
status: draft
milestone: v0.4.1
timestamp: 2026-10-20
---

# v0.4.1 テスト仕様 — LocalDate 文字列

| ID | 区分 | 入力 | 期待 |
|----|------|------|------|
| TC-STR-FMT-01 | 正常 | `{2024,3,5}` | `"2024-03-05"` |
| TC-STR-PARSE-01 | 正常 | `"2024-02-29"` | LocalDate うるう日。format と往復一致 |
| TC-STR-PARSE-02 | 異常 | `"2024-3-5"` / 空文字 | `CalEngineError` |
| TC-STR-PARSE-03 | 異常 | `"2023-02-29"` | `CalEngineError`（非実在日） |

----

以上
