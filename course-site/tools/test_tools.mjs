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

// ── finish ──────────────────────────────────────────────────────────────
await server.stop();
fs.rmSync(blobDir, { recursive: true, force: true });
console.log(failures ? `\n${failures} failed, ${passes} passed.` : `\nAll ${passes} tool tests passed.`);
process.exit(failures ? 1 : 0);
