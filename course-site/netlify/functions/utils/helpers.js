// Shared helpers for course functions. Files in this folder are bundled
// but not exposed as endpoints.
import crypto from "node:crypto";
import { getStore, connectLambda } from "@netlify/blobs";

// Lambda-style handlers (export const handler) do not get the Blobs context
// automatically: it arrives base64-encoded on event.blobs and must be passed
// to connectLambda() before getStore(). Tests pass no event.blobs and stub
// the store instead.
export function store(event) {
  if (event && event.blobs) connectLambda(event);
  return getStore({ name: "course" });
}

export function json(data, status = 200) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(data),
  };
}

export function fail(error, status = 400) {
  return json({ error }, status);
}

// Identity user from a request made by a signed-in visitor on the same site.
// Netlify verifies the "Authorization: Bearer <jwt>" header and exposes the
// decoded claims on context.clientContext.user (sub = user id).
export function identityUser(context) {
  const u = context && context.clientContext && context.clientContext.user;
  if (!u || !u.sub) return null;
  return { id: u.sub, email: u.email || "" };
}

export function safeToken(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1 confusion
export function makeCode() {
  const pick = (n) =>
    Array.from(crypto.randomBytes(n))
      .map((b) => ALPHABET[b % ALPHABET.length])
      .join("");
  return pick(4) + "-" + pick(4);
}

export function parseBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {};
  }
}
