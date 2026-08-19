# Decide Public Server Discovery Surface

## Decision

The first public server list should ship as a polished discovery hub, not a bare directory and not a votes-only leaderboard.

It should include:

- a public `/serverlist` browsing page
- a basic public `/serverlist/[slug]` detail page
- rich server cards with copyable connection info
- public voting by Minecraft username
- search, filters, sort, and paginated browsing
- clear empty/loading states

## Public Browsing Page

The `/serverlist` page should present the actual browsing experience as the first screen.

Recommended first screen composition:

- top search and sort controls
- category/platform filters in a sidebar or collapsible filter panel
- a grid/list of server cards
- a lightweight featured/top area only if it uses real server data
- pagination controls at the bottom

Do not build a marketing-style landing page for `/serverlist`; visitors came to browse servers.

## Server Cards

Cards should show enough information to decide whether to click, copy, or vote:

- banner/icon image
- server title
- short description or tagline when available
- categories/game modes
- platform/loader badges once the data model supports them
- server address with copy button
- vote count
- vote action
- optional Votifier/rewards hint when configured
- author/owner only if it helps trust or discovery

Live player counts should not be required for v1. If the existing UI keeps a player-count slot, it should avoid fake `0/0` values unless real ping/status data exists.

## Detail Page

The first version should include a basic `/serverlist/[slug]` detail page so server cards have a shareable destination.

The v1 detail page should include:

- server banner/icon
- title
- copyable IP/port
- description
- categories/platforms
- vote count and vote form
- Discord link if present
- owner/author summary

Richer detail-page tabs, screenshots, changelogs, staff lists, uptime history, and moderation views remain outside this ticket and can be decided later.

## Voting

Voting should be public and should not require Minecentral sign-in.

Minecraft server voting norms center the Minecraft username because that is what Votifier/NuVotifier and reward plugins use to grant in-game rewards. Minecentral should follow that convention:

- any visitor can vote
- Minecraft username is required only when the server has Votifier/reward voting enabled
- if the server does not have Votifier/reward voting enabled, the vote should be a simple Minecentral-side vote with no username input
- Minecentral records the vote for the server's public vote count
- if Votifier is enabled and configured, Minecentral also sends the vote payload to the server
- if Votifier is missing, disabled, or delivery fails, Minecentral still records the Minecentral-side vote
- the UI should make reward delivery conditional on the server having voting rewards configured

Signed-in Minecentral accounts may be associated with votes later, but account sign-in is not required for v1 voting.

Abuse protection should be decided in the query/vote-contract work, but the public surface should assume a cooldown/error state exists.

## Search

Search should be visible on `/serverlist` and should search server titles first, then description/category/owner if the backend contract supports it.

Search should be URL-backed so users can share filtered views.

## Filters

The v1 filter surface should include:

- categories/game modes using `C_ServerCategories`
- platform/server type using the existing `C_ServerLoaders` intent, once the schema/query contract decides where that data lives

The UI should support multi-select filters. Exact URL keys and backend shape belong to `Specify Server Filtering Contract`.

## Sort

The v1 sort surface should include:

- top voted
- newest
- recently updated
- alphabetical

If live player counts are not implemented in v1, do not include an online/player-count sort.

Default sort should be top voted unless a later decision changes vote semantics.

## Pagination

Use pagination for v1 rather than infinite scroll.

This matches the existing resource-list pattern, makes URL-backed browsing easier, and avoids the extra state complexity of infinite loading while the query contract is still new.

## Empty And Loading States

The public list should have:

- no servers yet
- no matches for current filters
- loading/skeleton state while client-side filter transitions occur
- vote success/failure states
- Votifier unavailable/delivery failed state that does not imply the Minecentral vote failed
- vote form states that hide the Minecraft username field when no server-side reward delivery is configured

## Save Behavior

Saved servers are not part of the v1 public discovery surface.

Existing saved/votes routes can remain future-facing. This avoids requiring account sign-in in the core public browsing flow.

## Required Public Fields

The public surface requires enough data to render a useful card:

- title
- slug
- IP/address
- port, if needed
- at least one category/game mode
- short description/tagline, once creation/editing supports it

Whether creation starts as draft or immediately public is still owned by `Decide Server Creation And Ownership Rules`. If that later decision adds a publication/readiness state, `/serverlist` should only show listings considered public/ready.

## Follow-On Work

This decision unblocks `Specify Server Filtering Contract`.

It also sharpens later work:

- `Decide Server Creation And Ownership Rules` must decide how a server reaches public-ready state.
- `Specify Server List Query Contract` must define vote counting, pagination totals, public filtering, and Votifier-aware vote state.
- `Prototype Public Server List UX` should prototype a real browsing surface, not a landing page.
