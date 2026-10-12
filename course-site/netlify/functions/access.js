// access.js — GET: the signed-in user's licence + profile.
//             POST: update profile fields used for document personalisation
//             and the certificate (learnerName, businessName, contactName, contactEmail).
import { store, json, fail, identityUser, parseBody } from "./utils/helpers.js";

const ALLOWED = ["learnerName", "businessName", "contactName", "contactEmail"];

export const handler = async (event, context) => {
  const user = identityUser(context);
  if (!user) return fail("Please sign in first.", 401);

  const s = store();
  const key = `users/${user.id}`;

  if (event.httpMethod === "GET") {
    const record = (await s.getJSON(key, { type: "json" })) || {};
    return json({ tier: record.tier || null, email: user.email || record.email || "", ...pick(record) });
  }

  if (event.httpMethod === "POST") {
    const body = parseBody(event);
    const existing = (await s.getJSON(key, { type: "json" })) || {};
    const next = { ...existing, email: user.email || existing.email || "" };
    for (const f of ALLOWED) {
      if (typeof body[f] === "string") next[f] = body[f].slice(0, 200);
    }
    await s.setJSON(key, next);
    return json({ ok: true, tier: next.tier || null, ...pick(next) });
  }

  return fail("method not allowed", 405);
};

function pick(record) {
  const out = {};
  for (const f of ALLOWED) if (record[f] !== undefined) out[f] = record[f];
  return out;
}
