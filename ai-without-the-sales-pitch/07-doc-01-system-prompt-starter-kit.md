# Document 1: System Prompt Starter Kit

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and Gems (Google), Copilot (Microsoft), and local tools such as Ollama and LM Studio running Meta's Llama or similar open models.
**Version:** October 2026. Interfaces change; the concepts do not.

---

## In plain terms

A system prompt is a short standing briefing that your AI tool reads before every request, so you stop repeating yourself. Write it once, paste it into the right setting, and every draft starts closer to how your business actually talks.

## What a system prompt is

Picture the laminated card you'd leave on a new temp's desk: who we are, who our customers are, how we write, and the things we never do. They read it every morning without being asked.

A system prompt is that card for your AI tool. You still type your request as usual. The system prompt is written once and quietly placed in front of every request, and the tool treats it as more important than any single message. That makes it the right place for the rules you're tired of repeating: who your business is, how you want things written, and what the tool must never do.

The difference from a real temp: this one never forgets the card, and never takes a sickie.

## Why it matters

Without one, every chat starts from zero. The tool guesses your tone, your audience and your habits, and you spend your first three messages correcting it. With a good system prompt, the first draft lands much closer to usable. It's the cheapest, fastest quality upgrade in any of these products, and almost nobody uses it properly.

**What it can't do:** a system prompt can't make the tool know more, and it can't stop it inventing facts. It shapes behaviour, tone, format and priorities. You still check the output.

**Why it should be short:** the card sits on the model's desk in every conversation, taking up space. Keep it to a briefing, not a novel. About 250 words is plenty.

## What it's called on each platform

Every product has this feature under a different name.

| Platform | What the feature is called | Where it lives (as at October 2026) |
|---|---|---|
| ChatGPT | Custom instructions, plus per-Project instructions | Settings, then Personalisation, then Custom instructions. Two boxes: "What would you like ChatGPT to know about you?" and "How would you like ChatGPT to respond?". Separately: any Project you create has its own instructions box that applies only inside that Project. |
| Claude | Profile / personal instructions, plus per-Project custom instructions | Settings, then Profile, "What personal preferences should Claude consider in responses?" Projects: open the Project, then the instructions field in Project settings. |
| Gemini | Personal context, plus Gems (custom assistants) | Settings, then Personal context (a single "what should Gemini know" box). Gems: create a Gem and paste your system prompt into its instructions; that Gem then behaves that way every time you open it. |
| Copilot (consumer) | Personalisation / preferred responses | In the Copilot app or copilot.microsoft.com: Settings, then Personalisation. |
| Microsoft 365 Copilot (work account) | Usually set by your IT admin; users get limited personal preferences | Admins can configure organisational prompts and agents in the Microsoft 365 admin centre and Copilot Studio. Individual staff typically cannot override them, which is the point. |
| Workspace (Gemini in Gmail/Docs) | No user system prompt inside Gmail/Docs drafting; use Gems for standing behaviour | Create a Gem with your template, or paste your instructions at the top of a "Help me write" prompt. |
| Ollama / LM Studio (local models) | System prompt field in the chat settings | LM Studio: the chat screen has a system prompt box on the right-hand settings panel. Ollama: pass a system prompt when you run the model, or use any front-end app that exposes the field. |

**Differences worth knowing:**

- **ChatGPT's custom instructions apply to every chat.** Handy, but annoying when you want work and personal kept apart. Use a Project for work.
- **Claude's Projects** are the strongest way to keep business contexts separate: one Project per type of client, each with its own instructions and files. Think of them as separate filing drawers.
- **Gems** are the same idea in Google's world, and live inside your Google account.
- **Microsoft 365 Copilot** deliberately gives standing instructions to your organisation's admin rather than to each person. That's good governance (one version of the truth for the whole team), and occasionally frustrating.

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

**ChatGPT.** Open Settings (your profile picture or name: bottom left on the web, top right on mobile). Choose Personalisation, then Custom instructions. Paste the template into the second box ("How would you like ChatGPT to respond?"), and put one or two lines about your business into the first box. Save.

For a dedicated work space, create a Project (sidebar, plus button), open its settings, and paste the full template into Project instructions. Files you add to that Project stay available to every chat inside it. On consumer plans, also check Settings, Data controls, and turn off model training if you haven't already.

**Claude.** Open Settings, then Profile. Paste your template into the personal preferences field. To keep contexts separate, create a Project (sidebar), open Project settings, and paste the template into the Project's custom instructions. Add reference files to the Project knowledge as needed.

**Gemini.** Two options.
- *Quick:* Settings, Personal context. Paste a shortened version, because this field is smaller than a full template. Keep the identity line and the top five rules.
- *Better for business:* go to Gems (sidebar, or gemini.google.com), create a Gem, name it something like "[Business] assistant", paste the full template as its instructions, and use that Gem for work tasks. Workspace users can also use the same Gems inside Google apps, depending on plan.

**Copilot (consumer).** In the Copilot app or website, open Settings, then Personalisation, and paste what the field accepts.

**Microsoft 365 Copilot (work).** Individual staff usually can't set an organisation-wide system prompt. Send your template to whoever looks after Microsoft 365 and ask for it to be set up centrally (in Copilot Studio or the admin prompt settings). That's a feature, not a bug: one version of the truth for the whole team.

**Local (Ollama / LM Studio).** In LM Studio's chat screen, open the settings panel on the right and paste the template into the System prompt field. It applies to that chat and can be saved with the preset. In Ollama itself, the system prompt is set per session or in a settings file called a Modelfile; most people use a front-end app that gives them the box. Bonus: your instructions, like everything else, stay on your machine.

## Writing your own: the five-part formula

Every template above has the same skeleton. Yours should too:

1. **Identity.** Who we are, in one sentence.
2. **Audience.** Who we write to.
3. **Tone.** Three or four concrete rules, not adjectives. "Short sentences, no exclamation marks" works. "Professional" doesn't, because the tool has to guess what you mean by it.
4. **Formats.** Your default length and layout for each type of task.
5. **Never rules.** The bright lines: no invented prices, no advice beyond your licence, no compliance wording from memory, and "say you're not sure" instead of guessing.

Keep it under about 250 words. Remember that it sits on the desk in every conversation.

## Testing it

After installing, run three everyday tasks: draft a customer email, summarise a document, write a social post. Compare them with what you used to get.

Then try to break it on purpose. Ask for something your never-rules forbid, such as "quote a price for this job", and check that it asks you for the figures instead of inventing them. If it invents them, strengthen that line in the template. This ten-minute test is worth more than any prompt-engineering course.
