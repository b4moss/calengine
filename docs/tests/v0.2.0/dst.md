---
title: "dst"
type: TestSpec
status: draft
milestone: v0.2.0
timestamp: 2026-10-20
---

# DST / TZ 変換テスト（v0.2.0）

| ID | 区分 | 入力 | 期待 | 決定 |
|----|------|------|------|------|
| TC-DST-GAP | 境界 | 存在しないローカル時刻（例: America/New_York 春） | 直後の有効時刻 | D-13 |
| TC-DST-OVERLAP | 境界 | 重複するローカル時刻 | オフセットが早い方 | D-13 |
| TC-DST-STRICT | 異常 | 同上 + strict | エラー | D-13 |
| TC-TZ-EXPLICIT | 正常 | 変換に tz 引数必須 | 暗黙デフォルト TZ なし | |

フィクスチャの具体日時は実装時に IANA 既知ケースで固定する。

----

以上
