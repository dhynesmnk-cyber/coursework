# Class 5: Software Without the Software Bill
### The collapsed cost of custom software, AI-assisted building, and what is realistic for a ten-person business

**Time:** about 20 minutes of reading, plus a 30-minute build-or-decide exercise.
**By the end of this class you can:** explain why custom software used to cost six figures and now can cost an afternoon, sort any build idea into one of three tiers with honest boundaries, and run a four-week path from annoying process to working internal tool.

## Why software was expensive, specifically

In 1995, building software meant developers billing by the month, servers you bought and housed, licences per user, and distribution on disks with manuals. Every extra copy and every extra user cost real money, so the industry's answer was shrink-wrapped software: build once, sell to thousands, customise for nobody small. Every small business learned to bend its processes around off-the-shelf tools, because bending the tools was unaffordable. Remember that shape, because the last thirty years have dismantled it piece by piece.

## What collapsed, and in what order

Three collapses stacked on top of each other. Infrastructure: cloud computing turned servers into an hourly rental, so running software for ten users costs roughly nothing. Distribution: the internet made copying free, which is why the marginal cost (the cost of one extra copy or one extra user) of software is now close to zero. And now, production: AI coding assistants (tools that write, explain and fix code from plain-language requests, such as GitHub Copilot, Cursor, Claude Code and the code modes inside ChatGPT, Gemini and Copilot) generate large amounts of routine code for you. The 1s and 0s were already free to copy and run at scale. The expensive human labour of writing them has become dramatically cheaper. That combination, the near-zero marginal cost of customised software, is the biggest shift happening right now, bigger than any robot story, and it is the whole of this class.

## What that means for a ten-person business, concretely

These are real shapes, not fantasies. A quoting tool that turns your standard rates and job types into branded PDF quotes. A job-intake form that feeds a tidy spreadsheet and drafts the confirmation email. An internal search across ten years of PDFs, policies and supplier catalogues, which is also the best use case for a local model from Class 3. A booking page for your niche that no software vendor bothered to build. A script that renames, sorts and backs up the photos from every job. In 2010 each of these was a $50,000 to $200,000 conversation. Today each is an afternoon to a weekend with an AI assistant, plus, for anything customer-facing, a few hundred dollars of professional review and hosting.

## A worked example, start to finish

Here is what a small build looks like in practice, described as you would experience it. You open a chat assistant and describe the tool in plain English: "Build me a one-page web tool where I enter a customer name, an invoice amount and days overdue, and it writes my reminder email in my usual tone. Internal use, fake data only." The assistant writes the code, roughly a hundred lines of a single file. You save it, open it in your browser, and it works. Ten minutes, start to finish, for the demo version.

Now the honest part, which is the actual lesson. That demo has no database, no logins, no backups and no security review. It runs wherever you saved it. If it breaks, nobody is on call. Turning it into software the business relies on means adding hosting (the rented computer where a tool lives so people can reach it), authentication if anyone outside you touches it, backups, and someone who owns the day it fails at 4pm on a Friday. That gap between "works on the demo" and "safe to rely on" is where judgement lives, and the three tiers below are how you keep it honest.

## The three tiers of build, and which one you are doing

**Tier one, no build.** Configure tools you already pay for: a Copilot agent over your SharePoint, a Gemini Gem over your Drive, an automation with an AI step. Most "we should build something" needs die here, cheaply.

**Tier two, assisted build.** Describe a small tool to an AI assistant, keep it internal or low-stakes, use fake data, accept that you cannot audit the code. This is where the napkin ideas live, and it is genuinely safe if the stakes stay low.

**Tier three, real software.** Anything taking payments, holding customer data at scale, or that the business would hurt to lose. Tier three always needs a professional in the loop, even if AI wrote 90 percent of the code, because someone must own security, backups and support. A few hundred dollars of review is not an insult to the AI's work. It is insurance on yours.

## "Vibe coding", named and bounded

The popular name for describing software in plain language and accepting the generated code without reading it is vibe coding. It works astonishingly well for prototypes (first working versions built to learn, not to rely on) and internal tools. It produces software the builder cannot audit, which is fine at tier two and dangerous at tier three. The rule this class teaches: vibe-code freely for internal, low-stakes tools, never for anything that holds other people's personal information, takes payments, or would hurt to lose. An AI-written app that works in the demo is not the same as an app that is secure, backed up and maintainable, and the difference only shows up under stress.

## Cloud versus local for software work

Cloud AI coding tools give you the most capable engines, and your code, sometimes your whole codebase, goes to the vendor, so check the tier's training and retention settings exactly as you would for any other data. Business tiers generally exclude your code from training. Consumer tiers may not. Local LLM-assisted development (running a coding model on your own hardware through Ollama or LM Studio inside your editor) means your code never leaves the building, which matters for agencies under non-disclosure agreements, government-adjacent work, or firms with strict client confidentiality. The trade-off is capability: local coding models are decent for boilerplate and explanation and noticeably weaker on large refactors and hard bugs. The hybrid most small firms land on: local or business-tier tools for client code, consumer cloud tools for learning and throwaway scripts.

## The cost reality check

What it actually costs in 2026: an AI subscription at roughly $20 to $30 per person per month, or free tiers for light use. Hosting for a small internal tool, free to about $30 per month. A domain, $15 to $25 per year. Your time, or a junior's. And for tier three, a professional review from a few hundred to a few thousand dollars, which is still a rounding error against the 1995 numbers. Budget honestly for the line item everyone forgets: maintenance. Software is a plant, not a purchase. Dependencies (other people's free code libraries your tool leans on) need occasional updates, and nobody updates what nobody owns.

## Buying versus building, the updated rule

The old rule was "never build what you can buy." The new rule is: buy for anything standard, such as email, accounting and payroll; build for the 10 percent that is genuinely specific to how your business works; never build anything regulated, such as payments or health records, yourself. AI-assisted building moved the line. It did not erase it.

## The traps, named so you can step over them

- **Security defaults.** AI-generated apps often ship without authentication, input checking or proper handling of secrets (passwords, API keys and similar credentials that software needs and attackers want) unless you ask. Ask explicitly, and have a professional verify.
- **The laptop problem.** "It only runs on Brad's laptop" is a business continuity incident waiting to happen. Host it or accept it is a prototype forever.
- **Data leaks through the build process.** Pasting your real customer database into a consumer chatbot to help it build the tool is the Class 3 mistake in a new costume. Fake data in, real data later, in your own systems.
- **The maintenance cliff.** The person who vibe-coded it leaves, and the business inherits software nobody can explain. Write a half-page note while you remember: what it does, where it lives, what breaks first.

## A realistic adoption path, four weeks

Week one: pick one annoying internal process, the one everyone grumbles about. Week two: prototype it at tier two with fake data. Week three: use it daily and note every failure, because the failure list is the specification. Week four: decide. Keep it as-is, park it, or budget a professional review to productionise it (the professional work of making a prototype secure, backed up, monitored and supported). Total exposure before the decision: a subscription and some evenings. That path is reproducible for every idea on your napkin list.

## What this does to the software you already pay for

One level-headed market note. When custom software is cheap, generic software that merely digitises a form faces pressure, and vendors respond by bolting on AI features, which is the "powered by AI" translation exercise from Class 2. You now have one strong question at renewal: what would this capability cost to build for our specific workflow? Sometimes the answer is still "buy". Now it is at least a real comparison instead of a shrug.

## Myth, meet reality

**"Only programmers can build software, so non-technical owners should stay out of it."** That was true when building meant years of specialised labour, and it stopped being true in stages, with AI-assisted coding removing most of what remained. A non-technical owner who can describe their process precisely, someone who knows exactly what happens between a customer's phone call and the job sheet, can now produce working internal tools with a chat assistant without reading a line of the code it writes. The myth survives because it is commercially useful to vendors, and because the caveats are real and easy to conflate with "you can't". The honest statement is narrower and more useful: you can build internal, low-stakes tools yourself this month, and you should not build anything that holds other people's personal information, takes payments, or that the business would suffer to lose, without a professional owning security and support. Inside that boundary, the person closest to the problem is often the best person to build the fix.

## Your exercise: napkin to prototype

1. Write the single most annoying repetitive process in your work on one card, in three sentences, the way you would explain it to a new employee. Reject your first draft if it is vague.
2. Convert the card into a build request using this template: what the tool takes in, what it does, what it produces, who uses it, plus the line "this is an internal prototype, use fake data only".
3. Run it in any assistant with code ability, save the result as a single HTML file if offered, and open it in your browser. If something breaks, paste the error back in and ask for a fix. That loop is the whole skill.
4. Use the tool once on a realistic but fake example and write down the first thing you would fix.
5. Make the tier call in one sentence: usable internally next week as-is, or needs a professional before anyone outside the business touches it? The gap between those two lists is the lesson of this class.

## Before you move on

- I can explain the marginal cost collapse in one sentence to a colleague.
- I have one napkin idea sorted into a tier, with reasons.
- I know which traps my idea would walk into, and the first step over each.

## Words used in this class

- **Marginal cost:** what one extra copy or one extra user costs. For software in 2026, near zero. The whole story of this class.
- **AI coding assistant:** a tool that writes, explains and fixes code from plain-language requests.
- **Vibe coding:** describing software conversationally and accepting the generated code without reading it. Fine for prototypes and internal tools, never for sensitive or customer-facing work.
- **Prototype:** a first working version, built to learn, not to rely on.
- **Hosting:** the rented computer where a tool lives so people can reach it.
- **Dependencies:** other people's free code libraries your tool leans on, which need occasional updates.
- **Secrets:** passwords, API keys and similar credentials. Store them specially, never paste them into chat tools.
- **Productionise:** the professional work of turning a prototype into software that is secure, backed up, monitored and supported.
- **Local LLM-assisted development:** running a coding model on your own hardware inside your editor, so your code never leaves the building.
