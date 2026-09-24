# Server workspaces — epic #4 (EPIC 02)

This epic implements private server workspaces independently of legacy public listings. `/servers` is My Servers; `/dashboard/servers` remains the public-listing editor. Creating a workspace neither publishes a listing nor provisions/contacts a Minecraft server.

## Enable and migrate

The feature remains behind `FEATURE_V2_WORKSPACES=false` by default. On a dedicated development/staging database, follow [the migration workflow](database-workflow.md): an existing legacy database must have its baseline verified/adopted before applying tracked migrations. `0001_server_workspaces.sql` adds three new tables without altering legacy records. Back up and rehearse first; no migration is run against the developer's configured database by tests or this implementation.

Set `FEATURE_V2_WORKSPACES=true` in the target environment, then build/restart the app. Sign in and open `/servers`, or choose **My Servers** in the dashboard. Both route access and every workspace action enforce the feature flag. Disabled routes are unavailable and cannot be enabled through submitted form fields.

## Data and access (#31, #36)

`server_workspace` uses UUID identity, stable owner-scoped slug, explicit snake_case SQL columns, timezone-aware lifecycle fields and nullable archive time. Owner, name, description, notes, platform, Minecraft/Java versions, planning status, access visibility and optional host/port metadata are modeled explicitly. Status means planning/active project/paused; it is never inferred server uptime. Host/port are private reference fields only: no credentials, DNS lookup, socket connection or agent enrollment.

`workspace_member` has unique `(workspace_id, user_id)` membership and an index beginning with user ID for dashboard access. Ownership lives on the workspace and cannot be removed through membership edits. `workspace_activity` records mutation descriptions and actor IDs, without copying private notes or connection metadata into events.

| Workspace role | Capabilities                                                        |
| -------------- | ------------------------------------------------------------------- |
| Owner          | Read/edit, manage sharing and collaborators, archive/restore/delete |
| Admin          | Read and edit metadata; cannot change sharing or membership         |
| Editor         | Read; content permissions are reserved for later stack/config tools |
| Viewer         | Read only                                                           |

Application-wide admin/moderator/curator status grants no implicit access to someone else's private workspace. All reads check ownership or assigned membership; writes recheck current membership in a transaction that locks the workspace row, serializing revocation/lifecycle changes with writes. Cached UI visibility is not permission. Private visibility is owner-only even if membership rows remain; team visibility admits only assigned collaborators. There is no public/unlisted access mode.

Owners add an existing signed-in MineCentral account by its exact email and choose a role. This records membership immediately and enables team sharing. No email is sent and there is no pending invitation/account-creation flow; the UI explains this. Unknown/ambiguous emails are rejected. Adding the same user again updates their role. Removal is effective on the next service request. Owners can remove access from archived workspaces as well.

## Onboarding and runtime metadata (#32, #35)

Onboarding collects name, platform, Minecraft version and optional Java version. It always creates an owner-private workspace regardless of submitted visibility. UUID URLs and stable slugs survive renaming. Settings include notes, description, status, visibility and optional connection metadata, with server-side validation and field feedback. Only owners/admins can edit active workspaces.

The curated initial metadata matrix is **Paper 1.20.6, 1.21.4 and 1.21.11**, with Java **21** or explicitly unknown Java. Default is the named 1.21.11 fixture, not a moving “latest”. This follows the existing Paper-first product contract and [Paper's Java guidance](https://docs.papermc.io/paper/getting-started/), checked 2026-09-24. It does not claim current security support, test server execution or establish plugin compatibility. Other platforms/versions are rejected with useful validation until their support matrix is deliberately added. The same runtime constraints are enforced by PostgreSQL CHECK constraints. Changing the matrix requires a reviewed schema migration and fixtures, not editing a dropdown alone.

## Dashboard, shell and overview (#33, #34, #38)

My Servers shows only owned/assigned workspaces, 24 per page, ordered by recent workspace activity. The query uses a membership existence predicate rather than an application-side per-server loop. Active/archived lists have dedicated empty states, pagination, loading skeletons and a retryable error boundary. Each card has its server identity, runtime, saved status, last mutation timestamp and explicit unknown plugin/warning summaries.

Every workspace section shares one shell with the current name, access role, runtime and archive state. Navigation wraps on mobile and highlights the current section. URLs include the immutable workspace UUID; all detail pages independently authorize that ID, rather than relying only on a parent layout. Overview, Stack, Configs, Compatibility, Updates, Diagnostics and Settings all resolve under the selected workspace.

Overview links each health summary to its relevant section. Plugins are **Not configured**, compatibility/updates/config checks are **Not checked**, and the agent is **Not connected**. These are not zero counts or successful checks. Detail destinations explain the unavailable feature and link back to usable settings; no fake analysis, plugin installation, agent heartbeat or compatibility result is fabricated. Persisted mutation activity is real. Later epics replace these states with authorized domain queries.

## Archive and deletion (#37)

Archiving is owner-only and reversible. Metadata/members/activity remain; archived workspaces are read-only except owner restore, access removal and explicit deletion. Hard deletion requires an already archived workspace and the exact current workspace name, checked server-side. Membership and activity records cascade intentionally; user accounts, legacy public listings and other workspaces remain unchanged.

No stack/config tables exist yet. Future domain tables must initially use restrictive workspace foreign keys until their export/retention/deletion policy and tests are defined. Do not silently add a broad cascade for configs, versions or diagnostics. Private metadata/notes are erased on hard deletion; no hidden copy is added to a log.

## Verification

Implementation validation on 2026-09-24: 47 unit/integration tests and both Playwright desktop/mobile lifecycle flows passed. Browser screenshots were inspected for the settings layout and wrapped mobile navigation. CI repeats the same suite on the PR.

Unit tests cover the curated runtime matrix and role policy. Database integration tests cover multiple private workspaces, tenant isolation including global admins, role-limited edits, sharing changes, revoked memberships, archive/restore, exact deletion confirmation, dependent cleanup, constraints and pagination. Existing migration tests now expect the 14-table baseline plus these three tables and verify reapplication is a no-op.

`pnpm test:e2e` uses Playwright desktop Chromium and mobile Chromium against a fresh loopback-only PGlite socket database and the real Next app/actions. It seeds synthetic users with signed test sessions, never adds an auth bypass to the application and never reads deployment database credentials. Tests cover onboarding, all section links, saved metadata after reload, denied outsider access, collaborator addition/removal, archive/restore and confirmation-protected deletion. Browser dependencies: `pnpm exec playwright install --with-deps chromium`. The fixture sets `DATABASE_POOL_MAX=1` because this PGlite socket adapter supports one connection at a time; normal deployments default to 10. Tests require free local ports 3100 and 55432 and do not reuse an existing server. Artifacts and fixture session files are ignored by Git. PGlite is not a substitute for production PostgreSQL restore/migration rehearsal.

Manual deployment smoke check: enable the flag after migration; create two workspaces; rename one and verify the other is unchanged; add a second account as viewer, then remove it; archive/restore; verify the deletion confirmation and unknown health summaries on desktop/mobile. Do not use real production servers or secrets as test fixtures.
