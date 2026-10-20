---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.4.1
timestamp: 2026-10-20
---

# v0.4.1 実装計画 — formatLocalDate / parseLocalDate

## 目的

文字列 ↔ `LocalDate` を公開し、利用側（final-calendar）の重複実装を解消する。

## 対象ファイル

```
src/ops/local-date-string.ts
src/index.ts
CHANGELOG.md
docs/plans/v1.0.0/api.md
docs/plans/v0.4.1/
docs/tests/v0.4.1/
```

## API / 型

```ts
function formatLocalDate(date: LocalDate): string
function parseLocalDate(iso: string): LocalDate
```

- 形式: `YYYY-MM-DD`（月・日は 2 桁ゼロ埋め）
- `parseLocalDate` は正規表現で形状を検証し、暦日妥当性は `localDate` に委譲
- 失敗時は `CalEngineError`（`INVALID_LOCAL_DATE`）

## 版

PO 判断により **patch `0.4.1`**（公開 API 追加だが MINOR にしない）。

## 依存

v0.4.0。

----

以上
