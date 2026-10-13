# Document 9: Custom Instructions and Memory: Setup Guide

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Copilot (Microsoft), and local tools (LM Studio, Ollama).
**Version:** October 2026. Menus move; if a step below does not match your screen, look for the nearest label in Settings containing "personalisation", "memory", "profile" or "context".

---

## In plain terms

When an AI tool "remembers" you, it has simply saved some notes about you as ordinary text and re-reads them at the start of each chat. You can open those notes, fix them and delete them, and you should, once a month. The instructions you write yourself are the ones worth getting right.

## First, what "memory" actually is

Picture the barista at your local café. They keep a sticky note about regular customers: "Sam, flat white, no sugar, runs the plumbing business". Before Sam walks in, they glance at the note. They haven't learned anything deeper about Sam; they've just got a note.

That's what AI "memory" is. The product stores ordinary text about you: either facts it picked out of your conversations ("runs a plumbing business in Geelong; prefers short emails") or notes you wrote yourself. It quietly places that text in front of your future conversations, in the same spot as the system prompt from Class 4. That's all.

**What it isn't:** the model's numbers aren't changing as you chat. Nothing is "getting to know you" the way a person does. Memory is a saved note that gets re-read, which means you can read it, edit it and delete it like any other text. You should, because out-of-date notes ("I'm preparing the March launch") quietly skew future answers.

**Two different features hide behind the word:**
- **Custom instructions:** text you write on purpose, applied every time. The laminated card from Class 4. Set this up carefully.
- **Memory:** text the product writes for itself from your conversations, applied automatically. The barista's sticky notes. Supervise these.

---

## ChatGPT (OpenAI)

**Custom instructions (yours, on purpose).** On the web: click your profile name or icon (bottom left), then Settings, Personalisation, Custom instructions. You'll see two boxes:
- Box one, "What would you like ChatGPT to know about you or your work?": who you are and your context (business, role, location, the systems you use).
- Box two, "How would you like ChatGPT to respond?": your standing rules. Paste the matching Document 1 template here.

Save. On mobile: menu icon, your name at the top, then Personalisation and Custom instructions, with the same two boxes.

**Memory (it writes, you supervise).** Settings, Personalisation, Memory. Two things live here:
- "Saved memories": facts it decided to keep. Each one is a line of text with a bin icon beside it.
- A "Reference chat history" style switch that lets it draw on past conversations.

To review, open Memory settings and read the list. You'll see plain sentences, which proves the point about what memory is. To delete, use the bin icon on each one, or "Clear all memories". To stop new ones forming, switch the memory settings off. To save something on purpose, say in a chat "Remember that our quotes are valid for 30 days", then check it appears in the list.

**Projects.** Sidebar, New project. Each project has its own instructions box and file area, and depending on settings its chats can be kept out of your account's general memory. Best practice for work: one project per recurring area (Quotes, Marketing, Admin), instructions pasted from Document 1, and standing reference files added as Document 2 describes.

**Consumer-tier warning:** on Free or Plus, also check Settings, Data controls, and turn off model training. On Business or Enterprise plans, memory and training are controlled by your organisation's admin and the contract.

## Claude (Anthropic)

**Profile / personal preferences (yours, on purpose).** Web or app: your initial or name (top corner), Settings, Profile. In the field asking what personal preferences Claude should consider, paste your identity lines and rules (Document 1 template). This applies across your chats.

**Projects (the workhorse).** Sidebar, New project. Open the project, then its settings. You'll find a custom instructions field (paste the full Document 1 template for that context) and a Project knowledge area, where uploaded files stay available to every chat in the project. Claude's Projects are the cleanest "separate filing drawer for each part of the business" setup among the major products: one project per type of client, one per recurring task.

**Memory.** Claude offers memory features on some plans: it can build summaries of past conversations and carry context forward. Look under Settings for Memory, or in a chat's tools menu. The supervision rules are the same: open it, read what it stored as plain text, delete what's out of date.

On consumer plans, the training and retention choices from Document 5 affect how long anything is kept: about 30 days by default, and up to five years if you opted in to training, so don't opt in at work. On Team or Enterprise plans, memory is controlled by your organisation's admin and your content isn't used for training.

## Gemini (Google)

**Personal context (yours, on purpose).** gemini.google.com or the app: Settings (gear icon), then look for Personal context or "What should Gemini know about you" (Google has also called this Saved info). Paste a shortened version of your template. The field rewards brevity: who you are, plus your five most important rules.

**Gems (standing assistants).** Sidebar, Gems (or gemini.google.com/gems), New Gem. Name it ("[Business] assistant") and paste the full Document 1 template into its instructions. Every conversation started inside that Gem follows the template. Create one Gem per major area of work. This is Google's equivalent of Projects and, for business use, the better half of Gemini. Workspace users: depending on plan, Gems and personal context are also available inside Gmail, Docs and Meet.

**Memory / activity.** Gemini's ability to draw on your past chats and your Google apps is controlled by Gemini Apps Activity (Settings, then the Activity page).
- **On:** prompts are saved to your Google Account, can shape personalisation and, as Document 5 explains, may feed product improvement.
- **Off:** chats aren't saved to your account history.

Review what's stored on the Activity page, and delete items one at a time or in bulk there. For work, the recommended setting is off, unless your Workspace admin has set business defaults, in which case Workspace protections apply and the consumer concerns mostly don't.

**NotebookLM (bonus, and excellent).** notebooklm.google.com: create a notebook, upload your sources (documents, PDFs, links), and every answer is based strictly on those sources, with references you can click to check. It's an open-book exam the tool can't cheat on. For "answer only from my documents" work (policies, contracts, manuals) it's the strongest easily available tool in Google's range, and for business use it sits under your Workspace account.

## Copilot (Microsoft)

**Consumer Copilot (personal Microsoft account).** In the Copilot app or copilot.microsoft.com: Settings, Personalisation, and enter your preferences. There's also a memory-style feature that stores facts from your chats, which you can review and delete in the same settings area, plus conversation history management in the Microsoft privacy dashboard (privacy.microsoft.com). As Document 5 says, check the product-improvement and data-sharing switches here too.

**Microsoft 365 Copilot (work account).** Personal settings are limited on purpose.
- **The standing briefing** is set for the whole organisation by your IT admin (organisational prompts and custom agents, through the Microsoft 365 admin centre and Copilot Studio).
- **"Memory" of your work** comes from something else entirely: Copilot can see the mail, files, chats and calendar you can see, within the permissions already in place.

What to do as an employee: send your Document 1 template to your admin and ask whether it can be applied for everyone. Day to day, you can rely on the fact that with a work account, your prompts aren't used to train the underlying models. Checking "what it knows" in this world means checking your actual Microsoft 365 permissions with your admin, which is a good idea regardless of AI.

## Local tools (Ollama, LM Studio)

There's no vendor memory because there's no vendor. It remembers whatever you set up.

- **LM Studio:** the settings panel on the right of the chat screen has a System prompt box. Fill it with your Document 1 template, then save it as a preset so every new chat loads it. Chat history is stored on your own computer, and you can delete it like any file.
- **Ollama:** system prompts are set per session, in a settings file called a Modelfile, or through whatever front-end app you use.

Anything beyond that is your own habit: keep your reference documents in a folder, paste or attach what you need each session, and your computer stays the only place any of it exists. That's the whole privacy appeal in one sentence.

---

## The maintenance routine (put it in your calendar)

**Monthly, five minutes:** open the memory or review screen of each tool you use (ChatGPT: Settings, Personalisation, Memory. Claude: Settings, Memory/Profile. Gemini: the Activity page. Copilot: personalisation settings) and delete anything out of date or wrong. Read it for what it is: sticky notes written by a very literal intern.

**Quarterly, with your Document 5 and 6 review:**
- re-read your custom instructions against how your business actually works now, and update the templates;
- check that an app update hasn't switched the training and retention settings back on;
- on shared or admin-managed tools, confirm the organisation's settings still match your policy (Document 3).

**One rule above all:** on consumer tiers, memory features store notes about you on the vendor's computers. Anything you wouldn't want on that note (a health detail you mentioned once, a client's name, a money worry) shouldn't be said to a consumer tool in the first place. The delete button is a mop; the decision drill is the tap.
