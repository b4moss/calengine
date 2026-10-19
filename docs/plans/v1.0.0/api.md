---
title: "api"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# 公開 API 方針

状態: 仕様詳細（未実装）。PO 初期ドキュメント §12 の意図を維持。

## 方針

- 公開 API は明示的な関数として提供する
- 設定を必要とする処理は設定を引数で受け取る
- 入力オブジェクトを変更しない
- 戻り値の構造を安定させる
- 不正な入力は明確なエラーとして扱う
- 暗黙のグローバル状態を持たない
- 可能な限り純粋関数とする
- 公開 API と内部実装を分離する
- 内部都合で公開 API を増やさない

関数名や具体的なエクスポート構成は実装時に提案し、既存仕様との整合を確認して決定する（独断追加禁止）。

## 公開面の塊（目安）

| 領域 | 例（名前は仮） |
|------|----------------|
| 日付演算 | `addDays`, `addMonths`, `compareLocalDate`, … |
| 範囲 | `intersectDateRange`, `normalizeDateRange`, … |
| グリッド | `buildMonthGrid`, `buildWeekGrid`, `buildYearGrids`, … |
| 予定配置 | `layoutEvents`, … |
| TZ | `zonedTimeToInstant`, `instantToZonedTime`, … |

## エラー

- 不正な日付・範囲・設定は型付きエラー（推奨名は実装時に確定）
- 「祝日でない」「予定が空」などはエラーにせず正常値（`null` / 空配列）

## 互換性

- `v0.x`: 破壊的変更可
- `v1.x`: 公開関数の引数・戻り値の形を安定契約とする。フィールド追加は MINOR、削除・改名は MAJOR

----

以上
