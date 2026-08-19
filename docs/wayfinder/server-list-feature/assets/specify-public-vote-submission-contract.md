# Specify Public Vote Submission Contract

## Decision

Public voting should not require Minecentral sign-in.

Minecentral records a site-side vote whenever the per-server cooldown allows it. Votifier delivery is optional backend behavior: when enabled, the vote submission requires a Minecraft username and Minecentral attempts delivery to the server, but the UI does not promise or report reward-delivery status.

## Submission Shape

Recommended server action:

```ts
serverVoteForServerAction(input: {
  serverId: string;
  minecraftUsername?: string;
}): Promise<ServerVoteResult>
```

Recommended result:

```ts
type ServerVoteResult =
  | { success: true; message: 'Vote counted.'; nextAllowedAt: Date }
  | { success: false; message: string; nextAllowedAt?: Date };
```

Do not expose Votifier delivery status in the public result.

## Votifier Username Rule

Minecraft username is required only when server-side reward delivery is enabled.

Behavior:

- if Votifier/reward voting is disabled, no username field is shown or required
- if Votifier/reward voting is enabled, username field is shown and required
- username should be validated for reasonable Minecraft username format before delivery is attempted
- Minecentral account sign-in is never required for v1 voting

## Cooldown

Cooldown is configurable per server.

Allowed cooldown options:

- `8` hours
- `12` hours
- `16` hours
- `20` hours
- `24` hours

Default:

- `24` hours

Minimum:

- `8` hours

Maximum:

- `24` hours

The UI should expose these as fixed options in server settings, not as arbitrary numeric input.

Cooldown is enforced even if Votifier delivery fails, because the Minecentral-side vote still counted.

## Anonymous Voter Identity

Use browser cookie/id plus IP hash.

Recommended identity fields for each vote:

- generated anonymous voter id from a persistent browser cookie
- IP hash
- user-agent hash
- optional `userId` when the visitor is signed in
- optional Minecraft username when required for Votifier delivery

The cookie/id should be the primary friendly identity. IP hash and user-agent hash are backup abuse signals and help reduce obvious repeat voting when cookies are cleared.

Do not store raw IP addresses for v1 voting; store a hash.

## Vote Storage

The current `serverVotesTable` should be replaced or reshaped for public voting.

Recommended vote row fields:

- `id`
- `serverId`
- `anonymousVoterId`
- `ipHash`
- `userAgentHash`
- `userId`
- `minecraftUsername`
- `votifierEnabledAtVote`
- `votifierDeliveryStatus`
- `votifierDeliveryError`
- `createdAt`

`serverId` must reference `serverTable.id`.

Do not use `(userId, serverId)` as the primary key for v1 public voting, because anonymous voters are allowed and repeat votes are allowed after cooldown.

## Cooldown Check

Before inserting a vote:

1. Load the public-ready server and its vote settings.
2. Determine whether Votifier/reward voting is enabled.
3. Validate Minecraft username only if needed.
4. Build voter identity from cookie/id, IP hash, user-agent hash, and optional `userId`.
5. Find the newest vote for the same server that matches the voter identity.
6. If the newest matching vote is inside that server's cooldown window, reject with a cooldown message and `nextAllowedAt`.
7. Otherwise insert a Minecentral-side vote.
8. Attempt Votifier delivery only after Minecentral vote insert succeeds.

Matching should prioritize cookie/id. IP hash and user-agent hash should be used as backup abuse prevention, with care to avoid harshly blocking shared networks.

## Votifier Delivery

If Votifier/reward delivery is disabled:

- record Minecentral vote
- return generic success
- do not ask for Minecraft username

If Votifier/reward delivery is enabled:

- require Minecraft username
- record Minecentral vote
- attempt delivery to Votifier/NuVotifier
- store delivery status internally
- return the same generic success whether delivery succeeds or fails

Public UI message:

- `Vote counted.`

Do not show:

- "Reward sent"
- "Reward failed"
- raw Votifier errors
- server configuration errors

Delivery failures should be visible to server owners/admins later if a diagnostics surface is created, but that is outside this ticket.

## Cache Revalidation

After a successful Minecentral-side vote insert, revalidate:

- `server-list`
- `server-id-${serverId}`
- `server-slug-${slug}`

If normalized filter tags are used, either revalidate the shared `server-list` tag that all list queries carry or use the repo's existing revalidation helper to fan out safely.

Do not wait for Votifier delivery success before revalidating vote counts.

## Failure Feedback

Public failure messages should cover:

- server not found
- server is not public/ready
- cooldown not expired
- Minecraft username required
- invalid Minecraft username
- unexpected server error

Failure messages should not expose:

- Votifier host/port/key details
- raw delivery exceptions
- anti-abuse internals

## Follow-On Work

Implementation should add:

- per-server vote cooldown setting with default `24`
- anonymous voter cookie helper
- IP/user-agent hashing helper
- public vote table/schema migration
- server action that no longer requires `validateSession()`
- optional signed-in `userId` association when available
- Votifier delivery result storage for admin diagnostics later
