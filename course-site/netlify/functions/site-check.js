// site-check.js — fetches a public page and its robots.txt for the Website
// Check tool. No AI and no cost; the scoring happens in the browser
// (assets/js/tools/schema-audit.js). Capped per visitor so the fetcher
// can't be used as a general-purpose proxy.
// GET ?url=example.com.au -> { url, status, html, truncated, robots: { status, text } }
import crypto from "node:crypto";
import { store, json, fail } from "./utils/helpers.js";
import { claimRun, visitorId } from "./utils/limits.js";
import { safeFetch, normaliseUrl, FetchError } from "./utils/safe-fetch.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") return fail("method not allowed", 405);
  const raw = ((event.queryStringParameters && event.queryStringParameters.url) || "").trim();
  if (!raw || raw.length > 500) return fail("Enter a website address.");

  let start;
  try { start = normaliseUrl(raw); } catch (e) { return fail(e.message); }

  const s = store(event);
  const claim = await claimRun(s, { bucket: "sitecheck", runId: crypto.randomUUID(), visitor: visitorId(event) });
  if (!claim.ok) return fail(claim.message, 429);

  let page;
  try {
    page = await safeFetch(start);
  } catch (e) {
    return fail(e instanceof FetchError ? e.message : "Couldn't reach that website.", 502);
  }
  if (page.status >= 400) return fail(`That page returned an error (HTTP ${page.status}).`, 502);
  const type = String(page.headers["content-type"] || "");
  if (type && !/html|xml|text\/plain/i.test(type)) return fail("That address isn't a web page.", 415);

  let robots = { status: 0, text: "" };
  try {
    const r = await safeFetch(new URL("/robots.txt", page.url), { maxBytes: 256 * 1024 });
    robots = { status: r.status, text: r.status < 400 ? r.body : "" };
  } catch (e) {
    robots = { status: 0, text: "" };
  }

  return json({ url: page.url, status: page.status, html: page.body, truncated: page.truncated, robots });
};
