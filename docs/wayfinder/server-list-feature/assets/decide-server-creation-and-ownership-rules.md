# Decide Server Creation And Ownership Rules

## Decision

Authenticated Minecentral users may create multiple server listings, capped by a global environment/config value for v1.

Listings start as drafts and become public automatically once required public-readiness fields are completed.

## Ownership

Server listings are owned by the authenticated Minecentral account that creates them.

Rules:

- creation requires `validateSession()`
- `userId` is always taken from the session, never from form data
- users may own multiple server listings
- the number of listings a user may own is capped by a global env/config value
- the create action should count existing listings for the current user before inserting
- all owner mutations must verify the current session user owns the server

Recommended env/config shape:

- `SERVERLIST_MAX_SERVERS_PER_USER`
- default: `5`

Admin-editable per-user limits are out of scope for v1.

## Creation Fields

Creation should stay lean so a user can start a listing quickly.

Required at creation:

- server name/title
- slug
- address/IP
- port

The existing create form should be corrected so the address/IP field is labeled as server address, not "Summary."

## Draft And Public Readiness

New server listings should be drafts until complete.

A listing becomes public once required public-readiness fields are completed. Public listing visibility should be derived from either an explicit status/readiness field or a consistent readiness query, to be finalized by the backend query contract.

Required to become public:

- server name/title
- slug
- address/IP
- port
- short description
- at least one category/game mode
- banner/icon

Optional for v1 public readiness:

- Votifier configuration
- Discord link
- languages/platforms
- long description
- live player/status data

The dashboard should guide owners through the missing required fields after creation. A server should not appear on `/serverlist` until it is public-ready.

## Slug Integrity

Slugs must be globally unique across server listings.

Behavior:

- create checks slug availability before insert
- update checks slug availability when changed
- database/index enforcement should be added by the implementation spec
- conflicts should return a specific form message such as "That URL is taken"

Slug matching should remain case-insensitive, matching the existing lowercase slug behavior.

## Address Integrity

The combination of address/IP and port should be globally unique.

Behavior:

- two users cannot list the exact same server address and port
- create checks address+port availability before insert
- update checks address+port availability when changed
- database/index enforcement should be added by the implementation spec
- conflicts should return a specific message such as "That server address is already listed"

## Failure Feedback

Creation should return targeted feedback for:

- invalid form data
- user is not signed in
- user has reached the global listing cap
- slug is already taken
- address+port is already listed
- unexpected database/server error

When creation succeeds, redirect to the server dashboard edit/checklist page, not directly to public browsing. The dashboard should communicate draft/public readiness and show the next missing fields.

## Follow-On Work

This decision unblocks:

- `Specify Dashboard Server Management Flow`
- `Specify Server List Query Contract`

It also gives `Specify Server Filtering Contract` a boundary: filters should operate only on public-ready listings.
