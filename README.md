# MineCentral

MineCentral v2 is being designed to help Minecraft server owners **assemble, configure, troubleshoot, and maintain a working server stack**. The planned core experience combines private server workspaces, versioned plugin stacks, evidence-backed compatibility, configuration editing, upgrade planning, and log diagnostics.

**Current phase: private server workspaces.** The repository includes the legacy resource/server-list dashboard and feature-gated v2 workspaces. Other v2 product documents still describe planned behavior. The proposed first beta focuses on Paper/Java Edition with manual workflows. Visual configuration editing, community configs, recipes, and the optional server agent are proposed later capabilities, subject to the scope decisions recorded in the product contract.

## What exists today

| Area                    | Current implementation                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication          | Better Auth with Discord/GitHub sign-in and user/curator/moderator/admin roles                                                                                                      |
| Resources/plugins       | Project editing, release uploads, discovery, likes, downloads, and partial moderation                                                                                               |
| Public server listings  | Listing creation/editing, publication, discovery, voting, and optional Votifier delivery                                                                                            |
| Support/account         | Tickets and messages, profile display, activity, shared dashboard layouts                                                                                                           |
| Legacy scaffolding      | Placeholder pages for other resource types, worlds, collections, saved servers and vote history; Stripe/hosting helpers and environment settings without complete application flows |
| V2 workspaces and tools | Private workspaces, metadata, collaborators and lifecycle implemented behind FEATURE_V2_WORKSPACES; stack/config/compatibility tools remain planned                                 |

The [v1 audit](docs/audits/v1-feature-and-data-inventory.md) records known authorization, download-contract, data-model, and migration risks. Current functionality is not a claim of production readiness. Public server listings are distinct from the planned private workspaces: creating or editing a listing does not provision or manage a Minecraft server.

## Roadmap and architecture

Start with [Product direction & legacy migration — epic #2](https://github.com/Minecentral-Official/Minecentral-Dashboard/issues/2) and the [repository issue backlog](https://github.com/Minecentral-Official/Minecentral-Dashboard/issues).

| Document                                                                                       | Purpose                                                                                                     |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [V1 feature and data inventory](docs/audits/v1-feature-and-data-inventory.md)                  | #18: 46 routes, 14 tables, current flows, dispositions and preservation risks                               |
| [V2 product requirements and non-goals](docs/product/v2-product-requirements.md)               | #19: proposed MVP boundaries, acceptance scenarios and all 16 roadmap epics mapped to requirements          |
| [V2 information architecture and navigation](docs/product/v2-information-architecture.md)      | #20: public/private route hierarchy, desktop/mobile behavior and legacy URL decisions                       |
| [Legacy migration and archival plan](docs/migrations/v2-legacy-migration-and-archival-plan.md) | #21: phased migration, data order, recovery and archival gates                                              |
| [Route cutover manifest](docs/migrations/v2-route-cutover-manifest.json)                       | #21: planning manifest for all current routes; not executable deployment configuration                      |
| [Server-owner personas and workflows](docs/product/server-owner-personas-and-workflows.md)     | #22: four hypothesized profiles, core journeys and measurable outcomes; research has not yet been conducted |

Earlier [server-list planning](docs/wayfinder/server-list-feature/map.md) and [todo notes](todo.md) are historical context. Some descriptions predate the current implementation; use the dated audit and v2 contracts for current planning. Refer to requirement IDs and issue acceptance criteria when starting new work.

## Stack and repository layout

Baseline: Next.js **16.3.6**, React **19.3.0**, TypeScript **5.9.3**, Drizzle **0.45.3**, Better Auth **1.7.5**, Tailwind 3 and Radix. Node **22.23.3** and pnpm **12.6.0** are pinned. See [package.json](package.json), the lockfile and the [foundation record](docs/development/platform-foundation.md) for upgrade decisions and limitations.

| Path                                                       | Responsibility                                                          |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/app`                                                  | App Router pages/layouts, server boundaries and API handlers            |
| `src/features/resources`                                   | Legacy resource catalog, publishing and uploads                         |
| `src/features/serverlist`                                  | Public server listings, votes and Votifier                              |
| `src/features/tickets`                                     | Support tickets and conversations                                       |
| `src/lib/auth`, `src/lib/db`, `src/lib/env`                | Authentication, central schema/connection, typed environment validation |
| `src/lib/activity`, `src/lib/cache`, `src/lib/uploadthing` | Activity, cache invalidation and file integration                       |
| `src/lib/stripe`                                           | Legacy billing read helpers and customer mappings                       |
| `src/components`, `src/hooks`                              | Shared UI, forms, layouts and client hooks                              |
| `docs`                                                     | Audit, product, navigation, migration and historical planning artifacts |

## Local development

Use Node 22.23.3, pnpm 12.6.0 and a dedicated development PostgreSQL database. OAuth and upload credentials are needed only to exercise those integrations; the automated tests use isolated PostgreSQL fixtures.

```sh
pnpm install --frozen-lockfile
# Fresh checkout only; merge keys manually if .env already exists:
cp docs/development/local.env.example .env
```

Set `DATABASE_URL`, `FRONTEND_URL` and separate random auth/revalidation secrets (at least 32 characters). Generate each secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Keep credentials out of Git and `NEXT_PUBLIC_*` variables. See [runtime configuration](docs/development/runtime-configuration.md) for every variable and development/staging/production differences.

On an **empty development database**, run:

```sh
pnpm db:migrate
pnpm dev
```

For a disposable database with old tables, run `pnpm db:reset --confirm` once to erase and rebuild the schema. For subsequent schema changes, use `pnpm db:migrate`. See the [database workflow](docs/development/database-workflow.md).

Open `http://localhost:3000`. Current routes include `/plugins`, `/serverlist`, `/sign-in` and `/dashboard`. After applying migration 0001 and setting `FEATURE_V2_WORKSPACES=true`, open `/servers` for private workspaces; see the [workspace guide](docs/development/server-workspaces.md). To enable Discord, set its client ID/secret and register `<FRONTEND_URL>/api/auth/callback/discord`; if `DISCORD_REDIRECT` is set it must match exactly. GitHub is optional. Automatic cross-provider account linking is disabled. Follow the [live sign-in checklist](docs/development/platform-foundation.md#authentication-27) in an environment with database access. Uploads require an UploadThing development token and reachable callbacks.

## Commands and verification

| Command                                                | Purpose                                                 |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `pnpm dev`                                             | Development server                                      |
| `pnpm build`, `pnpm start`                             | Build and serve with configured runtime integrations    |
| `pnpm typecheck`, `pnpm lint`                          | Next route types/TypeScript and ESLint                  |
| `pnpm test`                                            | Unit and isolated database/service integration tests    |
| `pnpm test:unit`, `pnpm test:integration`              | Individual test layers                                  |
| `pnpm db:generate --name change_name`, `pnpm db:check` | Generate/review SQL and validate migration snapshots    |
| `pnpm db:migrate`                                      | Apply tracked SQL to the configured database            |
| `pnpm db:studio`                                       | Database browser; can edit configured data              |
| `node scripts/with-test-env.mjs pnpm build`            | Isolated build check without developer/provider secrets |

[Testing and CI](docs/development/testing-and-ci.md) explains fixtures, manual end-to-end boundaries and the required GitHub check. [Platform foundation](docs/development/platform-foundation.md) records architecture, roles and authentication behavior. Passing isolated checks does not prove live OAuth, upload or production database connectivity.

## Working on v2

Use the issue's requirements and acceptance criteria to bound the work. Preserve legacy identities, private data, files and URLs according to the migration contract; a proposed “archive/remove” disposition is not an instruction to delete production records. Keep planning documents distinct from implemented behavior and record validation evidence when completing an issue.

Workspace browser checks: `pnpm exec playwright install --with-deps chromium`, then `pnpm test:e2e`. The runner uses a disposable loopback database and synthetic sessions; it does not connect to your configured database.

### Plugin catalog

The source-attributed catalog is at `/discover/plugins`. Curators/admins can queue Modrinth or Hangar imports and manage manual projects at `/admin/catalog`; `/admin/sources` shows sync status. Apply `pnpm db:migrate`, then run `pnpm catalog:sync` to process queued work. Schedule that command every five minutes for continued refreshes. See the [catalog architecture, source policy and operations guide](docs/development/plugin-catalog.md).
