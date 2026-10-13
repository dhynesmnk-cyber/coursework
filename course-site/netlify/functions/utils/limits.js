// limits.js — the spend guard for the public Tools section.
// No login is needed for the tools, so every paid AI run is counted against
// a site-wide daily cap and a per-visitor daily cap. Blobs has no atomic
// increment, so (like qa.js) each run writes its own key and we count keys.
// At the traffic this site sees, the tiny race between list and set is fine.
import crypto from "node:crypto";

const DAY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Sydney",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// YYYY-MM-DD in Sydney time, so caps reset at local midnight.
export function dayKey(now) {
  return DAY_FORMAT.format(new Date(now || Date.now()));
}

function envInt(name, fallback) {
  const n = parseInt(process.env[name] || "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function aiEnabled() {
  return String(process.env.TOOLS_AI_ENABLED || "true").trim().toLowerCase() !== "false";
}

export const BUCKETS = {
  // Paid Claude runs (blog, shot prompts, leads, pitch).
  ai: () => ({ site: envInt("TOOLS_DAILY_LIMIT", 30), visitor: envInt("TOOLS_PER_VISITOR_DAILY", 5) }),
  // Free website fetches. Capped only so the fetcher can't be used as a proxy.
  sitecheck: () => ({ site: 500, visitor: 30 }),
};

// A short, salted hash of the visitor's IP. The salt is the day, so the
// same visitor can't be followed across days and no raw IP is stored.
export function visitorId(event, now) {
  const h = (event && event.headers) || {};
  const ip =
    h["x-nf-client-connection-ip"] ||
    (h["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown";
  return crypto.createHash("sha256").update(ip + "|" + dayKey(now)).digest("hex").slice(0, 16);
}

// Claim one run. Returns { ok: true, key } or { ok: false, message }.
export async function claimRun(s, { bucket, runId, visitor, now }) {
  const caps = BUCKETS[bucket]();
  const prefix = `tools/usage/${bucket}/${dayKey(now)}/`;
  const { blobs } = await s.list({ prefix });
  if (blobs.length >= caps.site) {
    return {
      ok: false,
      message: "The free tools have hit today's limit for the whole site. It resets at midnight (Sydney time). The example below shows what you'd get.",
    };
  }
  const mine = blobs.filter((b) => b.key.slice(prefix.length).split("/")[0] === visitor);
  if (mine.length >= caps.visitor) {
    return {
      ok: false,
      message: `You've used your ${caps.visitor} free runs for today. They reset at midnight (Sydney time).`,
    };
  }
  const key = prefix + visitor + "/" + runId;
  await s.setJSON(key, { at: now || Date.now() });
  return { ok: true, key };
}

// Give a run back, e.g. when the AI call failed. Nobody pays for errors.
export async function releaseRun(s, key) {
  if (key) await s.delete(key);
}

// Delete usage records older than a week. Called occasionally, best effort.
export async function pruneUsage(s, now) {
  const cutoff = dayKey((now || Date.now()) - 7 * 24 * 3600 * 1000);
  for (const bucket of Object.keys(BUCKETS)) {
    const { blobs } = await s.list({ prefix: `tools/usage/${bucket}/` });
    for (const b of blobs) {
      const day = b.key.split("/")[3];
      if (day && day < cutoff) await s.delete(b.key);
    }
  }
}
