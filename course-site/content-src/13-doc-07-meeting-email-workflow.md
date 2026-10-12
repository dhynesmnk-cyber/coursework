# Document 7: Meeting and Email Workflow Guide

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** Microsoft 365 Copilot (Outlook, Teams, Word), Gemini in Google Workspace (Gmail, Meet, Docs) and NotebookLM, ChatGPT, Claude, and any local tool. The workflow is the same everywhere; the notes say which tool suits which step.
**Version:** October 2026.

This is a repeatable five-step workflow: prep, capture, clean, extract, follow up. Run it the same way every time and it stops being "using AI" and starts being "how we do meetings." Steps marked with **[HUMAN]** are where judgement must stay with a person. Those are not caveats; they are the process.

---

## Step 1: Prep (10 minutes before the meeting)

**The prompt:**
> I have a meeting at [time] with [who, their role/relationship]. Purpose: [e.g. quarterly review of the cleaning contract]. Here is the agenda: [paste]. Here are my notes from last time: [paste]. Give me: (1) a five-bullet briefing on where things stand, (2) the three questions I should make sure get answered, (3) any obvious gaps in the agenda.

**Tool notes.** Microsoft 365 Copilot is strongest here if your history lives in Outlook and Teams: ask it directly ("Prepare me for my 2pm with Bayside Dental using our past emails and the last meeting recap") and it works across your mail and calendar with your existing permissions. Gemini does the equivalent across Gmail and Calendar in Workspace. ChatGPT or Claude work well with pasted material and are the right choice when the meeting involves sensitive commercial material and you are on their business tiers, or when you use a local tool.

**[HUMAN]** You decide the three questions that actually matter. The tool's suggestions are a checklist prompt, not the strategy.

## Step 2: Capture (during the meeting)

Option A, automatic: Teams (with Copilot) and Google Meet (with Gemini, on eligible Workspace plans) can record and transcribe with everyone's knowledge. Turn it on only with participants' awareness; recording laws in Australia require consent of the parties, and "the AI was listening" is not a consent conversation to have after the fact.

Option B, manual (works everywhere, including the café): keep a scratch document open and type rough notes without punctuation or mercy. Names, numbers, decisions, who-said-what matters. Do not try to write prose during a meeting; prose is Step 3's job. Voice dictation into your phone's notes app works too.

**[HUMAN]** Nothing leaves the room yet. Raw notes may contain unguarded comments; that is what Step 3's edit is for.

## Step 3: Clean (within a day, while memory is fresh)

**The prompt:**
> These are rough notes from [meeting, date, attendees]: [paste]. Rewrite as clean minutes: short opening line (purpose, attendees, date), then Decisions, then Discussion points (three to six bullets), then Open questions. Use only what is in the notes. Remove side comments and anything that reads as a personal remark about an attendee. Keep it under one page. Mark anything ambiguous [UNCLEAR].

**Tool notes.** Claude and ChatGPT both do this well from pasted notes. Copilot in Word, or in Teams next to the transcript, keeps everything inside the Microsoft ecosystem (which matters if your business runs on it: work-account content is not used to train foundation models). Gemini in Docs, or NotebookLM with the transcript as a source, is the Google-shop equivalent. If the transcript came from Teams/Meet, Copilot/Gemini can summarise the transcript directly and you skip the paste.

**[HUMAN]** Read the cleaned minutes fully before they go anywhere. Check every name, number and date. Fix the [UNCLEAR] items yourself. You are the one who was in the room; the tool was not.

## Step 4: Extract actions

**The prompt:**
> From these minutes: [paste cleaned version]. Produce an action list as a table: Action / Owner / Due date / Source (which decision or discussion point it came from). If an owner or date is not stated in the minutes, write [ASSIGN] or [DATE?] instead of inventing one. Then list anything raised in discussion that has no action and no decision attached, so I can decide if it needs one.

**Tool notes.** Any platform handles this; it is pure restructuring. The value is in the last sentence: the "orphan items" list catches the things that meetings actually lose. If actions land in your task system (Planner, Asana, Trello and friends all have AI integrations now), have the tool format the output to match how you enter tasks there.

**[HUMAN]** Owners and dates get confirmed with the actual humans before the list is published. An action item assigned by a language model to someone who never agreed to it is how trust in the whole system dies in week two.

## Step 5: Follow-up emails (same day or next morning)

**The prompt (one per recipient, or one combined):**
> Draft a follow-up email to [name] from [meeting]. Tone: [warm and brief / formal]. Include: thanks, the two or three decisions relevant to them, their action items with dates, and anything I owe them with my dates. Here are the minutes: [paste]. Max 120 words. Nothing that is not in the minutes.

**Tool notes.** Copilot inside Outlook drafts directly in your mail with the thread and calendar context, which is the smoothest experience if you are a Microsoft shop; Gemini's "Help me write" in Gmail is the Google equivalent. Otherwise paste into ChatGPT or Claude and copy the result back. For the recurring follow-ups (same client, same weekly meeting), save the prompt in your platform's Project/Gem/custom instructions so Step 5 is two clicks.

**[HUMAN]** Final read before send, every time, no exceptions, forever. Check the promises the email makes on your behalf: dates you can hit, prices that are current, commitments that were actually agreed. The email has your name on it, and in the Air Canada case, the organisation's name on the machine's words was enough to make the organisation liable.

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

Sensitive meetings (disciplinary, M&A, health information, legally privileged): use your contracted business-tier or local tools only, or do the cleaning manually. Client-facing minutes: your edit is the deliverable, the tool's draft is scaffolding; some clients contractually restrict AI use, which your policy owner tracks (Document 3, section 4). And recording: consent first, always, in the room, out loud.
