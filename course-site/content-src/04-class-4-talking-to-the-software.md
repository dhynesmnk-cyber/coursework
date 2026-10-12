# Class 4: Talking to the Software
### Prompting without the prompt-guru nonsense: context, system prompts, and being specific

**Time:** about 20 minutes of reading, plus a 20-minute setup exercise.
**By the end of this class you can:** write a request in four parts that gets a usable first draft, explain why long conversations degrade, install a standing system prompt on your platform of choice, and fix the three common failure modes without starting over.

## Kill the magic thinking first

There is an entire cottage industry selling "prompt engineering" secrets, and most of it is superstition. No magic words, no incantations, no need to say please. A model is pattern-matching over everything currently on its desk, so better output comes from better desk contents: clearer instructions, more relevant material, fewer distractions. Everything in this class follows from that sentence, which is good news, because it means the skill is learnable in an evening by anyone who can write a clear work email.

## The anatomy of a good request: four parts

1. **Role.** Who the tool is acting as: "You are helping a plumbing business in Geelong."
2. **Task.** What you want produced: "draft a quote cover email".
3. **Material.** The real ingredients, pasted or attached: the job details, the prices, the customer's original request.
4. **Constraints.** The limits: length, tone, format, what to avoid, and what to do when unsure.

Most disappointing results are missing parts three and four. People ask for the output without supplying the ingredients or the limits, then blame the tool for guessing. Here is the difference in one pair.

- Weak: "Write a professional email about the delay."
- Strong: "Write a 100-word email to Karen at Bayside Dental apologising that the hot-water unit install moves from Thursday to Tuesday the 21st, offering a $150 discount on the labour, and confirming the new date. Warm, plain English, no corporate phrases."

The weak version leaves the model a thousand plausible directions and it picks one at random. The strong version removes 999 of them. Every constraint you add is an edit you do not have to make later.

## The context window, properly explained

The model works on a desk of fixed size, measured in tokens (mouthfuls of text, from Class 1). Your system prompt, your pasted documents, the conversation so far and the reply all share that desk, which is called the context window. When the desk overflows, the oldest material falls off the edge, and the model literally stops being able to see the start of the conversation. Three practical consequences. Very long chats get dumber near the end, so start a new chat for a new task. A 300-page PDF may be answered from a fraction of its content, so ask pointed questions about specific sections. And "remember what I told you at the start" is not a reliable instruction in a long thread, which is what standing settings in the next section are for.

## The system prompt: your standing briefing

A system prompt (also called custom instructions, personal context or project instructions, depending on the product) is text placed before every one of your messages. It persists, so it is where the rules you are tired of repeating live: who your business is, who you write to, your tone, your formats, and your bright lines such as "never invent prices or dates". Think of it as the induction briefing you give a new employee on their first morning, except you give it once and it is never forgotten.

Document 1 in your pack contains three complete templates, for retail, professional services and trades businesses, plus the exact menu path to paste them into ChatGPT, Claude, Gemini, Copilot and local tools. Installing one is the single highest-value twenty minutes in this course.

## Paste, upload, or project: three ways to show it stuff

- **Pasting into the chat** puts material on the desk immediately and in full, and it vanishes when the chat ends. Best for the one crucial document, right now.
- **Uploading a file to the chat** converts your PDF, Word file, spreadsheet or photo into text and puts it on the desk for this task. Clean digital documents convert well. Tables, diagrams and photographed pages convert imperfectly.
- **Adding files to a project, Gem, notebook or knowledge base** stores the material once and makes it available to every conversation in that space, with the product selecting the relevant slices per question. Best for standing reference such as policies, price lists and templates.

Document 2 covers the details, including the honest limits of what these tools can do with files. The rule of thumb: library for standing material, paste for today's authority.

## Iteration is the actual skill

The first output is a draft, not a deliverable. The working rhythm is: ask, read critically, correct ("that is too formal, and you invented a deadline, remove it"), narrow, re-run. Two or three correction rounds reliably beat one perfect attempt, because you are steering a pattern-matcher with feedback rather than programming a machine. One phrase earns its place in your repertoire: "Before answering, list what information you would need that I have not given you." It converts a guessing model into a question-asking one, and questions are cheaper than corrections.

## Three failure modes and their fixes

- **Vague and generic output.** You under-specified. Add constraints and paste real material.
- **Wrong tone.** Fix it once in the system prompt, not message by message.
- **Invented facts.** The model had a gap and filled it with plausible texture. Supply the facts, tell it to answer only from the material you provided and to say "not in the material provided" otherwise, and check every name, number, date and citation anyway. Grounding instructions reduce invention. They do not eliminate it, and checking stays non-negotiable.

## The furniture around the engine

Modern products bolt useful features onto the model, and they differ by vendor because they are car features, not engine features. Live web search fixes the "knows nothing recent" problem, with the caveat that it reads the web imperfectly, like you do at speed. Editable output panes, called Canvas in ChatGPT and Artifacts in Claude, let you revise a document in place instead of regenerating whole answers. Copilot drafts inside Word and Outlook, and Gemini inside Gmail and Docs, which matters if your business already lives in those suites. For basic text tasks all four major products are close enough that your existing software ecosystem and your data-handling tier should decide, not benchmark scores.

## Myth, meet reality

**"Prompting is a new profession and you need a course in magic words."** Prompt libraries full of "act as a world-class expert with 20 years of experience" are mostly theatre, and modern models respond to plain, specific instructions at least as well as to elaborate role-play. The mechanics that change output are unglamorous: put the relevant material in front of the model, state precisely what you want and what to avoid, correct it when it misses, and persist your standing instructions so you are not retyping them. A plumber who can describe a job accurately to an apprentice can prompt well, because the skill is the same one: knowing the job, specifying the standard, checking the work. What is genuinely worth learning is the furniture around the engine, projects, files, search, memory, and that is product-specific, which is why your document pack tells you where each button lives.

## Your exercise: build your standing setup

1. Draft a five-line system prompt for your own business using this skeleton: who we are, who we write to, tone rules, format rules, and one "never" rule such as "never invent prices or dates". Start from the matching template in Document 1.
2. Paste it into the right place on your platform. Document 9 has the click-paths. If you use a work-managed tool, send the template to your admin instead and note that as done.
3. Start a new chat and give the tool one real document plus one real task, such as "summarise this into five bullets for a customer who has never seen it". Nothing sensitive, or redact first.
4. Run one correction round using the failure-mode fixes above. Note what changed.
5. Write down the one recurring task this setup will handle next week. That sentence is the point of the exercise, because the productivity gain is not in one great prompt. It is in a standing setup that makes the tool useful on the tenth ordinary Tuesday.

## Before you move on

- My four-part request skeleton is written somewhere I can copy it.
- My system prompt is installed, or queued with my admin.
- I know which failure mode I meet most often and which fix matches it.

## Words used in this class

- **Prompt:** what you type. **System prompt or custom instructions:** standing text the product places before your prompts to shape behaviour.
- **Context window:** the model's desk. All the text it can consider at once, measured in tokens.
- **Iteration:** correcting and re-running. The real skill of prompting.
- **Grounding instruction:** telling the model to answer only from material you provided and to say so when the material runs out. Reduces invention, does not eliminate it.
- **Project, Gem, notebook, GPT:** product features, names vary by vendor, that bundle standing instructions plus files into a reusable workspace.
- **Canvas or Artifacts:** an editable document pane beside the chat, so you revise output in place.
- **Retrieval:** when a product with many stored files selects the relevant slices to put on the desk for each prompt instead of loading everything.
- **Live search:** a product feature that fetches current web pages for questions about recent events. Check anything that matters.
