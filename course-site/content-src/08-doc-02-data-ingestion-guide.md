# Document 2: How to Show Your AI Stuff (Data Ingestion Guide)

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and NotebookLM (Google), Copilot and Microsoft 365 Copilot (Microsoft), and local tools (Ollama, LM Studio) with any chat front-end that accepts files.
**Version:** October 2026.

---

## The one idea behind all of this

A model only knows what is on its desk right now. "Showing your AI stuff" means putting the right material on that desk: your price list, the client's email, last year's report, the policy document. Every feature in this guide (paste, upload, projects, connectors, knowledge bases) is just a different way of getting material onto the desk, with different lifespans and different reach.

Before you show it anything, apply the decision drill from Class 3: does this material contain personal information, secrets, or anything under NDA? If yes, use a business-tier tool, a contracted Microsoft/Google ecosystem tool, or a local tool. Consumer free tiers are for material you would not mind a stranger reading, because you cannot fully un-send it.

## The four ways to give a tool context

**1. Pasting into the chat.** The oldest and most reliable method. Copy the text, paste it, done. It is on the desk immediately, in full, exactly as you gave it. Downsides: it vanishes when the chat ends, very long pastes eat the desk (the context window) and can push earlier conversation off the edge, and formatting (tables especially) can get mangled. Best for: one-off material under a few pages.

**2. Uploading a file to the chat.** The paperclip or plus button. The product converts your file to text (and for images, describes or reads them) and puts it on the desk. Good for PDFs, Word files, spreadsheets, and photos of documents. Know what happens underneath: text is extracted, which is near-perfect for clean digital documents, lossy for tables and diagrams, and dependent on OCR (optical character recognition, software that reads pictures of text) for scans and photos, which can misread. Very large files may be processed in slices rather than all at once, so "read this 300-page PDF and tell me everything" can quietly become "read part of it." Ask pointed questions about specific sections and you get much better results.

**3. Adding to a Project, Gem, Notebook or knowledge base.** The persistent option. ChatGPT Projects, Claude Projects, Google Gems and NotebookLM, and SharePoint-backed Microsoft 365 Copilot all let you attach files and instructions once, and every conversation in that space can draw on them. Under the hood, most products do not keep the whole library on the desk at all times; they search it and place the relevant slices per question (retrieval). Practical consequences: excellent for a standing body of material (your policies, your product catalogue, your templates); slightly less literal than a direct paste, so for the one document that matters most in this moment, also paste or attach it directly to the chat and say "use the attached version as the authority."

**4. Connecting live data sources.** The products increasingly plug into your world: Microsoft 365 Copilot reads your Outlook, Teams, Word, Excel and SharePoint content (respecting the permissions already set, which is its big advantage); Gemini can work across Gmail, Drive, Docs and Calendar for Workspace accounts; ChatGPT and Claude offer connectors and integrations for Drive, Gmail, SharePoint and common business apps on some tiers. Powerful and convenient, and it widens the data question from "what did I paste" to "what can the tool reach." Turn on only the connections you actually use, prefer work accounts with admin controls, and remember the connector inherits your permissions, so anything you can see, it can see, including that spreadsheet you forgot you had access to.

## "I pasted it into the chat" versus "I uploaded it to a project": the honest comparison

| | Pasted into a chat | Uploaded to this chat | In a Project / Gem / Notebook | Live connector |
|---|---|---|---|---|
| Lifespan | This conversation only | This conversation only | The workspace, across conversations | Ongoing, live |
| Fidelity | Exactly what you gave | Text-extracted; tables and scans can degrade | Extracted plus retrieval; may quote indirectly | Depends on the app |
| Best for | The one crucial document, right now | PDFs, photos, spreadsheets for a task | Standing reference: policies, catalogues, templates | Working where your data already lives |
| Risk to manage | Chat history retention | Same, plus file stored in vendor systems | Everything in the space is reachable by everyone in the space (shared projects especially) | Scope creep: it can reach more than you think |

The common beginner mistake is trusting a big library connection when a small precise paste would do, and the common advanced mistake is pasting the same 20-page document into every new chat instead of putting it in a Project once. Use the library for standing material and the paste for today's authority.

## What the tools can and cannot actually do with your files

**Can:** extract and read text from documents; read tables from spreadsheets into a workable form (imperfectly); read text in images via OCR; answer questions grounded in what you gave them; summarise, compare and restructure your material; in the coding products, work across whole codebases.

**Cannot (reliably, in 2026):** keep perfect track of every number across a huge spreadsheet (they are pattern-matchers, not calculators; for arithmetic, ask them to write a formula or code, then check it); preserve the exact visual layout of your documents; understand diagrams and floor plans the way a human in your trade does; know which of two conflicting uploaded documents is current unless you tell it; remember anything across chats except through the persistence features above (and "memory" features store notes about you as text, which is Document 9's subject); guarantee nothing from your file was looked at by vendor systems for safety or abuse review under their policies, which is why tier choice matters more than any setting inside the chat.

## File formats that work well, and formats that fight back

Work well: plain text, Markdown, clean Word documents, PDFs generated from software (not photographed), CSV exports from spreadsheets, screenshots with clear text. Fight back: multi-column PDFs (text extraction can interleave columns), scanned documents at low quality, complex Excel files with merged cells, formulas and multiple sheets (upload a CSV export of just the data you need instead), PowerPoint decks heavy on graphics, and anything password-protected. When a file fights back, copy the relevant text out and paste it. Boring, effective, always works.

## The pre-session checklist

Five minutes before a working session with an AI tool. Print it, live by it.

1. **Objective in one sentence.** What do I want to walk away with? ("A draft quote email," not "some help with the Johnson job.")
2. **Gather the material.** The documents, numbers, emails and policies the task actually needs. If the tool has to guess, the tool will invent.
3. **Sensitivity screen.** Personal information? Secrets? NDA? If yes: business tier, Workspace/Microsoft ecosystem, or local tool. If unsure: redact first (names to initials, prices to placeholders you swap back later).
4. **Pick the right persistence.** One-off task: paste or attach to a fresh chat. Recurring task: check the right Project/Gem exists and has current files in it. Delete or replace stale files in that space; old price lists in a knowledge base produce confidently wrong quotes.
5. **Write the prompt in four parts.** Role, task, material, constraints (length, tone, format, what to avoid, what to do when unsure). Document 4 has the patterns.
6. **Set the check standard.** Decide now what you will verify in the output: every name, number, date, price and quoted policy. Write "[VERIFY]" instructions into the prompt if it helps.
7. **Fresh chat for fresh tasks.** Long threads degrade as the desk overflows. Start a new chat, let the Project carry the context.

## After the session

Save the useful output somewhere you own (your documents, not the chat history, which is not a filing system). If the session revealed a gap in your standing material (the tool needed your refund policy and no Project had it), add that file to the Project now. If anything sensitive was pasted by mistake, follow Document 10's first checklist the same day.
