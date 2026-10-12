# Class 4: Talking to the Software
### Prompting without the prompt-guru nonsense: context windows, system prompts, and being specific

---

## Registration page description (150 words)

There is an entire cottage industry selling "prompt engineering" secrets. Most of it is superstition. The real mechanics are three, and you can learn them in one evening. First, the context window: the model only knows what is currently on its desk, so what you include in the conversation matters more than how you phrase the request. Second, the system prompt: standing instructions that shape every answer, which most major products let you write yourself so the tool permanently knows your business, your tone and your rules. Third, specificity: one clear constraint is worth ten polite adjectives. We will write real prompts for real tasks (emails, meeting notes, quotes, policy documents), build a system prompt for your own business live in class, and cover what to do when the output is wrong, vague or confidently invented. You will leave with a prompting cheat sheet and a working system prompt you can paste into ChatGPT, Claude, Gemini or Copilot tonight.

---

## Detailed outline

**1. Kill the magic thinking first.**
No magic words, no "say please," no secret incantations. A model is pattern-matching over everything on its desk. Better output comes from better desk contents: clearer instructions, more relevant material, and fewer distractions. Everything in this class is a consequence of that.

**2. The anatomy of a good prompt: four parts.**
Role ("You are helping a plumbing business in Geelong"), task ("draft a quote cover email"), material (paste the job details, the prices, the customer's original request), and constraints (length, tone, format, what to avoid, what to do when unsure). Most bad prompts are missing parts three and four: people ask for the output without supplying the ingredients or the limits.

**3. The context window, properly explained.**
The model works on a desk of fixed size, measured in tokens. Your system prompt, your instructions, your pasted documents, the conversation so far and the reply all share that desk. When the desk overflows, the oldest material falls off the edge: the model literally stops being able to see the start of the conversation. Practical consequences: very long chats get dumber near the end (start a new chat for a new task); a 300-page PDF may be summarised from a fraction of its content depending on the product; and "remember what I told you at the start" is not a reliable instruction in a long thread.

**4. Why being specific beats being verbose.**
"Write a professional email about the delay" gives the model a thousand plausible directions and it picks one at random-ish. "Write a 100-word email to Karen at Bayside Dental, apologising that the hot-water unit install moves from Thursday to Tuesday the 21st, offering a $150 discount on the labour, and confirming the new date" removes 999 of them. Specificity is respect for your own time: every constraint you add is an edit you do not have to do later.

**5. The system prompt: standing instructions.**
A system prompt (also called custom instructions, a persona, or project instructions, depending on the car) is text placed before every one of your prompts. It persists across the conversation or, in some products, across all conversations. This is where "you write for a 12-person accounting firm in Hobart, plain Australian English, never use the word 'delve', flag anything tax-related for human review" lives. Document 1 in your pack has three full templates (retail, professional services, trades) and exactly where to paste them in each platform.

**6. Paste versus upload versus project.**
Three ways to give the tool material, with different lifespans. Pasting into the chat: fastest, gone when the chat ends, counts against the desk right now. Uploading a file to the chat: the product extracts text and puts some or all of it on the desk; good for one document, one task. Adding files to a project, knowledge base, Gems, or NotebookLM-style workspace: the material persists across chats in that workspace and the product retrieves relevant slices per prompt. Class 4 introduces the distinction; Document 2 covers it fully, including what the tools can and cannot actually do with your files (spoiler: mostly text extraction, and PDFs with tables and diagrams lose structure).

**7. Iteration is the actual skill.**
First output is a draft, not a deliverable. The working rhythm is: prompt, read critically, correct ("that's too formal, and you invented a deadline: remove it"), narrow, re-run. Two or three rounds of correction reliably beats one perfect prompt attempt, because you are steering a pattern-matcher with feedback, not programming a machine. Also teach the useful phrase "before answering, list what information you would need that I haven't given you," which converts a guessing model into a question-asking one.

**8. When it goes wrong: three failure modes and three fixes.**
Vague and generic: you under-specified; add constraints and paste real material. Wrong tone: fix it in the system prompt, not per-message. Invented facts (hallucination): the model had a gap and filled it with plausible texture; the fix is to supply the facts, to tell it to answer only from the pasted material and to say "not in the material provided" otherwise, and to check names, numbers, dates and citations every single time. Grounding instructions do not eliminate invention; they reduce it, and checking remains non-negotiable.

**9. Features that help: search, attachments, artefacts, canvas.**
Modern products bolt useful furniture onto the engine. Live web search (ChatGPT search, Gemini with Google Search, Copilot with Bing, Claude's search) fixes the "knows nothing recent" problem, with the caveat that it reads the web the way you would, imperfectly. Editable output panes (Claude's Artifacts, ChatGPT's Canvas, Copilot's drafting in Word and Outlook) let you revise a document in place instead of re-rolling the whole chat. These are car features, so they differ by vendor; the engine behaviour underneath is the same.

**10. Platform quirks that matter in practice.**
ChatGPT: strongest all-rounder ecosystem (memory, projects, GPTs, canvas), consumer data used for training unless you opt out. Claude: often preferred for long-document work and careful writing, Projects hold files and instructions across chats, consumer training is opt-in with extended retention. Gemini: deepest integration with Google Workspace (Gmail, Docs, Meet) if you already live there, NotebookLM is excellent for working strictly within your own documents. Copilot: the choice if your business runs on Microsoft 365, because it works inside Outlook, Word, Excel and Teams with your existing permissions and a work account means no training on your content. The honest summary: for basic text tasks all four are close enough that your existing software ecosystem and your data-handling tier should decide, not benchmark scores.

**11. Voice, images, and the rest of the car.**
Brief tour: voice mode for dictating on a job site (describe the job, get a draft email read back), image input for reading a photo of a part number, a handwritten timesheet or a whiteboard, and image output for quick marketing visuals (with a warning: generated images of real-looking people and text-heavy graphics are where quality and legal comfort drop). Same rules apply: check everything, and apply the Class 3 decision drill to anything sensitive in a photo.

**12. Building the habit.**
The productivity gain is not from one great prompt; it is from a standing setup (system prompt plus project files plus a business-tier account) that makes the tool useful on the tenth ordinary Tuesday. Homework: install your system prompt from Document 1 this week, create one project folder per recurring task, and time yourself on one real task before and after.

---

## Myth to bust: "Prompting is a new profession and you need a course in magic words."

Prompt libraries full of "act as a world-class expert with 20 years of experience" incantations are mostly theatre, and the platforms have been quietly absorbing what little value they had: the newest models respond to plain, specific instructions at least as well as to elaborate role-play. The mechanics that actually change output are unglamorous and learnable in an evening: put the relevant material in front of the model (context), tell it precisely what you want and what to avoid (constraints), correct it when it misses (iteration), and persist the standing instructions so you are not retyping them (system prompt). A plumber who can describe a job accurately to an apprentice can prompt well, because the skill is the same one: knowing the job, specifying the standard, and checking the work. What is genuinely new and worth paying attention to is not wording tricks; it is the furniture around the engine (projects, file upload, search, memory), and that is car-specific, which is why our documents tell you where each button lives on each platform.

---

## Practical exercise: "Build your standing setup"

**Time: 30 minutes. Needs: laptop or phone, a free or paid account on the platform you use most, one real document from your work (a past quote, a meeting agenda, a policy; nothing sensitive, or redact first).**

1. Each attendee drafts a five-line system prompt for their own business using the worksheet: who we are, who we write to, tone rules, format rules, and one "never" rule (for example "never invent prices or dates"). Volunteers read theirs aloud; the room suggests one improvement each.
2. Paste it into the right place on your platform (ChatGPT: Settings then Personalisation/Custom instructions or a Project's instructions; Claude: Settings then Profile, or a Project's custom instructions; Gemini: Settings then personal context, or a Gem's instructions; Copilot: personalisation settings for consumer, or your admin configures organisational prompts for Microsoft 365 Copilot). Document 9 has click-paths with described screenshots.
3. Start a new chat and give the tool your real document plus a real task ("summarise this into five bullets for a customer who has never seen it").
4. Run one correction round using the failure-mode fixes.
5. Finish by writing down, on the worksheet, the one recurring task this setup will handle next week. That commitment is the point of the exercise.

---

## Glossary

- **Prompt:** what you type. **System prompt / custom instructions:** standing text the product places before your prompts to shape behaviour.
- **Context window:** the model's desk. All text it can consider at once, measured in tokens. Older material falls off the edge in long conversations.
- **Token:** the text chunk models process, about three-quarters of an English word.
- **Iteration:** correcting and re-running. The real skill of prompting.
- **Grounding instruction:** telling the model to answer only from material you provided and to say so when the material runs out. Reduces invention; does not eliminate it.
- **Project / Gem / Notebook / GPT:** product features (names vary by vendor) that bundle standing instructions plus files into a reusable workspace.
- **Artifact / Canvas:** an editable document pane beside the chat, so you revise output in place instead of re-generating whole answers.
- **Multimodal:** the model accepts more than text (images, voice, files).
- **Retrieval:** when a product with many stored files selects the relevant slices to put on the desk for each prompt, instead of loading everything at once.
- **Live search:** a product feature that fetches current web pages to answer questions about recent events. Quality varies; check anything that matters.
