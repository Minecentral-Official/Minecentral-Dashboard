# Plugin catalog and metadata ingestion — epic #5

## Routes and rollout

Apply `pnpm db:migrate` before deploying the catalog. Migration `0002_plugin_catalog.sql` adds five tables; existing application records are unchanged. No legacy database adoption step or new environment flag is required. If `NODE_ENV=production`, use `MIGRATION_APPROVED=true pnpm db:migrate` after reviewing the migration. Do not reset a database containing records you want to keep.

`/discover/plugins` is the canonical catalog; `/discover` redirects there. Public detail URLs are `/discover/plugins/<UUID>/<slug>` with stable IDs and stable slugs. An outdated slug redirects only after public visibility is checked. Old `/plugins` resource browsing, uploads and downloads retain their original meaning. The homepage and dashboard now link to the catalog. Stack installation and compatibility evaluation remain later epics, so no Add to stack action pretends to install anything.

Curators/admins use `/admin/catalog` to queue metadata imports, create external-only projects, edit overviews and merge reviewed identities. `/admin/sources` shows the latest 50 jobs/sources, attempts, failures and freshness, and queues retries. Every action checks `catalog:curate`; service mutations also look up the actor's current role. Ordinary users and moderators cannot curate. IDs for projects outside the recent list are available in their public detail URL.

## Canonical schema and identity (#39, #44)

- `catalog_project`: UUID, stable slug, display/search fields, canonical metadata, curated overrides, publication state and redirect target.
- `catalog_source`: unique `(provider, external_id)`, current locator and source URL, normalized source metadata, freshness, failure status and next refresh.
- `catalog_version`: unique source/release ID, release channel/date, attributed external release URL, per-platform support and declared dependencies. Versions belong to sources, not duplicate copies of canonical projects.
- `catalog_job`: queued/running/done/failed work, attempt count, due time, timestamps and bounded errors; a partial unique index prevents duplicate active provider/locator jobs.
- `catalog_audit`: actor, project, event, evidence/reason and time. Syncs record source identity and imported release count; merges retain both previous project records and curated values.

Modrinth's immutable ID and Hangar's numeric project ID establish source identity. Initial inputs may be slugs or Hangar owner/slug; after successful resolution, scheduled refreshes use immutable IDs. Repeated imports through those aliases resolve to the same source. Similar names never merge automatically. Curators must record author confirmation or matching official-repository evidence before merging. Sources and release IDs move with their provenance; the old project and its URL become redirects. Existing redirects are flattened, and merged targets cannot be merged back into their aliases. No database records are hard-deleted by these tools.

Default display metadata comes from the first available source sorted by provider then external ID (Hangar, manual, Modrinth). Curated fields override it and persist across refreshes. No cross-source union invents compatibility. The source metadata remains independently queryable. Merge keeps the target's curation; the audit preserves the previous records for review. Hidden projects stay hidden during refresh. Source 404/410 makes that source unavailable; a project with no remaining available source is not publicly served. Temporary errors retain last known data and show failed freshness.

## Source adapters and support semantics (#40, #41)

Only documented public HTTPS APIs are fetched, using an identifying User-Agent, a 15-second request timeout, a 10 MB decompressed response limit, rejected redirects and at least 300 ms between requests. Source errors never persist raw response bodies or credentials. JSON is validated before a transaction writes any metadata. No JARs, changelogs or full marketplace descriptions are mirrored. Icons are stored as attributed URLs but are not automatically proxied or rendered.

Modrinth: resolve project and public team members, use declared project release IDs in batches of 100 with the bulk versions endpoint, validate project ownership for every returned release, and keep server plugin loaders only. Its bulk endpoint does not use offset pagination. Nonpublic projects/releases are excluded.

Hangar: resolve a public listed project, then fetch version pages of 25 until the reported count is covered. Project ID mismatches, premature empty pages and malformed responses fail the whole refresh. Both adapters explicitly reject more than 5,000 releases rather than marking a truncated import fresh. Unknown/new API fields are ignored; required shape changes fail validation and leave prior data intact.

Hangar `platformDependencies` is not uniformly Minecraft versions: Paper entries are recorded as Minecraft versions, while Velocity/Waterfall entries are platform versions. They are labeled separately and proxy versions never satisfy the Minecraft filter. Modrinth game versions are recorded against each declared plugin loader. Declared dependencies preserve source IDs, version IDs, names, type and platform as supplied; absent dependencies are not proof that none exist. No dependency resolver or compatibility result is implied.

A complete successful refresh upserts releases by source identity, preserving their internal IDs. Missing/withdrawn releases are retained with `available=0`, so prior provenance survives while public results exclude them. Metadata and release updates commit atomically.

## Worker operation and retries (#43)

Run once on demand:

```bash
pnpm catalog:sync
```

Run that same command every five minutes using the deployment scheduler, in the app directory with its database environment. The command exits after at most 10 jobs and returns a nonzero exit status if any processed job failed, so a scheduler can alert on errors. It schedules up to 50 due sources, then claims jobs transactionally with `SKIP LOCKED`. The CLI takes a session advisory lock so overlapping scheduled runs exit rather than multiplying upstream requests. A running job older than one hour is retryable after an interrupted process. This repository does not install a scheduler into the deployment environment.

Successful sources are due again after 24 hours. Transient network/validation/database errors and HTTP 429/5xx use exponential backoff, honoring `Retry-After` or Modrinth's reset header (bounded at 24 hours), with at most five attempts per job. Permanent 404/410/422 failures end the job; tracked sources are checked again the next day. Terminal jobs can be manually requeued. Job/source status and sanitized errors are visible to curators. A page request only reads persisted metadata or queues an authorized job; it never fetches marketplace APIs.

## Spigot and manual source policy (#42)

Spigot's published terms prohibit scraping and automated extraction through interfaces it does not provide. This implementation therefore has no Spigot scraper, unofficial mirror integration, automated binary download or inferred version history. Manual records contain a canonical publisher link and an original, minimal summary or author-permitted text, plus reviewer/evidence. Do not copy full marketplace descriptions, images or paid assets. Additional reuse needs appropriate permission and review; public availability alone is not a reuse license.

External-only records display **Manually curated / external links only** and **support unknown**. Their versions are empty, so version filters never manufacture a match. A source can later be attached through an explicit reviewed merge with an API-backed project. No matching by name alone, scraping fallback after API failure, or requests to user-entered publisher URLs occur.

## Search and detail (#45, #46)

Search uses indexed PostgreSQL simple-language full-text matching of name/description, with stable name or refresh-time ordering and bounded 12/24/48-item pagination. URL parameters follow the product contract: `q`, repeated `category`, `platform`, `gameVersion`, `source`, `sort`, `page`, `limit`. Category filters combine with AND; alternatives within platform/game/source combine with OR. A selected platform/game pair must be declared by the same release and source. The form presents one value per filter; shared URLs can express multiple alternatives. Changing filters resets pagination. Invalid values normalize to safe bounds/defaults.

Search pages have loading, empty and retryable error states and an unfiltered canonical URL. Details show overview, authors, source attribution/freshness, release channels and support, dependencies, and external publisher/release links. Compatibility and Configs sections explicitly say unavailable/not checked. Versions paginate by 25. There is no fake download count, rating, compatibility badge or live server status.

## Verification

Local validation: 63 unit/integration tests and all six desktop/mobile catalog/workspace browser flows passed. Desktop and mobile catalog screenshots were inspected. Fixtures use synthetic projects, accounts and disposable PGlite instances. Integration tests cover idempotent source refresh, curated field preservation, withdrawn release history, cross-source merge/redirect behavior, denied curation, manual-only records, combined filters, unavailable sources, queue deduplication/backoff/recovery and pagination. Browser flows cover public filtering, reloadable URLs, attributed detail/releases/dependencies, canonical redirects, unknown manual metadata, no-result recovery and curator queue/observability on desktop/mobile.

Read-only live adapter checks on 2026-09-24 successfully mapped LuckPerms from Modrinth (15 releases) and ViaVersion from Hangar (881 releases). These checks wrote no deployment database records and fetched no binaries. Counts are observations, not pinned fixtures or future freshness claims.

## Primary source references

- [Modrinth API overview, stable IDs, identifying User-Agent and rate limits](https://docs.modrinth.com/api/)
- [Modrinth project versions](https://docs.modrinth.com/api/operations/getprojectversions/)
- [Hangar API documentation](https://hangar.papermc.io/api-docs) and [published OpenAPI specification](https://hangar.papermc.io/v3/api-docs)
- [Spigot terms of use](https://www.spigotmc.org/wiki/spigot-terms/)
