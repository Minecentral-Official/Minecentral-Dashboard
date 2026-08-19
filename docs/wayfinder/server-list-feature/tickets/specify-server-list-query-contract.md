---
title: Specify Server List Query Contract
labels:
  - wayfinder:research
blocked_by:
  - Audit Existing Server List Shape
  - Decide Public Server Discovery Surface
  - Decide Server Creation And Ownership Rules
  - Specify Server Filtering Contract
status: closed
assignee: Codex
---

## Question

What backend query/API contract should power the public server list?

Resolve the request shape, response DTO, count/pagination behavior, searchable fields, sortable fields, vote count handling, draft/public filtering, indexes or constraints needed for performance and integrity, and cache/revalidation strategy consistent with the existing codebase.

## Resolution

Resolved with linked research asset: [Specify Server List Query Contract](../assets/specify-server-list-query-contract.md).

The public list should use a server-side query function with normalized filter request state, return public-ready server DTOs plus `totalCount`/`totalPages`, compute vote counts from the vote table, support `updated`, `top`, and `newest` sorting, and use list/per-server cache tags. Implementation requires schema fixes/additions for platform, draft/public status, slug uniqueness, address+port uniqueness, and the vote table server reference.
