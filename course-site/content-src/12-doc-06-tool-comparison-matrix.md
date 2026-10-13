# Document 6: AI Tool Comparison Matrix

**Part of the "AI Without the Sales Pitch" participant pack.**
**LAST VERIFIED: 13 October 2026.** Pricing and plans in this industry change every few months. This matrix is a snapshot, not scripture. Re-verify quarterly (put it in the same calendar slot as the Document 5 review). Prices below are US dollars, the global standard vendors publish; Australian-dollar prices differ (typically higher, plus GST). Always confirm on the vendor's own pricing page before budgeting.

---

## In plain terms

The four big AI products are more alike than their marketing suggests. For most small businesses, the best choice is whichever one plugs into the email and files you already use, on a paid business account so your data is protected by contract. Add a local tool only if you handle genuinely sensitive material.

## How to read this table

Remember Class 1: the model is the engine, the product is the car. This table compares cars: what they cost, what they're good at, and what they do with your data. Engines get swapped regularly under the bonnet, so the "best at" row describes each car's strengths today, not a permanent ranking.

Read the rows in this order: **Trains on your data?** first, then **Business/team** pricing, then **Best at**. The first two decide whether a product is safe and affordable for work; the third is a tiebreaker.

## The matrix

| | **ChatGPT (OpenAI)** | **Claude (Anthropic)** | **Gemini (Google)** | **Copilot (Microsoft)** | **Llama (Meta) local** |
|---|---|---|---|---|---|
| **Free tier** | Yes, generous, rate-limited | Yes, rate-limited | Yes (consumer app, with a Google account) | Yes (consumer Copilot app/web) | The models are free; your hardware is not |
| **Individual paid** | Go ~US$8/mo (limited markets); Plus US$20/mo (~A$31); Pro US$200/mo | Pro US$17/mo annual, US$20 monthly; Max US$100–200/mo | Google AI Pro ~US$19.99/mo; AI Ultra US$249.99/mo (heavy users only) | Copilot Pro ~US$20/mo (personal Microsoft 365 users) | $0 software; a usable 8B-class setup runs on a 16GB laptop; 12–32B models want 24–32GB memory or a 12GB+ graphics card |
| **Business/team** | Business (formerly Team) ~US$25–30/user/mo (annual vs monthly), low seat minimum | Team ~US$25/seat/mo annual (~US$30 monthly), typically 5-seat minimum; Premium tier (~US$150) adds Claude Code allowances | Bundled into Workspace plans: Starter ~US$7, Standard ~US$14, Plus ~US$22–26/user/mo; Gemini Enterprise sold separately for larger deployments | Microsoft 365 Copilot Business ~US$21/user/mo annual commitment (Microsoft's business page also lists a US$32 "Premium with Copilot" tier; check which applies); Copilot Chat is included free with M365 business subscriptions (agents metered) | Free Community Licence for virtually all SMBs (licence obligations kick in only at hyperscale); Meta provides no support, you own everything |
| **Enterprise** | Quote-only; third-party procurement reports converge around US$45–75/seat/mo | Quote-only (Team Enterprise tier ~US$20–125/seat depending on structure reported in 2026; get a quote) | Workspace Enterprise quote-only | ~US$30/user/mo annual with qualifying M365 plan | Self-hosted; your IT problem, your control |
| **Best at** | The all-rounder: ecosystem (Projects, GPTs, memory, canvas, voice, image generation), broad task coverage, largest third-party integration world | Long documents and careful writing; Projects with persistent files; generally cautious, well-behaved output; strong coding tools (Claude Code) | If you live in Google Workspace: inside Gmail, Docs, Meet, Drive; NotebookLM for working strictly within your own documents; bundled, so no extra purchase | If you live in Microsoft 365: inside Outlook, Word, Excel, Teams with your existing permissions; work-account data protection out of the box | Total privacy: nothing leaves the building; offline use; no per-seat fees; customisable |
| **Weak at** | Consumer tier trains on your data unless you opt out; feature sprawl can confuse; price climbs fast with add-ons | Smaller ecosystem and fewer integrations than OpenAI/Microsoft; consumer plan's training opt-in comes with 5-year retention if accepted | Consumer activity settings are a maze (see Doc 5); Workspace value depends on already paying for Workspace | Consumer Copilot and work Copilot look identical but behave differently, which trips people up; best features assume M365 subscriptions | Requires someone technical to own it; smaller models trail frontier cloud models on hard reasoning; no built-in ecosystem (your Drive/SharePoint do not appear inside it) |
| **Trains on your data?** | Free/Plus: yes unless you opt out. Pro: no. Business/Enterprise: no (contractual) | Free/Pro: only if you opt in (default/consent prompted since Aug 2025; opt-in extends retention to 5 years). Team/Enterprise: no | Consumer: only if Gemini Apps Activity is on. Workspace business: not outside your domain | Consumer: may be used to improve services unless opted out. Work/school account: not used to train foundation models (contractual) | Nothing is transmitted anywhere; no training happens on your chats unless you do it yourself |
| **Business DPA / admin controls** | Yes on Business/Enterprise | Yes on Team/Enterprise | Yes via Workspace terms | Yes, strongest of the group via Microsoft DPA | Not applicable (you are the processor) |

## How to choose: two questions

**Question 1: what does your business already run on?**
- Email, files and calendar in **Microsoft 365**: Copilot is the easiest path and the best governed, because it already knows who's allowed to see what.
- Email, files and calendar in **Google Workspace**: Gemini, for the same reason.
- **Neither:** question 2 decides.

**Question 2: what's your main task?**
- Long documents, drafting and careful rewriting: **Claude**.
- A broad mix (voice, images, custom helpers, lots of connections to other apps): **ChatGPT**.
- Strict privacy needs or lots of NDA work: a **local Llama-class setup**, or as the practical middle, a business tier of either cloud product with its contract protections.

**The common-sense 2026 setup for a ten-person business with no strong ecosystem:** two or three seats on one cloud product's business tier (ChatGPT Business or Claude Team, roughly US$25–30 per user per month) for day-to-day work. Optionally, add one capable computer running Ollama or LM Studio with a mid-size open model for the sensitive material. Total: under A$150 per month all in. The alternative, everyone on free personal accounts with client data, costs nothing and risks everything.

## What changes fastest (re-check these quarterly)

- **Prices and plan names.** OpenAI renamed Team to Business in 2025; expect more renaming.
- **Free-tier limits.**
- **Which model sits under each product.** The engine gets swapped regularly; the car keeps its name.
- **Data-handling defaults.** Anthropic's consumer terms changed significantly in August 2025, and Google's activity settings have moved several times.
- **Where tiers are sold.** For example, which countries get ChatGPT Go.
- **The gap between the best cloud models and the best local models.** It narrows every year.
