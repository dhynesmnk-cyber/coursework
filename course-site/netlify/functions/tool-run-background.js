// tool-run-background.js — runs one AI tool job. The "-background" suffix
// makes Netlify answer the browser with 202 straight away and give this
// function up to 15 minutes, so long generations never hit the 30-second
// limit. Progress and the result go to Blobs at tools/jobs/<jobId>, which
// the browser polls through tool-status.
//
// POST { jobId: <uuid v4 from the browser>, tool: "blog-writer" | "shot-prompts" | "leads" | "pitch", input: {...} }
import { store, parseBody } from "./utils/helpers.js";
import { AI_TOOLS } from "./utils/ai/index.js";
import { validateWith } from "./utils/ai/validate.js";
import { aiEnabled, claimRun, releaseRun, visitorId, pruneUsage } from "./utils/limits.js";
import { aiConfigured, friendlyError } from "./utils/claude.js";

const UUID_RE =/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY = 240 * 1024; // background functions take small payloads only

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return;
  if (event.body && event.body.length > MAX_BODY) return;
  const body = parseBody(event);
  if (typeof body.jobId !== "string" || !UUID_RE.test(body.jobId)) return; // nowhere to report

  const s = store(event);
  const key = `tools/jobs/${body.jobId}`;
  const startedAt = Date.now();
  const tool = typeof body.tool === "string" ? body.tool : "";

  // onlyIfNew: a repeated submit of the same job is ignored rather than run twice.
  const created = await s.setJSON(key, { status: "running", tool, startedAt }, { onlyIfNew: true });
  if (!created.modified) return;
  const finish = (data) => s.setJSON(key, Object.assign({ tool, startedAt, finishedAt: Date.now() }, data));

  const mod = Object.prototype.hasOwnProperty.call(AI_TOOLS, tool) ? AI_TOOLS[tool] : null;
  if (!mod) return finish({ status: "error", code: "unknown_tool", error: "Unknown tool." });
  if (!aiEnabled()) {
    return finish({ status: "error", code: "paused", error: "The AI tools are paused at the moment. The example below shows what you'd get." });
  }
  if (!aiConfigured()) {
    return finish({ status: "error", code: "not_configured", error: "The AI tools aren't switched on for this site yet. The example below shows what you'd get." });
  }

  const checked = validateWith(mod.validate, body.input);
  if (checked.error) return finish({ status: "error", code: "invalid", error: checked.error });

  const claim = await claimRun(s, { bucket: "ai", runId: body.jobId, visitor: visitorId(event, startedAt), now: startedAt });
  if (!claim.ok) return finish({ status: "error", code: "limit", error: claim.message });

  try {
    const result = await mod.run(checked.value);
    await finish({ status: "done", result });
  } catch (err) {
    console.error(`[tool-run] ${tool} failed:`, err && err.stack ? err.stack : err);
    await releaseRun(s, claim.key).catch(() => {});
    const f = friendlyError(err);
    await finish({ status: "error", code: f.code, error: f.message });
  }

  // Occasional housekeeping so old usage records don't pile up.
  if (Math.random() < 0.05) await pruneUsage(s).catch(() => {});
};
