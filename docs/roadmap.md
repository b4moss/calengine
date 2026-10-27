---
title: "roadmap"
type: Hub
status: draft
timestamp: 2026-10-20
---

# roadmap

版一覧・目的・含む機能・受け入れ・依存のハブ。詳細仕様の正本は各 `plans/`。実装後の仕様正本は `specs/`（現状なし）。

## 現状

- v0.1.0〜v0.4.2 実装済み（社内レジストリ `@b4m/calengine`）。`0.4.2` は社内のみ公開（npmjs 未公開）
- **2026-10-26**: npmjs.org 公開を決定（`@b4moss/calengine`）。**決定（2026-10-26）：案 a、`0.4.2` で初回公開予定**だったが、ミラー後に tag push イベントが来ないことが判明
- **決定（2026-10-27）**: npmjs 公開はミラー後に `gh workflow run publish.yml --ref vX.Y.Z -R b4moss/calengine`（`workflow_dispatch`）。`0.4.3` で対応。詳細は [specs/ci-cd.md](specs/ci-cd.md)
- GitHub `b4moss/calengine`（public）と Environment `npm-publish` は作成済み。push mirror 設定済み
- 社内 `@b4m/calengine` は当面併存（`final-calendar` 移行は別タスク）
- charter（OKF v0.1 / VERSION 1.2.0 相当）取り込み済み
- PO 決定（2026-10-20 / 2026-10-26 / 2026-10-27）反映済み
- **次の実装マイルストーン**: [v1.0.0](plans/v1.0.0/)
- 実装順（PO）: **日付演算 → グリッド生成 → 予定配置計算**（v0.4.1 まで完了）

## バージョニング方針

- SemVer。`v0.x` 中は破壊的変更可（[versioning-rule](charter/versioning-rule.md)）
- タグは `main` に打つ

## 実装計画（版一覧）

| 版 | 状態 | 目的（一言） | 詳細 |
|----|------|--------------|------|
| **v0.1.0** | 完了 | パッケージ開発の器 | [plans/v0.1.0/](plans/v0.1.0/) |
| **v0.2.0** | 完了 | 日付モデル・基本演算 | [plans/v0.2.0/](plans/v0.2.0/) |
| **v0.3.0** | 完了 | 月・週・年グリッド | [plans/v0.3.0/](plans/v0.3.0/) |
| **v0.4.0** | 完了 | 予定配置・期間選択 | [plans/v0.4.0/](plans/v0.4.0/) |
| **v0.4.1** | 完了 | LocalDate 文字列変換（PO: patch） | [plans/v0.4.1/](plans/v0.4.1/) |
| **v0.4.2** | 完了（社内のみ） | npmjs 初回公開準備（機能変更なし）。npmjs は未公開 | — |
| **v0.4.3** | 進行中 | `workflow_dispatch` 対応・npmjs 公開手順確定（機能変更なし） | — |
| **v1.0.0** | 未着手 | API 安定・休日 IF・共有テスト | [plans/v1.0.0/](plans/v1.0.0/) |
| **After-v1.0.0** | 未割当 | Go 移植など | [unscheduled/go-port.md](plans/unscheduled/go-port.md) |

---

### v0.1.0 — スキャフォールド

| 項目 | 内容 |
|------|------|
| **目的** | UI 非依存 TS パッケージの器を用意する |
| **含む機能** | `@b4moss/calengine`（当時 `@b4m/calengine`）の package 骨格、TS / テスト / Lint、ESM+型のビルド骨格 |
| **受け入れ** | 空でもテストと型チェックが緑。docs が辿れる |
| **依存** | なし |
| **詳細** | [plans/v0.1.0/](plans/v0.1.0/) |

### v0.2.0 — 日付モデルと基本演算

| 項目 | 内容 |
|------|------|
| **目的** | LocalDate / Instant / TimeZone と基本演算を確定する |
| **含む機能** | 妥当性・比較・加減算・半開区間。月末は末日クランプ。ISO 週番号既定。DST ポリシー |
| **受け入れ** | [date-model.md](plans/v1.0.0/date-model.md) / [date-ops.md](plans/v1.0.0/date-ops.md) の必須境界が単体で緑 |
| **依存** | v0.1.0 |
| **詳細** | [plans/v0.2.0/](plans/v0.2.0/) |

### v0.3.0 — カレンダーグリッド

| 項目 | 内容 |
|------|------|
| **目的** | 月間・週間・年間グリッドを返す |
| **含む機能** | 必要週のみ（4〜6）。週開始・設定検証。ピクセル情報は返さない |
| **受け入れ** | [calendar-grid.md](plans/v1.0.0/calendar-grid.md) どおり。5/6 週の見た目揃えは final-calendar 側 |
| **依存** | v0.2.0。利用側: final-calendar v0.2.0 以降が月グリッドを消費 |
| **詳細** | [plans/v0.3.0/](plans/v0.3.0/) |

### v0.4.0 — 予定配置・期間選択

| 項目 | 内容 |
|------|------|
| **目的** | 予定の配置計算と期間選択用の範囲処理 |
| **含む機能** | 終日は `startDate`/`endDate` 必須（N-C1）、レーン割り当て、複数日分割、期間選択ヘルパ |
| **受け入れ** | [events-layout.md](plans/v1.0.0/events-layout.md) / [range-selection.md](plans/v1.0.0/range-selection.md) |
| **依存** | v0.3.0。利用側: final-calendar のイベント／週表示 |
| **詳細** | [plans/v0.4.0/](plans/v0.4.0/) |

### v1.0.0 — 安定・休日 IF・移植準備

| 項目 | 内容 |
|------|------|
| **目的** | 公開 API を安定させ、休日注入と Go 共有テストの土台を揃える |
| **含む機能** | 休日プロバイダ IF、公開 API 文書化、JSON フィクスチャ方針 |
| **受け入れ** | [plans/v1.0.0/README.md](plans/v1.0.0/README.md)。[testing.md](plans/v1.0.0/testing.md) の必須ケース |
| **依存** | v0.4.0。harenohi は任意（プロバイダ実装の候補） |
| **詳細** | [plans/v1.0.0/](plans/v1.0.0/) |

---

## 早期意思決定（ログ）

| 議題 | 状態 | 正本 |
|------|------|------|
| npm スコープ・モジュール形式 | **決定**（2026-10-20） | [open-questions.md](plans/v1.0.0/open-questions.md) |
| npmjs.org 公開（`@b4moss/calengine`、GitHub Actions + Trusted Publishing） | **決定**（2026-10-26） | [open-questions.md](plans/v1.0.0/open-questions.md) / [ci-cd.md](specs/ci-cd.md) |
| 月末・週番号・DST・レーン・休日 IF | **決定** | 同上 |
| 終日は `startDate`/`endDate` 必須・グリッドは必要週のみ | **決定**（N-C1 含む） | [open-questions](plans/v1.0.0/open-questions.md) / [new-open-questions](plans/unscheduled/new-open-questions.md) |

----

以上
