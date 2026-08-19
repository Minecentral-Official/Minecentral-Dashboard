---
title: Specify Public Vote Submission Contract
labels:
  - wayfinder:grilling
blocked_by:
  - Decide Public Server Discovery Surface
  - Specify Server List Query Contract
status: closed
assignee: Codex
---

## Question

What backend contract should public server voting use?

Resolve anonymous vote identity/cooldown rules, when Minecraft username is required, how Minecentral-side votes are stored, how Votifier delivery is attempted and reported, what happens when delivery fails, and which cache tags are revalidated after a vote.

## Resolution

Resolved with linked decision asset: [Specify Public Vote Submission Contract](../assets/specify-public-vote-submission-contract.md).

Public voting does not require Minecentral sign-in. Cooldown is configurable per server using fixed 8, 12, 16, 20, or 24 hour options, with 24 hours as default. Voter identity uses a persistent browser cookie/id plus IP hash backup. Minecraft username is required only when Votifier/reward delivery is enabled. Minecentral records the vote first, attempts Votifier delivery silently when configured, and always gives generic UI feedback without promising rewards.
