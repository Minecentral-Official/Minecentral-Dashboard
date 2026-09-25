# Server stack builder — epic #6

Issues #47–#52 add private, user-recorded plugin stacks to server workspaces.
Apply the new migration before deploying the application:

```sh
pnpm db:migrate
```

The existing `FEATURE_V2_WORKSPACES=true` setting enables workspace routes; no
additional stack flag is required. Open a workspace's **Stack** tab. Add plugins
from its catalog search, or use **Add to a workspace** on public catalog search
and detail pages. Select a workspace before choosing a release. This workflow
records desired state; it does not install JARs, connect to a server or modify
running plugins.

## Data and authorization (#47, #48, #52)

`stack_entry` owns one canonical project per workspace, enforced by a database
unique index. It stores a selected catalog release, a manual version string or
an explicit unknown version; a check constraint prevents mixed states. Project
and release IDs are stable foreign keys. Source attribution for catalog versions
comes from the release's source, while `added_via` records catalog versus bulk
import. Timestamps distinguish version changes from metadata edits.

Notes (10,000 characters), alias/purpose (150 characters), and enabled/disabled
state belong to the workspace/plugin pair. They are never included in public
catalog queries. Global app admin status does not grant workspace access.
Owners, workspace admins and editors can mutate a stack; viewers may read it.
Private visibility revokes member access, and archived workspaces are read-only.
Every action authenticates the actor and the service authorizes the requested
workspace. Entry IDs are scoped to that workspace, including destructive actions.
Writes lock the workspace row and use the existing catalog transaction lock to
serialize source merges against version selection.

Removing an entry requires an explicit confirmation and deletes its private
notes. Workspace activity and the change outbox retain the removal event. There
are no config files attached to stack entries yet. Future config/history foreign
keys must restrict entry deletion until their export/retention policy exists.
Workspace deletion is restricted while entries exist; restore an archived
workspace, remove its entries, then archive/delete it.

Catalog merges move non-colliding stack references to the canonical target,
retaining entry IDs, notes and selected release IDs. If both projects already
exist in any one workspace, the merge fails atomically without revealing private
workspace identities. An owner must resolve that duplication first. No automatic
merge discards private metadata. This conservative policy may block a curator's
merge until workspace owners have coordinated a resolution.

## Versions and compatibility hooks (#49)

Default release choices require explicit source declarations for both the
workspace platform and its Minecraft version. **Show all releases** also exposes
unsupported, unknown and withdrawn releases, with warnings; each list paginates
by 25. Stored releases remain readable if a source refresh withdraws them. Manual
and unknown versions remain valid options for every project, including manual
catalog entries. A release from another project is rejected by the service.

Latest relevant means the most recently published available release with explicit
runtime declarations, with a deterministic ID tie-breaker. It is not a semantic
version comparison, a recommendation to upgrade, or a compatibility verdict.
Proxy platform versions never satisfy a Minecraft version filter. The UI keeps
publisher-declared runtime support separate from **Compatibility: not checked**
and **Dependencies: not checked**.

Every add, effective version change, metadata/state change, removal and catalog
merge appends a `stack_change` row in the same transaction as the mutation. This
is the durable recalculation hook for epic #7: consume unprocessed rows, authorize
workspace-scoped outputs, calculate against current state and mark processed
only after persisting results. Rows have a stable UUID for idempotency and retain
entry IDs after removal. No compatibility consumer or result is claimed in this
epic. Version no-ops do not create spurious change events. Removing a workspace
cascades its outbox and activity, after stack entries have been explicitly removed.

## Bulk import (#50)

Paste up to 100 nonblank lines containing exact catalog names or known source
URLs, or use this JSON manifest (maximum input size: 50,000 characters):

```json
{
  "plugins": [
    { "project": "Oak Permissions", "version": "custom-1.0" },
    { "project": "https://modrinth.com/plugin/oak-permissions" }
  ]
}
```

`project` also accepts a published canonical project UUID. Names are matched
case-insensitively but exactly, never fuzzily. Source URL matching tolerates a
trailing slash. Input URLs are compared to stored metadata, never fetched.
Preview classifies each row as matched, ambiguous or unresolved. The user can
choose among up to 21 displayed exact matches or skip a row. Unresolved projects
must first be added to the catalog, or corrected in the input. No synthetic
catalog identity is created by importing a name.

Confirmation re-parses input, rechecks current matches and permissions, and
ignores forged candidate IDs. If a formerly unique match becomes ambiguous,
there is no automatic guess. Existing entries and duplicate input rows are
skipped without overwriting notes, state or versions. Optional manifest version
text is recorded as **manual**, preserving what the user supplied without
assuming an upstream release identity. The result lists every row and reports
added/skipped/unresolved counts. Missing matches do not prevent confirmed known
projects from importing; unexpected database errors roll back the transaction.

## Management UI (#51)

The responsive stack list displays installed and latest relevant versions,
source, enabled state, purpose, private-note presence and explicit analysis
placeholders. Search matches plugin name or purpose; state and sort are URL
parameters. Pagination is 24 entries per page with stable ordering and clamped
out-of-range page numbers. An integration fixture exercises 105 entries.
Overview counts query current entries and every successful action revalidates
the workspace layout. Loading, no-entry, no-match, forbidden and retryable error
states use the workspace route boundaries and accessible form feedback.

## Validation

Tests use isolated PGlite databases and synthetic browser sessions. Integration
coverage includes workspace isolation, global-admin non-bypass, viewer/editor
roles, archived mutation denial, cross-workspace entry IDs, exact release
ownership, withdrawn versions, schema uniqueness, independent note/version
updates, atomic change hooks, confirmed removal, merge collisions, conservative
bulk matches, forged choices, preserved metadata and 105-entry pagination.
Browser coverage exercises catalog-to-workspace addition, catalog release
selection, manual and cleared versions, persistent notes/state, filtering,
private-route denial, public-note isolation, bulk reports, live overview counts,
and confirmed removal on desktop and mobile.
