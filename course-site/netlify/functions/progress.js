// progress.js — GET/POST the signed-in learner's progress blob
// (lessons completed, quiz results, worksheet answers, seen-reply marks).
import { store, json, fail, identityUser, parseBody } from "./utils/helpers.js";

const MAX_BYTES = 256 * 1024; // generous ceiling for worksheets

export const handler = async (event, context) => {
  const user = identityUser(context);
  if (!user) return fail("Please sign in first.", 401);

  const s = store();
  const key = `progress/${user.id}`;

  if (event.httpMethod === "GET") {
    const data = (await s.getJSON(key, { type: "json" })) || {};
    return json(data);
  }

  if (event.httpMethod === "POST") {
    if (!event.body || event.body.length > MAX_BYTES) return fail("progress payload too large", 413);
    const data = parseBody(event);
    // Whitelist the top-level shape so a buggy or hostile client cannot
    // stash arbitrary junk under this key.
    const clean = {};
    for (const section of ["lessons", "quizzes", "worksheets", "qaSeen"]) {
      if (data[section] && typeof data[section] === "object") clean[section] = data[section];
    }
    await s.setJSON(key, clean);
    return json({ ok: true });
  }

  return fail("method not allowed", 405);
};
