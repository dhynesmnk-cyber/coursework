// blog.js — Blog Writer. One structured Claude call returns a title, a meta
// description and the post in Markdown. Prompt adapted from the old
// bee-free-tools blog-writer-system.md, minus the fragile escaped-JSON
// output instructions (structured output replaces them).
import { text, oneOf } from "./validate.js";
import { structured } from "../claude.js";

const TONES = ["plain and friendly", "professional", "warm and chatty"];
const LENGTHS = ["600", "900", "1200"];

export function validate(input) {
  return {
    business: text(input, "business", { label: "your business name", max: 120, required: true }),
    industry: text(input, "industry", { label: "industry", max: 120 }),
    location: text(input, "location", { label: "location", max: 120 }),
    topic: text(input, "topic", { label: "the topic", max: 300, required: true }),
    audience: text(input, "audience", { label: "audience", max: 300 }),
    notes: text(input, "notes", { label: "notes", max: 1500 }),
    keyword: text(input, "keyword", { label: "the search phrase", max: 120 }),
    website: text(input, "website", { label: "website", max: 300 }),
    tone: oneOf(input, "tone", TONES, TONES[0]),
    length: oneOf(input, "length", LENGTHS, "900"),
  };
}

const SYSTEM = `You write blog posts for Australian small businesses: tradespeople, sole traders, retailers, hospitality operators and service businesses. The posts must be genuinely useful, earn trust, and read well in search results and AI assistants.

Voice: direct, warm and practical, like a knowledgeable local explaining something over coffee. No corporate speak, no padding. Write for a plumber in Ballarat or a florist in Fremantle who has read enough generic content to smell it from a mile away.

Language rules:
- Australian English throughout (colour, centre, organisation, realise, behaviour, labour, favour).
- No em dashes. Use commas, full stops or a new sentence instead. No semicolons in body copy.
- Short sentences (under 25 words on average) and short paragraphs of two to four sentences. Active voice.
- Never use: leverage, synergy, disrupt, empower, unlock, supercharge, revolutionise, "AI-powered", cutting-edge, state-of-the-art, next-generation, solutions, seamless, frictionless, "at scale", game-changer, groundbreaking, transformative, innovative, holistic, robust, utilise, streamline, ecosystem, deep dive, move the needle, low-hanging fruit, world-class.

Structure (Markdown, no H1 in the post body):
1. An opening of 60 to 100 words with no heading. Hook the reader with a real problem, a surprising fact or a direct challenge to a common assumption. Never open with "In today's world", "As a business owner", "In this article", "Whether you're a" or "Are you looking for". Answer the most obvious question about the topic within the first 150 words.
2. Three to five ## sections, each opening with a direct one or two sentence answer to the question its heading implies, then specifics and examples grounded in Australian business life.
3. A "## Common Questions" section with three or four questions phrased the way a real person types them, each answered in a standalone 50 to 90 words.
4. A closing of 60 to 100 words with no heading: the one thing to take away and a concrete next step for today. No "I hope this helped".

If a target search phrase is given, use it (or a natural variation) in the opening paragraph, in one ## heading and in the Common Questions section. Never force it where it reads badly.

Accuracy matters more than confidence. Do not invent statistics, prices, licence numbers, regulations, awards or customer stories. If a fact would need checking, phrase it generally or tell the reader what to check. Mention the business name naturally once or twice at most.

Return JSON with: title (under 60 characters, includes the core topic), metaDescription (under 155 characters, plain language, no clickbait) and post (the Markdown body).`;

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    metaDescription: { type: "string" },
    post: { type: "string" },
  },
  required: ["title", "metaDescription", "post"],
  additionalProperties: false,
};

export async function run(v) {
  const lines = [
    `Business name: ${v.business}`,
    v.industry && `Industry: ${v.industry}`,
    v.location && `Location: ${v.location}`,
    v.website && `Website: ${v.website}`,
    `Topic: ${v.topic}`,
    v.keyword && `Target search phrase: ${v.keyword}`,
    v.audience && `Target reader: ${v.audience}`,
    `Tone: ${v.tone}`,
    `Length: about ${v.length} words for the post body.`,
    v.notes && `About the business (treat as facts about them):\n${v.notes}`,
  ].filter(Boolean);
  const out = await structured({
    system: SYSTEM,
    content: lines.join("\n"),
    schema: SCHEMA,
    effort: "medium",
    maxTokens: 16000,
  });
  return {
    title: String(out.title || "").slice(0, 200),
    metaDescription: String(out.metaDescription || "").slice(0, 400),
    post: String(out.post || ""),
  };
}
