# Database conventions and migration workflow (#25)

The legacy schema has 14 tables with mixed naming/ID conventions. `drizzle/0000_legacy_baseline.sql` reproduces that schema without renaming existing identities. This initial baseline is not permission to apply CREATE TABLE statements to an existing database. No v2 domain tables are introduced by this foundation task.

## V2 conventions

Use PostgreSQL UUID primary keys with `defaultRandom()` for new v2 entities; retain existing text auth IDs and integer legacy IDs when referencing them. Never regenerate or cast legacy identities as a migration shortcut. Use lowercase snake_case SQL table/column names and camelCase TypeScript keys with explicit SQL names. Shared `identityColumns()` and `lifecycleColumns()` helpers live in `src/lib/db/columns.ts`.

Use timezone-aware `created_at` and `updated_at` timestamps (not dates), non-null with `now()` defaults. The helper updates `updated_at` for Drizzle writes; raw SQL must explicitly maintain it. Use nullable `archived_at` for reversible archival. Active queries must explicitly exclude archived records; archive is not erasure and is not a substitute for a separately reviewed retention/deletion policy. Keep audit history immutable.

Every foreign key needs a documented deletion policy; default to restricting deletion where data must be preserved. Index foreign keys used in lookups and composite access patterns (for example owner + archived status + updated time), avoiding duplicate indexes covered by uniqueness. Tenant-owned records require non-null owner/workspace keys, scoped uniqueness and an ownership constraint where feasible. Never rely on application checks alone for unique identities, referential integrity, non-negative counts or bounded states. Add named CHECK/UNIQUE/FK constraints. Prefer text plus named CHECK for evolving statuses; PostgreSQL enums require reviewed additive/removal migration plans. Use partial unique indexes where active-record uniqueness is intended. Explain each non-obvious index with the query it supports.

Review new tables for these conventions. Existing v1 tables remain unchanged; converting them belongs in a separately reviewed data migration. The foundation helpers are available for future v2 tables, not fictional shipped workspace tables.

## Disposable development databases

1. Provision a dedicated PostgreSQL database. Root `.env` supplies `DATABASE_URL` to the scripts.
2. On an **empty** database, run `pnpm db:migrate`. It applies tracked SQL and records hashes transactionally.
3. Edit schema, run `pnpm db:generate --name descriptive_change`, review SQL and snapshot together, then run `pnpm db:check`, tests and `pnpm db:migrate` on a disposable copy.
4. Commit generated SQL and metadata. Never edit an applied migration. Never generate migrations against production as an ad hoc repair.

`db:push` remains for throwaway experiments only; it bypasses tracked history. A database populated with push must be recreated or explicitly reconciled before the migration runner will accept it. Fixtures use disposable PGlite instances; no test reads the developer's database URL.

## Existing database baseline

Inspect a restored copy first. Back up schema/data and verify restoration. Establish a maintenance/write barrier with a single operator and no concurrent DDL. Run `BASELINE_APPROVED=true pnpm db:baseline` only after review. The command creates a temporary isolated expected schema, compares public columns/defaults/nullability, constraints and indexes, and records **only** the baseline hash if there is an exact match and no journal. It refuses drift instead of silently marking incompatible databases migrated. Differences caused by PostgreSQL versions/extensions also require investigation, not bypassing the comparison. Existing application rows are not changed.

The fingerprint is structural evidence, not a complete inventory of custom triggers, policies, grants or extensions. Inventory those separately as part of the migration review. Do not adopt this baseline blindly for an uninspected production database.

## Staging and production

Use a reviewed deployment artifact with exactly the tested migration files and a dedicated migration account. Before deployment: verify target database identity, backup/restore rehearsal, schema drift, expected row counts, grants, lock/statement duration and rollback/forward-fix plan. Test against a production-like PostgreSQL restore in staging; PGlite tests do not replace it.

Run one migration job behind the agreed maintenance/write barrier:

```sh
NODE_ENV=production MIGRATION_APPROVED=true pnpm db:migrate
```

The runner takes a transaction-scoped advisory lock, uses a 5-second lock timeout and 60-second statement timeout, checks every applied hash/timestamp is an unchanged prefix, and commits SQL + journal atomically. Existing unbaselined public tables are rejected. A SQL error rolls back the transaction. Applications must not perform migrations automatically at startup. Keep additive schema compatible with the preceding app version; deploy expand/backfill/contract changes separately. Concurrent index builds cannot run inside this runner's transaction and need a separately reviewed operational migration.

Afterward: verify schema/version, row counts and application smoke checks before lifting the barrier. On failure stop deployment; do not retry destructive changes blindly. Roll back application code only when schema compatibility permits. Restore the verified backup or deploy a reviewed forward fix for committed data changes; there is no automatic destructive down migration.

References: [Drizzle migration overview](https://orm.drizzle.team/docs/migrations), [Drizzle migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate). The repository uses a guarded runner around Drizzle-generated SQL so adopting history is explicit.
