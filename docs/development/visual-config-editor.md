# Visual config editor — epic #9

Issues #69–#76 extend workspace configuration with Visual, YAML and Split modes.
Apply migration 0006 before running this version:

```sh
pnpm install --frozen-lockfile
pnpm db:migrate
```

Keep `FEATURE_V2_WORKSPACES=true`. Configs still use the existing workspace
permissions, revision history, private exports and archive rules. No Minecraft
server connection or schema-fetching worker is required.

## Publishing supported configurations

The registry starts empty: the application does not invent coverage for catalog
plugins. A catalog curator/admin opens `/admin/config-schemas`, supplies a
canonical project UUID for a plugin (blank for server files), and publishes a
reviewed JSON definition. `/admin/catalog` links to this screen. Find a project's
UUID in its catalog detail URL. A schema is public setting metadata: never put
credentials or a user's private config into defaults, examples or descriptions.

Published releases are immutable. Corrections use the same key and an increasing
release number. Retirement removes a release from selection without changing
configs. Publication/retirement are permission checked and recorded in the catalog
audit. Banned accounts cannot curate. Schema definitions are stored separately
from user files; merely publishing one never rewrites a config or creates a config
revision. The admin screen shows the latest 100 releases.

The synthetic [complete format example](../../tests/fixtures/visual-schema.ts)
illustrates nested lists, maps, conditions and every field type. It is a test
fixture, **not a reviewed schema for a real plugin**. Do not publish that fixture
against a real project. Replace its targets, settings, defaults and provenance
with verified publisher information. Tests seed it only into disposable databases.

## Format version 1 (#69, #74, #75)

Definitions are JSON, at most 64 KiB, with at most 300 field definitions and eight
nested schema levels. The format validator rejects unknown schema properties,
duplicate field keys and unsafe metadata keys. Schema content is plain text;
there are no executable expressions, HTML, arbitrary regexes, remote references
or custom constructors. Documentation links must use HTTPS.

| Property                  | Meaning                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| `formatVersion`           | Exactly `1`; future formats need an explicit reader                    |
| `key`, `release`, `title` | Stable schema identifier, increasing positive integer and human label  |
| `filename`                | Exact YAML basename, such as `config.yml`; paths are not glob patterns |
| `target.kind`             | `plugin` or `server`                                                   |
| `target.platform`         | Exact runtime platform; no Paper/Spigot inheritance is assumed         |
| `target.versionRange`     | Numeric range grammar used by the compatibility engine                 |
| `provenance`              | HTTPS `url`, explanation, `verifiedVersion`, ISO `verifiedAt`          |
| `root`                    | Object field containing the supported settings                         |

For plugin files, selection uses the config's canonical project and linked stack
entry's machine version number, or an explicitly recorded manual version. It
never guesses from a release display name. For server files it uses the workspace
Minecraft version. Canonical catalog merges reparent schema references.

Only active releases matching project/kind, basename, platform and supported
numeric range are considered. A release verified for the exact installed version
wins first, then the highest schema release number, then lexicographic key and
release UUID. This is deterministic even when ranges overlap. Publishing requires
the verified version to fall within the declared range and a nonfuture verification
date. The range grammar accepts two to four numeric components with exact matches
or `=`, `>`, `>=`, `<`, `<=` and up to eight AND terms. Unsupported syntax,
unknown/manual build labels, unmatched versions, unlinked files and orphaned files
fall back to YAML with an explanation. Over 500 active candidates also fail to
YAML rather than selecting from a silently truncated list.

Selection is automatic; users cannot force a schema for an unsupported version.
A changed release selection causes a stale save to be rejected, preserving the
draft for review. The selected schema title, release, source, covered range and
last verified version/date are visible in the editor. A published coverage range
is a curator claim, not a live Minecraft-server test.

## Fields and constraints (#70, #73, #74)

Each field has `key`, `label`, `type` and optional `required`, `default`,
`description`, `examples`, `unit`, `caution` and HTTPS `link`.

| Type      | Control and additional properties                                                      |
| --------- | -------------------------------------------------------------------------------------- |
| `string`  | Text; `minLength`, `maxLength`                                                         |
| `number`  | Numeric control; `min`, `max`, `integer`, `recommendedMin`, `recommendedMax`           |
| `boolean` | Enabled/disabled choice that writes actual YAML booleans                               |
| `enum`    | Typed scalar `options`; strings and numbers remain distinct                            |
| `scalar`  | String/number/boolean/null; JSON notation distinguishes a numeric string from a number |
| `object`  | Recursive `fields` array; unknown properties remain outside the visual schema          |
| `list`    | Recursive `items`, `minLength`/`maxLength`; add/remove/move controls                   |
| `map`     | Recursive `items`; editable keys and `keyMode` (`identifier` or `text`)                |

Map identifiers accept letters, digits, dots, underscores and hyphens. Text keys
accept other printable characters. Keys are 1–120 characters; duplicates,
control characters and prototype-related names are rejected in visual operations.
Existing unknown keys remain in YAML. Only the first 50 items/keys per collection
are rendered, with a notice directing users to YAML for the rest; visual additions
are capped at 200 items/keys. Reordering moves complete YAML nodes, including their
comments, and uses labeled keyboard-operable buttons rather than drag-only UI.

`visibleWhen: {path: ["mode"], equals: "advanced"}` uses an absolute root path and
strict scalar equality. It hides irrelevant controls and their validation; it
does not remove their YAML values. Search matches labels, paths and explanations,
retaining parent context. Field help and examples are available in the editor.

Missing required fields, type errors and hard constraints appear at the relevant
field and block saves when an applicable schema exists. Recommendations are
separate warnings and permit saving. Save validation runs on the server under the
workspace write transaction, even for a modified client request. Syntax-only
unsupported files retain the original save behavior. Import/history restore and
export still use the configuration platform's syntax/safety validation: a newly
published schema can reveal errors in an existing file without trapping that file
or preventing the user from downloading the original. A valid YAML download is
not a claim of compliance with every plugin rule.

## One draft, three modes (#71, #72)

Raw YAML text is the canonical in-memory draft. Switching modes never rebuilds a
file from known settings. Scalar controls commit on blur or Enter; invalid numeric
input is flagged. Visual controls derive from the most recent valid parse of that
draft. Temporarily invalid YAML remains untouched; the last valid visual state is
shown read-only until raw text parses safely again. Drafts are not persisted to
browser storage or telemetry.

Visual mutations use the `yaml` document AST, following its
[document and node APIs](https://eemeli.org/yaml/#documents). They change the
selected node in the full document. Unknown keys, scalar types, ordering and
comments are retained where the library supports them, including large integer
nodes outside edited fields. Formatting may normalize (indentation, flow spacing,
comment placement and line endings) after a visual mutation; byte identity is not
promised. Raw-only unchanged saves retain the earlier exact-text behavior. The
existing YAML safety/size/depth limits apply before and after every mutation.

Split mode uses keyboard-resizable panels on desktop and vertically stacked panes
on mobile. YAML remains available when no schema matches. Existing Save, Check,
Copy, Download and History controls remain shared between modes.

## Defaults and replacement (#76)

Defaults are metadata until the user explicitly adds/resets a field or generates
a template. Publishing verifies typed defaults and that a generated template is
valid YAML with required fields satisfied. Resetting a field/section asks for
confirmation. Object-section reset recursively updates supported defaulted fields
and preserves unrelated unknown keys. Scalar/list/map replacement may replace the
selected value's contents; the confirmation explains this. No reset autosaves.

Whole-document generation is deliberately separate. **Preview default template**
shows a bounded line diff and full replacement YAML. Cancel leaves the draft
unchanged; **Replace draft with defaults** explicitly replaces it, including unknown
settings. If the draft changes after preview, replacement is rejected until a new
preview is generated. Save creates the usual revision, so an earlier saved file
can still be recovered through history.

## Verification

Unit tests cover format bounds, typed validation versus recommendations,
conditions, deterministic selection, AST edits, unknown/large integer/comment
preservation, list moves, map rename/duplicate prevention, defaults and invalid
raw YAML. Isolated PostgreSQL tests cover curator/workspace permissions, immutable
releases, stale forms, hard-error rollback, recommendation saves, retirement,
canonical merges and server/runtime targeting. Desktop/mobile browser tests cover
mode switching, nested edits, search, invalid raw recovery, split resizing,
preview/cancel/reset and unsupported-version fallback. Existing configuration and
application browser flows remain part of CI.
