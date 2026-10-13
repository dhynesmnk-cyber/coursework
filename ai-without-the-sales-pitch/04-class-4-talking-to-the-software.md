# Class 4: Talking to the Software
### Prompting without the prompt-guru nonsense: context, system prompts, and being specific

**Time:** about 20 minutes of reading, plus a 20-minute setup exercise.
**By the end of this class you can:** write a request in four parts that gets a usable first draft, explain why long conversations degrade, install a standing system prompt on your platform of choice, and fix the three common failure modes without starting over.

## The short version

Talk to an AI tool the way you'd brief a capable temp on their first day: say who they're working for, what you want, give them the real material, and set the limits. Put the things you'd otherwise repeat every day into a standing briefing. Then read what comes back and correct it, the way you'd correct a new starter.

## Kill the magic thinking first

There's a whole industry selling "prompt engineering" secrets, and most of it is superstition. There are no magic words. You don't need to say please, and you don't need to tell it that it's a world-class expert.

Here's why. From Class 1, a model is a pattern-matcher working on whatever is on its desk right now. So better results come from better desk contents: clearer instructions, the right material, fewer distractions. That's the whole secret. It's good news, because it means anyone who can write a clear work email can learn this in an evening.

## The four-part request: a job sheet

Think of the job sheet a tradie hands an apprentice. It says who the job is for, what to do, what materials to use, and the standards to meet. Leave any of that off and the apprentice guesses.

A good request to an AI tool has the same four parts:

1. **Role.** Who the tool is working for. "You're helping a plumbing business in Geelong."
2. **Task.** What you want made. "Draft a quote cover email."
3. **Material.** The real ingredients, pasted in or attached: the job details, the prices, the customer's original message.
4. **Constraints.** The limits: length, tone, format, what to avoid, and what to do if something's unclear.

Most disappointing results are missing parts three and four. People ask for the finished product without handing over the ingredients or the standards, then blame the tool for guessing. Here's the difference in one pair:

- **Weak:** "Write a professional email about the delay."
- **Strong:** "Write a 100-word email to Karen at Bayside Dental apologising that the hot-water unit install moves from Thursday to Tuesday the 21st, offering a $150 discount on the labour, and confirming the new date. Warm, plain English, no corporate phrases."

The weak version leaves a thousand plausible directions open, and the model picks one. The strong version closes 999 of them. Every limit you add is an edit you won't have to make later.

## The desk, properly explained

Class 1 introduced the model's desk, the **context window**. Here's why it matters for everyday use.

Everything shares the same desk: your standing briefing, any documents you pasted, the whole conversation so far, and the reply being written. The desk is a fixed size, measured in tokens. When it overflows, the oldest papers fall off the far edge, and the model genuinely can no longer see the start of the conversation.

Three practical consequences:

- **Long chats get worse near the end.** Start a new chat for a new task.
- **Huge documents get skimmed.** A 300-page PDF may be answered from a fraction of its pages, so ask pointed questions about specific sections.
- **"Remember what I said at the start" is unreliable** in a long conversation. Standing instructions, in the next section, are what fix that.

## The system prompt: your standing briefing

Picture the laminated card you'd leave on a temp's desk: who we are, who our customers are, how we write, and the things we never do. They read it every morning without being asked.

A **system prompt** is that card. Depending on the product it's called custom instructions, personal context, or project instructions. It's text the product quietly places in front of every message you send. Put the rules you're tired of repeating there: who your business is, who you write to, your tone, your usual formats, and your bright lines, such as "never invent prices or dates".

Document 1 in your pack has three complete templates, for retail, professional services and trades businesses, plus the exact menu path to paste them into ChatGPT, Claude, Gemini, Copilot and local tools. Installing one is the most valuable twenty minutes in this course.

## Three ways to show it your documents

Think about how you'd give a temp information:

- **Pasting into the chat** is handing them one sheet of paper. It's on the desk straight away, all of it, and it's gone when the chat ends. Best for the one important document, right now.
- **Uploading a file to the chat** is handing them a folder. The product converts your PDF, Word file, spreadsheet or photo into text and puts it on the desk for this task. Clean digital documents convert well. Tables, diagrams and photos of pages convert imperfectly.
- **Adding files to a project** (also called a Gem, notebook or knowledge base) is putting them in the office library. You store the material once, and every conversation in that space can use it. For each question, the product fetches the relevant pages, like a librarian bringing you the right chapter. Best for standing reference: policies, price lists, templates.

Document 2 covers the details, including the honest limits of what these tools can do with files. Rule of thumb: the library for standing material, a pasted page for today's facts.

## Correcting the draft is the real skill

The first answer is a draft, not a finished job. You wouldn't expect a new starter's first attempt to go straight to a client either.

The working rhythm is: ask, read it critically, correct it ("that's too formal, and you invented a deadline, take it out"), narrow it down, and run it again. Two or three rounds of correction reliably beat one perfect attempt, because you're steering with feedback, not programming a machine.

One phrase earns its place in your toolkit: "Before answering, list what information you'd need that I haven't given you." It turns a guesser into a question-asker, and questions are cheaper than corrections.

## Three common problems and their fixes

- **Vague, generic output.** You under-briefed it. Add limits and paste real material.
- **Wrong tone.** Fix it once in the standing briefing, not message by message.
- **Invented facts.** The model hit a gap and filled it with something plausible, the bluffing student from Class 1. Give it the facts, then make it an open-book exam: tell it to answer only from the material you provided, and to say "not in the material provided" otherwise. That's called a **grounding instruction**. Then check every name, number, date and quote anyway. Grounding reduces invention. It doesn't eliminate it, so checking is never optional.

## The extras around the engine

Products bolt useful features onto the model. They differ by vendor because, in Class 1's terms, they're features of the car, not the engine.

- **Live web search** fixes the "knows nothing recent" problem. It reads the web imperfectly, much like you do when skimming, so check anything that matters.
- **Editable document panes,** called Canvas in ChatGPT and Artifacts in Claude, let you revise a document in place instead of regenerating the whole answer.
- **Built into your office software:** Copilot drafts inside Word and Outlook, and Gemini inside Gmail and Docs. That matters if your business already lives in one of those suites.

For basic writing tasks, all four major products are close enough. Let the software you already use, and the data protection on your account tier, decide, not the test scores in the marketing.

## Myth, meet reality

**"Prompting is a new profession and you need a course in magic words."** Prompt libraries full of "act as a world-class expert with 20 years of experience" are mostly theatre. Modern models respond to plain, specific instructions at least as well as to elaborate role-play.

What changes the output is unglamorous: put the right material in front of the model, say precisely what you want and what to avoid, correct it when it misses, and save your standing instructions so you aren't retyping them.

A plumber who can describe a job clearly to an apprentice can prompt well, because it's the same skill: knowing the job, setting the standard, checking the work. What's genuinely worth learning is the furniture around the engine, such as projects, files, search and memory. That's different in each product, which is why your document pack tells you where each button lives.

## Your exercise: build your standing setup

1. Draft a five-line system prompt for your business with this skeleton: who we are, who we write to, tone rules, format rules, and one "never" rule such as "never invent prices or dates". Start from the matching template in Document 1.
2. Paste it into the right place on your platform. Document 9 has the click-paths. If your work tool is managed by an admin, send them the template instead and count that as done.
3. Start a new chat and give the tool one real document plus one real task, such as "summarise this into five bullets for a customer who has never seen it". Nothing sensitive, or remove the sensitive parts first.
4. Run one round of correction using the fixes above. Note what changed.
5. Write down the one recurring task this setup will handle next week.

That last sentence is the point of the exercise. The time saved doesn't come from one great prompt. It comes from a standing setup that makes the tool useful on the tenth ordinary Tuesday.

## Explain it back

A colleague says, "I tried ChatGPT and it gave me useless generic rubbish." In three sentences, with no jargon, explain what they probably left out and how to fix it. Then compare your answer with "The short version" and the job sheet.

If you weren't sure why long chats go wrong, reread the desk. If you couldn't explain the difference between a one-off message and a standing briefing, reread the laminated card.

## Before you move on

- My four-part request skeleton is written somewhere I can copy it.
- My system prompt is installed, or queued with my admin.
- I know which problem I meet most often and which fix matches it.

## Words used in this class

- **Prompt:** what you type.
- **System prompt or custom instructions:** standing text the product places in front of every prompt to shape behaviour. The laminated card.
- **Context window:** the model's desk. All the text it can consider at once, measured in tokens.
- **Iteration:** correcting and re-running. The real skill of prompting.
- **Grounding instruction:** telling the model to answer only from material you provided, and to say so when the material runs out. The open-book exam. Reduces invention, doesn't eliminate it.
- **Project, Gem, notebook, GPT:** product features (the names vary by vendor) that bundle standing instructions and files into a reusable workspace. The office library.
- **Retrieval:** when a product with many stored files fetches just the relevant pages for each question instead of loading everything. The librarian.
- **Canvas or Artifacts:** an editable document pane beside the chat, so you revise output in place.
- **Live search:** a feature that fetches current web pages for questions about recent events. Check anything that matters.
