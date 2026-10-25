---
title: "CI/CD"
type: Spec
status: draft
timestamp: 2026-10-22
---

# CI/CD

憲章 [CI/CD方針](../charter/ci-cd.md) に沿った、このリポジトリの Gitea Actions。

## CI (`.gitea/workflows/ci.yml`)

- `pull_request` の対象: `main`, `develop`, `dev-*`, `cursor/**`
- `paths-ignore`: `docs/**`, `**/*.md`
- `workflow_dispatch` を残し、手動実行できる
- concurrency は `ci-${{ github.event.pull_request.number || github.ref }}`、`cancel-in-progress: true`
- 上流 PR（head が `develop`、base が `main`）は通過済みとしてジョブを skip する。条件はジョブの `if: ${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}`
- `runs-on: ubuntu-latest`、Node 24、`actions/setup-node` の `cache: npm`
- ステップ順: `npm ci` → lint → typecheck → test → build
- E2E は CI に含めない

## パッケージ公開 (`.gitea/workflows/npm-publish.yml`)

- `push` のタグ `v*` と `workflow_dispatch` のみ。`pull_request` では動かない

## 既知の課題

`npm-publish` は secret `PACKAGE_REGISTRY_TOKEN` が未設定のため、`v0.1.0` から `v0.4.1` までのタグ実行がすべて失敗している。

----

以上
