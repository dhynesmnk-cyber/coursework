// test_tools.mjs — Node tests for the Netlify functions and the pure logic
// behind the Tools section. No network: Netlify Blobs runs on the package's
// own local BlobsServer, and the Anthropic client is stubbed.
//
// Run from course-site/:  node tools/test_tools.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlobsServer } from "@netlify/blobs/server";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const fnDir = path.join(root, "netlify", "functions");

let failures = 0;
let passes = 0;
function check(name, cond, detail) {
  if (cond) { passes++; console.log("  PASS " + name); }
  else { failures++; console.log("  FAIL " + name + (detail !== undefined ? " :: " + JSON.stringify(detail) : "")); }
}
function section(name) { console.log(name + ":"); }

// ── local Blobs server + Lambda-style events ────────────────────────────
const blobDir = fs.mkdtempSync(path.join(os.tmpdir(), "course-blobs-"));
const BLOB_TOKEN = "test-token";
const server = new BlobsServer({ directory: blobDir, token: BLOB_TOKEN });
const { port } = await server.start();
const blobsContext = Buffer.from(JSON.stringify({ url: `http://localhost:${port}`, token: BLOB_TOKEN })).toString("base64");

function event({ method = "GET", body, query, headers } = {}) {
  return {
    httpMethod: method,
    body: body === undefined ? null : typeof body === "string" ? body : JSON.stringify(body),
    queryStringParameters: query || {},
    headers: Object.assign({ "x-nf-site-id": "site-test", "x-nf-deploy-id": "deploy-test" }, headers || {}),
    blobs: blobsContext,
  };
}
function signedIn(id, email) {
  return { clientContext: { user: { sub: id, email: email || id + "@example.com" } } };
}
const load = async (name) => (await import(path.join(fnDir, name))).handler;
const parse = (res) => JSON.parse(res.body);

// ── Phase 1: course functions against real Blobs semantics ─────────────
section("Course functions (Blobs + Identity plumbing)");
{
  const access = await load("access.js");
  let res = await access(event(), {});
  check("access rejects anonymous", res.statusCode === 401, res.statusCode);

  res = await access(event({ method: "POST", body: { learnerName: "Sam", businessName: "Sam's Bakery", hacker: "x" } }), signedIn("u1"));
  check("access POST saves profile", res.statusCode === 200 && parse(res).businessName === "Sam's Bakery", res.body);

  res = await access(event(), signedIn("u1"));
  const a = parse(res);
  check("access GET reads it back", a.learnerName === "Sam" && a.tier === null && !("hacker" in a), a);

  const progress = await load("progress.js");
  res = await progress(event({ method: "POST", body: { lessons: { c0: { completed: true } }, junk: 1 } }), signedIn("u1"));
  check("progress POST ok", res.statusCode === 200, res.body);
  res = await progress(event(), signedIn("u1"));
  const p = parse(res);
  check("progress GET returns whitelisted data", p.lessons && p.lessons.c0.completed === true && !("junk" in p), p);

  const qa = await load("qa.js");
  for (let i = 0; i < 5; i++) {
    res = await qa(event({ method: "POST", body: { question: "Q" + i, lesson: "class-1" } }), signedIn("u2"));
  }
  check("qa accepts five questions", res.statusCode === 200, res.body);
  res = await qa(event({ method: "POST", body: { question: "one too many" } }), signedIn("u2"));
  check("qa sixth question in an hour is rate limited", res.statusCode === 429, res.statusCode);
  res = await qa(event(), signedIn("u2"));
  check("qa GET lists threads", parse(res).threads.length === 5, parse(res).threads.length);

  process.env.ADMIN_TOKEN = "admin-secret";
  const adminQa = await load("admin-qa.js");
  res = await adminQa(event({ headers: { "x-admin-token": "wrong" } }), {});
  check("admin-qa rejects a bad token", res.statusCode === 401, res.statusCode);
  res = await adminQa(event({ headers: { "x-admin-token": "admin-secret" } }), {});
  const threads = parse(res).threads;
  check("admin-qa lists all threads", threads.length === 5, threads.length);
  res = await adminQa(event({ method: "POST", headers: { "x-admin-token": "admin-secret" }, body: { key: threads[0].key, reply: "Answer" } }), {});
  check("admin-qa reply saved", res.statusCode === 200, res.body);
  res = await qa(event(), signedIn("u2"));
  check("learner sees the reply", parse(res).threads.some((t) => t.replies.length === 1), parse(res).threads);

  const redeem = await load("redeem-code.js");
  const { getStore } = await import("@netlify/blobs");
  const s = getStore({ name: "course", siteID: "site-test", token: BLOB_TOKEN, edgeURL: `http://localhost:${port}` });
  await s.setJSON("codes/ABCD-EFGH", { code: "ABCD-EFGH", tier: "individual", redeemed: false });
  res = await redeem(event({ method: "POST", body: { code: "abcd-efgh" } }), signedIn("u3"));
  check("redeem-code unlocks the account", res.statusCode === 200 && parse(res).tier === "individual", res.body);
  res = await redeem(event({ method: "POST", body: { code: "ABCD-EFGH" } }), signedIn("u4"));
  check("redeem-code refuses a code used by someone else", res.statusCode === 409, res.statusCode);
  res = await access(event(), signedIn("u3"));
  check("redeemed user now has a tier", parse(res).tier === "individual", res.body);
}

// ── Tools: spend caps ───────────────────────────────────────────────────
const { getStore } = await import("@netlify/blobs");
const directStore = () => getStore({ name: "course", siteID: "site-test", token: BLOB_TOKEN, edgeURL: `http://localhost:${port}` });
const limits = await import(path.join(fnDir, "utils", "limits.js"));

section("Spend caps");
{
  const s = directStore();
  const now = Date.parse("2026-10-13T02:00:00Z");
  const ev = (ip) => ({ headers: { "x-nf-client-connection-ip": ip } });
  check("visitor id is stable within a day", limits.visitorId(ev("1.2.3.4"), now) === limits.visitorId(ev("1.2.3.4"), now));
  check("visitor id differs per IP", limits.visitorId(ev("1.2.3.4"), now) !== limits.visitorId(ev("5.6.7.8"), now));
  check("visitor id changes the next day", limits.visitorId(ev("1.2.3.4"), now) !== limits.visitorId(ev("1.2.3.4"), now + 86400000));
  check("visitor id holds no raw IP", !limits.visitorId(ev("1.2.3.4"), now).includes("1.2.3.4"));
  check("day key uses Sydney time", limits.dayKey(Date.parse("2026-10-13T14:30:00Z")) === "2026-10-14");

  process.env.TOOLS_DAILY_LIMIT = "4";
  process.env.TOOLS_PER_VISITOR_DAILY = "2";
  const a1 = await limits.claimRun(s, { bucket: "ai", runId: "r1", visitor: "va", now });
  const a2 = await limits.claimRun(s, { bucket: "ai", runId: "r2", visitor: "va", now });
  const a3 = await limits.claimRun(s, { bucket: "ai", runId: "r3", visitor: "va", now });
  check("per-visitor cap allows 2", a1.ok && a2.ok);
  check("per-visitor cap refuses the 3rd", !a3.ok && /2 free runs/.test(a3.message), a3);
  await limits.releaseRun(s, a2.key);
  const a4 = await limits.claimRun(s, { bucket: "ai", runId: "r4", visitor: "va", now });
  check("a released run can be used again", a4.ok);
  await limits.claimRun(s, { bucket: "ai", runId: "r5", visitor: "vb", now });
  await limits.claimRun(s, { bucket: "ai", runId: "r6", visitor: "vb", now });
  const c1 = await limits.claimRun(s, { bucket: "ai", runId: "r7", visitor: "vc", now });
  check("site-wide cap refuses a new visitor once full", !c1.ok && /whole site/.test(c1.message), c1);
  const other = await limits.claimRun(s, { bucket: "ai", runId: "r8", visitor: "vc", now: now + 86400000 });
  check("caps reset the next day", other.ok);

  await limits.pruneUsage(s, now + 10 * 86400000);
  const left = (await s.list({ prefix: "tools/usage/ai/" })).blobs;
  check("old usage records are pruned", left.length === 0, left.map((b) => b.key));

  process.env.TOOLS_AI_ENABLED = "false";
  check("kill switch reads TOOLS_AI_ENABLED", limits.aiEnabled() === false);
  delete process.env.TOOLS_AI_ENABLED;
  check("AI enabled by default", limits.aiEnabled() === true);
  process.env.TOOLS_DAILY_LIMIT = "30";
  process.env.TOOLS_PER_VISITOR_DAILY = "5";
}

// ── Tools: background runner + status, with a fake Claude client ────────
const claude = await import(path.join(fnDir, "utils", "claude.js"));
const Anthropic = (await import("@anthropic-ai/sdk")).default;

function fakeClient(responder) {
  const calls = [];
  const create = (kind) => async (params) => {
    calls.push({ kind, params: JSON.parse(JSON.stringify(params)) });
    return responder(params, calls.length);
  };
  return { calls, messages: { create: create("plain") }, beta: { messages: { create: create("beta") } } };
}
const textResp = (obj, stop) => ({ stop_reason: stop || "end_turn", content: [{ type: "text", text: JSON.stringify(obj) }] });
let jobCounter = 0;
const newJobId = () => {
  jobCounter++;
  const hex = jobCounter.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${hex}`;
};

const runBg = await load("tool-run-background.js");
const status = await load("tool-status.js");
async function runJob(tool, input, ip) {
  const jobId = newJobId();
  await runBg(event({ method: "POST", body: { jobId, tool, input }, headers: { "x-nf-client-connection-ip": ip || "9.9.9.9" } }));
  const res = await status(event({ query: { id: jobId } }));
  return { jobId, job: parse(res) };
}

section("AI tool jobs");
const realConsoleError = console.error;
console.error = () => {}; // the failure-path tests log expected errors
{
  process.env.ANTHROPIC_API_KEY = "test-key";
  delete process.env.CLAUDE_MODEL;
  const blogOut = { title: "Winter roof checks", metaDescription: "What to check.", post: "Opening.\n\n## Gutters\n\nClear them." };
  let fc = fakeClient(() => textResp(blogOut));
  claude.setClientForTests(fc);

  let r = await runJob("blog-writer", { business: "Smith Roofing", topic: "Winter roof checks", length: "600", tone: "professional" });
  check("blog job finishes with the post", r.job.status === "done" && r.job.result.post.includes("## Gutters"), r.job);
  const call = fc.calls[0];
  check("default model is claude-opus-5-5", call.params.model === "claude-opus-5-5", call.params.model);
  check("opus uses the refusal fallback", call.kind === "beta" && call.params.fallbacks === "default" && call.params.betas.includes("server-side-fallback-2026-07-01"), call);
  check("blog uses structured output", call.params.output_config.format.type === "json_schema" && call.params.output_config.effort === "medium", call.params.output_config);
  check("blog prompt carries the inputs", JSON.stringify(call.params.messages).includes("Smith Roofing") && JSON.stringify(call.params.messages).includes("about 600 words"));

  const again = await status(event({ query: { id: r.jobId } }));
  check("finished job is deleted after it's read", parse(again).status === "pending", parse(again));

  const dupId = newJobId();
  await runBg(event({ method: "POST", body: { jobId: dupId, tool: "blog-writer", input: { business: "A", topic: "B" } } }));
  const callsBefore = fc.calls.length;
  await runBg(event({ method: "POST", body: { jobId: dupId, tool: "blog-writer", input: { business: "A", topic: "B" } } }));
  check("a repeated job id is not run twice", fc.calls.length === callsBefore, fc.calls.length);
  await status(event({ query: { id: dupId } }));

  r = await runJob("blog-writer", { business: "", topic: "x" });
  check("missing required input gives a clear error", r.job.status === "error" && r.job.code === "invalid" && /business name/.test(r.job.error), r.job);

  r = await runJob("not-a-tool", {});
  check("unknown tool is refused", r.job.status === "error" && r.job.code === "unknown_tool", r.job);
  r = await runJob("__proto__", {});
  check("prototype keys are not tools", r.job.status === "error" && r.job.code === "unknown_tool", r.job);

  process.env.TOOLS_AI_ENABLED = "false";
  r = await runJob("blog-writer", { business: "A", topic: "B" });
  check("kill switch pauses AI jobs", r.job.status === "error" && r.job.code === "paused", r.job);
  delete process.env.TOOLS_AI_ENABLED;

  delete process.env.ANTHROPIC_API_KEY;
  r = await runJob("blog-writer", { business: "A", topic: "B" });
  check("missing API key is explained", r.job.status === "error" && r.job.code === "not_configured", r.job);
  process.env.ANTHROPIC_API_KEY = "test-key";

  fc = fakeClient(() => { throw new Anthropic.RateLimitError(429, { type: "error" }, "rate limited", new Headers()); });
  claude.setClientForTests(fc);
  const s = directStore();
  const before = (await s.list({ prefix: "tools/usage/ai/" })).blobs.length;
  r = await runJob("blog-writer", { business: "A", topic: "B" }, "7.7.7.7");
  const after = (await s.list({ prefix: "tools/usage/ai/" })).blobs.length;
  check("API rate limit shows a friendly message", r.job.status === "error" && r.job.code === "busy", r.job);
  check("a failed run is not counted", after === before, { before, after });

  claude.setClientForTests(fakeClient(() => ({ stop_reason: "refusal", content: [] })));
  r = await runJob("blog-writer", { business: "A", topic: "B" });
  check("refusal is explained", r.job.status === "error" && r.job.code === "refused", r.job);

  claude.setClientForTests(fakeClient(() => ({ stop_reason: "end_turn", content: [{ type: "text", text: "not json" }] })));
  r = await runJob("blog-writer", { business: "A", topic: "B" });
  check("unreadable output is explained", r.job.status === "error" && r.job.code === "bad_output", r.job);

  // Per-visitor cap through the real runner.
  claude.setClientForTests(fakeClient(() => textResp(blogOut)));
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await runJob("blog-writer", { business: "A", topic: "B" }, "3.3.3.3")).job.status);
  check("6th run from one visitor hits the cap", codes.slice(0, 5).every((c) => c === "done") && codes[5] === "error", codes);

  // Model switching.
  process.env.CLAUDE_MODEL = "claude-haiku-5-5";
  fc = fakeClient(() => textResp(blogOut));
  claude.setClientForTests(fc);
  await runJob("blog-writer", { business: "A", topic: "B" }, "4.4.4.1");
  check("haiku runs without the fallback beta", fc.calls[0].kind === "plain" && !("fallbacks" in fc.calls[0].params), fc.calls[0].kind);
  check("haiku keeps effort", fc.calls[0].params.output_config.effort === "medium");
  process.env.CLAUDE_MODEL = "claude-haiku-4-5";
  fc = fakeClient(() => textResp(blogOut));
  claude.setClientForTests(fc);
  await runJob("blog-writer", { business: "A", topic: "B" }, "4.4.4.2");
  check("haiku 4.5 drops the unsupported effort setting", !("effort" in fc.calls[0].params.output_config), fc.calls[0].params.output_config);
  delete process.env.CLAUDE_MODEL;

  // Shot prompts.
  const shotOut = { productSummary: "A jar of honey.", prompts: [{ style: "studio", prompt: "Using my attached product photo..." }], tips: ["Shoot in daylight."] };
  fc = fakeClient(() => textResp(shotOut));
  claude.setClientForTests(fc);
  r = await runJob("shot-prompts", { product: "Honey", styles: ["studio", "bogus"], image: { mediaType: "image/jpeg", data: "QUJD" } }, "5.5.5.1");
  check("shot prompts job finishes", r.job.status === "done" && r.job.result.prompts.length === 1, r.job);
  const content = fc.calls[0].params.messages[0].content;
  check("photo is sent to Claude as an image block", Array.isArray(content) && content[0].type === "image" && content[0].source.data === "QUJD", content);
  check("shot prompts use low effort", fc.calls[0].params.output_config.effort === "low");
  r = await runJob("shot-prompts", { product: "Honey", styles: [] }, "5.5.5.2");
  check("shot prompts need a style", r.job.status === "error" && /at least 1 style/.test(r.job.error), r.job);
  r = await runJob("shot-prompts", { product: "Honey", styles: ["studio"], image: { mediaType: "image/gif", data: "QUJD" } }, "5.5.5.3");
  check("unsupported photo type is refused", r.job.status === "error" && r.job.code === "invalid", r.job);

  // Leads: search pauses once, then submits; output is cleaned.
  const submitted = {
    leads: [
      { name: "Fitzroy Wine Co", website: "https://fitzroywine.example", location: "Fitzroy VIC", category: "bottle shop", whyFit: "Stocks small producers.", publicContact: "https://fitzroywine.example/contact", sourceUrl: "https://fitzroywine.example" },
      { name: "Fitzroy Wine Co", website: "https://fitzroywine.example", location: "Fitzroy VIC", category: "dupe", whyFit: "", publicContact: "", sourceUrl: "" },
      { name: "Bad Link Cellars", website: "javascript:alert(1)", location: "Collingwood VIC", category: "wine bar", whyFit: "Natural wine list.", publicContact: "", sourceUrl: "not a url" },
      { name: "", website: "", location: "", category: "", whyFit: "", publicContact: "", sourceUrl: "" },
    ],
    searchSummary: "Searched for independent bottle shops in Fitzroy.",
  };
  fc = fakeClient((params, n) => n === 1
    ? { stop_reason: "pause_turn", content: [{ type: "server_tool_use", id: "s1", name: "web_search", input: { query: "bottle shop fitzroy" } }] }
    : { stop_reason: "tool_use", content: [{ type: "tool_use", id: "t1", name: "submit_leads", input: submitted }] });
  claude.setClientForTests(fc);
  r = await runJob("leads", { offer: "Small-batch gin", idealCustomer: "Independent bottle shops", location: "Fitzroy VIC", count: 5, exclude: ["Old Lead Pty Ltd"] }, "6.6.6.1");
  const leads = r.job.result && r.job.result.leads;
  check("leads job finishes", r.job.status === "done", r.job);
  check("leads are de-duplicated and blanks dropped", leads && leads.length === 2, leads);
  check("unsafe links are removed from leads", leads && leads[1].website === "" && leads[1].sourceUrl === "", leads && leads[1]);
  check("pause_turn is resumed by echoing the turn", fc.calls.length === 2 && fc.calls[1].params.messages[1].role === "assistant", fc.calls.map((c) => c.params.messages.length));
  const tools = fc.calls[0].params.tools;
  check("leads use the current web search tool", tools[0].type === "web_search_20260209" && tools[0].max_uses === 5, tools[0]);
  check("submit_leads is a strict tool", tools[1].name === "submit_leads" && tools[1].strict === true);
  check("tool choice stays auto", fc.calls[0].params.tool_choice.type === "auto");
  check("exclude list reaches the prompt", JSON.stringify(fc.calls[0].params.messages).includes("Old Lead Pty Ltd"));

  fc = fakeClient(() => ({ stop_reason: "end_turn", content: [{ type: "text", text: "I found some." }] }));
  claude.setClientForTests(fc);
  r = await runJob("leads", { offer: "Gin", idealCustomer: "Bars", location: "Hobart" }, "6.6.6.2");
  check("leads nudges once, then gives up clearly", r.job.status === "error" && r.job.code === "no_result" && fc.calls.length === 2, { job: r.job, calls: fc.calls.length });

  process.env.CLAUDE_MODEL = "claude-haiku-5-5";
  fc = fakeClient(() => ({ stop_reason: "tool_use", content: [{ type: "tool_use", id: "t1", name: "submit_leads", input: { leads: [], searchSummary: "" } }] }));
  claude.setClientForTests(fc);
  await runJob("leads", { offer: "Gin", idealCustomer: "Bars", location: "Hobart" }, "6.6.6.3");
  check("haiku gets the basic web search tool", fc.calls[0].params.tools[0].type === "web_search_20250305", fc.calls[0].params.tools[0]);
  delete process.env.CLAUDE_MODEL;

  const echoed = claude.echoable([
    { type: "thinking", thinking: "" },
    { type: "server_tool_use", id: "a" },
    { type: "web_search_tool_result", tool_use_id: "a" },
    { type: "server_tool_use", id: "b" },
    { type: "text", text: "partial" },
    { type: "fallback" },
    { type: "text", text: "after" },
  ]);
  check("echo after a fallback keeps text and paired search blocks only", JSON.stringify(echoed.map((b) => b.type + (b.id || ""))) === JSON.stringify(["server_tool_usea", "web_search_tool_result", "text", "fallback", "text"]), echoed);

  // Pitch.
  fc = fakeClient(() => textResp({ subject: "Gin for your shelves", body: "Hi team..." }));
  claude.setClientForTests(fc);
  r = await runJob("pitch", { lead: { name: "Fitzroy Wine Co", whyFit: "Stocks small producers." }, offer: "Small-batch gin", senderName: "Dana", tone: "brief" }, "8.8.8.1");
  check("pitch job finishes", r.job.status === "done" && r.job.result.subject === "Gin for your shelves", r.job);
  check("pitch prompt names the lead and sender", /Fitzroy Wine Co/.test(fc.calls[0].params.messages[0].content) && /Dana/.test(fc.calls[0].params.messages[0].content));
  r = await runJob("pitch", { lead: {}, offer: "Gin" }, "8.8.8.2");
  check("pitch needs a lead", r.job.status === "error" && r.job.code === "invalid", r.job);

  const bad = await status(event({ query: { id: "../../etc" } }));
  check("status rejects a malformed id", bad.statusCode === 400);
}

console.error = realConsoleError;

// ── Tools: safe fetch + site-check ──────────────────────────────────────
const sf = await import(path.join(fnDir, "utils", "safe-fetch.js"));
section("Safe fetch");
{
  const priv = ["10.0.0.1", "127.0.0.1", "169.254.169.254", "172.16.5.4", "192.168.1.1", "100.64.0.1", "0.0.0.0", "::1", "::", "fe80::1", "fd00::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "64:ff9b::a00:1"];
  const pub = ["1.1.1.1", "142.250.70.78", "2606:4700:4700::1111"];
  check("private addresses are blocked", priv.every(sf.isPrivateIp), priv.filter((ip) => !sf.isPrivateIp(ip)));
  check("public addresses are allowed", pub.every((ip) => !sf.isPrivateIp(ip)), pub.filter(sf.isPrivateIp));

  const refused = async (url) => { try { await sf.safeFetch(url, { timeoutMs: 3000 }); return false; } catch (e) { return e instanceof sf.FetchError; } };
  for (const url of ["http://127.0.0.1/", "http://localhost/", "http://[::1]/", "http://169.254.169.254/latest/meta-data", "http://10.0.0.1/", "ftp://example.com/", "https://user:pw@example.com/", "https://example.com:8080/", "intranet"]) {
    check("refuses " + url, await refused(url));
  }

  // A local server stands in for a public site; the test allows its IP and port.
  const zlib = await import("node:zlib");
  const http = await import("node:http");
  const srv = http.createServer((req, res) => {
    if (req.url === "/gz") { res.writeHead(200, { "content-type": "text/html", "content-encoding": "gzip" }); return res.end(zlib.gzipSync("<html><title>Hi</title></html>")); }
    if (req.url === "/to-private") { res.writeHead(302, { location: "http://10.0.0.1/" }); return res.end(); }
    if (req.url === "/loop") { res.writeHead(302, { location: "/loop" }); return res.end(); }
    if (req.url === "/big") { res.writeHead(200, { "content-type": "text/html" }); return res.end("x".repeat(5000)); }
    if (req.url === "/slow") { return setTimeout(() => res.end("late"), 2000); }
    res.writeHead(200, { "content-type": "text/html" }); res.end("<html>ok</html>");
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const p = srv.address().port;
  // Fake DNS: public.test is "public" (the local server), evil.test resolves to a private IP.
  const fakeDns = (host, o, cb) => {
    const ip = host === "public.test" ? "127.0.0.1" : host === "evil.test" ? "10.0.0.5" : null;
    if (!ip) return cb(Object.assign(new Error("ENOTFOUND"), { code: "ENOTFOUND" }));
    cb(null, [{ address: ip, family: 4 }]);
  };
  const opts = { isBlockedIp: (ip) => ip !== "127.0.0.1" && sf.isPrivateIp(ip), allowedPorts: [p], resolver: fakeDns };
  let res = await sf.safeFetch(`http://public.test:${p}/gz`, opts);
  check("fetches and un-gzips a page", res.status === 200 && res.body.includes("<title>Hi</title>"), res.body);
  check("hostname resolving to a private IP is refused at connect time", await sf.safeFetch(`http://evil.test:${p}/`, opts).then(() => false, (e) => /private network/.test(e.message)));
  check("redirect to a private address is refused", await sf.safeFetch(`http://public.test:${p}/to-private`, opts).then(() => false, (e) => e instanceof sf.FetchError));
  check("redirect loops are cut off", await sf.safeFetch(`http://public.test:${p}/loop`, opts).then(() => false, (e) => /too many/.test(e.message)));
  res = await sf.safeFetch(`http://public.test:${p}/big`, Object.assign({ maxBytes: 1000 }, opts));
  check("large pages are truncated", res.truncated === true && res.body.length === 1000, res.body.length);
  check("slow sites time out", await sf.safeFetch(`http://public.test:${p}/slow`, Object.assign({ timeoutMs: 300 }, opts)).then(() => false, (e) => /too long/.test(e.message)));
  await new Promise((r) => srv.close(r));

  const siteCheck = await load("site-check.js");
  let r = await siteCheck(event({ query: { url: "" } }));
  check("site-check needs a URL", r.statusCode === 400);
  r = await siteCheck(event({ query: { url: "http://169.254.169.254/" } }));
  check("site-check refuses private addresses", r.statusCode === 502 && /private network/.test(parse(r).error), r.body);
}

// ── finish ──────────────────────────────────────────────────────────────
await server.stop();
fs.rmSync(blobDir, { recursive: true, force: true });
console.log(failures ? `\n${failures} failed, ${passes} passed.` : `\nAll ${passes} tool tests passed.`);
process.exit(failures ? 1 : 0);
