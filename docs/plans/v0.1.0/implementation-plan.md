---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.1.0
timestamp: 2026-10-20
---

# v0.1.0 実装計画 — スキャフォールド

## 目的

`@b4m/calengine` の UI 非依存 TS パッケージ器を用意する。

## 対象ファイル・モジュール構成（案）

```
package.json            # @b4m/calengine, type: module
tsconfig.json
vitest.config.ts        # DOM なし
src/
  index.ts              # 空 export プレースホルダ
.devcontainer/ .npmrc/  # 既存
```

## API / 型

本版では公開 API なし。ESM + 型のみ（D-05）。

## 実装ステップ

1. package / tsconfig / テストランナー
2. ビルドで `dist` + `.d.ts`
3. 空テスト緑

## リスク

ビルドツール変更は v0.x で許容。

## 受け入れ対応

| 受け入れ | 担保 |
|----------|------|
| 空でもテスト・型チェック緑 | ステップ 2–3 |
| DOM 依存なし | vitest を node 環境に |

## 依存

なし。テスト: [../../tests/v0.1.0/](../../tests/v0.1.0/)

----

以上
