// qa.js — the learner-facing question store.
// GET:  list my threads (with replies).
// POST: { question, lesson } -> save a new thread. (The email to the site
//       owner is sent separately via Netlify Forms from the client.)
import { store, json, fail, identityUser, parseBody } from "./utils/helpers.js";

export const handler = async (event, context) => {
  const user = identityUser(context);
  if (!user) return fail("Please sign in first.", 401);

  const s = store(event);
  const prefix = `qa/${user.id}/`;

  if (event.httpMethod === "GET") {
    const { blobs } = await s.list({ prefix });
    const threads = [];
    for (const b of blobs) {
      const t = await s.get(b.key, { type: "json" });
      if (t) threads.push({ ...t, key: b.key });
    }
    threads.sort((a, b) => b.createdAt - a.createdAt);
    return json({ threads });
  }

  if (event.httpMethod === "POST") {
    const body = parseBody(event);
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 4000) : "";
    const lesson = typeof body.lesson === "string" ? body.lesson.trim().slice(0, 200) : "";
    if (!question) return fail("empty question");

    // Simple rate limit: no more than 5 questions per hour per user.
    const { blobs } = await s.list({ prefix });
    const recent = blobs.filter(
      (b) => Date.now() - parseInt(b.key.split("/").pop(), 10) < 3600 * 1000
    );
    if (recent.length >= 5) return fail("Too many questions just now. Try again within the hour.", 429);

    const key = prefix + Date.now();
    await s.setJSON(key, {
      userId: user.id,
      email: user.email || "",
      question,
      lesson,
      createdAt: Date.now(),
      replies: [],
    });
    return json({ ok: true, key });
  }

  return fail("method not allowed", 405);
};
