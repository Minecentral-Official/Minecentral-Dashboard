# Runtime configuration (#26)

Use `src/lib/env/server.env.ts` for server values and `client.env.ts` for explicitly exposed values. The pure Zod parser reports invalid field names only. `server-only` prevents the server config, database and auth configuration from entering client imports. Do not spread environment objects into props or logs. Public variables are bundled at build time; rebuild when changing them.

| Variables                                                           | Requirement / behavior                                                                                     |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                      | Required PostgreSQL URL, dedicated per environment                                                         |
| `DATABASE_POOL_MAX`                                                 | Optional connection pool limit, integer 1–100, default 10; browser fixture uses 1                          |
| `BETTER_AUTH_SECRET`                                                | Required random secret, at least 32 characters, stable per environment                                     |
| `REVALIDATION_SECRET`                                               | Required separate random secret, at least 32 characters                                                    |
| `FRONTEND_URL`                                                      | Required HTTP(S) origin, no path/query/credentials; normalized without trailing slash; HTTPS in production |
| `NODE_ENV`                                                          | Next supplies development/production; tests may use test                                                   |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`                        | Optional pair; configure both to enable Discord                                                            |
| `DISCORD_REDIRECT`                                                  | Optional compatibility value; if set, must equal `<FRONTEND_URL>/api/auth/callback/discord`                |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`                          | Optional pair; configure both to enable GitHub sign-in                                                     |
| `UPLOADTHING_TOKEN`                                                 | Optional; required to use upload routes                                                                    |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET_KEY`                    | Optional legacy integration; Stripe client initializes only when used                                      |
| `HOST_PTERO_API_URL`, `HOST_PTERO_API_KEY`                          | Optional; both required if hosting creation is enabled                                                     |
| `HOST_PTERO_SERVER_CREATE`                                          | Exact `true`/`false`, default false                                                                        |
| `SERVERLIST_MAX_SERVERS_PER_USER`                                   | Positive integer, default 5; legacy public listing limit                                                   |
| `GITHUB_ACCESS_TOKEN`                                               | Optional legacy server integration credential                                                              |
| `FEATURE_V2_WORKSPACES`, `FEATURE_V2_COMMUNITY`, `FEATURE_V2_AGENT` | Exact `true`/`false`, default false; shared server-only feature flag policy                                |
| `NEXT_PUBLIC_FRONTEND_URL`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`         | Optional explicitly public values; never put secrets here                                                  |

Empty optional strings are treated as unset. Flags reject typos instead of silently enabling features. `feature-flags.ts` provides typed flags and `requireFeature`; future modules must enforce flags at both route and mutation boundaries. Setting a flag today does not create a v2 feature.

## Environment separation

Copy `local.env.example` to `.env` on a fresh checkout; merge manually if a file exists. Never commit it. Standalone database commands read root `.env` through dotenv; Next also supports its normal environment file precedence.

Development: localhost HTTP, development OAuth apps and database, provider keys only for features under test. Staging: dedicated HTTPS origin, separate database, secrets, OAuth apps and storage; `NODE_ENV=production`; flags off unless deliberately testing. Production: HTTPS public origin, independent secret store/database/OAuth/storage, least-privilege database account; flags default off and are enabled only with completed feature release gates. Do not reuse staging secrets or use production data for tests.

`node scripts/with-test-env.mjs pnpm build` overrides provider credentials and configuration with fixed test-only values and an unreachable database port. It is a build verification command, not deployment configuration. Database migration commands validate their own database input and do not require OAuth/upload credentials.
