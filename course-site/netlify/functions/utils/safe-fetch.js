// safe-fetch.js — fetch a public web page on a visitor's behalf without
// letting them reach anything private (cloud metadata, localhost, the LAN).
// Every hostname is checked at connect time through a custom DNS lookup, so
// a name that resolves to a private address is refused even if it changes
// between checks. Redirects are followed by hand and re-checked each hop.
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";

export class FetchError extends Error {}

export function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||  // carrier-grade NAT
      (a === 169 && b === 254) ||            // link-local, cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (net.isIPv6(ip)) {
    const x = ip.toLowerCase();
    const dotted = x.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (dotted) return isPrivateIp(dotted[1]);
    const hex = x.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
      const hi = parseInt(hex[1], 16);
      const lo = parseInt(hex[2], 16);
      return isPrivateIp([hi >> 8, hi & 255, lo >> 8, lo & 255].join("."));
    }
    return (
      x.startsWith("::") ||          // ::, ::1 and IPv4-compatible forms
      /^f[cd]/.test(x) ||            // unique local fc00::/7
      /^fe[89ab]/.test(x) ||         // link-local fe80::/10
      x.startsWith("ff") ||          // multicast
      x.startsWith("64:ff9b:") ||    // NAT64 can reach IPv4 private space
      x.startsWith("2001:db8")       // documentation
    );
  }
  return true; // not an IP we understand: refuse
}

function guardedLookup(isBlockedIp, resolver) {
  return (hostname, options, callback) => {
    if (typeof options === "function") { callback = options; options = {}; }
    if (typeof options === "number") options = { family: options };
    resolver(hostname, Object.assign({}, options, { all: true }), (err, addresses) => {
      if (err) return callback(err);
      if (!addresses.length || addresses.some((a) => isBlockedIp(a.address))) {
        return callback(new FetchError("That address points to a private network, so it can't be checked."));
      }
      if (options.all) return callback(null, addresses);
      callback(null, addresses[0].address, addresses[0].family);
    });
  };
}

export function normaliseUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) throw new FetchError("Enter a website address.");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = "https://" + s;
  let url;
  try { url = new URL(s); } catch (e) { throw new FetchError("That doesn't look like a website address."); }
  return url;
}

function checkUrl(url, { isBlockedIp, allowedPorts }) {
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new FetchError("Only http and https addresses can be checked.");
  if (url.username || url.password) throw new FetchError("Addresses with a username or password can't be checked.");
  const port = url.port ? parseInt(url.port, 10) : url.protocol === "https:" ? 443 : 80;
  if (!allowedPorts.includes(port)) throw new FetchError("Only standard web ports can be checked.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isBlockedIp(host)) throw new FetchError("That address points to a private network, so it can't be checked.");
  if (!net.isIP(host) && !host.includes(".")) throw new FetchError("That doesn't look like a public website address.");
}

function requestOnce(url, { isBlockedIp, resolver, timeoutMs, maxBytes, headers }) {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(url, {
      method: "GET",
      lookup: guardedLookup(isBlockedIp, resolver),
      headers: Object.assign({
        "user-agent": "Mozilla/5.0 (compatible; CourseWebsiteCheck/1.0)",
        accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5",
        "accept-encoding": "gzip, deflate, br",
      }, headers || {}),
    });
    const timer = setTimeout(() => req.destroy(new FetchError("That website took too long to respond.")), timeoutMs);
    req.on("error", (err) => {
      clearTimeout(timer);
      reject(err instanceof FetchError ? err : new FetchError("Couldn't reach that website."));
    });
    req.on("response", (res) => {
      const status = res.statusCode || 0;
      if (status >= 300 && status < 400 && res.headers.location) {
        clearTimeout(timer);
        res.resume();
        return resolve({ status, headers: res.headers, redirect: res.headers.location });
      }
      const enc = String(res.headers["content-encoding"] || "").toLowerCase();
      let stream = res;
      if (enc === "gzip") stream = res.pipe(zlib.createGunzip());
      else if (enc === "deflate") stream = res.pipe(zlib.createInflate());
      else if (enc === "br") stream = res.pipe(zlib.createBrotliDecompress());
      const chunks = [];
      let size = 0;
      let truncated = false;
      const done = () => {
        clearTimeout(timer);
        resolve({ status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), truncated });
      };
      stream.on("data", (chunk) => {
        if (truncated) return;
        size += chunk.length;
        if (size > maxBytes) {
          chunks.push(chunk.subarray(0, chunk.length - (size - maxBytes)));
          truncated = true;
          req.destroy();
          return done();
        }
        chunks.push(chunk);
      });
      stream.on("end", () => { if (!truncated) done(); });
      stream.on("error", () => { if (!truncated) { clearTimeout(timer); reject(new FetchError("That website sent a response we couldn't read.")); } });
    });
    req.end();
  });
}

export async function safeFetch(raw, opts = {}) {
  const o = Object.assign({
    maxBytes: 1.5 * 1024 * 1024,
    timeoutMs: 8000,
    maxRedirects: 3,
    isBlockedIp: isPrivateIp,
    allowedPorts: [80, 443],
    resolver: dns.lookup, // tests swap in a fake resolver
  }, opts);
  let url = raw instanceof URL ? raw : normaliseUrl(raw);
  for (let hop = 0; hop <= o.maxRedirects; hop++) {
    checkUrl(url, o);
    const res = await requestOnce(url, o);
    if (res.redirect) {
      try { url = new URL(res.redirect, url); } catch (e) { throw new FetchError("That website redirected somewhere invalid."); }
      continue;
    }
    return { url: url.href, status: res.status, headers: res.headers, body: res.body, truncated: res.truncated };
  }
  throw new FetchError("That website redirected too many times.");
}
