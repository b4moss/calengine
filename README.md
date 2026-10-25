# @b4m/calengine

カレンダー UI 向けの日付演算・グリッド生成・予定配置計算を提供する、UI 非依存の TypeScript ライブラリ。

社内 Gitea レジストリ（`@b4m`）で配布し、公開時に `@b4moss/calengine` へ移す。

詳細は [`docs/`](docs/) を正本とする。

| 文書 | 内容 |
|------|------|
| [docs/README.md](docs/README.md) | 目的・スコープ・技術方針（pillar） |
| [docs/roadmap.md](docs/roadmap.md) | 版・マイルストーン |
| [docs/plans/](docs/plans/) | これからやる内容（未実装仕様） |
| 開発憲章 | AGENTS.md の「開発憲章（charter）」節 → [b4moss/charter v1](https://github.com/b4moss/charter/tree/v1/docs/charter) |
| [`.npmrc`](.npmrc) | `@b4m` → 社内 registry（トークンは環境変数） |
| [`.devcontainer/`](.devcontainer/) | 開発コンテナ（Node 24） |

関連パッケージ:

- 描画: [`@b4m/final-calendar`](https://git.b4m.jp/b4m-packages/final-calendar)
- 祝日: [`@b4m/harenohi`](https://git.b4m.jp/b4m-packages/harenohi)（休日データの供給候補。本パッケージは祝日演算を持たない）

----

以上
