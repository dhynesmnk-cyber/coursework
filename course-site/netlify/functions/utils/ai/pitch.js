// pitch.js — writes a short first-contact email for one lead from the
// Leads tool. Adapted from BeeSearch's generatePitch(), without the
// score-driven sections (the lightweight tool has no 7-point evaluation).
import { text, oneOf } from "./validate.js";
import { structured } from "../claude.js";

const TONES = ["warm", "professional", "brief"];

export function validate(input) {
  const lead = (input && typeof input.lead === "object" && input.lead) || {};
  return {
    lead: {
      name: text(lead, "name", { label: "the lead's name", max: 120, required: true }),
      website: text(lead, "website", { max: 300 }),
      location: text(lead, "location", { max: 120 }),
      category: text(lead, "category", { max: 80 }),
      whyFit: text(lead, "whyFit", { max: 400 }),
    },
    offer: text(input, "offer", { label: "what you sell", max: 300, required: true }),
    business: text(input, "business", { label: "your business name", max: 120 }),
    senderName: text(input, "senderName", { label: "your name", max: 80 }),
    tone: oneOf(input, "tone", TONES, "warm"),
  };
}

const SYSTEM = `You write short first-contact emails from one small Australian business to another.

Rules:
- 90 to 150 words in the body. Australian English. No em dashes, no emojis, no hype words (synergy, leverage, game-changer, revolutionise).
- Open with one specific, true observation about the recipient based only on the details given. Never invent facts about them (awards, owners' names, menus, history).
- Say plainly what the sender offers and one concrete reason it suits this business.
- End with a low-pressure question, then the sender's name and business so they are clearly identified.
- Finish with one line making it easy to opt out, e.g. "If this isn't relevant, just reply and I won't follow up."

Return JSON: subject (under 70 characters, no clickbait) and body (plain text, no Markdown).`;

const SCHEMA = {
  type: "object",
  properties: { subject: { type: "string" }, body: { type: "string" } },
  required: ["subject", "body"],
  additionalProperties: false,
};

export async function run(v) {
  const l = v.lead;
  const brief = [
    `Recipient business: ${l.name}`,
    l.category && `Type: ${l.category}`,
    l.location && `Location: ${l.location}`,
    l.website && `Website: ${l.website}`,
    l.whyFit && `Why they might be a fit: ${l.whyFit}`,
    ``,
    `Sender offers: ${v.offer}`,
    v.business && `Sender business: ${v.business}`,
    v.senderName && `Sender name: ${v.senderName}`,
    `Tone: ${v.tone}`,
  ].filter((x) => x !== null && x !== false && x !== undefined).join("\n");
  const out = await structured({ system: SYSTEM, content: brief, schema: SCHEMA, effort: "low", maxTokens: 6000 });
  return { subject: String(out.subject || "").slice(0, 200), body: String(out.body || "") };
}
