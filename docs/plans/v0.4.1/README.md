---
title: "v0.4.1"
type: Plan
status: 方針確定
milestone: v0.4.1
timestamp: 2026-10-20
---

# v0.4.1 — LocalDate 文字列変換（patch）

## 目的

`LocalDate` と `YYYY-MM-DD` 文字列の相互変換を公開 API にする。

## 含む機能

- `formatLocalDate(date: LocalDate): string`
- `parseLocalDate(iso: string): LocalDate`

## 版の扱い

公開 API の追加だが、**PO 判断（2026-10-20）により patch `v0.4.1` として扱う**（通常の MINOR ではなく）。

## 受け入れ条件

- 2 関数が ESM + 型定義で export される
- 不正な文字列・非実在日は `CalEngineError` になる
- final-calendar の既存ヘルパと互換な `YYYY-MM-DD` 形式

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.4.1/](../../tests/v0.4.1/)

----

以上
