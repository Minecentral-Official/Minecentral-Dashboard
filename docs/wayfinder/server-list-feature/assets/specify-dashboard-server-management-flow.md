# Specify Dashboard Server Management Flow

## Decision

The owner dashboard should guide a server listing from draft to published through an explicit readiness checklist and a manual publish action.

Listings do not become public automatically. Required fields make the listing eligible to publish; the owner chooses when to publish.

## Post-Create Redirect

After successful creation, redirect to:

```text
/dashboard/servers/[slug]
```

This page should be the owner management hub for that listing, not just a general edit form.

## Status Model

V1 statuses:

- `draft`
- `published`

Rules:

- new listings start as `draft`
- public `/serverlist` and `/serverlist/[slug]` only show `published` listings
- `Publish` is disabled until all required public-readiness fields are complete
- owner may unpublish a listing back to `draft`
- owner may edit published listings freely
- if a published listing is saved with required fields incomplete, it automatically moves back to `draft`

## Required Readiness Fields

Required to publish:

- server name/title
- slug
- address/IP
- port
- short description
- at least one category/game mode
- platform/server type
- banner/icon

Votifier/reward delivery is optional and should not block publishing.

Discord, languages, long description, and live status are optional for v1.

## Dashboard Layout

Recommended sections:

- `Overview`
- `Profile`
- `Voting`
- `Danger`

These can be tabs, topbar links, or a sidebar section list, but the owner should always be able to see the current draft/published state clearly.

## Overview

The overview section should show:

- status badge: `Draft` or `Published`
- readiness checklist
- preview card matching the public horizontal card style as closely as practical
- `Publish` button when draft and complete
- disabled `Publish` button with missing-field guidance when incomplete
- `Unpublish` button when published
- `View public page` link only when published

The checklist should name exactly what is missing, for example:

- Add a banner
- Add at least one category
- Add a short description

## Profile

The profile section should edit:

- title
- slug
- address/IP
- port
- short description
- category/game modes
- platform/server type
- banner/icon
- Discord link

Validation should include:

- slug uniqueness
- address+port uniqueness
- owner permission
- public-readiness recalculation after save

The current create form label mismatch should be fixed: address/IP fields should not be labeled "Summary."

## Voting

The voting section should edit:

- reward delivery enabled/disabled
- Votifier host/IP
- Votifier port
- Votifier public key
- per-server cooldown selector

Cooldown selector options:

- 8 hours
- 12 hours
- 16 hours
- 20 hours
- 24 hours

Default:

- 24 hours

If reward delivery is disabled, public voting does not ask for a Minecraft username.

If reward delivery is enabled, public voting asks for Minecraft username and attempts Votifier delivery silently.

## Danger

The danger section should support deleting draft or published listings.

Deletion behavior:

- require confirmation dialog
- require typing the server name/title
- delete listing, votes, and Votifier settings by cascade
- redirect to `/dashboard/servers` after delete

The delete action must verify the current authenticated user owns the listing.

## Ownership Guards

All dashboard routes and mutations must verify ownership.

Required checks:

- route/layout should redirect or 404 if the current user does not own the listing
- update actions verify ownership before mutation
- banner/icon upload and delete verify ownership
- Votifier settings verify ownership
- publish/unpublish verify ownership
- delete verifies ownership

The existing UploadThing authorship check is the pattern to preserve.

## Listing Index

Because users may own multiple listings, `/dashboard/servers` should show all listings owned by the current user, not just "My Realm."

Recommended behavior:

- list owned server cards/rows
- show status badges
- show missing-required-field count for drafts
- show create button until global env cap is reached
- if cap is reached, disable create and show cap message

## Follow-On Work

Implementation should add:

- dashboard query for all servers by current user
- owner-check helper for server listings
- publish/unpublish action
- readiness helper shared by dashboard and public query
- Votifier settings mutation/upsert action
- delete action with cascade-safe schema behavior
