# Document 2: How to Show Your AI Stuff (Data Ingestion Guide)

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and NotebookLM (Google), Copilot and Microsoft 365 Copilot (Microsoft), and local tools (Ollama, LM Studio) with any chat front-end that accepts files.
**Version:** October 2026.

---

## In plain terms

An AI tool only knows what you put in front of it right now. There are four ways to put things in front of it, from handing over one page to giving it a key to your filing room. Pick the smallest one that does the job, and screen for anything sensitive first.

## The one idea behind all of this

A model only knows what's on its desk right now. "Showing your AI stuff" just means putting the right material on that desk: your price list, the client's email, last year's report, the policy document.

Every feature in this guide (pasting, uploading, projects, connectors, knowledge bases) is a different way of getting material onto the desk. They differ in how long the material stays there and how much the tool can reach.

**Before you show it anything,** run the decision drill from Class 3: does this contain personal information, secrets, or anything under a non-disclosure agreement? If yes, use a business-tier tool, a contracted Microsoft or Google work account, or a local tool. Free consumer accounts are for material you wouldn't mind a stranger reading, because you can't fully un-send it.

## The four ways to give a tool context

Think of how you'd give information to a temp.

**1. Pasting into the chat: handing over one sheet of paper.** The oldest and most reliable method. Copy the text, paste it, done. It's on the desk straight away, all of it, exactly as you gave it.
- *Downsides:* it's gone when the chat ends. Very long pastes take up desk space and can push earlier parts of the conversation off the edge. Formatting, especially tables, can get scrambled.
- *Best for:* one-off material under a few pages.

**2. Uploading a file to the chat: handing over a folder.** The paperclip or plus button. The product turns your file into text (and for images, describes or reads them) and puts it on the desk. Good for PDFs, Word files, spreadsheets and photos of documents.
- *What happens underneath:* the text is pulled out of the file. That's near-perfect for clean digital documents and patchy for tables and diagrams. For scans and photos, the tool has to read a picture of text, which is called **OCR** (optical character recognition). Like reading a faded fax, it can misread.
- *Big files get skimmed:* very large files may be read in slices rather than all at once, so "read this 300-page PDF and tell me everything" can quietly become "read part of it". Ask pointed questions about specific sections and you'll get much better results.

**3. Adding to a Project, Gem, Notebook or knowledge base: the office library.** The long-term option. ChatGPT Projects, Claude Projects, Google Gems and NotebookLM, and Microsoft 365 Copilot over SharePoint all let you add files and instructions once, and every conversation in that space can use them.
- *What happens underneath:* most products don't keep the whole library on the desk at once. For each question, a librarian fetches the relevant pages and puts just those on the desk. That's called **retrieval**.
- *What that means for you:* excellent for a standing body of material, such as your policies, product catalogue and templates. It's slightly less exact than a direct paste, so for the one document that matters most right now, also paste or attach it to the chat and say "use the attached version as the authority".

**4. Connecting live data sources: giving it a key to your filing room.** The products increasingly plug straight into your systems:
- Microsoft 365 Copilot reads your Outlook, Teams, Word, Excel and SharePoint content, respecting the permissions already set. That's its big advantage.
- Gemini can work across Gmail, Drive, Docs and Calendar for Workspace accounts.
- ChatGPT and Claude offer connectors for Drive, Gmail, SharePoint and common business apps on some tiers.

It's powerful and convenient, and it changes the question from "what did I paste?" to "what can the tool reach?". The key opens every door your own key opens, including that spreadsheet you forgot you had access to. Turn on only the connections you actually use, and prefer work accounts with admin controls.

## Side by side

| | Pasted into a chat | Uploaded to this chat | In a Project / Gem / Notebook | Live connector |
|---|---|---|---|---|
| Lifespan | This conversation only | This conversation only | The workspace, across conversations | Ongoing, live |
| Fidelity | Exactly what you gave | Text-extracted; tables and scans can degrade | Extracted plus retrieval; may quote indirectly | Depends on the app |
| Best for | The one crucial document, right now | PDFs, photos, spreadsheets for a task | Standing reference: policies, catalogues, templates | Working where your data already lives |
| Risk to manage | Chat history retention | Same, plus file stored in vendor systems | Everything in the space is reachable by everyone in the space (shared projects especially) | Scope creep: it can reach more than you think |

The common beginner mistake is connecting a whole library when one precise paste would do. The common advanced mistake is pasting the same 20-page document into every new chat instead of putting it in a Project once. Rule of thumb: the library for standing material, a pasted page for today's facts.

## What the tools can and can't do with your files

**They can:**
- Pull out and read the text in documents.
- Read tables from spreadsheets into a usable form, imperfectly.
- Read text in images, using OCR.
- Answer questions based on what you gave them.
- Summarise, compare and reorganise your material.
- In the coding products, work across a whole software project.

**They can't, reliably, in 2026:**
- **Keep perfect track of every number in a huge spreadsheet.** They predict words, they don't calculate. For maths, ask for a formula or a small program, then check it.
- **Keep the exact look of your documents.** Layout gets lost when files become text.
- **Read diagrams and floor plans the way someone in your trade does.**
- **Know which of two conflicting documents is current,** unless you tell them.
- **Remember anything between chats,** except through the long-term features above. ("Memory" features store notes about you as text; that's Document 9.)
- **Guarantee your file was never looked at by the vendor's safety systems** under their policies. That's why choosing the right account tier matters more than any setting inside the chat.

## File formats that work well, and formats that fight back

**Work well:** plain text, clean Word documents, PDFs made by software (not photographed), CSV exports from spreadsheets, and screenshots with clear text.

**Fight back:**
- PDFs with several columns (the text can get shuffled between columns).
- Low-quality scans.
- Complex Excel files with merged cells, formulas and several sheets. Export just the data you need as a CSV instead.
- PowerPoint decks that are mostly pictures.
- Anything password-protected.

When a file fights back, copy the relevant text out and paste it. Boring, effective, always works.

## The pre-session checklist

Five minutes before a working session with an AI tool. Print it, and live by it.

1. **Objective in one sentence.** What do I want to walk away with? "A draft quote email", not "some help with the Johnson job".
2. **Gather the material.** The documents, numbers, emails and policies the task actually needs. If the tool has to guess, it will invent.
3. **Sensitivity screen.** Personal information? Secrets? Under NDA? If yes: business tier, Microsoft or Google work account, or local tool. If unsure, remove the sensitive parts first: names to initials, prices to placeholders you swap back later.
4. **Pick how long it should stay.** One-off task: paste or attach to a fresh chat. Recurring task: check the right Project or Gem exists and has current files in it. Delete or replace out-of-date files in that space. An old price list in the library produces confidently wrong quotes.
5. **Write the request in four parts.** Role, task, material, constraints (length, tone, format, what to avoid, what to do when unsure). Document 4 has the patterns.
6. **Decide what you'll check.** Every name, number, date, price and quoted policy. Write "[VERIFY]" instructions into the request if it helps.
7. **Fresh chat for a fresh task.** Long threads get worse as the desk overflows. Start a new chat, and let the Project carry the background material.

## After the session

- **Save the useful output somewhere you own,** such as your documents folder. Chat history isn't a filing system.
- **Fill the gap.** If the session showed something missing from your standing material (say, the tool needed your refund policy and no Project had it), add that file to the Project now.
- **If anything sensitive was pasted by mistake,** follow Document 10's first checklist the same day.
