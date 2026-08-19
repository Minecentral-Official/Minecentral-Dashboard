# Audit Existing Server List Shape

## Current Surface

The server list feature already has a substantial private/dashboard slice under `src/features/serverlist` and `src/app/(authorized)/dashboard/servers`, but the public discovery surface is mostly unbuilt.

- Public `/serverlist` exists at `src/app/(public)/serverlist/page.tsx`, but it renders a placeholder sidebar with `test` and main content `Coming Soon`.
- No public `/serverlist/[slug]` route exists, even though `ServerCard` links to `/serverlist/${slug}`.
- Dashboard routes exist for `/dashboard/servers`, `/dashboard/servers/[slug]`, and `/dashboard/servers/[slug]/votifier`.
- Dashboard saved/votes routes exist as files, but the audit did not find a built saved-server workflow in `src/features/serverlist`.
- The dashboard currently frames the feature as a single owned "Realm" rather than many server listings.

## Data Model

The main table is `serverTable` with:

- ownership: `userId`
- required identity/address fields: `title`, `slug`, `ip`, `port`
- profile fields: `description`, `categories`, `iconUrl`, `languages`, `linkDiscord`
- timestamps: `createdAt`, `updatedAt`

There is no publication/status field, no moderation state, no server address uniqueness constraint, and no obvious DB-level slug uniqueness constraint in the Drizzle schema.

Related tables:

- `serverVotifierTable` stores one votifier config per server via `serverId`.
- `serverVotesTable` stores one row per user/server pair with `voteTime`.

Important mismatch: `serverVotesTable.serverId` references `resourceTable.id`, but its relation points to `serverTable.id`. This should be corrected before relying on votes.

## Authenticated Creation

`serverCreateAction` already does the core authenticated-user binding:

- calls `validateSession()`
- parses `S_ServerCreate`
- checks `serverGetByUserId(user.id)` and rejects users who already own a server
- calls `serverCreate({ ...formParsed.value, userId: user.id })`
- records activity
- redirects to `/dashboard/servers/${newServer.slug}`

Creation currently requires title, slug, IP, and port. It does not check slug availability before insert, and the schema does not enforce a unique slug at the DB level.

The create form has a copy mismatch: the IP field is labeled "Summary" and describes "Short sentence describing your server," while the actual input is IP/address data.

## Dashboard Editing

The dashboard edit form currently edits title, slug, and banner/icon. `S_ServerUpdateGeneral` only includes `id`, `title`, `slug`, and `deletingIcon`, so fields like IP, port, categories, description, languages, and Discord link are not currently editable through the general form.

Security gap: `serverUpdateGeneralAction` does not call `validateSession()` and does not verify the current user owns the server before updating it. The route loads by slug and renders edit forms without an ownership check. The UploadThing banner middleware does perform an authorship check, so that pattern already exists and should be copied into normal server actions/routes.

`serverDeleteBannerAction` also updates by server id without validating session ownership.

The delete card is present but the actual delete dialog/action is commented out.

## Votifier

There is a votifier schema, table, DTO, query, form, and vote action, but the update path appears incomplete or miswired.

- `ServerUpdateVotifierForm` imports and submits to `serverUpdateGeneralAction`, not a votifier-specific action.
- `S_ServerUpdateVotifier` expects `enabled`, but the rendered form does not expose an enabled control.
- No mutation/action for upserting `serverVotifierTable` was found in the serverlist slice.
- `serverVoteForServer` requires login, checks a Minecraft username, checks whether the user has voted, looks up enabled votifier config, stores a vote, attempts Votifier delivery, and revalidates the server cache.

Vote persistence has another mismatch: `serverSaveUserVote` uses `onConflictDoUpdate({ target: serverVotesTable.serverId })`, but the table primary key is composite `(userId, serverId)`. The target should be revisited alongside the intended vote cooldown model.

## Filtering And Queries

`server-list-all-filter.get.ts` is a fully commented-out copy of the resource filtering query and still references resource tables/types. No working public server list query contract exists yet.

The resource feature provides reusable patterns for URL-backed filter state, debounced search, limit/page/sort params, filter context, list rendering, and server-side filtered query behavior. The server list should decide whether to reuse that pattern directly or create a server-specific context/query pair.

Existing server categories and loaders are defined:

- categories: `pvp`, `survival`, `skyblock`, `roleplay`, `creative`, `adventure`, `hardcore`, `prison`, `faction`, `challenge`, `parkour`, `minigames`, `vanilla`, `anarchy`, `pixelmon`, `modded`, `ftb`
- loaders/platforms: `java`, `bedrock`, `fabric`, `forge`, `neoforge`, `quilt`

The data model has `categories` but no `loaders` field, despite a `C_ServerLoaders` config. That mismatch should be resolved when specifying filters.

## Patterns To Preserve

- Keep server actions for mutations.
- Keep Zod/Conform validation for create and edit forms.
- Keep DTO wrappers between Drizzle rows and UI props.
- Keep cache tagging by server id and slug, but define invalidation for list queries once the public query exists.
- Keep author/owner derived from `validateSession().user.id`; never accept `userId` from client form data.
- Reuse the existing UploadThing authorship guard pattern for all server owner mutations.

## Follow-On Implications

The next decisions should treat the existing code as a partial foundation:

- The authenticated creation story is started, but ownership limits, publication state, slug/address uniqueness, and required fields need a product decision.
- The public discovery story is not implemented, so filtering should be specified from first principles and then mapped onto the current category/loaders/schema mismatch.
- Before implementation, security/data integrity fixes should be included in the spec rather than treated as polish.
