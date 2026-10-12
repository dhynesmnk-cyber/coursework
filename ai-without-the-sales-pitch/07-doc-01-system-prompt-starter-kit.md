# Document 1: System Prompt Starter Kit

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and Gems (Google), Copilot (Microsoft), and local tools such as Ollama and LM Studio running Meta's Llama or similar open models.
**Version:** October 2026. Interfaces change; the concepts do not.

---

## What a system prompt is

A system prompt is a block of standing instructions that sits in front of everything you type. You write the message; the system prompt is written once and applies to every message. The model treats it as higher-priority guidance than your individual requests, which is why it is the right place for rules you are tired of repeating: who your business is, how you want things written, what the tool must never do.

Think of it as the induction briefing you give a new employee on their first morning, except you give it once and the employee never forgets it, and never takes a sickie.

## Why it matters

Without one, every chat starts from zero. The tool guesses your tone, guesses your audience, guesses your conventions, and you spend your first three messages correcting it. With a good system prompt, the first draft lands much closer to usable. It is the cheapest, fastest quality upgrade available in any of these products, and almost nobody uses it properly.

A system prompt cannot make the model more knowledgeable or stop it inventing facts. It shapes behaviour, tone, format and priorities. You still check the output.

## How the same idea is named on each platform

| Platform | What the feature is called | Where it lives (as at October 2026) |
|---|---|---|
| ChatGPT | Custom instructions, plus per-Project instructions | Settings, then Personalisation, then Custom instructions. Two boxes: "What would you like ChatGPT to know about you?" and "How would you like ChatGPT to respond?". Separately: any Project you create has its own instructions box that applies only inside that Project. |
| Claude | Profile / personal instructions, plus per-Project custom instructions | Settings, then Profile, "What personal preferences should Claude consider in responses?" Projects: open the Project, then the instructions field in Project settings. |
| Gemini | Personal context, plus Gems (custom assistants) | Settings, then Personal context (a single "what should Gemini know" box). Gems: create a Gem and paste your system prompt into its instructions; that Gem then behaves that way every time you open it. |
| Copilot (consumer) | Personalisation / preferred responses | In the Copilot app or copilot.microsoft.com: Settings, then Personalisation. |
| Microsoft 365 Copilot (work account) | Usually set by your IT admin; users get limited personal preferences | Admins can configure organisational prompts and agents in the Microsoft 365 admin centre and Copilot Studio. Individual staff typically cannot override them, which is the point. |
| Workspace (Gemini in Gmail/Docs) | No user system prompt inside Gmail/Docs drafting; use Gems for standing behaviour | Create a Gem with your template, or paste your instructions at the top of a "Help me write" prompt. |
| Ollama / LM Studio (local models) | System prompt field in the chat settings | LM Studio: the chat screen has a system prompt box on the right-hand settings panel. Ollama: pass a system prompt when you run the model, or use any front-end app that exposes the field. |

**Platform differences worth knowing.** ChatGPT's global custom instructions apply everywhere, which is convenient and occasionally annoying when you want work mode and personal mode separated; use Projects for work. Claude's Projects are the strongest way to keep separate business contexts (one Project per client type, each with its own instructions and files). Gems are the same idea in Google's world and live inside your Google account. Microsoft 365 Copilot deliberately takes standing instructions away from individuals and gives them to the organisation's admin, which is good governance and occasionally frustrating.

---

## Template 1: Small retail business

Paste into your platform's system prompt / custom instructions / Gem instructions field. Edit the square brackets.

```
You assist [Business Name], an independent [retail type, e.g. hardware store / boutique / gift shop] in [town/suburb], with a team of [number]. We sell [main product categories] to [customer types, e.g. local tradies, gift buyers, tourists].

When writing for us:
- Plain Australian English. Warm but not gushy. Short sentences.
- Customers come first: product names, prices and promotions must match exactly what I give you. Never invent prices, stock levels, dates or product claims.
- If I ask for social media copy: [platform, e.g. Facebook and Instagram], maximum [number] sentences, one clear call to action, no hashtags unless I ask.
- If I ask for customer emails: friendly, brief, answer the customer's actual problem, sign off as [name/role].
- For supplier or landlord correspondence: polite, factual, firm, no slang.
- Never promise refunds, exchanges, warranties or delivery dates unless I have given you the policy in the message. If the answer depends on our policy and I have not supplied it, ask me.
- When you are unsure, say so plainly instead of guessing.
- Do not use the words "delve", "elevate", "game-changing" or "unlock".
```

## Template 2: Professional services firm (accounting, legal, consulting)

```
You assist [Firm Name], a [discipline] firm in [city] with [number] staff. Our clients are [client types, e.g. small businesses, individuals, SMEs in the construction sector]. Our tone is [e.g. precise and reassuring].

Rules:
- Plain Australian English, professional register. Define any technical term the first time you use it.
- You are a drafting assistant, not an adviser. You do not provide accounting, legal or financial advice, and you must never state a rule of law, a tax rate, a threshold or a deadline as fact unless I supplied it in the conversation. Where a claim needs verification, mark it [VERIFY] in the output.
- Structure documents clearly: headings, short paragraphs, numbered lists for steps.
- When summarising material I provide, distinguish clearly between what the document says and what you infer.
- Flag, in a separate line at the end, anything in my material that looks time-sensitive, jurisdiction-specific, or beyond your knowledge, so a qualified human reviews it before it goes to a client.
- Confidentiality: I will only paste client material that our firm's AI policy permits. Never assume context I have not given.
- Output defaults: emails under 150 words; memos with a three-sentence executive summary up top; tables where data is involved.
```

## Template 3: Trades or field-services business

```
You assist [Business Name], a [trade, e.g. plumbing / electrical / landscaping] business based in [region], with [number] on the tools and [number] in the office. Our customers are [e.g. homeowners, builders, property managers] across [service area].

When writing for us:
- Straight-talking Australian English. No corporate fluff, no jargon the customer would not use. Read it out loud; if a tradie would not say it, rewrite it.
- Quotes and job descriptions: use only the figures, dates and scope I give you. Never estimate prices, materials or timeframes yourself. If something is missing, list what you need before drafting.
- Customer emails and texts: short, friendly, confirm the facts (what, when, how much), and always include what happens next.
- Job sheet and work-completion summaries: bullet points, plain language a homeowner understands, note anything the customer should watch for.
- Supplier and subcontractor messages: direct, factual, no apologies we do not owe.
- Compliance language (certificates, standards, permits): never paraphrase a requirement from memory. Use only what I paste in, and mark anything else [CHECK WITH LICENSED PERSON].
- If I dictate rough notes, turn them into clean text without adding facts.
```

---

## How to install your template, step by step

**ChatGPT.** Open Settings (your profile picture or name, bottom left on web; top right on mobile). Choose Personalisation, then Custom instructions. Paste into the second box ("How would you like ChatGPT to respond?"), and put one or two lines of business identity into the first box. Save. For a dedicated work space, create a Project (sidebar, plus button), open its settings, and paste the full template into Project instructions; files added to that Project stay available to every chat inside it. Note: on consumer plans, check Settings, Data controls, and turn off model training if you have not already.

**Claude.** Open Settings, then Profile. Paste your template into the personal preferences field. For per-context use, create a Project (sidebar), open Project settings, and paste the template into the Project's custom instructions; add reference files to the Project knowledge as needed.

**Gemini.** Two options. Quick: Settings, Personal context, paste a condensed version (the field is shorter than a full template, so keep the identity line and the top five rules). Better for business: go to Gems (sidebar or gemini.google.com), create a Gem, give it a name like "[Business] assistant", paste the full template as its instructions, and use that Gem for work tasks. Workspace users: the same Gems are available inside Google apps depending on your plan.

**Copilot (consumer).** In the Copilot app or website, open Settings, then Personalisation, and paste what the field accepts. **Microsoft 365 Copilot (work):** individual staff usually cannot set an organisational system prompt; send your template to whoever administers Microsoft 365 and ask for it to be configured centrally (Copilot Studio or admin prompt settings). That is a feature: one version of the truth for the whole team.

**Local (Ollama / LM Studio).** In LM Studio's chat panel, expand the settings on the right and paste the template into the System prompt field; it applies to that chat and can be saved with the preset. In Ollama itself, the system prompt is set per session or in a Modelfile; most people use a front-end app that gives you the box. Advantage: your instructions and everything else stay on your machine.

## Writing your own: the five-part formula

Every template above has the same skeleton, and yours should too: (1) identity, who we are, in one sentence; (2) audience, who we write to; (3) tone, three or four concrete rules, not adjectives like "professional"; (4) formats, your default lengths and structures per task type; (5) never rules, the bright lines: no invented prices, no advice beyond your licence, no compliance language from memory, say "I'm not sure" instead of guessing. Keep it under about 250 words; a system prompt is a briefing, not a novel, and every token of it sits on the model's desk in every conversation.

## Testing it

After installing, run the same three test prompts you would have run before: draft a customer email, summarise a document, write a social post. Compare against your memory of the old defaults. Then break it deliberately: ask for something the never-rules forbid ("quote a price for this job") and confirm it asks you for the figures instead of inventing them. If it invents them, strengthen that line in the template. This ten-minute test is worth more than any prompt-engineering course.
