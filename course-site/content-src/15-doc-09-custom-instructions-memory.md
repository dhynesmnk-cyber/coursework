# Document 9: Custom Instructions and Memory: Setup Guide

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Copilot (Microsoft), and local tools (LM Studio, Ollama).
**Version:** October 2026. Menus move; if a step below does not match your screen, look for the nearest label in Settings containing "personalisation", "memory", "profile" or "context".

---

## First, what "memory" actually is (thirty seconds of honesty)

When these products say the AI "remembers you," here is the mechanism: the product stores ordinary text about you, either facts it extracted from your conversations ("runs a plumbing business in Geelong; prefers short emails") or notes you wrote yourself, and it pastes that text into the system prompt area of your future conversations. That is all. The model's numbers are not being adjusted by your chats in the moment; nothing is "learning you" the way a person does. Memory is a saved briefing note that gets replayed, which means you can read it, edit it and delete it like any other text, and you absolutely should, because stale notes ("I'm preparing the March launch") quietly distort future answers. Two separate features hide behind the word: **custom instructions** (text you write deliberately, always applied) and **memory** (text the product writes from your conversations, applied automatically). Set up the first with care; supervise the second.

---

## ChatGPT (OpenAI)

**Custom instructions (yours, deliberate).** Web: click your profile name or icon (bottom left), Settings, Personalisation, Custom instructions. You will see two boxes. Box one, "What would you like ChatGPT to know about you or your work?": put identity and context (business, role, location, the systems you use). Box two, "How would you like ChatGPT to respond?": put your standing rules; paste the matching template from Document 1 here. Save. Mobile: menu icon, your name at top, Personalisation and Custom instructions, same two boxes.

**Memory (it writes, you supervise).** Settings, Personalisation, Memory. Two mechanisms live here: "Saved memories" (explicit facts it decided to keep; each appears as a line of text with a bin icon beside it) and a "Reference chat history" style toggle that lets it draw on past conversations. To review: open Memory settings and read the saved list; you will see plain sentences, which proves the point about what memory is. To delete: bin icon per memory, or "Clear all memories". To stop it forming: switch the memory toggles off. To make it save something deliberately, say in chat "Remember that our quotes are valid for 30 days" and check it appears in the list.

**Projects.** Sidebar, New project. Each project has its own instructions box and file area, and its chats can be excluded from the memory of the rest of your account depending on settings. Best practice for work: one project per recurring domain (Quotes, Marketing, Admin), instructions pasted from Document 1, standing reference files added per Document 2.

**Consumer-tier warning:** if you are on Free or Plus, also check Settings, Data controls, and turn off model training. On Business/Enterprise plans, memory and training are governed by the organisation's admin settings and the contract.

## Claude (Anthropic)

**Profile / personal preferences (yours, deliberate).** Web or app: your initial or name (top corner), Settings, Profile. In the field asking what personal preferences Claude should consider, paste your identity lines and rules (Document 1 template). This applies across your chats.

**Projects (the workhorse).** Sidebar, New project. Open the project, then its settings: a custom instructions field (paste the full Document 1 template for that context) and a Project knowledge area where uploaded files persist and are available to every chat in the project. Claude's Projects are the cleanest "separate brain per business context" setup of the major products: one project per client type, one per recurring task.

**Memory.** Claude offers memory features on some plans (it can build summaries of past conversations and carry context forward). Look under Settings for Memory or in a chat's tools menu. The supervision rules are identical: open it, read what it stored as plain text, delete what is stale, and be aware that on consumer plans the training and retention choices from Document 5 interact with how long anything is kept (default retention about 30 days; up to five years if you opted in to training, so do not opt in at work). On Team/Enterprise plans, memory behaviour is controlled by your organisation's admin and your content is not used for training.

## Gemini (Google)

**Personal context (yours, deliberate).** gemini.google.com or the app: Settings (gear), look for Personal context / "What should Gemini know about you" (Google has also labelled this Saved info). Paste a condensed version of your template: the field favours brevity, so identity plus your five most important rules.

**Gems (standing assistants).** Sidebar, Gems (or gemini.google.com/gems), New Gem. Name it ("[Business] assistant"), paste the full Document 1 template into its instructions. Every conversation started inside that Gem follows the template. Create one Gem per major context; this is Google's equivalent of Projects and, for business use, the better half of Gemini. Workspace users: depending on plan, Gems and the same personal context are available inside Gmail, Docs and Meet.

**Memory / activity.** Gemini's ability to draw on your past chats and your Google apps is governed by Gemini Apps Activity (Settings, then the Activity page): if it is on, prompts are saved to your Google Account and can inform personalisation and, per Document 5, may feed product improvement; if it is off, chats are not saved to your account history. Review what is stored on the Activity page, delete individual items or bulk-delete there, and for work purposes the recommended setting is off unless your Workspace admin has set the business defaults, in which case Workspace protections apply and consumer-style activity concerns mostly do not.

**NotebookLM (bonus, and excellent).** notebooklm.google.com: create a notebook, upload your sources (documents, PDFs, links), and every answer is grounded strictly in those sources with citations you can click. For "answer only from my documents" work (policies, contracts, manuals), it is the strongest consumer-accessible tool in Google's range, and for business use sits under your Workspace account.

## Copilot (Microsoft)

**Consumer Copilot (personal Microsoft account).** In the Copilot app or copilot.microsoft.com: Settings, Personalisation, and enter your preferences; there is also a Memory-style feature storing facts from your chats, reviewable and deletable in the same settings area, plus conversation history management under Microsoft privacy dashboard (privacy.microsoft.com). As per Document 5, check the product-improvement/data-sharing toggles here too.

**Microsoft 365 Copilot (work account).** Individual personalisation is limited by design. The organisation-level equivalent of a system prompt is configured by your IT admin (organisational prompts and custom agents via the Microsoft 365 admin centre and Copilot Studio), and "memory" of your work context comes instead from the Microsoft Graph: Copilot can see the mail, files, chats and calendar you can see, under the permissions already in place. What an employee should do: send your Document 1 template to your admin and ask whether it can be applied organisation-wide; then in day-to-day use, rely on the fact that with a work account your prompts are not used to train foundation models. Reviewing "what it knows" in this ecosystem means reviewing your actual Microsoft 365 permissions with your admin, which is a good idea regardless of AI.

## Local tools (Ollama, LM Studio)

There is no vendor memory because there is no vendor; persistence is whatever you set up. In LM Studio: the right-hand settings panel of the chat screen has a System prompt box; fill it with your Document 1 template, then save it as a preset so every new chat loads it. Chat history is stored locally on your machine (and you can delete it like any file). In Ollama: system prompts are set per session, via a Modelfile, or through whatever front-end app you use. "Memory" beyond that means your own discipline: keep your reference documents in a folder, paste or attach what you need per session, and your machine stays the only place any of it exists. That is the entire privacy appeal in three sentences.

---

## The maintenance routine (put it in your calendar)

**Monthly, five minutes:** open the memory/review screen of each tool you use (ChatGPT: Settings, Personalisation, Memory. Claude: Settings, Memory/Profile. Gemini: Activity page. Copilot: personalisation settings) and delete anything stale or wrong. Read it as what it is: a briefing note written by a very literal intern.

**Quarterly, with your Document 5 and 6 review:** re-read your custom instructions against how your business actually works now; update the templates; check the training and retention toggles have not been reset by an app update; on shared or admin-managed tools, confirm the organisation's settings still match your policy (Document 3).

**One rule above all:** memory features store text about you in the vendor's systems on consumer tiers. Anything you would not want in that note (a health detail you mentioned once, a client's name, a financial worry) should not be said to a consumer tool in the first place. The delete button is a mop; the decision drill is the tap.
