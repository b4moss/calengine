---
title: "v0.2.0"
type: Plan
status: 方針確定
milestone: v0.2.0
timestamp: 2026-10-20
---

# v0.2.0 — 日付モデルと基本演算

## 目的

日付・時刻モデルと基本演算を実装し、後続グリッド／配置の土台にする。

## 含む機能

- [date-model.md](../v1.0.0/date-model.md): LocalDate / LocalDateTime / Instant / TimeZone
- [date-ops.md](../v1.0.0/date-ops.md): 比較・加減算・範囲。月末クランプ。ISO 週番号既定
- DST: 存在しない→直後、重複→早い方（厳密モードオプション）
- `Intl` 利用。大きな日付ライブラリは使わない

## 受け入れ条件

- [testing.md](../v1.0.0/testing.md) のうち日付演算に関する必須境界が緑
- 現在時刻・デフォルト TZ への暗黙依存がない

## 依存関係

- **前提:** v0.1.0

----

以上
