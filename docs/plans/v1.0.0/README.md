---
title: "v1.0.0"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# v1.0.0 — UI 非依存カレンダー演算

## 目的

カレンダー UI が必要とする日付演算・グリッド・予定配置を、DOM なしで再利用できる npm パッケージとして出す。描画は final-calendar 等の利用側の責務とする。

## 受け入れ（要約）

- 公開 API が [api.md](api.md) どおりに振る舞い、型定義を同梱する
- 日付モデル・範囲規則が [date-model.md](date-model.md) / [date-ops.md](date-ops.md) どおり
- グリッドが [calendar-grid.md](calendar-grid.md) どおり
- 予定配置が [events-layout.md](events-layout.md) どおり（ピクセル情報を返さない）
- 休日は [holidays.md](holidays.md) の注入インターフェースのみ（演算本体は持たない）
- 憲章の TDD に沿い、[testing.md](testing.md) の必須境界値を単体でカバー
- ルート README と `docs/` から利用方法が辿れる

## 文書一覧

| 文書 | 内容 |
|------|------|
| [date-model.md](date-model.md) | LocalDate / Instant / TimeZone / 半開区間 |
| [date-ops.md](date-ops.md) | 基本日付演算・設定 |
| [calendar-grid.md](calendar-grid.md) | 月間・週間・年間グリッド |
| [events-layout.md](events-layout.md) | 予定モデルと配置計算 |
| [range-selection.md](range-selection.md) | 期間選択（UI イベントは対象外） |
| [holidays.md](holidays.md) | 休日プロバイダ |
| [api.md](api.md) | 公開 API 方針 |
| [testing.md](testing.md) | 必須テストケース |
| [portability.md](portability.md) | Go 共有仕様・JSON フィクスチャ |
| [open-questions.md](open-questions.md) | 未決項目 |

## 関連パッケージ

- 描画: `b4m-packages/final-calendar`（本パッケージを依存として使う）
- 祝日: `b4m-packages/harenohi`（休日データの供給候補。本パッケージは依存しない）

## 公開方針（v1）

- パッケージ名の意向（PO 初期 README）: `@b4moss/calengine`（作業上の呼称 `@b4m/calengine` との差は U-01）
- SemVer。`v0.x` 中は破壊的変更を許容。`v1.0.0` は PO 判断（憲章 versioning-rule）

----

以上
