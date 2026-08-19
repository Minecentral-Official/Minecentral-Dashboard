---
title: Specify Server Filtering Contract
labels:
  - wayfinder:grilling
blocked_by:
  - Decide Public Server Discovery Surface
status: closed
assignee: Codex
---

## Question

What exact filter state should the frontend own for the public server list, and how should it be represented in URLs and UI controls?

Resolve filter keys, supported values, defaults, multi-select behavior, reset behavior, mobile/desktop layout expectations, and whether filtering is client-side over a loaded page or server-driven through search params.

## Resolution

Resolved with linked decision asset: [Specify Server Filtering Contract](../assets/specify-server-filtering-contract.md).

Filtering is server-driven through URL search params. V1 params are `q`, `category`, `platform`, `sort`, `p`, and `limit`; multi-select params use compact comma-separated values. Default sort is recently updated, sort options are only `updated`, `top`, and `newest`, and changing filters/sort/limit resets the page to `1`.
