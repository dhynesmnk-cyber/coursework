# Class 5: Software Without the Software Bill
### The collapsed cost of custom software, AI-assisted building, and what's realistic for a ten-person business

---

## Registration page description (150 words)

Here is the story the AI hype cycle keeps skipping. In 1995, custom software cost a fortune: developers, servers, licences, physical media, and an IT team to keep it alive. Copying and running software is now effectively free, and AI tools write much of the routine code. The result is that software tailored to your one specific business, the quoting spreadsheet that became a proper tool, the booking system nobody sells in your niche, the internal dashboard your ops manager keeps sketching on napkins, can now be built in days, sometimes hours, for hundreds of dollars instead of hundreds of thousands. This class shows what that looks like in practice, demos a small real build live, and draws the honest boundaries: what a non-technical owner can safely do, where you still need a professional, and the security and maintenance traps that catch people who build without asking. Cloud and local tooling compared, real costs, real limits, no sizzle.

---

## Detailed outline

**1. Why software was expensive, specifically.**
1995: developers billed by the month; servers were physical boxes you bought and housed; every user licence cost money; distribution meant disks and manuals; maintenance meant a retained IT firm. The marginal cost of one more copy or one more user was significant, so the industry's answer was shrink-wrapped software: build once, sell to thousands, customise for nobody small. Every small business learned to bend its processes around off-the-shelf software because bending the software was unaffordable.

**2. What collapsed, and when.**
Three collapses stacked. Infrastructure: cloud computing turned servers into an hourly rental, so running software for ten users costs roughly nothing. Distribution: the internet made copying free. And now, production: AI coding assistants (Cursor, GitHub Copilot, Claude Code, and the code modes inside ChatGPT, Gemini and Copilot) generate large amounts of routine code from plain-language description. The 1s and 0s are effectively free to copy and run at scale, and the expensive human labour of writing them has gotten dramatically cheaper. This is the biggest shift happening right now, bigger than any robot story: the near-zero marginal cost of customised software.

**3. What that means for a ten-person business, concretely.**
Examples in range: a quoting tool that turns your standard rates and job types into branded PDF quotes; a job-intake form that feeds a tidy spreadsheet and drafts the confirmation email; an internal search across ten years of PDFs, policies and supplier catalogues (this is the local-AI use case from Class 3); a simple booking page for your niche that no SaaS vendor bothered to build; a script that renames, sorts and backs up the photos from every job. Each of these was a $50,000 to $200,000 conversation in 2010. Each is now an afternoon-to-a-weekend conversation with an AI tool plus, for anything customer-facing, a few hundred dollars of professional review and hosting.

**4. Live demo: build something small, honestly.**
The facilitator builds, in front of the room, a one-page web tool: a "late invoice email generator" where you enter the customer name, amount and days overdue and it produces your tone of email. Using a chat-based assistant to generate the code and a browser to run it. Total elapsed: about ten minutes. Then the honest part of the demo: show what it does not do (no database, no logins, no payments), and list what you would need to add before a customer ever touches it.

**5. The three tiers of build, and which one you are doing.**
Tier one, no build: configure tools you already pay for (a Copilot agent over your SharePoint, a Gemini Gem over your Drive, a Zapier/Make automation with an AI step). Tier two, assisted build: describe a small tool to an AI assistant, paste the result into a host, keep it internal or low-stakes. Tier three, real software: anything taking payments, holding customer data at scale, or that your business would hurt to lose. Tier three always needs a professional in the loop, even if the AI wrote 90% of the code, because someone must own security, backups and the day it breaks at 4pm on a Friday.

**6. "Vibe coding" and what it actually produces.**
The popular name for describing software in plain language and accepting the AI's code without reading it. It works astonishingly well for prototypes and internal tools, and it produces software the builder cannot audit. The rule this class teaches: vibe-code freely at tier two, never at tier three, and never for anything that touches personal information without a review. An AI-written app that works on the demo is not the same as an app that is secure, backed up and maintainable, and the difference only shows up under stress.

**7. Cloud versus local for software work.**
Cloud AI coding tools (GitHub Copilot, Cursor, Claude Code, ChatGPT's code mode, Gemini in Colab): the most capable engines, and your code and sometimes your codebase go to the vendor, so check the tier's training and retention settings the same way you check anything else (business tiers generally exclude your code from training; consumer tiers may not). Local LLM-assisted development (Ollama or LM Studio serving a coding model into your editor via an extension): your code never leaves the building, which matters for agencies under NDA, government-adjacent work, or firms with strict client confidentiality. The trade-off is capability: local coding models are decent for boilerplate and explanation, noticeably weaker for large refactors and hard bugs. The hybrid most small firms land on: local or business-tier tools for client code, consumer cloud tools for learning and throwaway scripts.

**8. The cost reality check.**
What it actually costs in 2026: an AI subscription ($20 to $30 per person per month, or free tiers for light use); hosting for a small internal tool (free to about $30 per month on mainstream platforms); a domain ($15 to $25 per year); your time or a junior's; and, for tier three, a professional review (a few hundred to a few thousand dollars, still a rounding error against 1995 numbers). Budget honestly for the boring line item everyone forgets: maintenance. Software is a plant, not a purchase.

**9. Buying versus building, the updated rule.**
The old rule was "never build what you can buy." The new rule is "buy for anything standard (email, accounting, payroll), build for the 10% that is genuinely specific to how your business works, and never build anything regulated (payments, health records) yourself." AI-assisted building shifts the line but does not erase it.

**10. The traps, named.**
Security defaults: AI-generated apps often ship without authentication, input validation or secrets handling unless you ask; ask explicitly and have a professional verify. Dependencies: the tool will use free third-party libraries that need updates; nobody updates what nobody owns. Lock-in to the machine: "it only runs on Brad's laptop" is a business continuity incident waiting to happen. Data leaks through the build process: pasting your real customer database into a consumer chatbot to "help it build the tool" is the Class 3 mistake in a new costume. And the maintenance cliff: the person who vibe-coded it leaves, and the business inherits software nobody can explain.

**11. A realistic adoption path for a ten-person business.**
Week one: pick one annoying internal process. Week two: prototype it with an AI assistant at tier two, internal use only, with fake data. Week three: use it daily, note every failure. Week four: decide, park it, or budget a professional review to productionise it. Total exposure before the decision: a subscription and some evenings. That path is reproducible for every tool on the napkin list.

**12. What this does to the software vendors you already pay.**
Brief, level-headed market note: when custom software is cheap, generic software that merely digitises a form faces pressure, and vendors respond by bolting on AI features (see Class 2's "powered by AI" translation). For buyers, the new leverage is simple: before renewing any software contract, ask what the same capability would cost to build for your specific workflow. Sometimes the answer is still "buy." Now it is at least a real comparison.

---

## Myth to bust: "Only programmers can build software, so non-technical owners should stay out of it."

That was true when building meant years of specialised labour, and it stopped being true in stages over the last decade, with AI-assisted coding removing most of what was left. A non-technical owner who can describe their process precisely, someone who knows exactly what happens between a customer's phone call and the job sheet, is now able to produce working internal tools with a chat assistant, without reading a line of the code it writes. The myth survives because it is commercially useful: to vendors selling software you could now build for your exact workflow, and because the caveats (security, maintenance, tier three boundaries) are real and easy to conflate with "you can't." The honest statement is narrower and more useful: you can build internal, low-stakes tools yourself this month; you should not build anything that holds other people's personal information, takes payments, or that the business would suffer to lose, without a professional owning security and support. Within that boundary, the person closest to the problem is now often the best person to build the fix.

---

## Practical exercise: "Napkin to prototype"

**Time: 35 minutes. Needs: laptops (pairs are fine), a free account on any major assistant with code ability, a modern browser.**

1. Each pair writes on one index card the single most annoying repetitive process in their work, in three sentences, the way they would explain it to a new employee. (Facilitator circulates; rejects anything vague.)
2. Pairs convert the card into a build request using a supplied template: what the tool takes in, what it does, what it produces, who uses it, and the line "this is an internal prototype, use fake data only."
3. They run it in the assistant, save the code as a single HTML file where possible, and open it in the browser. The facilitator and helpers debug the two or three common failure points.
4. Each pair uses the tool once on a realistic-but-fake example and writes down the first thing they would fix.
5. Debrief against the tiers: which of these prototypes could be used internally next week as-is? Which would need a professional before anyone outside the business touches them? The gap between those two lists is the lesson.

---

## Glossary

- **Marginal cost:** what one extra copy or one extra user costs you. For software in 2026, near zero. This is the whole story of this class.
- **AI coding assistant:** a tool that writes, explains and fixes code from plain-language requests. Examples: GitHub Copilot, Cursor, Claude Code, and the code modes in ChatGPT, Gemini and Copilot.
- **Vibe coding:** describing software conversationally and accepting the generated code without reading it. Fine for prototypes and internal tools; never for anything sensitive or customer-facing.
- **Prototype:** a first working version, built to learn, not to rely on.
- **Hosting:** the computer (usually rented, often free at small scale) where a tool lives so people can reach it. "It only runs on Brad's laptop" means unhosted.
- **Dependencies:** other people's free code libraries that your tool leans on. They need occasional updates, which is a chunk of "maintenance."
- **Secrets:** passwords, API keys and similar credentials that software needs and attackers want. They must be stored specially, never pasted into chat tools.
- **Local LLM-assisted development:** running a coding model on your own hardware (via Ollama or LM Studio) inside your editor, so your code never leaves the building.
- **Productionise:** the professional work of turning a prototype into software that is secure, backed up, monitored and supported.
- **Buy versus build:** the decision of whether to purchase existing software or make your own. AI has moved the line toward building for niche, internal needs.
