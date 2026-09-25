# Testing and CI (#29, #30)

Use the pinned Node/pnpm versions, then `pnpm install --frozen-lockfile`.

| Command                                                                    | Scope                                                                                                 |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm typecheck`                                                           | Generate Next route types, then TypeScript without emitting                                           |
| `pnpm lint`                                                                | ESLint, warnings treated as failures                                                                  |
| `pnpm test`                                                                | All Vitest unit and integration tests                                                                 |
| `pnpm test:unit`                                                           | Pure configuration, return-path and permission policies                                               |
| `pnpm test:integration`                                                    | Migration lifecycle, real ticket action/database boundaries, moderation HTTP responses, auth sessions |
| `DATABASE_URL=postgresql://fixture:fixture@127.0.0.1:1/test pnpm db:check` | Snapshot consistency; no database connection                                                          |
| `node scripts/with-test-env.mjs pnpm build`                                | Production compilation/rendering with test-only configuration                                         |

Unit tests should cover policy and parsing edge cases. Add compatibility/config parser cases as those v2 services are implemented; do not fabricate a compatibility engine for a test. Integration tests use fresh PGlite PostgreSQL instances with checked-in migration SQL, real Drizzle queries/transactions and synthetic users. Ticket actions mock the authenticated actor and cache invalidation only; denied writes must leave rows unchanged. HTTP moderation tests assert 401/403 before mocked service access. Auth tests use real Better Auth persistence and HTTP handlers, with fixture-only password signup to obtain sessions; production remains OAuth-only.

The server-only test alias is test configuration only. Tests never use root `.env` or external service credentials. Keep fixtures local, synthetic and independently disposable; avoid tests relying on production IDs/time/order. Add regression tests for behavior, not snapshots that mirror implementation. For SQL involving extensions/locking/planner behavior, also test the deployment PostgreSQL version in staging.

End-to-end boundary: live Discord consent/cancellation, upload callbacks and external service callbacks require a connected development/staging environment. Follow the [auth checklist](platform-foundation.md#authentication-27). These manual checks are not represented as automated passing tests. The workspace suite (`pnpm test:e2e`) now exercises desktop/mobile UI against a disposable local database and synthetic signed sessions; live provider consent remains a separate check. Provider credentials must not be added to untrusted PR workflows.

## GitHub Actions

`.github/workflows/quality.yml` runs on all pull requests and pushes to main, with read-only repository permissions, pinned action SHAs, pnpm-store caching, cancellation of superseded runs and a 20-minute timeout. Workspace browser checks run after the production build. No production secrets/database or deployment steps. Named steps install, typecheck, lint, test, check migrations and build; the first failing step exposes the relevant command/log and can be reproduced locally.

Required check to select in the main branch rule/ruleset after its first run: **Quality gates** (workflow **Quality**). Require pull requests and passing checks; disallow bypass/force pushes according to repository policy. The workflow makes main protectable; committing YAML does not enable a repository ruleset. Actual PR results must be verified before closing #30. No branch protection setting is silently changed by this task.

Sources: [pnpm setup](https://github.com/pnpm/setup), [GitHub Node CI](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
