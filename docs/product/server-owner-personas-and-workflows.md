# Server-owner personas and core workflows

Date: 2026-09-24. Planning deliverable for [#22](https://github.com/Minecentral-Official/Minecentral-Dashboard/issues/22), under [epic #2](https://github.com/Minecentral-Official/Minecentral-Dashboard/issues/2).

Inputs: [v2 product requirements](v2-product-requirements.md), [navigation/route contract](v2-information-architecture.md), [v1 audit](../audits/v1-feature-and-data-inventory.md), and [migration plan](../migrations/v2-legacy-migration-and-archival-plan.md). The profiles below are **product hypotheses**, not interview findings, market statistics, or claims about existing customers. No user research or runtime testing was performed for this document. Numerical task criteria are proposed acceptance targets, not measured results.

## Scope and prioritization

The proposed MVP helps an individual owner assemble, configure, troubleshoot, and maintain a saved Paper/Java Edition stack. The product contract still owns the exact support boundary and release-scope decisions. Multiple privately owned workspaces are included; multi-user administration, automatic live installation, agent telemetry, recipes and community config publishing are later capabilities. An owner can complete the core workflow without payment or an agent.

Prioritize P1 and P2 for initial usability evaluation. Include P3 and P4 to expose boundaries and prevent design choices that confuse servers, intended state, and live observations; their presence does not expand MVP into network/fleet orchestration.

## Target owner profiles

| ID / profile                        | Operating context and practical knowledge                                                                                                                | Main job and trigger                                                                          | Pain points to reduce                                                                                                                                                | MVP fit and boundaries                                                                                                                                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 — Solo community starter         | One small community server; comfortable following setup instructions, uncertain about plugin dependencies, Java/game versions, and YAML                  | Get an initial stack saved and understandable after choosing a server platform                | Marketplace hopping; confusing plugin versus game versions; missing dependencies; fear of breaking config indentation; assuming green UI means a working live server | Primary. Guided creation, source/version explanations, dependency findings, raw YAML with useful errors, manual diagnostics. Must clearly distinguish exported files from deployed changes                                                                |
| P2 — Returning community maintainer | Maintains an established server and perhaps a test instance; can read configs/logs, has existing custom settings and limited maintenance time            | Change a plugin/config or prepare a game-version update without losing a known setup          | Losing undocumented customization; forgetting why a version was pinned; overwriting config keys; checking the same compatibility claims repeatedly; stale advice     | Primary. Separate production/test workspaces, exact versions/manual entries, revision restore, saved upgrade reports and source freshness. No automated synchronization or deployment promise                                                             |
| P3 — Small-network administrator    | Owns a few distinct servers, potentially with a proxy; understands platform differences and follows several plugin sets                                  | Identify which server has a problem or needs a change without mixing configurations           | Similar server names; wrong-server edits; different version requirements; ambiguous plugin identity across sources; unclear local versus network-wide failures       | Secondary. Multiple independently owned Paper workspaces and explicit server context. Proxy/Velocity support, shared libraries, cross-server dependency resolution and coordinated rollout are outside the proposed MVP                                   |
| P4 — Larger multi-server operator   | Operates many instances with existing deployment/monitoring processes and potentially several staff; expects reproducible evidence and control over data | Evaluate a representative stack or explain an incident before changing operational procedures | Inconsistent manual inventories; stale observations presented as fact; opaque compatibility claims; secrets in shared logs; insufficient audit/recovery context      | Boundary/expansion profile. Can evaluate one supported stack in an individually owned workspace. Team roles, fleet operations, automatic imports, agent connection and operational SLAs are not promised; shared account credentials are not a workaround |

### Design implications by profile

| Profile | First useful result                                                  | Information the interface must make explicit                                                                                          | Do not optimize for                                                   |
| ------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| P1      | A saved stack with one understandable next action                    | Platform/game/Java context; required versus optional dependency; unknown versus incompatible; what remains to do on the actual server | Catalog size, download counts, unexplained health scores              |
| P2      | An exported config revision or a saved target-version comparison     | Which revision/version was selected; what changed; whether evidence is stale; export versus deployment                                | Automatically choosing “latest” or rewriting unknown YAML keys        |
| P3      | Correctly scoped findings and changes across two distinct workspaces | Current server name/ID context, environment, and independent saved state                                                              | Automatically reusing config/session IDs when switching servers       |
| P4      | Reproducible findings with provenance and retention controls         | Source snapshot, evaluation/parser version, sanitized evidence, collection/retention boundary                                         | Implying fleet support because a workspace list can contain many rows |

## Core journeys

The route names below are the planned destinations from #20, not implemented features. Owner actions describe deliberate choices; inspecting a page or returning from sign-in must never silently mutate a stack or submit a log.

### J1 — First run: create a useful server workspace

**Profiles:** P1 primarily; P2 importing an existing setup. **Requirements:** PR-02, PR-03, PR-04, PR-05, PR-06, PR-17.

Trigger: the owner wants to choose plugins for a new server or record an existing setup. Starting knowledge may be incomplete; unknown/manual plugin versions must remain representable.

1. Enter from Home, My Servers, a public catalog project, or Tools. Sign in and return to the intended safe destination.
2. Create a workspace at `/servers/new`, selecting its name and supported platform/game/Java context. Explain that this does not provision or connect a server. If the target is unsupported, state that limitation rather than infer compatibility.
3. Open `/discover/plugins`, inspect source and version evidence, choose the workspace and selected version, and explicitly add the project. Repeat for a second project. Record an unmatched local plugin as a manual entry rather than forcing a false catalog match.
4. Open `/servers/[workspaceId]/stack` and Compatibility. Show exact selected versions, required/optional dependencies, conflicts and unknowns; explain one next action with its evidence.
5. Reload or leave and return. Retain progress; onboarding can be skipped and resumed without creating duplicate workspaces or entries.

Recovery: canceled sign-in/selection returns safely; no workspace opens a create option; stale catalog data is labeled; an ambiguous identity remains unresolved. Saving is not proof of runtime installation.

**Success:** W1 and W2 below pass; the owner can identify the recorded environment, selected versions, and one unresolved item without claiming it has been deployed.

### J2 — Ongoing maintenance: change a configuration and preserve a known revision

**Profiles:** P2 primarily; P1 learning config editing; P3 verifying server context. **Requirements:** PR-02, PR-05, PR-07, PR-16.

Trigger: change a setting or record a deliberate component change while preserving the prior setup.

1. Choose the correct workspace from My Servers; inspect its name/environment and saved stack. Switch between two workspaces when necessary without carrying nested object IDs across them.
2. Open Configs, import a bounded YAML file, and associate it with the relevant stack entry when known. Keep content private; distinguish syntax validation from plugin-specific semantic validation.
3. Edit one setting. On temporarily invalid YAML, retain the text, show the parse location, and retain the previous valid revision. Canceling navigation keeps the draft; discarding is explicit.
4. Save a new valid revision, inspect History, export the selected revision, and verify that unknown keys survive. Explain any known formatting/comment limitations.
5. If the change is unsuitable, restore a prior revision and export it again. Applying those files to the actual server remains the owner's external task. Update recorded stack versions only through explicit selection, not because a file was downloaded.

Recovery: a failed save keeps the draft and reports failure; no success notification before persistence. A missing schema means syntax-only feedback. If the operator cannot identify the intended workspace, resolve context before editing.

**Success:** W3 and W4 pass; the exported content matches the chosen saved revision, and the second workspace is unchanged. Actual server configuration changes require separate owner verification and are not counted as a MineCentral deployment success.

### J3 — Update planning: assess a target before changing the stack

**Profiles:** P2 and P3; P4 evaluating one representative supported stack. **Requirements:** PR-04, PR-06, PR-11.

Trigger: a planned game/platform version update or a need to reassess existing software against new metadata.

1. Open the workspace's Upgrades section and choose a supported target. Show the recorded current environment and selected components before evaluation.
2. Capture the source snapshot and evaluate target candidates; do not silently select prereleases or substitute an arbitrary “latest” version.
3. Review ready, update-available, blocked, unknown and manual-action findings with dependency effects and provenance. Every stack entry receives a state and reason; one unexplained unknown prevents an unqualified “ready” conclusion.
4. Open relevant project/help/config context, record the next manual step, and revisit the saved report through its stable evaluation URL.
5. If new metadata or stack changes warrant another assessment, create a new evaluation. Preserve the previous report and source snapshot; don't silently rewrite history.

Recovery: no candidate, unavailable source, unresolved plugin and conflicting evidence produce explicit reasons. The owner can defer the update. A report does not upgrade a live server or provide a runtime rollback mechanism.

**Success:** W5 passes; the owner can name a blocker/unknown and a reasonable next action, and both the original stack and original report remain unchanged after reevaluation.

### J4 — Troubleshooting: find the next justified action from logs

**Profiles:** P1 and P2; P3 identifying the affected server; P4 reviewing an incident sample. **Requirements:** PR-02, PR-06, PR-12, PR-14, PR-16.

Trigger: startup failure, dependency error, config error, or a mismatch between expected and logged behavior.

1. Enter from Tools → Diagnostics or the workspace's Diagnostics section. Choose the affected workspace explicitly; a guest signs in before any private log session is created.
2. Paste or upload bounded supported text. Reject unsupported/binary/oversized input with a recoverable explanation. Explain retention, review masked content, and let the owner correct remaining sensitive values before submission; redaction is not guaranteed to recognize every secret.
3. Submit deliberately. Correlate parsed evidence with recorded stack/environment and call out disagreement between the log and workspace instead of hiding it.
4. Show prioritized deterministic findings, sanitized supporting excerpts, implicated components, uncertainty, and linked next steps. Unknown input reports insufficient evidence, not an invented cause.
5. The owner chooses a suggested check or opens a Knowledge article. If further help is needed, create a support ticket explicitly; attaching log/config content is a separate choice, not an automatic copy.
6. Revisit or delete the session under the documented retention/deletion behavior. A later log submission creates new evidence rather than rewriting an old finding as resolved.

Recovery: preserve useful unparsed lines under the stated retention policy; parser failure isn't “no issues found.” An unavailable source or unresolved stack identity limits conclusions. Detecting a pattern does not prove the real incident is fixed.

**Success:** W6 passes. An owner can explain why the finding exists and identify the next justified action. Track actual incident resolution only as a separate, explicitly reported follow-up outcome.

## Measurable MVP outcomes

A task passes only when its persisted state and user-visible result are correct. A click, page view, green indicator or submitted request alone is not completion. Fixture assertions below are deterministic implementation acceptance criteria; human comprehension checks are proposed pilot observations.

| ID / MVP workflow                                         | Observable success and measurement                                                                                                                                                                                                                                                                 | Failure / excluded success signal                                                                                                                   | Traceability                               |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| W1 — Access and workspace creation                        | From sign-in, create one supported workspace and reload it with matching owner/name/environment; another signed-in account is denied direct read/write. Observe whether the participant correctly explains “saved plan, not provisioned server”                                                    | Duplicate creation on resume, lost environment, unauthorized access, belief that the server was provisioned                                         | J1; PR-02, PR-03, PR-17                    |
| W2 — Discover, assemble, inspect compatibility            | Save two catalog entries with selected versions plus one manual/unresolved entry; reload with all three intact and no duplicate canonical project. In fixtures, every hard/optional dependency, known conflict and missing-evidence case has the expected reason/provenance                        | Counting search views as saved stacks, silently dropping the manual entry, showing missing evidence as compatible                                   | J1; PR-04, PR-05, PR-06                    |
| W3 — Maintain multiple workspaces                         | Open two differently configured workspaces; switch from a nested detail to the matching top-level section; make one explicit change in the selected workspace. Compare before/after state: only the intended workspace changed                                                                     | Wrong-server mutation, carrying a nested config/report ID to another owner/workspace                                                                | J2; PR-02, PR-03, PR-05                    |
| W4 — Configure, revise, export and restore                | Import a YAML fixture with unknown keys/comments; make one valid edit and export/reparse the saved revision. Semantic values/unknown keys match; invalid draft does not replace the last valid revision. Restore the prior revision and compare exported semantic values to its snapshot           | Download-button click without verified content; lost unknown keys; discarded invalid draft; treating syntax validity as runtime correctness         | J2; PR-07                                  |
| W5 — Evaluate an upgrade                                  | All entries in a fixture stack receive explained target states. Save/revisit an evaluation after metadata refresh; its snapshot/findings are unchanged. Compare current stack before/after: no mutation. Participant identifies one blocker/unknown and next action                                | Single opaque percentage, unknown labeled ready, automatic version changes, historical report silently recomputed                                   | J3; PR-06, PR-11                           |
| W6 — Diagnose manually and control evidence               | Known fixtures yield expected deterministic findings with sanitized evidence; unrecognized input reports uncertainty. Test secret-pattern masking and review before submission. Delete a session and verify documented access/retention behavior. Participant points to evidence and a next action | Finding without evidence, sensitive fixture secret in public/general logs, invented diagnosis, claiming server recovery from report generation      | J4; PR-12, PR-14, PR-16                    |
| W7 — Use public discovery/help and enabled admin controls | Guest opens a published project/help page and reaches the relevant owner task through safe sign-in/chooser; no data is submitted automatically. Admin can trace a catalog/evidence change to an attributable action; non-admin mutation is denied                                                  | Private data in search/previews; dead-end help link; unauthorized evidence override; accidental publish during navigation                           | J1/J4 supporting path; PR-02, PR-14, PR-15 |
| W8 — Maintain useful data through operational failure     | A failed sync leaves saved owner work intact and freshness/error visible; repeat successful sync without duplicate source identities. On a restored migration copy, compare preserved IDs/ownership/files and reopen representative user records with no unexplained difference                    | Error shown as fresh data, duplicated catalog identities, counters alone masking missing records, database restore assumed to undo external effects | J2/J3 supporting path; PR-01, PR-04, PR-16 |

W7/W8 are supporting MVP workflows, not additional owner personas. W8's full operator runbook and go/no-go gates are owned by the migration/reliability plan. No billing purchase or agent pairing is required for W1–W8; later features need their own acceptance measures before they enter the MVP scope.

## Pilot measurement and research handoff

### Measurement definitions

For each W1–W8 scenario, record attempts, completions, assisted completions, abandonment step, errors, and relevant deterministic assertions. An attempt starts when a participant deliberately starts the defined task, not on every page view. Count retries within that task as retries, not new participants. Report counts alongside rates for small samples.

- **Unassisted completion rate:** unassisted successful attempts / all started attempts for the same task and cohort. Assisted successes remain separately reported; abandoned/failed attempts stay in the denominator. Flag technical interruptions rather than silently removing them.
- **Time to first useful stack:** elapsed time from deliberate first-run start to persisted stack plus an explained compatibility result (W1/W2). Report wall-clock time, active task time when observed, and OAuth/provider interruptions separately; no untested “under N minutes” promise.
- **Config task completion:** W4 attempts passing saved/exported/restored semantic checks / all W4 attempts. Downloads alone are insufficient evidence.
- **Diagnostic usefulness:** among participants shown a finding, count those who can identify its evidence and a justified next action without prompting. Track “no finding/insufficient evidence” outcomes separately so accuracy is not inflated by excluding them.
- **Upgrade comprehension:** W5 participants correctly distinguishing ready, blocked and unknown findings / all W5 participants; separately record whether the source stack remained unchanged.
- **Incident resolution:** optional later owner report, with response count and elapsed follow-up time. A nonresponse is unknown, not resolved; do not attribute causality solely to opening a report.

Use synthetic or deliberately sanitized fixtures for research and replay. Any eventual analytics implementation should record event names, task/result codes, durations, supported-target categories and appropriately minimized identifiers; no YAML, logs, secrets, ticket text, full URLs or workspace names in general analytics. Configure consent/retention/access behavior in the implementing privacy work. This issue does not introduce tracking or set production retention periods.

### Proposed research plan, not completed research

Recruit 6–8 consenting participants as a small formative sample: 2–3 P1, 2–3 P2, and one each P3/P4. Recruitment is future work and has not been initiated. Classify by responsibilities and experience rather than invented demographic traits. This sample can identify usability problems; it cannot establish market prevalence or statistically reliable performance claims.

Give P1/P2 a supported synthetic stack, valid/invalid YAML examples, known/unknown log samples, and an upgrade target with at least one unknown. Give P3 two deliberately similar server names with distinct versions to test context errors. Ask P4 to evaluate one representative supported stack and explain where missing team/fleet capabilities prevent broader adoption. Don't ask participants to upload production secrets or use actual outages for first-run testing.

Ask participants to demonstrate their last comparable task, where they lost time, how they judge compatibility claims, how they preserve config changes, and how they decide an incident is resolved. Observe W1–W6 before explaining the interface. Inspect W7/W8 with staff/test accounts and controlled fixtures. Record assistance and mistaken assumptions, particularly “saved equals installed,” “unknown equals safe,” “valid YAML equals correct plugin behavior,” and “report generated equals incident fixed.”

Proposed review trigger: if two participants independently misunderstand the same key concept, revise that interaction/copy and retest. Any observed cross-owner disclosure, wrong-workspace mutation, destructive config loss or sensitive-data exposure blocks release of that path regardless of completion rate. Numerical cohort rates inform iteration; they do not override the security/data-preservation gates from #19/#21.

| Hypothesis to validate                                                     | Observation sought                                                                    | Product response if contradicted                                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| P1 can make useful progress with raw YAML and structured errors            | Complete W4 and explain the remaining manual deployment step                          | Simplify instructions/error recovery or revisit editor scope through #19; don't silently add visual editing to MVP      |
| P2 values immutable config/report history enough to maintain a saved stack | Revisit a prior revision/report and accurately explain the difference                 | Improve snapshot/context presentation; determine why records become stale before adding automation                      |
| P3 can keep independent server context clear                               | Complete W3 with no wrong-server change                                               | Improve switcher, names and section context; do not infer need for full fleet orchestration from one navigation failure |
| P4 can obtain value without an agent or team features                      | Finish one representative evaluation and identify a useful operational decision       | Record expansion needs separately; don't promise team/shared-account workarounds                                        |
| Evidence and honest unknowns support decisions                             | Identify justified next actions in W2/W5/W6 without treating uncertainty as assurance | Improve provenance and uncertainty presentation; do not hide unknowns to increase completion                            |

## Traceability and follow-up boundaries

J1 covers first run; J2 covers ongoing maintenance/configuration; J3 covers updates; J4 covers troubleshooting. The four profiles span solo owners, established community maintainers, small networks and larger multi-server operators as requested by #22. W1–W8 cover the product contract's first-run, catalog/assembly, metadata operation, compatibility, configuration, upgrades, diagnostics, public/admin, and reliability/preservation slices. PR-17's free-core boundary applies across all tasks.

Follow-up owners: product/UX work validates profiles and measures; feature implementation issues implement their PR-linked scenarios; #144 onboarding uses J1; #145 beta feedback can use the measurement definitions after confirming its own scope; #148 launch review consumes measured evidence rather than treating this document as test results. Existing support/resource/listing history and routes remain governed by #18–#21; these personas do not authorize their removal.

## Issue #22 acceptance and documentation validation

- [x] Four target owner profiles, their practical context, jobs, pain points and MVP boundaries are documented.
- [x] First-run, maintenance, update and troubleshooting journeys include triggers, steps, recovery and outcomes.
- [x] Every MVP workflow maps to measurable saved-state/user-visible success criteria with failure exclusions.
- [x] Hypotheses, proposed measurements and unperformed research are distinguished from evidence.

Documentation validation: check unique profile/journey/outcome IDs and their references, PR references against #19, planned journey routes against #20, local links and whitespace. No participant sessions, analytics implementation, runtime tests or measured outcomes are claimed.
