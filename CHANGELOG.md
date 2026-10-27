# Changelog

## Unreleased

## 0.4.3 — 2026-10-27

### Notes

- GitHub の push mirror（`git push --mirror`）はタグの push イベントを作らないため、`publish.yml` はミラー後に `workflow_dispatch` で手動実行する。`0.4.2` は社内レジストリのみ公開済み。機能変更なし。

### Changed

- `.github/workflows/publish.yml` に `workflow_dispatch` を追加（タグ `vX.Y.Z` 以外の ref、および `package.json` と不一致のタグは拒否）。

## 0.4.2 — 2026-10-26

### Notes

- npmjs.org 公開の準備。公開名 `@b4moss/calengine`、MIT、GitHub Actions の `publish.yml` から公開。機能変更なし。

### Changed

- パッケージ名を `@b4moss/calengine` に変更（MIT、`publishConfig.access: public`）。
- GitHub Actions `.github/workflows/publish.yml` を追加（タグ `vX.Y.Z`、Trusted Publishing / provenance）。
- 社内レジストリ向け `@b4m/calengine` は当面併存（`.gitea/workflows/npm-publish.yml` が publish 直前に name を書き換え）。
- CI 内での `npm version` による版書き換えをやめ、タグと `package.json` の一致検査に変更。

## 0.4.1 — 2026-10-20

### Added

- Public API: `formatLocalDate` / `parseLocalDate` (`YYYY-MM-DD` ↔ `LocalDate`).

### Notes

- 公開 API の追加だが、PO 判断（2026-10-20）により **patch**（`v0.4.1`）として扱う。
- final-calendar 側の重複実装を本パッケージへ寄せるための先行公開。

## 0.4.0 — 2026-10-20

- Event layout (`layoutEvents`) and range selection helpers.

## 0.3.0 — 2026-10-20

- Month / week / year calendar grids.

## 0.2.0 — 2026-10-20

- Date model and operations (LocalDate, DST/TZ, week numbers).

## 0.1.0 — 2026-10-20

- Package scaffold (ESM + types, Node 24).
