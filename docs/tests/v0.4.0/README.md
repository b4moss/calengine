---
title: "tests-v0.4.0"
type: TestSpec
status: draft
milestone: v0.4.0
timestamp: 2026-10-20
---

# v0.4.0 テスト仕様 — 予定配置 / 期間選択

| ID | 区分 | 入力 | 期待 | 決定 |
|----|------|------|------|------|
| TC-EV-ORDER | 正常 | 同時刻・長さ違い・id 違い | レーン: start→長い→id | D-14 |
| TC-EV-SAME-START | 正常 | 同じ start | 決定的レーン | |
| TC-EV-NEST | 正常 | 入れ子期間 | レーン分離 | |
| TC-EV-MULTI | 正常 | 複数日 | 分割＋先頭末尾フラグ | |
| TC-EV-WEEK | 境界 | 週境界をまたぐ | 分割 | |
| TC-EV-CLIP | 正常 | 表示期間外はみ出し | 切り詰め | |
| TC-EV-ALLDAY | 正常 | 終日（LocalDate 正規） | TZ 変換で日付ずれない | D-09 / N-C1 |
| TC-EV-END-EXCL | 正常 | end 排他 | 境界日に出ない | |
| TC-EV-NO-PX | 制約 | レイアウト結果 | ピクセルなし | |
| TC-SEL-01 | 正常 | 期間選択ヘルパ | 半開区間 | |

----

以上
