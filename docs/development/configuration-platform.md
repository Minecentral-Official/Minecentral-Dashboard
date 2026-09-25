# Configuration platform — epic #8

Issues #61–#68 add private YAML files to workspaces. Apply migration 0005 before
running this version:

```sh
pnpm install --frozen-lockfile
pnpm db:migrate
```

The existing `FEATURE_V2_WORKSPACES=true` flag enables the routes. No worker,
object store or Minecraft server connection is required. Open **Configs**, import
a file or paste YAML, edit, save and download. History, restore and file settings
are secondary controls; the main editor focuses on the file content.

## Storage and access (#61, #68)

`config_file` records workspace, optional stack entry/canonical project, relative
path, YAML format, validation profile, current revision, creation source and
timestamps. Each workspace may have 50 files, each at most 128 KiB of UTF-8 text.
PostgreSQL text columns hold the content; uploads are never written to an
application filesystem or public object store. Paths are identifiers and download
names, never executable filesystem paths. Relative `.yml`/`.yaml` paths accept
ASCII letters, digits, spaces, dots, underscores and hyphens; absolute paths,
traversal, backslashes, empty segments and control characters are rejected.
Workspace/path uniqueness prevents accidental replacement during import.

Every action and service operation authenticates/authorizes the workspace.
Owners, workspace admins and editors may write; viewers can read and download.
Global catalog/admin roles do not bypass membership. Archived workspaces remain
readable/exportable and reject changes. Configs, revision contents and change
notes are never included in catalog queries, public search or activity payloads.
Activity only records generic operations. Content may contain credentials, so
operators must protect their PostgreSQL database/backups; no additional field
level encryption or secret scanning is claimed by this epic.

A file is intentionally server-level, plugin-linked or unlinked. Plugin selection
is checked against the same workspace. A canonical project reference survives
stack removal, while the stack-entry foreign key becomes null: the UI identifies
that file as orphaned and retains all content/history. Owners can relink it or
choose an intentional unlinked/server association. Catalog merges reparent
project references without losing files. Configs also appear on their linked
stack entry. Workspace deletion is blocked while files exist; restore, export
and explicitly delete them first. Deleting a config requires its exact path and
current revision, and cascades its retained history.

## YAML import and validation (#62–#64)

The `yaml` 2.9.1 library is pinned as a direct dependency. Its document parser
supports syntax diagnostics and node inspection without custom constructors.
We use a restricted YAML 1.2 core schema; custom tags and known-tag resolution
are disabled. Explicit tags outside core scalar/map/sequence types, aliases,
legacy version directives, multiple documents, duplicate keys, non-string keys,
non-mapping roots and binary/NUL input are rejected. Aliases are deliberately
unsupported in this first version; expand them into explicit values before
importing. This avoids expansion and recursive-reference surprises entirely.

Inputs are bounded to 128 KiB, 64 AST traversal levels and 10,000 visited nodes.
Structured diagnostics include category, severity and line/column when available;
the UI shows at most 20 messages. Parsing does not run code, fetch remote schemas,
expand environment variables or construct arbitrary objects. The parser's
[document API and options](https://eemeli.org/yaml/#documents) informed the choice.
`js-yaml` remains in legacy features; new workspace configuration uses the shared
`config-yaml` layer exclusively.

Raw text is the source of truth. Validation never parse/stringifies it into a new
layout. `serializeConfig` validates and returns the same text, preserving unknown
keys, order, comments, quotes and multiline values as supplied to the service.
An unchanged server-side round trip preserves CRLF too. Browser textarea edits
may normalize newline style; no semantic formatting/normalization is applied.
Epic #9 adds an optional [schema-driven visual editor](visual-config-editor.md).
This raw storage layer does not automatically merge defaults.

Users can upload UTF-8 `.yml`/`.yaml` files or paste text. Uploads are size and
encoding checked; pasted/file content is validated again server-side. Invalid
imports create no file, and invalid saves do not replace the last valid revision.
The editor retains its unsaved text and offers location buttons to return to the
problem. Drafts are held in browser memory, not localStorage or telemetry, and
navigation warns before leaving unsaved changes. Drafts are not recovered after
a crash or a confirmed reload.

Default validation is explicitly **YAML syntax only**. Users may opt into
**Bukkit settings — basic checks**, which checks `settings` is a mapping and the
types of `allow-end`, `connection-throttle` and `shutdown-message` when present.
These advisory rules follow the [Paper Bukkit configuration reference](https://docs.papermc.io/paper/reference/bukkit-configuration/).
They emit separate schema warnings, do not reject unknown keys and do not claim
to validate an entire plugin schema or a specific Minecraft/plugin release.
Warnings permit saving/export; syntax/safety errors block both. The [visual editor](visual-config-editor.md) adds separately curated versioned
schemas and server-side hard constraints for covered files.

## Revisions, comparison and restore (#65, #66)

Import creates revision 1. Saves append content, SHA-256, author, UTC timestamp,
source and an optional private change note. Comparing hash **and text** avoids
noisy identical-content saves. Workspace write locking and the caller's expected
revision prevent concurrent saves from silently overwriting each other. A stale
save returns an actionable conflict while retaining the draft.

The latest 20 revisions per file are retained, including the current revision.
Older revision rows are removed in the same transaction after a successful save;
revision numbers are never reused. The file/revision deferred composite foreign
key ensures a current revision belongs to the correct file. A SQL trigger prevents
revision edits, allowing only author anonymization on account deletion. These
custom constraints/triggers are included in migration 0005 beyond the generated
Drizzle table snapshot.

History shows author, time, source and note. Two retained revisions can be
selected for a bounded, line-oriented replacement diff. Common prefix/suffix
lines are trimmed to context; the middle block is shown as removed/added lines.
This linear strategy avoids quadratic work for large files; it is not a minimal
edit-distance diff. At most 1,000 diff lines are rendered, with an explicit notice
and expandable complete raw revision text for larger comparisons.

Restore requires confirmation and the expected current revision. It appends a
new revision tagged `restore`, including the source revision number, even when
that content is identical to the current text. The normal retention limit still
applies. Cancel returns to the editor without mutation. Expired revisions cannot
be restored; export backups if longer retention is needed.

## Export (#67)

The editor offers a raw view, copy-to-clipboard and single-file download. Unsaved
edits must be saved successfully before copying/downloading through the editor.
The download endpoint authenticates and authorizes independently, revalidates
saved YAML, and returns only the text under the configured basename. Paths,
workspace identity, author, revision IDs and other MineCentral metadata are not
inserted into the file. Downloads use `application/yaml`, an attachment filename,
`private, no-store` caching, `Vary: Cookie` and `nosniff`. Unauthorized reads do not
leak content; corrupt saved YAML returns a blocking 422 response.

## Verification

Unit tests exercise comments/key order/quotes/CRLF/unknown keys, prototype-like
keys, syntax locations, duplicate keys, tags/directives, aliases, limits, path
validation, schema-warning separation and bounded diffs. Isolated PostgreSQL
integration tests cover scoped reads/writes/history/exports, viewer/editor/admin
roles, invalid-state rollback, deduplication, stale saves, restoration, retention,
immutable revisions/current-revision integrity, orphan preservation/relinking,
canonical merges, archive/delete policy, file limits and export revalidation.

Desktop/mobile browser flows exercise invalid pasted imports, uploaded YAML,
invalid draft retention, warnings, save/download, history/restore cancellation and
confirmation, private download denial, orphan handling and explicit deletion.
Tests use disposable PGlite databases and synthetic sessions. They do not migrate
a deployment database or install config files on a Minecraft server.
