// Second half of the migration: takes the backed-up documents plus the
// Cloudinary mapping and rewrites every Convex table into the new schema
// (storage ids swapped for Cloudinary pointers). Convex system fields and the
// old *Url / *Id fields are stripped so the documents validate.
//
//   node scripts/reseed-convex.mjs backups/<folder> --prod
//   node scripts/reseed-convex.mjs backups/<folder> --dev
//
// The target is required: this rewrites every table, so which deployment it
// lands on is never left to whatever CONVEX_DEPLOYMENT happens to be set to.
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2];
const target = process.argv[3];
if (!root || (target !== "--prod" && target !== "--dev")) {
  throw new Error(
    "Usage: node scripts/reseed-convex.mjs backups/<folder> --prod|--dev"
  );
}

const data = JSON.parse(await readFile(join(root, "data.json"), "utf8"));
const map = JSON.parse(await readFile(join(root, "cloudinary-map.json"), "utf8"));

function media(storageId) {
  const found = map[storageId];
  if (!found) throw new Error(`No Cloudinary asset for storage id ${storageId}.`);
  return found;
}

// Convex assigns _id/_creationTime itself; re-inserting them would be rejected.
function strip(doc, ...extra) {
  if (!doc) return doc;
  const clean = { ...doc };
  for (const key of ["_id", "_creationTime", ...extra]) delete clean[key];
  return clean;
}

const payload = {
  products: (data.products ?? []).map((p) => ({
    ...strip(p, "imageId", "imageUrl"),
    image: media(p.imageId),
  })),
  labMedia: (data.labMedia ?? []).map((m) => ({
    ...strip(m, "storageId", "mediaUrl", "type"),
    media: media(m.storageId),
  })),
  teamMembers: (data.team ?? []).map((t) => ({
    ...strip(t, "storageId", "photoUrl"),
    photo: media(t.storageId),
  })),
  home: data.home
    ? {
        ...strip(data.home, "heroImageId", "heroImageUrl"),
        ...(data.home.heroImageId ? { heroImage: media(data.home.heroImageId) } : {}),
      }
    : undefined,
  contactInfo: data.contactInfo ? strip(data.contactInfo) : undefined,
  siteContent: Object.values(data.content ?? {})
    .filter(Boolean)
    .map((c) => ({
      ...strip(c, "heroImageId", "heroImageUrl"),
      ...(c.heroImageId ? { heroImage: media(c.heroImageId) } : {}),
    })),
};

console.log(
  `Restoring into ${target === "--prod" ? "PROD" : "dev"}: ` +
    `${payload.products.length} products, ${payload.labMedia.length} lab items, ` +
    `${payload.teamMembers.length} team members, ${payload.siteContent.length} content pages...`
);

// The Convex CLI is invoked through node directly rather than `npx`: on
// Windows, Node 22 refuses to spawnSync a .cmd shim (EINVAL), and going
// through a shell would expose the payload to quoting. execFileSync passes it
// as a single argv entry, so rich-text bodies survive verbatim.
const cli = join("node_modules", "convex", "bin", "main.js");
const out = execFileSync(
  process.execPath,
  [
    cli,
    "run",
    ...(target === "--prod" ? ["--prod"] : []),
    "seed:restore",
    JSON.stringify(payload),
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }
);
console.log(out);
console.log("Convex now points at Cloudinary. Verify the site, then the old Convex files can be deleted.");
