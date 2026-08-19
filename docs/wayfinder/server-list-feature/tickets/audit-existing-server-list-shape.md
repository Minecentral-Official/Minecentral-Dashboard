---
title: Audit Existing Server List Shape
labels:
  - wayfinder:research
blocked_by: []
status: closed
assignee: Codex
---

## Question

What server-list functionality already exists in the codebase, where is it incomplete, and which existing patterns should the implementation spec preserve?

The answer should summarize current routes, schema fields, server actions, dashboard/public UI pieces, vote/votifier code, filtering stubs, and any obvious mismatches such as naming, validation, missing slug checks, one-server-per-user behavior, or placeholder pages.

## Resolution

Resolved with linked research asset: [Audit Existing Server List Shape](../assets/audit-existing-server-list-shape.md).

The server list has an authenticated creation/dashboard foundation, but public discovery is placeholder-only. The most important implementation facts for later tickets are: create already binds `user.id` and enforces one server per user in application code; the public list/filter query is still a commented resource-query copy; there is no public detail route despite card links; normal edit/delete actions need ownership guards; votifier update is miswired; and the vote schema/conflict target should be corrected before ranking or vote cooldown decisions rely on it.
