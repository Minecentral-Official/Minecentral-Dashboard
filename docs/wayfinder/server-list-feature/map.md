---
title: Server List Feature Map
labels:
  - wayfinder:map
children:
  - tickets/audit-existing-server-list-shape.md
  - tickets/decide-public-server-discovery-surface.md
  - tickets/decide-server-creation-and-ownership-rules.md
  - tickets/specify-server-filtering-contract.md
  - tickets/specify-server-list-query-contract.md
  - tickets/specify-public-vote-submission-contract.md
  - tickets/prototype-public-server-list-ux.md
  - tickets/specify-dashboard-server-management-flow.md
---

## Destination

Produce a clear implementation spec for the Minecentral server list feature: the public browsing/filtering experience, the server data/query contract behind it, and the authenticated flow that creates a server owned by the current user.

The map is complete when the remaining work can be implemented without unresolved product or architecture decisions.

## Notes

Use the existing Next.js App Router, server actions, Conform/Zod forms, Drizzle schema/query patterns, shadcn-style UI components, and `validateSession()` authentication helpers. Planning should account for the current `src/features/serverlist` implementation, especially the existing one-server-per-user create action and the currently placeholder public `/serverlist` route.

Wayfinder is planning-only for this effort. Do not implement the feature while resolving tickets unless a ticket explicitly asks for a prototype artifact.

Local-markdown tracker convention: each child ticket is a markdown file under `docs/wayfinder/server-list-feature/tickets`. Dependencies are listed in ticket frontmatter as `blocked_by` using ticket names.

## Decisions so far

- [Audit Existing Server List Shape](tickets/audit-existing-server-list-shape.md) — Existing serverlist code provides authenticated single-server creation and dashboard-edit foundations, but public browsing/filtering is placeholder-only and the spec must account for ownership guards, slug/address integrity, votifier wiring, and vote schema issues.
- [Decide Public Server Discovery Surface](tickets/decide-public-server-discovery-surface.md) — Public server list v1 is a polished discovery hub with basic detail pages, rich cards, URL-backed search/filter/sort, pagination, and public voting; Minecraft username is only required when Votifier/reward delivery is configured.
- [Decide Server Creation And Ownership Rules](tickets/decide-server-creation-and-ownership-rules.md) — Authenticated users may create multiple draft listings up to a global env cap; listings become public once required profile fields are complete, and slug plus address/port must be globally unique.
- [Specify Server Filtering Contract](tickets/specify-server-filtering-contract.md) — Public server filtering is server-driven by URL params `q`, `category`, `platform`, `sort`, `p`, and `limit`; multi-select values are comma-separated, default sort is recently updated, and filter changes reset to page one.
- [Specify Server List Query Contract](tickets/specify-server-list-query-contract.md) — Public list queries return only public-ready listings using normalized URL filter state, include vote counts and pagination metadata, require platform/status schema additions, and use list plus per-server cache tags.
- [Specify Public Vote Submission Contract](tickets/specify-public-vote-submission-contract.md) — Public votes use anonymous cookie/id plus IP hash identity, per-server 8-24 hour cooldown options defaulting to 24, optional Minecraft username only for Votifier delivery, and generic UI feedback while delivery happens silently.
- [Prototype Public Server List UX](tickets/prototype-public-server-list-ux.md) — Public browsing should feel like a polished Minecraft server browser with a desktop filter rail, search/sort row, active chips, pagination, and horizontal dense server cards rather than a plugin-style grid.
- [Specify Dashboard Server Management Flow](tickets/specify-dashboard-server-management-flow.md) — Owner dashboard uses draft/published status, readiness checklist, manual publish/unpublish, Overview/Profile/Voting/Danger sections, and returns published listings to draft when required fields are saved incomplete.

## Not yet specified


## Out of scope

- Hosting/Pterodactyl server provisioning is outside this map; this effort concerns listing externally reachable Minecraft servers and managing their public profile.
- Paid promotion, sponsored ranking, or marketplace monetization is outside this map.
- Full admin moderation tooling is outside this map unless the publication decision makes a minimal status field unavoidable.
- Live player counts and uptime polling are outside v1; do not show fake player counts.
- Saved servers and vote history dashboard pages are outside v1 even though placeholder routes exist.
