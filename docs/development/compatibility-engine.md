# Compatibility and dependency engine — epic #7

Issues #53–#60 implement evidence-backed reports for a workspace's recorded
stack. Apply migration `0004_compatibility_engine.sql` before deploying:

```sh
pnpm db:migrate
```

Keep the existing `FEATURE_V2_WORKSPACES=true` setting. No new flag or worker is
required. Open a workspace's **Compatibility** tab; overview and stack badges
use the same report. This evaluates recorded state, not a running Minecraft
server. It neither installs plugins nor runs automated server tests.

## Evidence and verdicts (#53, #56)

Each claim targets one catalog release UUID, platform and Minecraft version.
It records kind, result, confidence, provenance/link, observation and expiry.
Supported kinds are developer-declared, source-metadata, community-tested,
automated-test and manual-curation. Curators record declarations or externally
performed tests with their provenance; source and community claims are derived
by the service, not entered as arbitrary curator votes.

The precedence policy is conservative:

1. Exclude revoked, expired, future-dated and low-confidence claims from the
   verdict, while retaining recorded claims as context.
2. Current medium/high-confidence positive and negative claims together produce
   **conflicting-evidence**. Neither recency, authority nor community vote count
   silently overrides a contradiction.
3. Positive-only evidence produces **compatible**; negative-only evidence
   produces **incompatible**; no eligible directional evidence is **unknown**.
   An unknown claim does not contradict a directional claim.

Source metadata is medium-confidence declaration evidence, not a runtime test.
It requires the selected release's exact platform and Minecraft-version support.
An explicit nonempty Minecraft-version list on that platform excluding the target
is negative evidence. Missing platform metadata is unknown: Paper/Spigot
inheritance and proxy/platform version equivalence are never guessed. Missing,
manual or disabled selected releases remain unknown. Disabled entries do not
contribute active dependency edges or summary totals.

Source declarations expire 30 days after a successful sync. Withdrawn releases
or unavailable sources stop contributing. A temporary refresh error can retain
last-good declarations within that window. Curated claims/relationships require
an HTTPS provenance link, nonfuture observation, future expiry and at most a
365-day observation-to-expiry interval. Revocation keeps provenance and audit
history. Unknown, disagreement and unsupported states have distinct UI labels
and colors; a runtime-supported badge does not certify the whole stack.

## Dependency graph and relationships (#54, #55, #57)

The pure resolver builds deterministic required/optional edges from normalized
release metadata and scoped curator relationships. Provider IDs resolve through
canonical catalog identities; exact release IDs take precedence over names.
Unresolved or ambiguous identities and missing release metadata stay unknown.
Embedded dependencies are bundled, not missing installations. Cycles are found
with iterative strongly connected components and shown as load-order context;
cycles alone do not claim incompatibility or recurse indefinitely.

Required dependencies absent from enabled entries are blocking findings. Exact
release mismatches or known supported-range failures are blocking for required
edges, informational for optional edges. Presence with no version constraint
confirms presence only, explicitly leaving version suitability unknown. Unknown
constraints never become a false range failure.

`catalog_version.version_number` stores the upstream machine version separately
from display names. Existing releases remain null until their next source sync;
we do not parse a display name such as “Oak 1.0” into a version. The bounded
numeric range grammar accepts two to four dot-separated integer components,
exact matches and `=`, `>`, `>=`, `<`, `<=`, with up to eight whitespace-separated
AND terms (example: `>=1.0 <2.0`). Missing components compare as zero. Prereleases,
caret/tilde ranges, wildcards, ORs and unsupported formats stay unknown.

Curated required, optional, conflict and overlap relationships may constrain the
origin release, destination release or numeric range, platform and Minecraft
version. Wrong known scopes do not apply; insufficient scope metadata produces
unknown. A hard conflict is a strong warning; overlap is informational. Every
finding identifies the originating plugin, provenance and observation date, and
links to adding/reviewing the dependency and the required release where known.
Catalog merges retain release identities and reparent relationship project IDs.

## Community reports and curation (#58)

An enabled stack entry with an exact catalog release offers **Share a community
test report**. The server binds that form to the displayed release and runtime;
if they change before submission, it rejects the stale form. The user explicitly
consents, chooses worked/failed, gives an observation date within 90 days and
20–1,000 characters of test details. Private workspace notes, server connection
data and other stack entries are not copied.

Rules enforced in the service and database:

- Non-banned account at least seven days old; workspace owner/admin/editor.
- One report per account/release/platform/game target, at most five submissions
  per 24 hours, and at least 24 hours before revising a target. Rate limits use
  server submission times, not the user-supplied test date. Concurrent submissions
  serialize on the reporter; revisions return to pending review.
- Curator/admin approval required, with a recorded reason and reviewer. A
  reporter cannot approve their own report. Reports remain private to their
  author and curators; other workspace users only receive aggregate evidence.
- At least three independently reviewed, distinct eligible accounts reporting
  the same outcome for the exact target. Ban status, account age, review identity
  and 90-day recency are checked again when aggregating. The oldest contributing
  observation determines the aggregate expiry.
- Aggregates have medium confidence, disclose source, count and observation/
  expiry, and can disagree with publisher evidence; counts never override it.
- `/servers/reports` allows users to withdraw their reports even after removing
  the stack entry. Withdrawal erases the test details and excludes that report
  from evidence. Deleting an account cascades its reports.

`/admin/compatibility` provides paginated pending reviews, evidence and
relationship recording/revocation, and a failed-cache count without exposing
private workspace reports. `/admin/catalog` links there; catalog release details
expose stable release IDs for precise curation. These are human-reviewed reports,
not proof against coordinated accounts or a substitute for running server tests.

## Snapshots, invalidation and failure behavior (#60)

Reports are cached in PostgreSQL per workspace with an engine-version, runtime
and revision fingerprint. Normal reads authorize membership and compare revisions
before loading the graph; a matching unexpired snapshot avoids resolution.
There is no graph computation in public catalog reads.

Migration 0004 includes reviewed SQL triggers, beyond the Drizzle table snapshot:

- Stack inserts/updates/deletes and workspace runtime changes increment that
  workspace's revision. Unrelated workspace changes do not invalidate it.
- Catalog project/source/release changes, evidence/relationship changes,
  community report changes and account trust updates increment a global catalog
  revision. This intentionally invalidates all workspace reports for correctness,
  rather than attempting partial dependency invalidation in the first version.
- Workspace deletion clears its cache through a foreign key and removes its
  revision. The successful report transaction marks visible pending `stack_change`
  outbox rows processed only after saving the snapshot.

Lazy recomputation runs on the next authorized report/stack/overview read.
Transactions use repeatable-read snapshots and per-workspace advisory locks.
Serialization/deadlock conflicts retry the complete transaction up to three
attempts with fresh snapshots before recording a recompute failure.
Cache lifetime is at most one hour, shortened to the earliest future evidence
or relationship expiry. Engine logic changes must bump the engine version.
`Recheck compatibility` forces recomputation for workspace content editors;
global curator/admin status alone never grants private workspace access.

Computation failures replace any old verdict with an explicit unavailable state,
log a sanitized error and appear in the curator failure count. Failures retry
after 30 seconds; forced recompute retries immediately. Failed computations do
not mark outbox rows processed. Authorization failures do not create cache records.
Oversized inputs (over 1,000 stack entries or 10,000 relevant relationships,
claims or community reports) fail visibly instead of silently truncating evidence.
The report paginates entries/findings by 24 and prioritizes blocking findings;
curation and personal-report lists are paginated too.

## Verification

Unit tests cover all four verdicts, stale/revoked/low-confidence evidence,
platform isolation, numeric ranges, missing/optional/exact/embedded dependencies,
scoped conflicts and overlap, deterministic ordering, self-cycles and a 2,000-node
cycle. Isolated PostgreSQL integration tests cover authorization, cache hits,
stack/runtime/catalog invalidation, expiry, failure/recovery, bounded injected
snapshot-conflict retries, outbox consumption,
curator auditing, merge preservation, stale forms, consent, trust/volume rules,
self-review denial, bans, withdrawal, privacy and submission throttles.
Desktop/mobile browser tests exercise a contradictory-evidence report, correction
of a missing dependency, forced recheck, opt-in submission and withdrawal. The
existing catalog, workspace, authentication and stack flows remain in the suite.

These checks use isolated PGlite databases and synthetic sessions. Deployment
migration and checks against a user's real Minecraft server are separate.
