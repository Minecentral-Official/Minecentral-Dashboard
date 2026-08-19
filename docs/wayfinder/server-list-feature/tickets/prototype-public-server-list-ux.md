---
title: Prototype Public Server List UX
labels:
  - wayfinder:prototype
blocked_by:
  - Specify Server Filtering Contract
status: closed
assignee: Codex
---

## Question

What rough public server-list screen should the user react to before implementation is locked?

Create a cheap UI prototype or annotated layout using the decisions from the discovery/filtering tickets. It should make the filter controls, list density, card content, sorting, and empty/loading states concrete enough for feedback without implementing production data flow.

## Resolution

Resolved with linked prototype asset: [Prototype Public Server List UX](../assets/prototype-public-server-list-ux.md).

The public list should use a polished Minecraft server-browser layout: desktop filter rail, search/sort control row, active filter chips, pagination, and horizontal dense server cards. Cards show banner, title, short description, tags, vote count/action, copyable address, and detail link. Mobile uses visible search/sort plus a filter drawer. The user chose horizontal dense cards over a 2-3 column grid.
