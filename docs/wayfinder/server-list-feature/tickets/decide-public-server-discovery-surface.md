---
title: Decide Public Server Discovery Surface
labels:
  - wayfinder:grilling
blocked_by: []
status: closed
assignee: Codex
---

## Question

What should a visitor be able to see and do on the public server list when the first version ships?

Resolve the browsing surface at product level: list/card content, search behavior, available filters, sort options, pagination or infinite loading, empty states, whether unauthenticated users can vote/save, and which fields are required for a server to appear publicly.

## Resolution

Resolved with linked decision asset: [Decide Public Server Discovery Surface](../assets/decide-public-server-discovery-surface.md).

The public server list v1 should be a polished discovery hub with `/serverlist`, basic `/serverlist/[slug]` detail pages, rich cards, URL-backed search/filter/sort, pagination, and public voting. Minecentral sign-in is not required to vote; Minecraft username is required only when Votifier/reward delivery is configured. If Votifier is unavailable, Minecentral still records a site-side vote without asking for a username.
