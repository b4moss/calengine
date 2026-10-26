# @b4moss/calengine

[![npm version](https://img.shields.io/npm/v/@b4moss/calengine.svg)](https://www.npmjs.com/package/@b4moss/calengine)
[![license](https://img.shields.io/npm/l/@b4moss/calengine.svg)](./LICENSE)

カレンダー UI 向けの日付演算・グリッド生成・予定配置計算を提供する、UI 非依存の TypeScript ライブラリ。

## Install

```bash
npm install @b4moss/calengine
```

## Usage

```ts
import { localDate, addMonths, buildMonthGrid } from '@b4moss/calengine'

const start = localDate(2026, 10, 31)
const next = addMonths(start, 1) // clamps to month end → 2026-11-30
const grid = buildMonthGrid({
  year: 2026,
  month: 10,
  config: { timeZone: 'Asia/Tokyo', weekStartsOn: 1 },
})
```

## Docs

詳細は [`docs/`](docs/) を正本とする。

| 文書 | 内容 |
|------|------|
| [docs/README.md](docs/README.md) | 目的・スコープ・技術方針（pillar） |
| [docs/roadmap.md](docs/roadmap.md) | 版・マイルストーン |
| [docs/specs/ci-cd.md](docs/specs/ci-cd.md) | CI と npm 公開 |
| [docs/plans/](docs/plans/) | これからやる内容（未実装仕様） |
| 開発憲章 | AGENTS.md の「開発憲章（charter）」節 → [b4moss/charter v1](https://github.com/b4moss/charter/tree/v1/docs/charter) |
| [`.devcontainer/`](.devcontainer/) | 開発コンテナ（Node 24） |

## Related packages

- 描画: `@b4m/final-calendar`（社内 Web Component UI。本パッケージを利用する）
- 祝日: `@b4moss/harenohi` / `@b4m/harenohi`（休日データの供給候補。本パッケージは祝日演算を持たない）

## Internal registry (`@b4m/calengine`)

当面、社内 Gitea Packages レジストリにも `@b4m/calengine` として併存公開する（利用者移行は別タスク）。

1. ルート [`.npmrc`](.npmrc) で `@b4m` スコープを社内 npm レジストリへ向ける（認証トークンは環境変数 `PACKAGE_REGISTRY_TOKEN`）。
2. `npm install @b4m/calengine` で取得する。
3. タグ `vX.Y.Z` を打つと、Gitea の `.gitea/workflows/npm-publish.yml` が name を一時的に `@b4m/calengine` へ書き換えて社内レジストリへ publish する。同じタグは GitHub ミラー経由で `.github/workflows/publish.yml` も動かし、npmjs の `@b4moss/calengine` を公開する（詳細は [docs/specs/ci-cd.md](docs/specs/ci-cd.md)）。

----

以上
