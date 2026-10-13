// claude.js — the one place the tools talk to the Anthropic API.
// Model, effort and the refusal fallback are decided here so each tool
// module only describes its prompt and the shape of its answer.
import Anthropic from "@anthropic-ai/sdk";

export const DEFAULT_MODEL = "claude-opus-5-5";

export function modelId() {
  return String(process.env.CLAUDE_MODEL || DEFAULT_MODEL).trim();
}

export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Models that accept the server-side refusal fallback in its "default"
// form: if the model declines a request, the API re-runs it on a fallback
// model inside the same call.
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"]);
// Older models that reject output_config.effort.
const NO_EFFORT = /^claude-(haiku-4-5|sonnet-4-5)/;

// The newest web search tool needs a recent Opus/Sonnet; Haiku keeps the basic one.
export function webSearchType(model) {
  return /haiku/.test(model) ? "web_search_20250305" : "web_search_20260209";
}

let client = null;
export function getClient() {
  // Background functions have 15 minutes. Two attempts of up to four
  // minutes each leaves room for the leads tool's follow-up calls.
  if (!client) client = new Anthropic({ timeout: 4 * 60 * 1000, maxRetries: 1 });
  return client;
}
export function setClientForTests(fake) {
  client = fake;
}

// An error whose message is safe to show to the visitor.
export class ToolError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export async function createMessage(params) {
  const model = params.model || modelId();
  const body = Object.assign({ model }, params);
  if (body.output_config && body.output_config.effort && NO_EFFORT.test(model)) {
    body.output_config = Object.assign({}, body.output_config);
    delete body.output_config.effort;
  }
  const c = getClient();
  if (FALLBACK_MODELS.has(model)) {
    return c.beta.messages.create(
      Object.assign(body, { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
    );
  }
  return c.messages.create(body);
}

export function checkStop(resp) {
  if (resp.stop_reason === "refusal") {
    throw new ToolError("refused", "Claude declined this request. Try rewording it or removing anything sensitive.");
  }
  if (resp.stop_reason === "max_tokens") {
    throw new ToolError("too_long", "The answer ran too long and was cut off. Try a shorter request.");
  }
}

// Content to send back as the assistant turn (e.g. after pause_turn). If a
// refusal fallback switched models mid-answer, blocks before the last
// `fallback` marker must not be echoed, except text and paired server-tool
// blocks.
export function echoable(content) {
  const blocks = content || [];
  let boundary = -1;
  blocks.forEach((b, i) => { if (b.type === "fallback") boundary = i; });
  if (boundary < 0) return blocks;
  const resultIds = new Set(blocks.filter((b) => b.tool_use_id).map((b) => b.tool_use_id));
  return blocks.filter((b, i) => {
    if (i >= boundary) return true;
    if (b.type === "text") return true;
    if (b.type === "server_tool_use") return resultIds.has(b.id);
    return Boolean(b.tool_use_id); // server tool results
  });
}

export function textOf(resp) {
  return (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
}

// One request that must come back as JSON matching `schema`.
export async function structured({ system, content, schema, effort, maxTokens }) {
  const resp = await createMessage({
    max_tokens: maxTokens || 8000,
    system,
    messages: [{ role: "user", content }],
    output_config: { effort: effort || "medium", format: { type: "json_schema", schema } },
  });
  checkStop(resp);
  try {
    return JSON.parse(textOf(resp));
  } catch (e) {
    throw new ToolError("bad_output", "The AI sent back something unreadable. Please try again.");
  }
}

// Map anything thrown during a run to a message for the visitor. Details go
// to the function log, never to the browser.
export function friendlyError(err) {
  if (err instanceof ToolError) return { code: err.code, message: err.message };
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return { code: "not_configured", message: "The AI tools aren't set up correctly on this site (the API key was rejected)." };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return { code: "busy", message: "The AI service is busy right now. Please try again in a minute." };
  }
  if (err instanceof Anthropic.BadRequestError || err instanceof Anthropic.NotFoundError) {
    return { code: "rejected", message: "The AI service rejected this request. Please try again with simpler input." };
  }
  if (err instanceof Anthropic.APIConnectionTimeoutError) {
    return { code: "timeout", message: "The AI service took too long to answer. Please try again." };
  }
  return { code: "failed", message: "Something went wrong while generating. Please try again." };
}
