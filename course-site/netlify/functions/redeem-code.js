// redeem-code.js — signed-in user redeems an access code.
// POST { code } -> unlocks the account.
import { store, json, fail, identityUser, parseBody } from "./utils/helpers.js";

export const handler = async (event, context) => {
  const user = identityUser(context);
  if (!user) return fail("Please sign in first.", 401);
  if (event.httpMethod !== "POST") return fail("method not allowed", 405);

  const { code } = parseBody(event);
  if (!code || typeof code !== "string") return fail("missing code");

  const key = `codes/${code.trim().toUpperCase()}`;
  const s = store();
  const record = await s.getJSON(key, { type: "json" });

  if (!record) return fail("not_found", 404);
  if (record.redeemed && record.userId !== user.id) return fail("already_used", 409);

  // Mark the code redeemed by this user (re-redemption by the same user is fine).
  if (!record.redeemed) {
    await s.setJSON(key, { ...record, redeemed: true, userId: user.id, redeemedAt: Date.now() });
  }

  const userKey = `users/${user.id}`;
  const existing = (await s.getJSON(userKey, { type: "json" })) || {};
  await s.setJSON(userKey, {
    ...existing,
    email: user.email || existing.email || "",
    tier: record.tier,
    code: record.code,
    redeemedAt: record.redeemedAt || Date.now(),
  });

  return json({ ok: true, tier: record.tier });
};
