# Document 7: Meeting and Email Workflow Guide

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** Microsoft 365 Copilot (Outlook, Teams, Word), Gemini in Google Workspace (Gmail, Meet, Docs) and NotebookLM, ChatGPT, Claude, and any local tool. The workflow is the same everywhere; the notes say which tool suits which step.
**Version:** October 2026.

---

## In plain terms

Treat the AI tool as a very fast junior minute-taker. It can turn your scrappy notes into tidy minutes, an action list and follow-up emails in minutes. But it wasn't really in the room, so you check every name, number, date and promise before anything goes out.

## The five steps

Prep, capture, clean, extract, follow up. Run them the same way every time and it stops being "using AI" and becomes "how we do meetings".

Steps marked **[HUMAN]** are where a person must make the call. They're not fine print; they're the process. The junior does the typing. You stay the chair.

---

## Step 1: Prep (10 minutes before the meeting)

**The prompt:**
> I have a meeting at [time] with [who, their role/relationship]. Purpose: [e.g. quarterly review of the cleaning contract]. Here is the agenda: [paste]. Here are my notes from last time: [paste]. Give me: (1) a five-bullet briefing on where things stand, (2) the three questions I should make sure get answered, (3) any obvious gaps in the agenda.

**Tool notes.**
- **Microsoft 365 Copilot** is strongest here if your history lives in Outlook and Teams. Ask it directly ("Prepare me for my 2pm with Bayside Dental using our past emails and the last meeting recap") and it searches your mail and calendar, seeing only what you're allowed to see.
- **Gemini** does the same across Gmail and Calendar in Workspace.
- **ChatGPT or Claude** work well with pasted material. They're the right choice for sensitive commercial meetings if you're on their business tiers, as is a local tool.

**[HUMAN]** You decide the three questions that actually matter. The tool's suggestions are a checklist, not the strategy.

## Step 2: Capture (during the meeting)

**Option A, automatic.** Teams (with Copilot) and Google Meet (with Gemini, on eligible Workspace plans) can record and transcribe the meeting. Only switch it on with everyone's knowledge. Australian recording laws require the consent of the people being recorded, and "the AI was listening" is not a conversation to have afterwards.

**Option B, manual (works anywhere, including the café).** Keep a scratch document open and type rough notes, with no care for spelling or punctuation. What matters: names, numbers, decisions, and who said what. Don't try to write proper sentences during a meeting; that's Step 3's job. Dictating into your phone's notes app works too.

**[HUMAN]** Nothing leaves the room yet. Raw notes may contain offhand comments, and Step 3's edit is where those come out.

## Step 3: Clean (within a day, while memory is fresh)

**The prompt:**
> These are rough notes from [meeting, date, attendees]: [paste]. Rewrite as clean minutes: short opening line (purpose, attendees, date), then Decisions, then Discussion points (three to six bullets), then Open questions. Use only what is in the notes. Remove side comments and anything that reads as a personal remark about an attendee. Keep it under one page. Mark anything ambiguous [UNCLEAR].

**Tool notes.**
- **Claude and ChatGPT** both do this well from pasted notes.
- **Copilot in Word, or in Teams beside the transcript,** keeps everything inside Microsoft. That matters if your business runs on it, because work-account content isn't used to train the underlying models.
- **Gemini in Docs, or NotebookLM** with the transcript as a source, is the Google equivalent.
- If the transcript came from Teams or Meet, Copilot or Gemini can summarise it directly and you skip the paste.

**[HUMAN]** Read the clean minutes in full before they go anywhere. Check every name, number and date, and sort out the [UNCLEAR] items yourself. You were in the room; the tool wasn't.

## Step 4: Extract actions

**The prompt:**
> From these minutes: [paste cleaned version]. Produce an action list as a table: Action / Owner / Due date / Source (which decision or discussion point it came from). If an owner or date is not stated in the minutes, write [ASSIGN] or [DATE?] instead of inventing one. Then list anything raised in discussion that has no action and no decision attached, so I can decide if it needs one.

**Tool notes.** Any platform handles this; it's just reorganising. The real value is the last sentence: the list of "orphan" items catches exactly the things meetings lose. If actions go into a task app (Planner, Asana, Trello and similar all have AI features now), ask the tool to format the list the way you enter tasks there.

**[HUMAN]** Confirm owners and dates with the actual people before the list goes out. An action assigned by a machine to someone who never agreed to it is how trust in the whole system dies in week two.

## Step 5: Follow-up emails (same day or next morning)

**The prompt (one per recipient, or one combined):**
> Draft a follow-up email to [name] from [meeting]. Tone: [warm and brief / formal]. Include: thanks, the two or three decisions relevant to them, their action items with dates, and anything I owe them with my dates. Here are the minutes: [paste]. Max 120 words. Nothing that is not in the minutes.

**Tool notes.**
- **Copilot inside Outlook** drafts directly in your mail with the thread and calendar in view. Smoothest if you run on Microsoft.
- **Gemini's "Help me write" in Gmail** is the Google equivalent.
- Otherwise, paste into **ChatGPT or Claude** and copy the result back.
- For recurring follow-ups (same client, same weekly meeting), save the prompt in your Project, Gem or custom instructions so Step 5 takes two clicks.

**[HUMAN]** A final read before sending. Every time, no exceptions, forever. Check every promise the email makes on your behalf: dates you can hit, prices that are current, commitments that were actually agreed. The email has your name on it. In the Air Canada case from Class 2, the company's name on the chatbot's words was enough to make the company liable.

---

## The weekly rhythm, condensed

| When | What | Tool | Human check |
|---|---|---|---|
| 10 min before | Briefing and three questions | Copilot / Gemini in your ecosystem, or ChatGPT/Claude with pasted notes | You pick the real questions |
| During | Rough capture or consented transcript | Teams/Meet transcription, or your scratch doc | Consent for recording |
| Within a day | Clean minutes | Same ecosystem, or paste to Claude/ChatGPT | Full read; fix names, numbers, dates |
| Same sitting | Action table plus orphan items | Any | Confirm owners and dates with people |
| Same or next day | Follow-up emails | Outlook/Gmail in-place, or paste | Final read before send, always |

## Where this workflow must not go

- **Sensitive meetings** (disciplinary, mergers and acquisitions, health information, legally privileged): contracted business-tier or local tools only, or clean the notes up by hand.
- **Client-facing minutes:** your edit is the finished product; the tool's draft is just scaffolding. Some clients' contracts restrict AI use, and your policy owner keeps track of those (Document 3, section 4).
- **Recording:** consent first, always, in the room, out loud.
