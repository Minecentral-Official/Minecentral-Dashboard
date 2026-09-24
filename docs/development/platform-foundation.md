# Platform foundation — epic #3 (EPIC 01)

Implementation record: 2026-09-24. Covers #24–#30. This modernizes the existing application; v2 workspace/catalog features remain planned.

## Framework baseline (#24)

| Component       | Decision                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Node / pnpm     | Node 22.23.3 (`.node-version`, engines >=22.12 <23), pnpm 12.6.0 (`packageManager`)                  |
| Next.js / React | 16.3.6 / 19.3.0; active Next major, Cache Components enabled                                         |
| TypeScript      | 5.9.3 deliberately retained on the 5.x line; parser upgraded to support it                           |
| Drizzle         | ORM 0.45.3, Kit 0.31.11; checked-in SQL and snapshots                                                |
| Better Auth     | 1.7.5; explicit schema mapping and configured providers                                              |
| Tailwind        | Retain 3.x design system and matching tailwind-merge 2.x; v4 CSS migration is separate work          |
| ESLint          | Retain 9.x; native Next flat configs and direct ESLint CLI                                           |
| UI              | Retain Radix/Conform; upgrade DayPicker 8→9 for React 19/date-fns 4 compatibility; adapt class names |
| Tests           | Vitest 5, isolated PGlite PostgreSQL instances; no external database credentials                     |

Breaking-change adaptations: replace removed `next lint`; stable `cacheLife`/`cacheTag`; explicit immediate `revalidateTag` expiry; remove incompatible route runtime export; put dynamic layout content behind Suspense; remove query strings from local static images. Manrope is bundled through Fontsource so production builds do not fetch Google Fonts. Next updates JSX/type-generation configuration. Conform's reactive controls require a narrowly scoped compiler refs-lint exception; browser synchronization effects have documented local exceptions.

Removed obsolete `next-remove-imports`, `next-cache-toolbar`, direct `jiti`, unused `@t3-oss/env-nextjs` and FlatCompat dependency. Removed obsolete auth generation command (wrong paths and unpinned CLI). Conform belongs in runtime dependencies. Transitive deprecations and the retained Recharts 2.x UI are follow-up maintenance, not a claim that every package is latest.

Sources: [Next 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16), [Next support policy](https://nextjs.org/support-policy), [cache invalidation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [Better Auth installation](https://better-auth.com/docs/installation).

## Application boundaries

`src/app` owns HTTP/rendering boundaries; `src/features` owns domain queries, schemas and actions; `src/lib` owns shared auth, database, configuration and cache policies. Client components receive deliberately selected public values. Database/config/auth modules use `server-only`; internal resource/server mutations no longer export remote Server Actions. Public actions must authenticate, validate input and authorize ownership/capability before writes. Cached resource records are loaded separately from request-specific authorization.

Do not cache session-dependent authorization globally. Public resource reads expose accepted records; owner/moderator checks gate unpublished records and downloads. Moderation API failures return 401/403 before data access. Ticket replies/status changes enforce ownership or support capability server-side.

## Authentication (#27)

Discord is displayed first; GitHub is optional. Only fully configured providers appear. Better Auth owns OAuth state, session cookies and session persistence. Base/trusted origin comes from `FRONTEND_URL`; production cookies are secure and production origins must use HTTPS. Return destinations are internal paths; auth loops and external redirects are rejected. Cancellation/start failures display a generic retry message without provider error details.

User IDs, provider IDs and display names have different meanings: the existing stable user ID remains the application identity; `(providerId, accountId)` identifies the external login; `name` is an untrusted, non-unique display label populated from provider profile data. Never authorize by name/email. No username reservation or profile renaming flow is added here. Do not render display names as raw HTML.

Automatic cross-provider account linking is disabled. An existing account with a different provider must use its original provider. Future linking requires a separately reviewed authenticated flow; do not merge identities merely because emails match. Existing account/session rows remain intact. Changing the auth secret invalidates existing signed cookies.

Automated checks exercise persisted sessions through the server API and the browser session HTTP endpoint, revocation, Discord authorization URL generation and external callback rejection. Fixture-only password signup is enabled in tests, never production. **Live Discord authorization/cancellation remains a manual release gate**; the local environment cannot reach the user's database. Run this in the user's connected development/staging environment:

1. Set the origin, a random auth secret of at least 32 characters, and Discord client ID/secret. Register exactly `<origin>/api/auth/callback/discord` in Discord.
2. Use a development database initialized/migrated using the database guide. Start the app and open `/sign-in?returnTo=/dashboard`.
3. Sign in with Discord; confirm arrival at dashboard, matching identity in server-rendered account UI and client session UI, and persistence after refresh.
4. Sign out; confirm private routes require sign-in. Sign back in and confirm the same account is used.
5. Cancel Discord consent and retry. Confirm a readable failure state; test invalid/expired callbacks and a `returnTo=https://example.org` destination (must stay internal).
6. Confirm role restrictions with separate user/moderator/admin accounts. Record environment, commit and results without tokens or credentials.

Provider docs: [Discord](https://better-auth.com/docs/authentication/discord), [users/accounts](https://better-auth.com/docs/concepts/users-accounts).

## Authorization (#28)

| Role      | Capabilities                                        |
| --------- | --------------------------------------------------- |
| user      | Own records only                                    |
| curator   | Admin shell, future catalog curation                |
| moderator | Admin shell, resource moderation, support tickets   |
| admin     | All declared capabilities including user management |

`hasPermission`, `requirePermission`, `canAccessOwnedRecord` and `assertOwnedRecord` provide shared policy. Unknown/null/comma-separated roles fail closed. Ownership is checked independently of role. The admin shell checks `admin:access`; resource moderation additionally checks `resources:moderate`. Curator access does not imply resource moderation. No new catalog or user-management UI is claimed. Role assignment remains admin-only through Better Auth's admin API; bootstrap admin identity is an operator task, never a public signup field.

## Completion evidence

See [testing](testing-and-ci.md), [configuration](runtime-configuration.md) and [database workflow](database-workflow.md). Builds use isolated dummy configuration and do not contact production providers/databases. A passing build/test suite does not establish live OAuth, production migration readiness for an uninspected database, or deployment health. #27 and the epic stay open until live sign-in is verified; CI completion requires a real PR check run.
