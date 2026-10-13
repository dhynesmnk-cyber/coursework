// validate.js — small input cleaners shared by the AI tool modules.
// Each returns a cleaned value or throws an InputError with a message the
// visitor can act on.
export class InputError extends Error {}

export function text(input, field, { label, max = 4000, required = false } = {}) {
  const raw = input && typeof input[field] === "string" ? input[field].trim() : "";
  if (required && !raw) throw new InputError(`Please fill in ${label || field}.`);
  if (raw.length > max) throw new InputError(`${label || field} is too long (max ${max} characters).`);
  return raw;
}

export function oneOf(input, field, allowed, fallback) {
  const v = input && input[field];
  return allowed.includes(v) ? v : fallback;
}

export function int(input, field, min, max, fallback) {
  const n = parseInt(input && input[field], 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function list(input, field, allowed, { min = 0, max = allowed.length, label } = {}) {
  const raw = Array.isArray(input && input[field]) ? input[field] : [];
  const out = [...new Set(raw.filter((v) => allowed.includes(v)))].slice(0, max);
  if (out.length < min) throw new InputError(`Please choose at least ${min} ${label || field}.`);
  return out;
}

export function strings(input, field, { maxItems = 50, maxLength = 200 } = {}) {
  const raw = Array.isArray(input && input[field]) ? input[field] : [];
  return raw
    .filter((v) => typeof v === "string" && v.trim())
    .map((v) => v.trim().slice(0, maxLength))
    .slice(0, maxItems);
}

// Run a tool module's validate() and turn InputErrors into { error }.
export function validateWith(fn, input) {
  try {
    return { value: fn(input || {}) };
  } catch (e) {
    if (e instanceof InputError) return { error: e.message };
    throw e;
  }
}
