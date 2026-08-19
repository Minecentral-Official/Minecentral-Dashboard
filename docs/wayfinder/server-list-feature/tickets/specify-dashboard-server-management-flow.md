---
title: Specify Dashboard Server Management Flow
labels:
  - wayfinder:grilling
blocked_by:
  - Decide Server Creation And Ownership Rules
status: closed
assignee: Codex
---

## Question

What dashboard flow should a server owner have after creating a server listing?

Resolve the post-create redirect, edit navigation, required-versus-optional profile sections, banner/icon handling, votifier setup placement, deletion behavior, and how the UI should communicate draft/public/readiness state if that state exists.

## Resolution

Resolved with linked decision asset: [Specify Dashboard Server Management Flow](../assets/specify-dashboard-server-management-flow.md).

After creation, owners land on `/dashboard/servers/[slug]`, where a status badge, readiness checklist, preview, and manual publish/unpublish controls guide the listing from draft to published. Required fields can be completed in any order; publish is enabled only when complete. Published listings can be edited, but saving an incomplete required field moves them back to draft. Dashboard sections are Overview, Profile, Voting, and Danger, with typed-name confirmation for deletion.
