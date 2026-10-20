---
title: "v0.1.0"
type: Plan
status: 方針確定
milestone: v0.1.0
timestamp: 2026-10-20
---

# v0.1.0 — スキャフォールド

## 目的

UI 非依存の TypeScript パッケージとして、実装を載せる器を用意する。

## 含む機能

- `@b4m/calengine` の `package.json`
- TypeScript / テスト / Lint の最小構成
- ESM + 型定義のビルド骨格
- 既存 `.devcontainer` / `.npmrc` で開発できること

## 受け入れ条件

- 空でもテストと型チェックが通る
- DOM 依存のテストランナー設定をしない（または DOM なしで動く）

## 依存関係

- なし

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.1.0/](../../tests/v0.1.0/)

----

以上
