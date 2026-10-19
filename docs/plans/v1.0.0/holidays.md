---
title: "holidays"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# 休日

状態: 仕様詳細（未実装）。PO 初期ドキュメント §11 の意図を維持。

## 責務境界

| 担当 | 内容 |
|------|------|
| **calengine（本パッケージ）** | 休日データの取得や外部 API 通信はしない。日付に対する休日判定を**受け取る**インターフェースを設ける |
| **harenohi 等** | 日本固有の祝日計算、振替、国民の休日などの規則・データ |
| **final-calendar / 利用側** | 祝日データの注入（例: 月表示で祝日を渡す）。演算結果の見た目 |

## インターフェース（案）

```ts
type HolidayFlag = boolean | 'unknown'

type IsHoliday = (date: LocalDate) => HolidayFlag
```

- 未提供時: グリッド等では `'unknown'` または「未判定」扱い（`isHoliday: false` と混同しない）
- 詳細形は U-08

## やらないこと

- 政府 CSV の取得
- 春分・秋分の概算
- 国別ロケールの祝日表の同梱

これらは harenohi の plans を正とする。

----

以上
