# Media migration: Convex file storage → Cloudinary

Convex now stores **data only**. Every photo and video lives in Cloudinary, and
Convex keeps a small pointer (`publicId`, `version`, `format`, `resourceType`,
`width`, `height`) instead of an `_storage` id. This keeps the Convex free tier
away from its file-storage and bandwidth limits, which large lab videos were
the main risk to.

## Deployments

- **prod — `handsome-jackal-846`** (`https://handsome-jackal-846.convex.cloud`).
  This is the one that matters; it is what `www.kambestmeds.com` reads from.
- dev — `utmost-echidna-125`. This is what `.env.local` points at, and it holds
  a much smaller, stale subset (4 products vs 15). Do not migrate from it.

## Status

The application code is fully migrated, and the **prod backup is taken**:
`backups/handsome-jackal-846-2026-09-09T21-31-45-442Z/` — 25/25 files (20 MB,
including the 17 MB lab video), 15 products, 8 lab items, 1 team member,
home + contact + all three content pages.

What remains is the cutover, which needs credentials this machine doesn't have.

`/backups` is gitignored; the exports never enter git.

## Prerequisites

1. **Cloudinary account.** From the dashboard, copy the cloud name, API key and
   API secret into `.env.local`:

   ```
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
   ```

   Add the same three to the Netlify site's environment variables.

2. **Convex CLI logged into the right account.** The CLI on this machine is
   authenticated as a different account and cannot reach the Kambest project
   at all — not dev, not prod. Run `npx convex login` / `npx convex dev` once
   and select it, then confirm `npx convex dashboard --prod` opens the right
   deployment before running anything below.

3. **Stop any running dev server** before `yarn install` — a running server
   holds the native `next-swc` / `tailwindcss-oxide` binaries open and the
   install fails with `EPERM`. `cloudinary@^2.11.0` is in `package.json` and
   installed in `node_modules`, but `yarn.lock` still needs that one run to
   record it.

## Rehearse on dev first

`.env.local` already points at the dev deployment, and a dev backup is on disk
(`backups/utmost-echidna-125-*`). Running the whole sequence there first
exercises every step — schema push, Cloudinary upload, atomic reseed, build —
against data nobody sees, using the same commands. Do this before touching
prod; the prod run is then a repeat of something already known to work.

```bash
node scripts/backup-convex.mjs https://utmost-echidna-125.convex.cloud
node --env-file=.env.local scripts/migrate-to-cloudinary.mjs backups/<dev-folder>
npx convex dev --once     # dev equivalent of `convex deploy`
node --env-file=.env.local scripts/reseed-convex.mjs backups/<dev-folder> --dev
yarn dev                  # click through the site and the dashboard
```

Dev and prod are separate Convex deployments but share one Cloudinary account,
so the rehearsal uploads real assets there. That is harmless: public ids are
the old Convex storage ids, and the two deployments have disjoint sets.

## Cutover

Run these in order from the project root.

```bash
# --- Safe: prod is untouched and the live site keeps serving ---------------

# 1. Re-take the prod backup so it reflects the newest data.
#    Folder is named after the deployment: backups/<deployment>-<timestamp>/.
node scripts/backup-convex.mjs https://handsome-jackal-846.convex.cloud

# 2. Upload every backed-up file to Cloudinary. Touches nothing in Convex.
#    Writes backups/<folder>/cloudinary-map.json.
node --env-file=.env.local scripts/migrate-to-cloudinary.mjs backups/<folder>

# --- Cutover: the live site is degraded until step 5 finishes --------------

# 3. Push the new schema and functions to prod.
#    Add { schemaValidation: false } to defineSchema first — see below.
npx convex deploy         # also regenerates convex/_generated

# 4. Swap every table to the new shape, in one atomic transaction.
node --env-file=.env.local scripts/reseed-convex.mjs backups/<folder> --prod

# 5. Build and deploy the new frontend to Netlify.
yarn build

# 6. Drop { schemaValidation: false } from convex/schema.ts and deploy once
#    more, to turn validation back on for future writes.
npx convex deploy
```

`yarn build` prerenders the public pages, which means it reads real data from
the deployment it is pointed at. It therefore cannot pass until that deployment
has been migrated — which is why it sits at step 5 and not before the cutover.

Between steps 3 and 5 the deployed frontend is still the old build, which asks
for fields (`imageUrl`, `photoUrl`) the new functions no longer return, so
product and gallery images will be missing on the live site. Text content is
unaffected. Keep the gap short; nothing else about the ordering is delicate.

## Nothing is deleted by hand

An earlier draft of this document said to clear the prod tables from the
dashboard first. Do not do that. The push in step 3 would otherwise be rejected
because the old documents carry `imageId`/`storageId` fields the new schema
doesn't define — but the fix is to relax validation for that one push, not to
empty the database:

```ts
// convex/schema.ts — TEMPORARY, for the migration push only
export default defineSchema({ /* ...tables... */ }, { schemaValidation: false });
```

With that flag, prod keeps its old rows through the push, and `seed:restore`
then swaps every table to the new shape. That mutation deletes and re-inserts
inside **a single Convex transaction**, so there is no moment where prod is
empty: either the whole swap lands or nothing changes. Remove the flag and push
again (step 6) to turn validation back on.

Steps 2 and 5 are both idempotent. Uploads use the old Convex storage id as the
Cloudinary `public_id` with `overwrite: true`, and `seed:restore` replaces each
table wholesale, so re-running produces the same result rather than duplicates.

## After it's verified

Old files still sit in Convex file storage and continue to count against the
quota. Once the live site is confirmed good, delete them from the Convex
dashboard's Files tab — the backup on disk is the safety net.

## How it fits together

- `lib/cloudinary.ts` — builds delivery URLs. `f_auto,q_auto` lets Cloudinary
  pick AVIF/WebP and per-image quality, which replaces the old Jimp re-encode.
- `lib/upload-media.ts` — the single client upload path. It asks the server for
  a signature, then posts the file **straight to Cloudinary**. Nothing large
  passes through our own server, so the 1 MB Server Action body limit is never
  a factor for lab videos.
- `app/actions/cloudinary.ts` — mints those signatures and deletes assets. The
  API secret stays server-side.
- Because Convex mutations can't call out to Cloudinary, any mutation that
  orphans an asset returns it as `{ orphaned }`, and the caller deletes it
  through `destroyAsset`.
- Cloudinary URLs are rendered with `unoptimized` on `next/image`: the CDN has
  already optimised the bytes, so re-optimising at the edge only adds cost.
