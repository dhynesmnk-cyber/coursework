// tool-status.js — the browser polls this while an AI tool job runs.
// GET ?id=<jobId> -> { status: "pending" | "running" | "done" | "error", result?, error? }
// "pending" means the background function hasn't started yet. A finished
// job is deleted once it has been read, so generated content isn't kept.
// Key layout: see tool-run-background.js.
import { store, json, fail } from "./utils/helpers.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const handler = async (event) => {
  if (event.httpMethod !== "GET") return fail("method not allowed", 405);
  const id = (event.queryStringParameters && event.queryStringParameters.id) || "";
  if (!UUID_RE.test(id)) return fail("bad job id");

  const s = store(event);
  const prefix = `tools/jobs/${id}/`;
  const job = await s.get(prefix + "result", { type: "json" });
  if (!job) {
    const started = await s.get(prefix + "start", { type: "json" });
    return json({ status: started ? "running" : "pending", tool: started ? started.tool : undefined });
  }

  await Promise.all([s.delete(prefix + "result"), s.delete(prefix + "start")]);
  const out = { status: job.status, tool: job.tool };
  if (job.status === "done") out.result = job.result;
  if (job.status === "error") Object.assign(out, { code: job.code || "failed", error: job.error || "Something went wrong." });
  return json(out);
};
