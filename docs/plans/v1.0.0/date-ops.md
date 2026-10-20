---
title: "date-ops"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# 基本的な日付演算と設定

状態: 仕様詳細（未実装）。PO 初期ドキュメント §5–6 の意図を維持。

## CalendarConfig

```ts
interface CalendarConfig {
  timeZone: string
  weekStartsOn: number // 0: Sunday ... 6: Saturday
  locale?: string
  firstWeekContainsDate?: number
}
```

| フィールド | 意味 |
|------------|------|
| `timeZone` | カレンダー基準 TZ |
| `weekStartsOn` | 週の開始曜日 |
| `locale` | 表示側で曜日名等に使う識別子（演算結果には埋め込まない） |
| `firstWeekContainsDate` | 週番号規則用 |

- 週番号は ISO 8601 を既定とし、設定で上書きできる（U-03 決定）
- 設定値の有効性は検証する（不正ならエラー）

## 提供する操作

- 日付の妥当性検証
- 日付の比較
- 日・月・年の加算・減算
- 月初・月末、週初・週末
- 曜日、月の日数、うるう年判定
- 日付間の日数
- 2 つの日付範囲の重複判定・交差
- 指定期間に含まれる日付の列挙

## 月末丸め（月・年加算）

対象日に対応する日が存在しない場合の処理を明示する。

例: 1 月 31 日 + 1 か月。

**決定（2026-10-20 PO / U-02）:** 対象月の末日に丸める。

## 純粋性

- 「今日」が必要な処理は基準日を引数で受け取る
- 入力オブジェクトを変更しない
- グローバルな現在時刻・デフォルト TZ に依存しない

----

以上
