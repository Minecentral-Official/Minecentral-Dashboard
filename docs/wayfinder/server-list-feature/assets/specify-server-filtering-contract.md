# Specify Server Filtering Contract

## Decision

The public `/serverlist` filtering experience should be server-driven through URL search params.

Filtering state is owned by the URL so pages are shareable, refresh-safe, and compatible with server-side pagination.

## Search Params

Supported v1 params:

- `q`: search text
- `category`: comma-separated category/game-mode values
- `platform`: comma-separated platform/server-type values
- `sort`: sort key
- `p`: page number
- `limit`: page size

Example:

```text
/serverlist?q=smp&category=survival,skyblock&platform=java,bedrock&sort=top&p=2&limit=16
```

Defaults should be omitted from the URL where practical. `/serverlist` means recently updated servers, all categories, all platforms, first page, default page size.

## Defaults

Default filter state:

- `q`: empty
- `category`: all categories
- `platform`: all platforms
- `sort`: `updated`
- `p`: `1`
- `limit`: `16`

## Supported Sorts

V1 supports only:

- `updated`: recently updated; default
- `top`: most votes
- `newest`: newest listings

Do not include alphabetical sorting in v1.

Do not include online-player sorting until live status/player counts are intentionally implemented.

## Categories

`category` maps to `C_ServerCategories`.

Behavior:

- multi-select
- comma-separated URL representation
- omitted means all categories
- selected categories should be displayed as removable filter badges/chips
- reset category clears the param

The query contract should decide whether category matching means "contains any selected category" or "contains all selected categories." Recommended default is "any selected category" for discovery.

## Platforms

`platform` maps to the existing `C_ServerLoaders` intent, but the implementation spec must add an actual schema/query field for it because `serverTable` currently has categories but no loader/platform field.

Behavior:

- multi-select
- comma-separated URL representation
- omitted means all platforms
- selected platforms should be displayed as removable filter badges/chips
- reset platform clears the param

UI labels should present this as platform/server type rather than "loader" if that reads better for server owners and players.

## Search

`q` should be a single debounced text input.

Search should be URL-backed. The input may keep local state while typing, but committed/debounced changes update the URL and refetch from the server.

The query contract should search at least server title. If supported, it may also search short description, categories, platform, address, and owner name.

## Page And Limit

Use pagination for v1.

Behavior:

- `p` is 1-indexed
- invalid or missing `p` resolves to `1`
- invalid or missing `limit` resolves to `16`
- recommended allowed limits: `16`, `32`, `48`
- changing `q`, `category`, `platform`, `sort`, or `limit` resets `p` to `1`

## Reset Behavior

The UI should support:

- clearing search
- clearing individual category/platform chips
- clearing all filters
- restoring default sort

Clearing all filters should preserve only non-filter route context and return to `/serverlist` when all state is default.

## Desktop UI

Desktop should favor a browsable discovery layout:

- search and sort in a top control row
- category/platform filters in a sidebar or left rail
- active filter chips above the result grid
- pagination below results

## Mobile UI

Mobile should keep browsing uncluttered:

- search visible near the top
- sort as a compact select
- category/platform filters in a drawer or collapsible panel
- active filters visible as chips
- pagination below results

## Data Scope

Filters apply only to public-ready server listings.

Draft/incomplete listings should not appear in `/serverlist` results regardless of filter state.

## Follow-On Work

This decision unblocks:

- `Specify Server List Query Contract`
- `Prototype Public Server List UX`

The query contract must define parsing/validation schemas, exact category/platform matching semantics, public-ready filtering, count behavior, and cache tags.
