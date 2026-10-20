---
title: "roadmap"
type: Hub
status: draft
timestamp: 2026-10-19
---

# roadmap

版・マイルストーン・進捗のハブ。詳細仕様の正本は各 `plans/` /（実装後）`specs/`。

| 版 | 状態 | 要約 | 詳細 |
|----|------|------|------|
| v0.1.0 | 未着手 | リポジトリスキャフォールド、ビルド・Lint・テスト基盤 | [plans/v1.0.0/](plans/v1.0.0/) の前提 |
| v0.2.0 | 未着手 | 日付モデル・基本日付演算・範囲処理 | [date-model.md](plans/v1.0.0/date-model.md) / [date-ops.md](plans/v1.0.0/date-ops.md) |
| v0.3.0 | 未着手 | 月間・週間・年間グリッド、週番号、設定検証 | [calendar-grid.md](plans/v1.0.0/calendar-grid.md) |
| v0.4.0 | 未着手 | 予定モデル・配置計算・期間選択 | [events-layout.md](plans/v1.0.0/events-layout.md) / [range-selection.md](plans/v1.0.0/range-selection.md) |
| v1.0.0 | 未着手 | 休日インターフェース、公開 API 安定、共通テストフィクスチャ | [api.md](plans/v1.0.0/api.md) / [holidays.md](plans/v1.0.0/holidays.md) / [portability.md](plans/v1.0.0/portability.md) |
| After-v1.0.0 | 未割当 | Go 移植本体、追加週番号方式 など | [unscheduled/go-port.md](plans/unscheduled/go-port.md) |

進捗の更新はこの表の「状態」列のみでよい。受け入れ条件の正本は plans 側。

実装順（PO 初期指示）: **日付演算 → グリッド生成 → 予定配置計算**。

----

以上
