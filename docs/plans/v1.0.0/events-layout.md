---
title: "events-layout"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# 予定データモデルと配置計算

状態: 仕様詳細（未実装）。PO 初期ドキュメント §8–9 の意図を維持。

## CalendarEvent

UI の表示形式から独立させる。

```ts
interface CalendarEvent {
  id: string
  title?: string
  start: number // Instant (epoch ms)
  end: number   // Instant (epoch ms), 排他
  allDay: boolean
}
```

要件:

- `start < end` 必須。終了は排他
- 終日と時刻指定を `allDay` で区別
- 永続化・API・認証は担当しない
- 色・フォント・DOM を必須フィールドにしない
- ID 生成は担当しない

終日予定の正規表現は U-05 決定どおり、日付ベースの `LocalDate` 範囲を正とし、Instant は派生とする（TZ 変換で日付がずれない設計）。

## 配置計算が返すもの

レンダラーが必要とする構造化データのみ。対象:

- 表示期間と予定期間の重複判定
- 表示期間外のはみ出し切り詰め
- 複数日にまたがる予定の分割
- 週境界をまたぐ分割
- 同時刻に重なる予定のグルーピング
- 同一時間帯のレーン割り当て

配置結果に含める最低限:

- 元の予定 ID
- 表示対象の期間
- 予定の開始・終了（切り詰め後）
- 複数日予定の先頭・末尾フラグ
- レーン番号とレーン数

**返さない:** ピクセル位置・サイズ、CSS クラス（final-calendar の責務）。

レーン順は決定的にする（U-07 決定: `start` 昇順 → 長い順 → `id` 昇順）。

----

以上
