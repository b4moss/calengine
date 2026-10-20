---
title: "calengine"
type: Pillar
status: draft
owner: PO
timestamp: 2026-10-19
---

# calengine

## このプロジェクトについて

**カレンダー UI に必要な日付演算・カレンダーグリッド生成・予定の配置計算**を提供する、UI 非依存の TypeScript ライブラリ。

レンダリング層から演算ロジックを分離し、複数の UI 実装やバックエンドから再利用できるようにする。将来 Go へ移植することを想定し、特定の言語やランタイムに依存しない仕様とデータモデルを採用する。

## パッケージ間の役割

| パッケージ | 役割 | 依存 |
|------------|------|------|
| **calengine**（本パッケージ） | 日付演算・グリッド・予定配置。DOM / UI フレームワーク非依存 | 祝日演算ライブラリには依存しない（休日は注入） |
| **final-calendar**（[`b4m-packages/final-calendar`](https://git.b4m.jp/b4m-packages/final-calendar)） | HTML/CSS・Web Component による描画と操作 UI | **calengine を利用する**。calengine は final-calendar に依存しない |
| **harenohi**（[`b4m-packages/harenohi`](https://git.b4m.jp/b4m-packages/harenohi)） | 祝日の演算・照会 | 本パッケージの休日プロバイダ実装の候補。結合は利用側または final-calendar |

PO 初期ドキュメントの「2. パッケージ構成」の意図を維持する。

## スコープ

### やる（v1.0.0 まで）

- 日付・期間の演算（妥当性、比較、加減算、範囲）
- タイムゾーンを考慮した日時変換（明示的操作）
- 月間・週間・年間ビュー用グリッドの生成
- 週番号の計算
- 予定の期間計算、複数日分割、同時刻レーン配置
- 期間選択に必要な日付範囲処理
- 休日情報を受け取るための日付モデル／インターフェース

### やらない（現時点）

- HTML / CSS / DOM / マウス・タッチイベント
- React / Vue 等の UI フレームワーク依存
- HTTP・DB・永続化・認証・CalDAV・外部カレンダー同期
- ピクセル単位のレイアウトや CSS クラスの決定
- 祝日データの取得・日本祝日の演算そのもの（harenohi 等の別モジュール）
- 予定 ID の生成、表示色・フォント等の見た目必須フィールド

## 設計原則

PO 初期ドキュメントの意図を維持する。

1. DOM、HTML、CSS、ブラウザ API に依存しない
2. UI フレームワークに依存しない
3. 日付演算とレンダリングを分離する
4. 外部ライブラリへの依存は必要最小限
5. TypeScript と Go で同じ仕様を実装できるようにする
6. ロケール依存の表示文字列を演算結果に含めない
7. 現在時刻を暗黙参照しない（必要なら呼び出し元から渡す）
8. 暗黙のタイムゾーン変換を避ける
9. 入力の破壊的変更やグローバル状態を避け、可能な限り純粋関数とする
10. 仕様未確定の動作を独断実装せず、決定待ち項目として明示する

## 技術方針

| 項目 | 方針 |
|------|------|
| 言語 | TypeScript（将来 Go 移植を想定した仕様共有） |
| 実行環境 | Node.js およびブラウザ |
| 日付モデル | `LocalDate` / `LocalDateTime` / `Instant` / IANA `TimeZone`（詳細は [plans/v1.0.0/date-model.md](plans/v1.0.0/date-model.md)） |
| 範囲 | 半開区間 `[start, end)` |
| アーキテクチャ | パッケージのため薄い DDD の CRUD Trait は不要。純関数の演算層を中心とする（憲章の「CLI・パッケージ」例外） |
| 配布 | 当面 `@b4m/calengine` を社内 Gitea レジストリで配布（framewaku と同じ）。npmjs 公開時に `@b4moss/calengine` へ移す |
| テスト | 憲章の TDD・氷山パターン。DOM なし。可能なら JSON フィクスチャを Go と共有 |

## マイルストーン（要約）

| 版 | 内容 |
|----|------|
| v0.1.0 | スキャフォールド・ビルド・テスト基盤 |
| v0.2.0 | 日付モデルと基本日付演算 |
| v0.3.0 | カレンダーグリッド（月・週・年） |
| v0.4.0 | 予定モデルと配置計算・期間選択 |
| v1.0.0 | API 安定・休日インターフェース・移植用テストフィクスチャ |

詳細は [roadmap.md](roadmap.md)。未実装の仕様詳細は [plans/](plans/)。

## 憲章・ドキュメント

- 憲章: [charter/](charter/)（取り込み元: [b4moss/charter](https://github.com/b4moss/charter)、VERSION 1.2.0 相当をファイルコピー）
- オーバーライド: [override-charter.md](override-charter.md)（現状なし）
- 計画: [plans/](plans/) / 版ハブ: [roadmap.md](roadmap.md)
- 現行仕様: [specs/](specs/)（未実装のため空）

## 決定済み項目（要約・2026-10-20 PO）

| ID | 項目 | 決定 |
|----|------|------|
| U-01 | npm スコープ名 | 当面 `@b4m/calengine`（社内 Gitea）。公開時に `@b4moss` へ |
| U-02 | 月末加算の丸め | 対象月の末日にクランプ |
| U-03 | 週番号の既定 | ISO 8601 を既定とし設定で上書き可 |
| U-04 | 月間グリッドの週数 | 固定せず、必要週のみ（4〜6）。5/6 週は表示側 |
| U-05 | 終日予定の正規表現 | 日付ベース（`LocalDate` 範囲）。Instant は派生 |
| U-06 | DST の存在しない／重複時刻 | 存在しない→直後、重複→早い方。厳密モードはオプション |
| U-07 | レーン割り当て順 | `start` 昇順 → `end` 降順 → `id` 昇順 |
| U-08 | 休日プロバイダの形 | `(date: LocalDate) => boolean \| 'unknown'`。harenohi は必須にしない |
| U-09 | タイムゾーン実装 | `Intl`＋必要なら小さな補助。大きな日付ライブラリは使わない |
| U-10 | モジュール形式 | ESM + 型定義のみ |

詳細は [plans/v1.0.0/open-questions.md](plans/v1.0.0/open-questions.md)。

----

以上
