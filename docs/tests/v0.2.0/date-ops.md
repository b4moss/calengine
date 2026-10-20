---
title: "date-ops"
type: TestSpec
status: draft
milestone: v0.2.0
timestamp: 2026-10-20
---

# 日付演算テスト（v0.2.0）

| ID | 区分 | 入力 | 期待 | 決定 |
|----|------|------|------|------|
| TC-DATE-LEAP-01 | 境界 | 2024-02-29 妥当 | OK | |
| TC-DATE-LEAP-02 | 異常 | 2023-02-29 | エラー | |
| TC-DATE-ADD-01 | 境界 | 2024-01-31 + 1 月 | 2024-02-29 | D-11 |
| TC-DATE-ADD-02 | 境界 | 2023-01-31 + 1 月 | 2023-02-28 | D-11 |
| TC-DATE-RANGE-01 | 正常 | [d, d+1) | d を含み d+1 を含まない | 半開 |
| TC-DATE-RANGE-02 | 異常 | start >= end | エラー | |
| TC-WEEK-ISO-01 | 正常 | 既定 config | ISO 週番号 | D-12 |
| TC-WEEK-OVERRIDE | 正常 | weekStartsOn=0 | 設定どおり | D-12 |
| TC-WEEK-YEAR | 境界 | 年末年始の週 | 年跨ぎで一貫 | |
| TC-NO-NOW | 制約 | 演算呼び出し | システム現在時刻を読まない | |

----

以上
