# Prototype Public Server List UX

## Purpose

This is a rough UX artifact for reaction before implementation. It is not production UI code.

The page should feel like a Minecraft server browser: dense enough to scan, polished enough to feel public-facing, and action-oriented around copy, vote, and open detail.

## Design Direction

Subject:

- Minecentral public Minecraft server discovery.

Audience:

- players browsing for somewhere to play
- server owners checking how their listing appears

Single job:

- help a visitor find a server, copy its address, vote, or open the detail page.

Visual posture:

- not a landing page
- not a generic marketplace card wall
- closer to an upgraded multiplayer server browser with modern dashboard polish

Signature element:

- each server card uses a wide server banner strip as the identity anchor, with address/copy and vote actions fixed in predictable zones.

## Desktop List Page

```text
/serverlist

┌────────────────────────────────────────────────────────────────────────────┐
│ Minecraft Servers                                      [Create listing]    │
│ Find public servers by game mode, platform, and vote activity.             │
├────────────────────────────────────────────────────────────────────────────┤
│ [ Search servers...                                        ] [Updated ▾]   │
│                                                                            │
│ [Survival x] [Java x] [Clear filters]                         128 servers │
├───────────────┬────────────────────────────────────────────────────────────┤
│ Game modes    │ ┌────────────────────────────────────────────────────────┐ │
│ □ PvP         │ │ [468x60 banner strip]                     342 votes   │ │
│ ☑ Survival    │ │ BlossomCraft                                      Vote │ │
│ □ Skyblock    │ │ Friendly survival SMP with towns, economy, and events. │ │
│ □ Minigames   │ │ [survival] [smp] [java] [bedrock]                     │ │
│ ...           │ │ top.blossomcraft.org              [copy] [details →]  │ │
│               │ └────────────────────────────────────────────────────────┘ │
│ Platform      │ ┌────────────────────────────────────────────────────────┐ │
│ ☑ Java        │ │ [468x60 banner strip]                     188 votes   │ │
│ ☑ Bedrock     │ │ Pixel Valley                                      Vote │ │
│ □ Fabric      │ │ Pixelmon adventure server with seasonal tournaments.   │ │
│ □ Forge       │ │ [pixelmon] [modded] [java]                            │ │
│               │ │ play.pixelvalley.net:25565       [copy] [details →]  │ │
│               │ └────────────────────────────────────────────────────────┘ │
│               │                                                            │
│               │ [Previous] [1] [2] [3] [...] [Next]                       │
└───────────────┴────────────────────────────────────────────────────────────┘
```

## Mobile List Page

```text
/serverlist

┌──────────────────────────────┐
│ Minecraft Servers            │
│ [ Search servers...       ]  │
│ [Filters]        [Updated ▾] │
│ [Survival x] [Java x]        │
├──────────────────────────────┤
│ [468x60 banner strip]        │
│ BlossomCraft        342 vote │
│ Friendly survival SMP...     │
│ [survival] [java] [bedrock]  │
│ top.blossomcraft.org         │
│ [copy] [vote] [details]      │
├──────────────────────────────┤
│ [468x60 banner strip]        │
│ Pixel Valley        188 vote │
│ Pixelmon adventure server... │
│ [pixelmon] [modded] [java]   │
│ play.pixelvalley.net:25565   │
│ [copy] [vote] [details]      │
├──────────────────────────────┤
│ [Previous]       [Next]      │
└──────────────────────────────┘
```

Mobile filters open in a drawer:

```text
┌──────────────────────┐
│ Filters              │
│ Game modes           │
│ ☑ Survival           │
│ □ Skyblock           │
│ □ Minigames          │
│                      │
│ Platform             │
│ ☑ Java               │
│ ☑ Bedrock            │
│ □ Fabric             │
│                      │
│ [Clear] [Show 128]   │
└──────────────────────┘
```

## Card Behavior

Each card should support:

- click banner/title/details to open `/serverlist/[slug]`
- copy address without navigating
- vote without navigating
- visible vote count
- visible tags
- no fake player count

Card layout should avoid nested card-in-card styling.

Desktop cards should be horizontal, dense cards rather than a 2-3 column plugin-style grid. The card should keep the same zones:

- identity/banner
- title/description/tags
- address/copy
- vote/details actions

## Vote States

Base:

```text
[Vote]
```

Server has Votifier/reward delivery enabled:

```text
┌──────────────────────────────┐
│ Vote for BlossomCraft        │
│ Minecraft username           │
│ [ Steve__________________ ]   │
│ [Vote]                       │
└──────────────────────────────┘
```

Server has no reward delivery:

```text
┌──────────────────────────────┐
│ Vote for BlossomCraft        │
│ [Vote]                       │
└──────────────────────────────┘
```

Success:

```text
Vote counted.
```

Cooldown:

```text
You can vote again in 6h 12m.
```

Do not show reward delivery success/failure.

## Detail Page

```text
/serverlist/blossomcraft

┌────────────────────────────────────────────────────────────────────────────┐
│ [wide banner]                                                              │
│ BlossomCraft                                       342 votes     [Vote]    │
│ Friendly survival SMP with towns, economy, quests, and weekly events.      │
│                                                                            │
│ top.blossomcraft.org                                      [Copy address]   │
│ [survival] [smp] [java] [bedrock]                         [Discord]       │
├────────────────────────────────────────────────────────────────────────────┤
│ About                                                                      │
│ <description / markdown summary>                                           │
│                                                                            │
│ Server info                                                                │
│ Owner: Blossom Team                                                        │
│ Platforms: Java, Bedrock                                                   │
│ Game modes: Survival, SMP                                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

Detail page v1 should stay basic and shareable. No tabs are required.

## Empty States

No servers yet:

```text
No public servers yet.
```

No filter matches:

```text
No servers match those filters.
[Clear filters]
```

Search in progress:

- keep existing results visible if possible
- show subtle loading state near the search/sort row
- skeleton cards are acceptable on initial page load

## Implementation Notes

Use the existing resource search architecture as the functional base:

- URL-backed filter provider
- search input
- sort select
- filter badges
- pagination

But do not visually copy the plugin page one-for-one. The server list needs:

- richer server cards
- vote and copy actions as primary behaviors
- platform/game-mode tags
- no release/version filters
- no fake live player count

## Open Prototype Questions

- whether the page title/control row feels enough, or if it needs a featured/top strip
- whether vote should open a dialog, inline popover, or detail-page section

## User Reaction

The user chose horizontal dense cards for desktop results.
