# Specify Server List Query Contract

## Decision

The public server list should be powered by a server-side query function that accepts the URL-backed filter state, returns public-ready server DTOs with vote counts and pagination metadata, and caches results by normalized filter state.

Recommended function:

```ts
serverListAllFiltered(request: T_ServerListFilterRequest): Promise<T_ServerListResponse>
```

## Request Shape

Create a server-list-specific request schema instead of reusing the resource schema.

Recommended schema fields:

- `query?: string`
- `categories?: T_ServerCategories[]`
- `platforms?: T_ServerLoaders[]`
- `sort: 'updated' | 'top' | 'newest'`
- `page: number`
- `limit: number`

URL parsing should normalize:

- missing `query` to empty/undefined
- missing `categories` to all categories
- missing `platforms` to all platforms
- missing `sort` to `updated`
- invalid `page` to `1`
- invalid `limit` to `16`
- comma-separated category/platform params into arrays

Recommended allowed limits:

- `16`
- `32`
- `48`

## Response Shape

Recommended response:

```ts
type T_ServerListResponse = {
  servers: T_DTOServer_PublicList[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};
```

`totalCount` should be included, not only `totalPages`, so the UI can show result counts later without changing the contract.

## Public List DTO

The public list DTO should extend the current server DTO shape with list-specific fields.

Recommended fields:

- `id`
- `title`
- `slug`
- `ip`
- `port`
- `description`
- `categories`
- `platforms`
- `iconUrl`
- `linkDiscord`
- `updatedAt`
- `createdAt`
- `votes`
- `votifierEnabled`
- `author`

`votifierEnabled` is enough for list/detail UI to decide whether voting needs a Minecraft username. Do not expose Votifier IP, port, or public key in public DTOs.

## Public-Ready Filtering

The public list query must only return public-ready listings.

Required public-ready fields:

- `title`
- `slug`
- `ip`
- `port`
- `description`
- at least one category
- `iconUrl`

Implementation can use either:

- an explicit `status`/`publishedAt`/`isPublic` field maintained by create/update actions
- a computed readiness condition in the query

Recommendation: add an explicit status/readiness field for clarity and performance, but keep the readiness rule centralized so dashboard checklists and public queries agree.

Draft/incomplete listings should never be returned by `/serverlist` queries.

## Schema Changes Required

The current schema needs changes before this contract can be implemented cleanly:

- add a platform/server-type array field to `serverTable`, backed by `C_ServerLoaders`
- add an explicit public/draft readiness field, recommended `status: 'draft' | 'public'`
- enforce globally unique slugs
- enforce globally unique `ip + port`
- fix `serverVotesTable.serverId` to reference `serverTable.id`, not `resourceTable.id`
- revisit vote uniqueness because the current composite primary key prevents repeat votes from the same signed-in user forever and does not model anonymous votes

Exact anonymous-vote storage and cooldown rules belong to `Specify Public Vote Submission Contract`.

## Search Behavior

Search should match at least:

- server title
- short description

If practical, it may also match:

- server address/IP
- owner/user name
- categories/platform labels

The query should combine search with filters using:

- `AND` between base public-ready conditions and filter groups
- `OR` inside text-search fields
- recommended `OR` matching for selected categories/platforms, so a server matching any selected category/platform appears

## Category And Platform Filtering

`categories` should filter against `serverTable.categories`.

`platforms` should filter against the new server platform field.

For v1, selected values should use "contains any" matching:

- `category=survival,skyblock` returns servers tagged survival OR skyblock
- `platform=java,bedrock` returns servers tagged java OR bedrock

If no categories/platforms are supplied, do not add a filter for that field.

## Sorting

Supported sorts:

- `updated`: `serverTable.updatedAt desc`
- `newest`: `serverTable.createdAt desc`
- `top`: vote count descending, then `updatedAt desc`

Default sort is `updated`.

Do not include alphabetical sorting in v1.

Do not include live-player sorting until live status/player counts are implemented.

## Vote Count Handling

List and detail queries should compute vote count from the vote table rather than storing a mutable count on `serverTable` for v1.

The query may use a SQL count subquery, matching the existing resource/server DTO pattern.

`top` sorting should sort by the same vote count used in the DTO.

If vote counts become expensive later, denormalized counters can be revisited outside this map.

## Pagination

Pagination is offset-based for v1:

- `offset = Math.max(0, page - 1) * limit`
- `totalPages = Math.ceil(totalCount / limit)`
- empty pages are allowed to return an empty `servers` array

The frontend should reset page to `1` when filter/sort/limit changes.

## Cache And Revalidation

Use existing Next cache helpers:

- `cacheLife('minutes')`
- `cacheTag(...)`

Recommended tags:

- a stable list tag such as `server-list`
- a normalized filter tag such as `server-list-${hashOrNormalizedParams}`
- per-server tags such as `server-id-${serverId}` and `server-slug-${slug}` for detail queries

Mutations that can affect public listing results should revalidate:

- `server-list`
- `server-id-${serverId}`
- `server-slug-${oldSlug}` and `server-slug-${newSlug}` when slug changes

Mutations that affect list ordering/counts include:

- create server
- update public-ready fields
- publish/draft status changes
- delete server
- banner/icon changes
- category/platform changes
- vote creation

## Integrity And Indexes

Implementation should add database-level integrity where possible:

- unique index on lowercase slug, or an equivalent case-insensitive slug strategy
- unique index on `ip + port`
- index on `status`
- index on `updatedAt`
- index on `createdAt`
- index on vote table `serverId`
- indexes suitable for category/platform array filtering if needed

Application checks should still provide friendly errors, but DB constraints should be the final guard.

## API Route

An API route is optional for v1.

Because this is a Next.js App Router app with server components and server actions, the public `/serverlist` page can call the query function directly from the server. Add an API route later only if client-side fetching, external consumers, or public JSON access become requirements.

## Follow-On Work

This decision unblocks the production implementation plan for public list querying.

It also surfaces one new ticket:

- `Specify Public Vote Submission Contract`

That ticket should decide anonymous vote storage, cooldown keys, optional Minecraft username behavior, Votifier delivery failure semantics, and revalidation after votes.
