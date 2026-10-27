---
title: "tests-ci"
type: TestSpec
status: draft
timestamp: 2026-10-26
---

# CI ワークフロー契約

`.gitea/workflows/ci.yml`・`.gitea/workflows/npm-publish.yml`・`.github/workflows/publish.yml` をテキストとして読み、トリガー・スキップ条件・ステップ順・公開契約を検証する。

| ID | 区分 | 対象 | 期待 |
|----|------|------|------|
| TC-CI-01 | 正常 | `ci.yml` `pull_request.branches` | `main`, `develop`, `'dev-*'`, `'cursor/**'` |
| TC-CI-02 | 正常 | `ci.yml` `paths-ignore` | `'docs/**'`, `'**/*.md'` |
| TC-CI-03 | 正常 | `ci.yml` `concurrency` | `group: ci-${{ github.event.pull_request.number \|\| github.ref }}`, `cancel-in-progress: true` |
| TC-CI-04 | 正常 | `ci.yml` `on` | `workflow_dispatch` が残る |
| TC-CI-05 | 正常 | `ci.yml` test ジョブ | ジョブ直下の `if: ${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}` |
| TC-CI-06 | 正常 | `ci.yml` `steps` の `run` | `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` の順 |
| TC-CI-07 | 正常 | `ci.yml` Setup Node | `actions/setup-node` の `cache: npm` |
| TC-CI-08 | 正常 | `ci.yml` test ジョブ | `runs-on: ubuntu-latest`、`node-version: "24"` |
| TC-CI-09 | 制約 | `ci.yml` | E2E（e2e / playwright）を含まない。手動実行は `workflow_dispatch` |
| TC-CI-10 | 制約 | `npm-publish.yml` `on` | `push.tags: 'v*'` と `workflow_dispatch` のみ。`pull_request` は無い |
| TC-CI-11 | 正常 | `npm-publish.yml` | 版の一致検査あり、`npm version` なし、`@b4m/calengine` と `--registry` あり |
| TC-CI-12 | 正常 | `publish.yml` | `id-token: write`、タグ `v[0-9]+.[0-9]+.[0-9]+` の push と `workflow_dispatch` |
| TC-CI-13 | 正常 | `publish.yml` | SemVer タグ以外拒否・版一致検査、`environment: npm-publish`、`npm publish --access public --provenance`、`NPM_TOKEN` |

----

以上
