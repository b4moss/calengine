---
title: "CI/CD"
type: Spec
status: draft
timestamp: 2026-10-26
---

# CI/CD

憲章 [CI/CD方針](../charter/ci-cd.md) に沿った、このリポジトリの CI とパッケージ公開。

## CI (`.gitea/workflows/ci.yml`)

- `pull_request` の対象: `main`, `develop`, `dev-*`, `cursor/**`
- `paths-ignore`: `docs/**`, `**/*.md`
- `workflow_dispatch` を残し、手動実行できる
- concurrency は `ci-${{ github.event.pull_request.number || github.ref }}`、`cancel-in-progress: true`
- 上流 PR（head が `develop`、base が `main`）は通過済みとしてジョブを skip する。条件はジョブの `if: ${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}`
- `runs-on: ubuntu-latest`、Node 24、`actions/setup-node` の `cache: npm`
- ステップ順: `npm ci` → lint → typecheck → test → build
- E2E は CI に含めない

## npmjs.org 公開 (`.github/workflows/publish.yml`)

前提（2026-10-26 PO）: npmjs への公開は **GitHub Actions** から行い、Trusted Publishing も GitHub 側で設定する。パッケージ名は `@b4moss/calengine`。初版は Environment secret `NPM_TOKEN`（granular token）を使い、2 版目以降は OIDC（`id-token: write`）のみ。

- トリガー: `push` のタグ `v[0-9]+.[0-9]+.[0-9]+` のみ（`workflow_dispatch` なし）
- `permissions`: `contents: read`、`id-token: write`
- `runs-on: ubuntu-latest`、`environment: npm-publish`
- actions は SHA 固定。Node 24、`registry-url: https://registry.npmjs.org`（release では npm cache を使わない）
- npm CLI が 11.5.1 未満なら更新する
- タグと `package.json` の `version` が一致することを検査する（**CI で版を書き換えない**）
- `npm ci` → lint → typecheck → test → build → `npm pack --dry-run`
- その版が npm に既にあれば skip。なければ `npm publish --access public --provenance`
- `NODE_AUTH_TOKEN` は `${{ secrets.NPM_TOKEN }}`（初版用。secret 削除後は OIDC）

Trusted Publisher 登録例（パッケージ Settings、または `npm trust`）:

- Organization: `b4moss`
- Repository: `calengine`
- Workflow: `publish.yml`
- Environment: `npm-publish`
- Allowed actions: 直接 `npm publish` を許可

## 社内レジストリ公開 (`.gitea/workflows/npm-publish.yml`)

当面、社内 Gitea Packages にも `@b4m/calengine` として併存公開する（D-8）。`final-calendar` など既存利用者は `@b4m/calengine` のまま。

- トリガー: `push` のタグ `v*` と `workflow_dispatch`（`pull_request` では動かない）
- タグ／入力版と `package.json` の `version` が一致することを検査する（**CI で版を書き換えない**）
- publish 直前に `package.json` の `name` を一時的に `@b4m/calengine` へ書き換え、`--registry` で社内レジストリを指定して `npm publish --access restricted`
- secret `PACKAGE_REGISTRY_TOKEN` が必要

ルート [`.npmrc`](../../.npmrc) は `@b4m` スコープを社内レジストリへ向ける（トークンは `${PACKAGE_REGISTRY_TOKEN}`）。`@b4moss` は npmjs 既定のため行を書かない。

## 同じタグで両方の workflow が走るとき

1. Gitea の `main` にタグ `vX.Y.Z` を打つ
2. Gitea Actions の `npm-publish` が動き、社内レジストリへ `@b4m/calengine@X.Y.Z` を公開する
3. Gitea → GitHub の push mirror（運用設定）が同じタグを GitHub に届ける
4. GitHub Actions の `publish` が動き、npmjs へ `@b4moss/calengine@X.Y.Z` を公開する

両者は独立する。一方の失敗は他方をロールバックしない。どちらかを再実行するときは、版がレジストリに既にある場合は skip される（npmjs）／社内側は失敗または手動判断になる。

## 既知の課題

- 社内 `npm-publish` は secret `PACKAGE_REGISTRY_TOKEN` が未設定だと失敗する（過去タグ実行が失敗していた）
- GitHub リポ `b4moss/calengine`・Environment `npm-publish`・ミラー・Trusted Publisher は公開日に別途設定する（このリポのコード準備とは別作業）

----

以上
