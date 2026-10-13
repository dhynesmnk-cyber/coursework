// leads.js — BeeSearch Leads. Claude searches the live web (Anthropic's
// server-side web search tool, no scraping or extra API keys) and reports
// back through a strict submit_leads tool so the result is always valid.
// Replaces the Replit app's DuckDuckGo-scraping pipeline and its Postgres
// database; the visitor's shortlist lives in their own browser.
import { text, int, strings } from "./validate.js";
import { createMessage, checkStop, echoable, modelId, webSearchType, ToolError } from "../claude.js";

const MAX_TURNS = 5; // pause_turn continuations + one nudge

export function validate(input) {
  return {
    offer: text(input, "offer", { label: "what you sell", max: 300, required: true }),
    idealCustomer: text(input, "idealCustomer", { label: "your ideal customer", max: 300, required: true }),
    location: text(input, "location", { label: "the location", max: 120, required: true }),
    examples: text(input, "examples", { label: "examples", max: 600 }),
    count: int(input, "count", 3, 10, 6),
    exclude: strings(input, "exclude", { maxItems: 50, maxLength: 200 }),
  };
}

const SUBMIT_TOOL = {
  name: "submit_leads",
  description: "Submit the final list of business leads. Call this exactly once, after searching.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      leads: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            website: { type: "string", description: "The business's own website (https://...), or empty if none was found." },
            location: { type: "string", description: "Suburb and state." },
            category: { type: "string", description: "Short type of business, e.g. 'independent bottle shop'." },
            whyFit: { type: "string", description: "One or two sentences on why this business fits, based on what you found." },
            publicContact: { type: "string", description: "A business contact the business itself publishes (contact page URL, general email or phone). Empty if none. Never a personal address." },
            sourceUrl: { type: "string", description: "The page where you found this business." },
          },
          required: ["name", "website", "location", "category", "whyFit", "publicContact", "sourceUrl"],
          additionalProperties: false,
        },
      },
      searchSummary: { type: "string", description: "One sentence on how you searched." },
    },
    required: ["leads", "searchSummary"],
    additionalProperties: false,
  },
};

const SYSTEM = `You find sales leads for a small Australian business: real, currently operating businesses that would plausibly buy from, stock, or partner with them.

Search the web for businesses in or near the given location that match the ideal customer. Prefer independent local businesses with their own website. Skip directories, marketplaces, news articles, chains' head offices, closed businesses and anything on the exclude list. Do not guess: only include a business if your search results show it exists, and only report contact details the business publishes itself for business enquiries. Never include personal email addresses or private individuals.

When you're done searching, call submit_leads once with the best matches (up to the number requested). Fewer good leads beat padding the list. Use Australian English.`;

function clean(lead) {
  const s = (v, n) => String(v || "").trim().slice(0, n);
  const url = (v) => {
    const u = s(v, 300);
    return /^https?:\/\/[^\s]+$/i.test(u) ? u : "";
  };
  return {
    name: s(lead.name, 120),
    website: url(lead.website),
    location: s(lead.location, 120),
    category: s(lead.category, 80),
    whyFit: s(lead.whyFit, 400),
    publicContact: s(lead.publicContact, 200),
    sourceUrl: url(lead.sourceUrl),
  };
}

export async function run(v) {
  const model = modelId();
  const brief = [
    `What we sell: ${v.offer}`,
    `Ideal customer: ${v.idealCustomer}`,
    `Location: ${v.location}`,
    v.examples && `Examples of good existing customers: ${v.examples}`,
    `Number of leads wanted: up to ${v.count}`,
    v.exclude.length ? `Exclude (already on the shortlist): ${v.exclude.join("; ")}` : null,
  ].filter(Boolean).join("\n");

  const tools = [
    { type: webSearchType(model), name: "web_search", max_uses: 5, user_location: { type: "approximate", country: "AU" } },
    SUBMIT_TOOL,
  ];
  const messages = [{ role: "user", content: brief }];
  let nudged = false;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const resp = await createMessage({
      max_tokens: 16000,
      system: SYSTEM,
      messages,
      tools,
      tool_choice: { type: "auto" },
      output_config: { effort: "medium" },
    });
    checkStop(resp);

    const submit = (resp.content || []).find((b) => b.type === "tool_use" && b.name === "submit_leads");
    if (submit) {
      const seen = new Set();
      const leads = (submit.input.leads || [])
        .map(clean)
        .filter((l) => {
          const k = (l.website || l.name).toLowerCase();
          if (!l.name || seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .slice(0, v.count);
      return { leads, searchSummary: String(submit.input.searchSummary || "").slice(0, 300) };
    }

    // The server-side search loop paused: send the turn back unchanged and it resumes.
    messages.push({ role: "assistant", content: echoable(resp.content) });
    if (resp.stop_reason === "pause_turn") continue;
    if (nudged) break;
    nudged = true;
    messages.push({ role: "user", content: "Please call submit_leads now with the businesses you found (an empty list is fine)." });
  }
  throw new ToolError("no_result", "The search didn't come back with a list. Please try again, perhaps with a broader location.");
}
