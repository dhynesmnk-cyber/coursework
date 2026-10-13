// page-text.js — turn fetched HTML into compact plain text for a prompt,
// and pick out the few internal pages worth reading as well (about,
// services). No DOM in functions, so this is careful regex work; it only
// has to be good enough for Claude to read, not pixel-perfect.

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', ndash: "-", mdash: "-", hellip: "...",
};

export function decodeEntities(s) {
  return String(s || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : " ";
    }
    const v = ENTITIES[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

export function pageText(html, maxChars) {
  const s = String(html || "");
  const title = (s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const descTag = (s.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [])[0] || "";
  const description = (descTag.match(/content=["']([^"']*)["']/i) || [])[1] || "";
  const jsonLd = Array.from(s.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi))
    .map((m) => m[1].trim())
    .join("\n")
    .slice(0, 3000);
  const body = decodeEntities(
    s.replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<\/?(br|p|div|li|h[1-6]|tr|section|article|header|footer|nav|ul|ol)\b[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t\f\v\r]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
  return {
    title: decodeEntities(title).replace(/\s+/g, " ").trim(),
    description: decodeEntities(description).trim(),
    jsonLd,
    text: body.slice(0, maxChars || 8000),
  };
}

// Same-site links that usually describe the business, best first.
const WANTED = [/about|our-story|who-we-are/i, /service|what-we-do/i, /menu|product|shop|range/i, /work|projects|gallery/i];

export function interestingLinks(html, baseUrl, max) {
  let base;
  try { base = new URL(baseUrl); } catch (e) { return []; }
  const found = [];
  for (const m of String(html || "").matchAll(/<a\s[^>]*href=["']([^"']+)["']/gi)) {
    let u;
    try { u = new URL(decodeEntities(m[1]), base); } catch (e) { continue; }
    if (u.host !== base.host || (u.protocol !== "https:" && u.protocol !== "http:")) continue;
    u.hash = "";
    u.search = "";
    const rank = WANTED.findIndex((re) => re.test(u.pathname));
    if (rank < 0 || u.href === base.href || found.some((f) => f.href === u.href)) continue;
    found.push({ href: u.href, rank });
  }
  return found.sort((a, b) => a.rank - b.rank).slice(0, max).map((f) => f.href);
}
