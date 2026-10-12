// admin-qa.js — owner-only inbox. Protected by the ADMIN_TOKEN env var
// (sent as the x-admin-token header from admin.html).
// GET:  all threads across all learners.
// POST: { key, reply } -> append a reply to a thread; it appears in the
//       learner's course on their next poll/refresh.
import { store, json, fail, safeToken, parseBody } from "./utils/helpers.js";

export const handler = async (event) => {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return fail("server not configured (ADMIN_TOKEN)", 500);

  const provided =
    (event.headers && (event.headers["x-admin-token"] || event.headers["X-Admin-Token"])) || "";
  if (!safeToken(provided, expected)) return fail("unauthorized", 401);

  const s = store();

  if (event.httpMethod === "GET") {
    const { blobs } = await s.list({ prefix: "qa/" });
    const threads = [];
    for (const b of blobs) {
      const t = await s.getJSON(b.key, { type: "json" });
      if (t) threads.push({ ...t, key: b.key });
    }
    threads.sort((a, b) => b.createdAt - a.createdAt);
    return json({ threads });
  }

  if (event.httpMethod === "POST") {
    const { key, reply } = parseBody(event);
    if (typeof key !== "string" || !key.startsWith("qa/")) return fail("bad key");
    if (typeof reply !== "string" || !reply.trim()) return fail("empty reply");

    const thread = await s.getJSON(key, { type: "json" });
    if (!thread) return fail("thread not found", 404);

    thread.replies = thread.replies || [];
    thread.replies.push({ text: reply.trim().slice(0, 8000), at: Date.now() });
    await s.setJSON(key, thread);

    // OPTIONAL: email the learner that their answer is ready.
    // No email provider is wired up by default (keeps the stack free and
    // dependency-light); learners see replies via polling in their course.
    // To add: sign up to Resend or Postmark (both have free tiers), then
    // call their API here with thread.email.
    return json({ ok: true });
  }

  return fail("method not allowed", 405);
};
