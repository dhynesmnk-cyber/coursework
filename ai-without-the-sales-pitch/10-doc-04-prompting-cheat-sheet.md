# Document 4: Prompting Cheat Sheet for Daily Tasks

**Part of the "AI Without the Sales Pitch" participant pack. One page, pin it up.**
**Applies to:** ChatGPT, Claude, Gemini, Copilot, and any local model chat (Ollama, LM Studio).
**Version:** October 2026.

**The universal pattern:** Role + Task + Material + Constraints. Give it the ingredients and the limits, and the pattern-matcher has less room to invent.

---

## 1. Drafting emails

**Pattern A (the situation):**
> Draft an email to [name] at [business]. Situation: [facts, dates, amounts]. Goal: [what you want to happen]. Tone: [friendly/firm]. Max [X] words. Don't apologise unless the facts warrant it. End with a clear next step.

**Pattern B (the reply):**
> Here is the email I received: [paste]. Draft a reply that: [answers their question / declines the request / buys time until Friday]. Keep my usual tone: [brief, warm, Australian]. No corporate phrases. Max 100 words.

*Platform notes:* All four major platforms do this well. Copilot inside Outlook drafts in place with your thread context, which is fastest if you are a Microsoft shop; Gemini inside Gmail does the same for Google shops. ChatGPT and Claude are best when you paste the thread in and want tighter control of tone.

## 2. Summarising meeting notes

**Pattern A (rough to readable):**
> These are my rough notes from [meeting, date, attendees]: [paste]. Rewrite them as clean minutes: decisions made, action items with owner and due date, and open questions. Keep it under one page. Do not add anything I did not write. If an owner or date is missing, mark it [UNCLEAR].

**Pattern B (the long meeting):**
> Here is the transcript/notes from a [X]-minute meeting: [paste or attach]. Give me: (1) a five-sentence summary, (2) every decision, (3) every action item as "who / what / by when", (4) anything that was raised but parked. Quote exact figures only where they appear in the notes.

*Platform notes:* Claude and ChatGPT handle long rough material well; NotebookLM (Google) is excellent when the notes live in Drive and you want answers strictly from your documents. Copilot in Teams can summarise the meeting itself if your organisation has it enabled, saving the paste entirely. Check names and numbers every time; note-takers mumble and models smooth over gaps with invention.

## 3. First-draft reports

**Pattern A:**
> Draft a [report type] for [audience]. Purpose: [decision it supports]. Key facts and figures: [paste or attach source material]. Structure: executive summary (max 150 words), then [sections]. Plain Australian English. Mark every figure you did not get from my material as [VERIFY].

**Pattern B (from existing documents):**
> Using only the attached documents [attach], write a draft [report type] answering: [the question]. Cite which document each major point came from. End with a list of gaps: what the question needs that these documents do not cover.

*Platform notes:* Claude's Projects and ChatGPT's Projects are the right home for recurring reports because the standing material lives there. Gemini/NotebookLM shines when the sources are in Google Drive. Copilot drafts directly into Word with your templates. Pattern B's "list the gaps" step is the single best defence against a confident report built on thin sources, which is how the Deloitte fiasco happens at your scale.

## 4. Brainstorming

**Pattern A:**
> I need ideas for [goal, e.g. getting more commercial maintenance contracts]. Constraints: [budget, region, team size, what we will not do]. Give me 15 ideas: 5 safe, 5 bold, 5 cheap-and-fast. One sentence each, then mark your top 3 with a reason.

**Pattern B (the thinking partner):**
> Let's work through [problem]. Ask me one question at a time to understand the situation before suggesting anything. After five questions, propose three approaches with the trade-offs of each.

*Platform notes:* All platforms are fine here; none is magical. Pattern B turns the chatbot into an interviewer, which consistently produces better thinking than "give me ideas," on every platform. Treat outputs as prompts for your own judgement, not answers; the model recombines what is common, so its "bold" ideas are usually medium-bold.

## 5. Translating jargon into plain language

**Pattern A:**
> Rewrite this for [audience, e.g. a customer with no construction knowledge]: [paste]. Plain Australian English, short sentences, define any term you must keep. Keep every number and deadline exactly as given.

**Pattern B (the reverse: explain it to me):**
> Explain this to me like I'm smart but have never worked in [field]: [paste the contract clause / council notice / insurance letter]. What does it actually require me to do? What are the traps? Quote the exact phrases that matter.

*Platform notes:* Claude tends to be strongest at careful plain-language rewriting; ChatGPT and Gemini both good; Copilot good inside your documents. Pattern B is superb on legal and insurance text, with one hard rule: it tells you what the document seems to say, a qualified person tells you what it means for you.

## 6. Checking your own work

**Pattern A (the cold reader):**
> Read this as a sceptical [customer / auditor / council officer]: [paste]. List: (1) anything unclear, (2) anything that sounds like a promise we might not want to make, (3) any inconsistency in numbers or dates, (4) typos. Be blunt. Do not rewrite it yet.

**Pattern B (the fact-check pass):**
> Here is a draft: [paste]. Here are the source facts: [paste/attach]. Check every name, number, date, price and claim in the draft against the sources. Output a table: claim / supported by source? / what's wrong. Do not fix anything, just report.

*Platform notes:* Pattern B is the most valuable habit in this entire sheet and works on every platform. One honest limit: the model checks your draft against your sources well, but it cannot check either against the world reliably. If a fact matters and it did not come from material you supplied, verify it yourself (or with a live-search-enabled tool, then verify anyway).

---

## The bottom strip

- One task per chat. Fresh chat, fresh desk.
- Paste the real material. No material, no accuracy.
- Constraints are kindness to future-you: length, tone, format, "if unsure, ask."
- Every name, number, date and quoted rule gets checked by a human. That human is you.
- Sensitive data: business-tier or local tools only (see Documents 3 and 5).
