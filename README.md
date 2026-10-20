# @b4m/calengine

カレンダー UI 向けの日付演算・グリッド生成・予定配置計算を提供する、UI 非依存の TypeScript ライブラリ。

当面は社内 Gitea レジストリ（`@b4m`、framewaku と同じ仕組み）で配布する。npmjs 公開時に `@b4moss/calengine` へ移す。

詳細は [`docs/`](docs/) を正本とする。

| 文書 | 内容 |
|------|------|
| [docs/README.md](docs/README.md) | 目的・スコープ・技術方針（pillar） |
| [docs/roadmap.md](docs/roadmap.md) | 版・マイルストーン |
| [docs/plans/](docs/plans/) | これからやる内容（未実装仕様） |
| [docs/charter/](docs/charter/) | 開発憲章（[b4moss/charter](https://github.com/b4moss/charter) 由来） |

関連パッケージ:

- 描画: [`@b4m/final-calendar`](https://git.b4m.jp/b4m-packages/final-calendar)（本パッケージを利用する）
- 祝日: [`@b4m/harenohi`](https://git.b4m.jp/b4m-packages/harenohi)（休日データの供給側候補。本パッケージは祝日演算そのものは持たない）

----

以上
