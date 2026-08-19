---
title: Decide Server Creation And Ownership Rules
labels:
  - wayfinder:grilling
blocked_by: []
status: closed
assignee: Codex
---

## Question

How should an authenticated user create and own a server listing?

Resolve whether users may own one or many server listings, which fields are required at creation versus later editing, how slug uniqueness and server address uniqueness should behave, whether creation produces a public listing or a draft, and what feedback the user receives when creation fails.

## Resolution

Resolved with linked decision asset: [Decide Server Creation And Ownership Rules](../assets/decide-server-creation-and-ownership-rules.md).

Authenticated users may create multiple server listings, capped by a global env/config value for v1. New listings start as drafts and become public once name, slug, address, port, short description, at least one category, and banner/icon are complete. Slug and address+port must be globally unique, with specific form feedback for cap, slug, and duplicate-address failures.
