# MineCentral v2 Roadmap

MineCentral v2 is being rebuilt around a single product promise:

> Help Minecraft server owners assemble, configure, troubleshoot, and maintain a working server stack.

This roadmap intentionally treats the existing resource directory/server-list code as reusable legacy infrastructure rather than the center of the product.

## GitHub Project setup

Create a GitHub Project named **MineCentral v2** and enable the auto-add workflow for issues from `Minecentral-Official/Minecentral-Dashboard`.

### Recommended fields

**Status**
- Backlog
- Ready
- In Progress
- In Review
- Blocked
- Done

**Priority**
- P0 — required for the current product milestone or a blocker
- P1 — important follow-up
- P2 — useful later / expansion

**Phase**
- 00 Product direction & legacy migration
- 01 Platform foundation
- 02 Server workspaces
- 03 Plugin catalog & metadata ingestion
- 04 Server stack builder
- 05 Compatibility & dependency engine
- 06 Configuration platform
- 07 Visual config editor
- 08 Community configs
- 09 Server recipes
- 10 Upgrade readiness
- 11 Diagnostics & troubleshooting
- 12 Official MineCentral Server Plugin & Control Plane
- 13 Search, knowledge & SEO
- 14 Admin, moderation & trust
- 15 Monetization, reliability & launch

**Type**
- Epic
- Product
- Architecture
- Feature
- Integration
- Infrastructure
- Security
- Privacy
- Trust
- Content
- SEO
- Analytics
- Performance
- Docs
- Research

### Recommended views

1. **Roadmap** — group by Phase, filter out Done.
2. **Current Build** — filter `Priority = P0`, group by Status.
3. **Next Up** — filter `Status = Ready`, sort P0 → P2.
4. **By Area** — group by Area for engineering focus.
5. **Later / Expansion** — filter `Priority = P2`.
6. **Completed** — filter `Status = Done`, sort by completion date.

## Epics and issue ranges

| Phase | Epic | Child issues |
|---|---|---:|
| 00 | #2 Product direction & legacy migration | #18–#23 |
| 01 | #3 Platform foundation | #24–#30 |
| 02 | #4 Server workspaces | #31–#38 |
| 03 | #5 Plugin catalog & metadata ingestion | #39–#46 |
| 04 | #6 Server stack builder | #47–#52 |
| 05 | #7 Compatibility & dependency engine | #53–#60 |
| 06 | #8 Configuration platform | #61–#68 |
| 07 | #9 Visual config editor | #69–#76 |
| 08 | #10 Community configs | #77–#84 |
| 09 | #11 Server recipes | #85–#91 |
| 10 | #12 Upgrade readiness | #92–#98 |
| 11 | #13 Diagnostics & troubleshooting | #99–#107 |
| 12 | #14 Official MineCentral Server Plugin & Control Plane | #108–#116, #150–#162 |
| 13 | #15 Search, knowledge & SEO | #117–#125 |
| 14 | #16 Admin, moderation & trust | #126–#134 |
| 15 | #17 Monetization, reliability & launch | #135–#148 |

## Suggested delivery milestones

### M1 — Product foundation
Issues #18–#38.

Outcome: the legacy product is audited, the v2 direction is explicit, and users can create/manage server workspaces.

### M2 — Server Stack MVP
Issues #39–#60.

Outcome: users can create a real plugin stack and receive evidence-backed dependency and compatibility results.

### M3 — Configuration MVP
Issues #61–#76.

Outcome: users can upload/edit/export YAML and supported plugins can use the Visual / YAML / Split config editor.

### M4 — Community layer
Issues #77–#91.

Outcome: reusable configs and complete server recipes can be published, forked, discovered, and applied.

### M5 — Maintenance toolkit
Issues #92–#107.

Outcome: MineCentral can help plan upgrades and analyze common server failures using recorded stack context.

### M6 — Official server plugin & connected control plane
Issues #108–#116 and #150–#162.

Outcome: a server owner can install the official MineCentral Paper plugin, securely pair it to a workspace, sync observed server/plugin state, receive update/compatibility alerts, and use MineCentral as the primary control plane for explicitly approved maintenance actions.

### M7 — Public knowledge & operations
Issues #117–#134.

Outcome: MineCentral has unified discovery, useful indexable knowledge pages, provenance, curation, and moderation.

### M8 — Public beta and launch
Issues #135–#148.

Outcome: billing boundaries, observability, backups, deployment, security, analytics, onboarding, privacy, beta feedback, docs, and launch gates are complete.

## Working rules

- Do not build a feature only because another Minecraft marketplace has it.
- Prefer source-agnostic canonical data models.
- Preserve **Unknown** as a valid compatibility state; never convert missing evidence into success or failure.
- Every compatibility claim should be traceable to provenance.
- Private configs, diagnostic logs, notes, and agent telemetry are private by default.
- The official MineCentral Server Plugin must not provide arbitrary remote command or shell execution.
- MineCentral.net is the control plane; the installed server plugin is a narrowly scoped, permissioned connector.
- Web-originated server actions must be allowlisted, authenticated, expiring/replay-resistant, auditable, and owner-controllable.
- Remote configuration or plugin changes must never silently overwrite server state; use explicit review, conflict detection, and rollback safeguards.
- Public/community content must use immutable releases so user edits do not silently mutate previously shared artifacts.
- Keep implementation tickets small enough that one pull request can usually close one issue.
- When implementation reveals a large new requirement, create a new issue and link the dependency instead of expanding an existing issue indefinitely.
