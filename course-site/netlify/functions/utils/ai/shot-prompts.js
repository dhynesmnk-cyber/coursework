// shot-prompts.js — Product-Shot Prompt Builder. No image is generated here:
// Claude writes ready-to-paste prompts for an image tool the visitor
// already uses (ChatGPT, Gemini). An optional small photo lets Claude
// describe the real product accurately.
import { text, oneOf, list, InputError } from "./validate.js";
import { structured } from "../claude.js";

export const STYLES = ["studio", "lifestyle", "flatlay", "outdoor"];
const MOODS = ["professional", "warm", "bold"];
const ASPECTS = ["1:1", "4:5", "16:9", "9:16"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Background functions accept small payloads only; the browser shrinks the
// photo to about 768px before sending, which lands well under this.
export const MAX_IMAGE_BASE64 = 200 * 1024;

export function validate(input) {
  const v = {
    product: text(input, "product", { label: "the product name", max: 120, required: true }),
    description: text(input, "description", { label: "description", max: 600 }),
    notes: text(input, "notes", { label: "notes", max: 500 }),
    styles: list(input, "styles", STYLES, { min: 1, max: 3, label: "style" }),
    mood: oneOf(input, "mood", MOODS, "professional"),
    aspect: oneOf(input, "aspect", ASPECTS, "1:1"),
    image: null,
  };
  const img = input.image;
  if (img) {
    if (!IMAGE_TYPES.includes(img.mediaType) || typeof img.data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(img.data)) {
      throw new InputError("That photo couldn't be read. Try a JPEG or PNG.");
    }
    if (img.data.length > MAX_IMAGE_BASE64) throw new InputError("That photo is too large. Try a smaller one.");
    v.image = { mediaType: img.mediaType, data: img.data };
  }
  return v;
}

const STYLE_NOTES = {
  studio: "clean seamless studio sweep, even professional lighting, centred product, sharp throughout",
  lifestyle: "the product in a believable real-world Australian setting where it would be used, natural light, shallow depth of field",
  flatlay: "overhead flat-lay composition on a textured surface (timber, linen or stone) with a few relevant props",
  outdoor: "soft outdoor daylight, gently blurred natural background",
};

const SYSTEM = `You write product photography prompts for small Australian businesses to paste into an image tool such as ChatGPT or Gemini, usually alongside their own phone photo of the product.

For each requested style, write one prompt of 80 to 150 words in plain commercial-photography language. Each prompt must:
- Start with: "Using my attached product photo, keep the product exactly as it is (shape, colours, label and text) and"
- Describe the background, surface, lighting, camera angle, composition and mood for that style.
- State the aspect ratio.
- End with: "Sharp focus on the product, no watermarks, no added text, no people or hands, commercial product photography quality."
- Never invent a different product, extra branding or claims.

If a photo is attached, first describe the product accurately from it (materials, colours, packaging) in productSummary and use those details. Otherwise base productSummary on the text you were given.

Also give two or three short tips for getting a better result (for example, how to shoot the source photo or what to ask for when the first result is off). Use Australian English and no em dashes.

Return JSON: productSummary, prompts (one per requested style, each with style and prompt), tips.`;

const SCHEMA = {
  type: "object",
  properties: {
    productSummary: { type: "string" },
    prompts: {
      type: "array",
      items: {
        type: "object",
        properties: { style: { type: "string" }, prompt: { type: "string" } },
        required: ["style", "prompt"],
        additionalProperties: false,
      },
    },
    tips: { type: "array", items: { type: "string" } },
  },
  required: ["productSummary", "prompts", "tips"],
  additionalProperties: false,
};

export async function run(v) {
  const brief = [
    `Product: ${v.product}`,
    v.description && `Description: ${v.description}`,
    `Mood: ${v.mood}`,
    `Aspect ratio: ${v.aspect}`,
    `Styles wanted (one prompt each, in this order):`,
    ...v.styles.map((s) => `- ${s}: ${STYLE_NOTES[s]}`),
    v.notes && `Extra notes: ${v.notes}`,
    v.image ? "A photo of the product is attached." : "No photo is attached.",
  ].filter(Boolean).join("\n");

  const content = v.image
    ? [{ type: "image", source: { type: "base64", media_type: v.image.mediaType, data: v.image.data } }, { type: "text", text: brief }]
    : brief;

  const out = await structured({ system: SYSTEM, content, schema: SCHEMA, effort: "low", maxTokens: 8000 });
  return {
    productSummary: String(out.productSummary || ""),
    prompts: (out.prompts || []).slice(0, 3).map((p) => ({ style: String(p.style || ""), prompt: String(p.prompt || "") })),
    tips: (out.tips || []).slice(0, 4).map(String),
  };
}
