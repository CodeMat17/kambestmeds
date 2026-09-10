// One-off safety net: pulls every public document out of Convex and downloads
// each referenced storage file to disk, so the Cloudinary migration can be
// redone (or rolled back) without the live deployment.
//
//   node scripts/backup-convex.mjs https://<deployment>.convex.cloud
//
// The deployment URL is required rather than read from NEXT_PUBLIC_CONVEX_URL,
// because that variable points at the dev deployment and the data that matters
// lives in prod. The backup folder is named after the deployment so a dev
// export can never be mistaken for a prod one.
import { ConvexHttpClient } from "convex/browser";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const url = process.argv[2];
if (!url) {
  throw new Error(
    "Usage: node scripts/backup-convex.mjs https://<deployment>.convex.cloud"
  );
}

const deployment = new URL(url).hostname.split(".")[0];
const client = new ConvexHttpClient(url);

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const root = join("backups", `${deployment}-${stamp}`);
const filesDir = join(root, "files");
await mkdir(filesDir, { recursive: true });

console.log(`Backing up ${deployment} (${url})`);

const data = {
  deployment,
  url,
  products: await client.query("products:list", {}),
  home: await client.query("home:get", {}),
  labMedia: await client.query("labMedia:list", {}),
  team: await client.query("team:list", {}),
  contactInfo: await client.query("contactInfo:get", {}),
  content: {
    "about-us": await client.query("content:get", { key: "about-us" }),
    terms: await client.query("content:get", { key: "terms" }),
    privacy: await client.query("content:get", { key: "privacy" }),
  },
};

// Every storage-backed field, flattened to (storageId, signed url) pairs.
const targets = [
  ...(data.products ?? []).map((p) => [p.imageId, p.imageUrl]),
  ...(data.labMedia ?? []).map((m) => [m.storageId, m.mediaUrl]),
  ...(data.team ?? []).map((t) => [t.storageId, t.photoUrl]),
  [data.home?.heroImageId, data.home?.heroImageUrl],
  ...Object.values(data.content).map((c) => [c?.heroImageId, c?.heroImageUrl]),
].filter(([id, u]) => id && u);

const manifest = [];
let failed = 0;
for (const [storageId, signedUrl] of targets) {
  const res = await fetch(signedUrl);
  if (!res.ok) {
    console.error(`  FAILED ${storageId}: ${res.status}`);
    failed++;
    continue;
  }
  const type = res.headers.get("content-type") ?? "application/octet-stream";
  const ext = type.split("/")[1]?.split(";")[0]?.replace("jpeg", "jpg") ?? "bin";
  const name = `${storageId}.${ext}`;
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(join(filesDir, name), bytes);
  manifest.push({ storageId, file: name, contentType: type, bytes: bytes.length });
  console.log(`  saved ${name} (${(bytes.length / 1024).toFixed(0)} KB)`);
}

await writeFile(join(root, "data.json"), JSON.stringify(data, null, 2));
await writeFile(join(root, "files.json"), JSON.stringify(manifest, null, 2));

console.log(
  `\nBackup written to ${root}: ${manifest.length}/${targets.length} files, ` +
    `${(data.products ?? []).length} products, ${(data.labMedia ?? []).length} lab items, ` +
    `${(data.team ?? []).length} team members.`
);
// A partial backup must not be treated as a safe starting point for the
// migration, so fail loudly rather than exiting 0.
if (failed > 0) {
  throw new Error(`${failed} file(s) failed to download — backup is incomplete.`);
}
