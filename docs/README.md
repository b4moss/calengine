---
title: "calengine"
type: Pillar
status: draft
owner: PO
timestamp: 2026-10-20
---

# calengine

## このプロジェクトについて

**カレンダー UI に必要な日付演算・グリッド生成・予定の配置計算**を提供する、UI 非依存の TypeScript ライブラリ。

レンダリングから演算を分離し、複数 UI やバックエンドから再利用できるようにする。将来 Go へ移植することを想定し、言語・ランタイムに依存しにくい仕様とデータモデルを採用する。

## パッケージ間の役割

| パッケージ | 役割 | 依存 |
|------------|------|------|
| **calengine**（本パッケージ） | 日付演算・グリッド・予定配置。DOM / UI 非依存 | 祝日ライブラリに依存しない（休日は注入） |
| **final-calendar**（`@b4m/final-calendar`） | Web Component による描画と操作 UI | **calengine を利用する**（逆依存なし） |
| **harenohi**（`@b4moss/harenohi` / `@b4m/harenohi`） | 祝日の演算・照会 | 休日プロバイダ実装の候補。結合は利用側または final-calendar |

## スコープ

### やる（v1.0.0 まで）

- 日付・期間の演算（妥当性、比較、加減算、範囲。半開区間 `[start, end)`）
- タイムゾーンを考慮した明示的な日時変換（IANA 名。暗黙変換なし）
- 月間・週間・年間ビュー用グリッド（週数は固定せず必要週のみ 4〜6）
- 週番号（既定は ISO 8601、設定で上書き可）
- 予定の期間計算・複数日分割・同時刻レーン配置
- 期間選択に必要な日付範囲処理
- 休日判定の受け取り口（`(date) => boolean | 'unknown'`）

### やらない（現時点）

- HTML / CSS / DOM / ポインティングイベント
- React / Vue 等の UI フレームワーク依存
- HTTP・DB・永続化・認証・CalDAV
- ピクセル単位レイアウトや CSS クラス決定
- 祝日データの取得・日本祝日の演算（harenohi 等）
- 予定 ID 生成、表示色・フォント等の見た目必須フィールド

## 設計原則

1. DOM / HTML / CSS / ブラウザ API に依存しない
2. UI フレームワークに依存しない
3. 日付演算とレンダリングを分離する
4. 外部ライブラリ依存は必要最小限（大きな日付ライブラリは使わない。`Intl`＋必要なら小さな補助）
5. TypeScript と Go で同じ仕様を実装できるようにする
6. ロケール依存の表示文字列を演算結果に含めない
7. 現在時刻を暗黙参照しない
8. 暗黙のタイムゾーン変換を避ける
9. 入力の破壊的変更やグローバル状態を避け、可能な限り純粋関数とする

## 技術方針

| 項目 | 方針 |
|------|------|
| 言語 | TypeScript（将来 Go 移植を想定） |
| 実行環境 | Node.js およびブラウザ |
| 日付モデル | `LocalDate` / `LocalDateTime` / `Instant` / IANA `TimeZone` |
| 範囲 | 半開区間 `[start, end)` |
| 月末加算 | 対象月の末日にクランプ |
| 終日予定 | `startDate` / `endDate`（LocalDate）必須（N-C1）。Instant は派生または省略可 |
| DST | 存在しない→直後、重複→早い方。厳密モードはオプション |
| レーン順 | `start` 昇順 → 長い順 → `id` 昇順 |
| モジュール | ESM + 型定義のみ |
| 配布 | npmjs `@b4moss/calengine`（public）。社内レジストリ `@b4m/calengine` は当面併存 |
| レジストリ設定 | 社内 `@b4m` 向け: ルート [`.npmrc`](../.npmrc)（`${PACKAGE_REGISTRY_TOKEN}`）。`@b4moss` は npmjs 既定 |
| 開発環境 | [`.devcontainer/`](../.devcontainer/)（Node 24） |
| テスト | 憲章 TDD。DOM なし。可能なら JSON フィクスチャを Go と共有 |

## マイルストーン（要約）

| 版 | 内容 |
|----|------|
| v0.1.0 | スキャフォールド・ビルド・テスト基盤 |
| v0.2.0 | 日付モデルと基本日付演算 |
| v0.3.0 | カレンダーグリッド（月・週・年） |
| v0.4.0 | 予定モデルと配置計算・期間選択 |
| v1.0.0 | API 安定・休日 IF・移植用フィクスチャ |
| After-v1.0.0 | Go 移植本体など |

詳細は [roadmap.md](roadmap.md)。実装順: **日付演算 → グリッド → 予定配置**。

## 憲章・ドキュメント

- 憲章: [charter/](charter/)（取り込み元: [b4moss/charter](https://github.com/b4moss/charter)。framewaku と同じくファイルコピー）
- オーバーライド: [override-charter.md](override-charter.md)（現状なし）
- 計画: [plans/](plans/) / 版ハブ: [roadmap.md](roadmap.md)
- 現行仕様: [specs/](specs/)（未実装のため空）
- 決定ログ: [plans/v1.0.0/open-questions.md](plans/v1.0.0/open-questions.md)（2026-10-20 PO）

----

以上
