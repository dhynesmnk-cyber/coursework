# Class 5: Software Without the Software Bill
### The collapsed cost of custom software, AI-assisted building, and what is realistic for a ten-person business

**Time:** about 20 minutes of reading, plus a 30-minute build-or-decide exercise.
**By the end of this class you can:** explain why custom software used to cost six figures and now can cost an afternoon, sort any build idea into one of three tiers with honest boundaries, and run a four-week path from annoying process to working internal tool.

## The short version

Software tailored to your business used to cost a fortune because skilled people had to write every line. AI now writes much of the routine code, so a small internal tool can take an afternoon. But a tool that works once on your screen is not the same as one your business can rely on, so build freely for low-stakes internal jobs and bring in a professional for anything touching money or customers' personal information.

## Why software was expensive

Think back to the photocopier. The expensive part of a document was never the copy, it was writing the original. Once written, each extra copy cost a sheet of paper.

Software in 1995 had expensive originals and expensive copies. Writing it meant developers billing by the month. Running it meant buying and housing your own servers. Each user needed a licence, and each copy shipped on disks with a printed manual.

Because every copy and every user cost real money, the industry built software once and sold it to thousands. Nobody customised it for a ten-person business. So small businesses bent their processes around whatever came off the shelf, because bending the software was unaffordable. Remember that shape: the last thirty years have taken it apart piece by piece.

## What collapsed, and in what order

Picture opening a restaurant.

1. **Renting the kitchen got cheap.** Instead of building your own commercial kitchen, you hire one by the hour. In software, that's cloud computing: servers became an hourly rental, so running a tool for ten people costs next to nothing.
2. **Delivery became free.** The internet made copying software free. The cost of one extra copy or one extra user, which economists call the **marginal cost**, is now close to zero.
3. **Now the cooking got cheap.** AI coding assistants are the sous-chef doing the prep. Tools such as GitHub Copilot, Cursor, Claude Code, and the code modes inside ChatGPT, Gemini and Copilot write, explain and fix routine code from plain-English requests.

Copying and running software was already nearly free. Now the expensive human work of writing it has become dramatically cheaper as well. Put together, that means customised software costs a fraction of what it did, and that is the biggest shift happening right now. It's bigger than any robot story, and it's the whole of this class.

## What that means for a ten-person business

These are real examples, not fantasies:

- A quoting tool that turns your standard rates and job types into branded PDF quotes.
- A job-intake form that fills a tidy spreadsheet and drafts the confirmation email.
- A search across ten years of PDFs, policies and supplier catalogues. This is also the best use for a local model from Class 3.
- A booking page for your niche that no software company bothered to build.
- A small program that renames, sorts and backs up the photos from every job.

In 2010, each of these was a $50,000 to $200,000 conversation. Today each is an afternoon to a weekend with an AI assistant. For anything customers use, add a few hundred dollars of professional review and hosting.

## A worked example, start to finish

Here's what a small build actually feels like.

You open a chat assistant and describe the tool in plain English: "Build me a one-page web tool where I enter a customer name, an invoice amount and days overdue, and it writes my reminder email in my usual tone. Internal use, fake data only." The assistant writes the code, roughly a hundred lines in a single file. You save it, open it in your web browser, and it works. Ten minutes, start to finish, for the demo version.

Now the honest part, which is the real lesson. That demo has no database, no logins, no backups and no security check. It lives wherever you saved it. If it breaks, nobody is on call.

Turning it into software the business relies on means adding **hosting** (a rented computer where the tool lives, so other people can reach it), logins if anyone outside you will use it, backups, and a person who owns the problem when it fails at 4pm on a Friday. The gap between "works in the demo" and "safe to rely on" is where judgement lives. The three tiers below keep that judgement honest.

## The three tiers: the DIY rules for software

You already know the Australian rules for DIY around the house. You can change a light bulb. You can build a garden shed. You can't do your own wiring: that needs a licensed electrician, however good your YouTube research was. Software works the same way.

**Tier one, the light bulb: no build.** Set up tools you already pay for, such as a Copilot agent over your SharePoint, a Gemini Gem over your Drive, or an automation with an AI step. Most "we should build something" ideas end here, cheaply.

**Tier two, the garden shed: assisted build.** Describe a small tool to an AI assistant, keep it internal and low-stakes, use fake data, and accept that you can't check the code yourself. This is where your napkin ideas live, and it's genuinely safe as long as the stakes stay low.

**Tier three, the wiring: real software.** Anything that takes payments, holds lots of customer data, or that the business would really hurt to lose. Tier three always needs a professional involved, even if AI wrote 90 percent of the code, because someone has to own security, backups and support. A few hundred dollars of review isn't an insult to the AI's work. It's insurance on yours.

## "Vibe coding", named and bounded

**Vibe coding** is the popular name for describing software in plain language and accepting whatever code comes back, without reading it.

It's like assembling flat-pack furniture without looking at the instructions. For a bookshelf in the shed, who cares if a screw is in the wrong hole. For a child's cot, you read every step and check every bolt.

Vibe coding works astonishingly well for **prototypes** (first working versions, built to learn from, not to rely on) and for internal tools. It produces software the builder can't check, which is fine at tier two and dangerous at tier three.

The rule this class teaches: vibe-code freely for internal, low-stakes tools. Never vibe-code anything that holds other people's personal information, takes payments, or would hurt to lose. An AI-written app that works in the demo isn't the same as one that's secure, backed up and maintainable, and the difference only shows up under stress.

## Cloud versus local for building software

The same Class 3 rules apply to code as to any other data.

**Cloud coding tools** have the most capable engines, and your code, sometimes your whole project, goes to the vendor. So check the account tier's training and retention settings exactly as you would for customer data. Business tiers generally exclude your code from training. Consumer tiers may not.

**Local coding tools** mean running a coding model on your own computer, through Ollama or LM Studio, inside your code editor. Your code never leaves the building. That matters for agencies under non-disclosure agreements, government-related work, and firms with strict client confidentiality rules. The trade-off is capability: local coding models are fine for routine code and explanations, and noticeably weaker on big rewrites and hard bugs.

The mix most small firms land on: local or business-tier tools for client code, and consumer cloud tools for learning and throwaway experiments.

## The cost reality check

What it actually costs in 2026:

- An AI subscription: roughly $20 to $30 per person per month, or free tiers for light use.
- Hosting for a small internal tool: free to about $30 per month.
- A domain name: $15 to $25 per year.
- Your time, or a junior's.
- For tier three, a professional review: a few hundred to a few thousand dollars. Still a rounding error against the 1995 numbers.

Budget honestly for the line everyone forgets: **maintenance**. Software is a plant, not a purchase. It needs watering. Your tool leans on other people's free building blocks, called **dependencies**, and like car parts those occasionally get recalled and need replacing. Nobody updates what nobody owns.

## Buying versus building, the updated rule

The old rule was "never build what you can buy." The new rule:

- **Buy** anything standard, such as email, accounting and payroll.
- **Build** the 10 percent that's genuinely specific to how your business works.
- **Never build** anything regulated yourself, such as payments or health records.

AI-assisted building moved the line. It didn't erase it.

## The traps, named so you can step over them

- **Security left off by default.** AI-built apps often ship without logins, without checking what people type in, and with **secrets** handled carelessly. Secrets are the passwords and access keys software needs and attackers want; leaving them in the code is a key under the doormat. Ask for security explicitly, and have a professional check.
- **The laptop problem.** "It only runs on Brad's laptop" is an outage waiting to happen. Host it properly, or accept it's a prototype forever.
- **Data leaking during the build.** Pasting your real customer database into a consumer chatbot so it can help build the tool is the Class 3 mistake in a new costume. Fake data in while building; real data later, in your own systems.
- **The maintenance cliff.** The person who built it leaves, and the business inherits software nobody can explain. Write a half-page note while you remember: what it does, where it lives, what usually breaks first.

## A realistic path, four weeks

- **Week one:** pick one annoying internal process, the one everyone grumbles about.
- **Week two:** prototype it at tier two, with fake data.
- **Week three:** use it daily and note every failure. The failure list becomes your specification.
- **Week four:** decide. Keep it as it is, park it, or budget a professional to make it production-ready: secure, backed up, monitored and supported.

Total cost before you decide: a subscription and a few evenings. You can repeat that path for every idea on your napkin.

## What this does to the software you already pay for

One level-headed note about the market. When custom software is cheap, generic software that just turns a paper form into a screen comes under pressure. Vendors respond by bolting on AI features, which is the "powered by AI" translation exercise from Class 2.

You now have a strong question at every renewal: what would this cost to build for our specific way of working? Sometimes the answer is still "buy". At least now it's a real comparison instead of a shrug.

## Myth, meet reality

**"Only programmers can build software, so non-technical owners should stay out of it."** That was true when building meant years of specialised work. It stopped being true in stages, and AI coding tools removed most of what remained.

A non-technical owner who can describe their process precisely, who knows exactly what happens between a customer's phone call and the job sheet, can now produce working internal tools with a chat assistant, without reading a line of the code.

The myth survives because it suits software vendors, and because the real caveats are easy to confuse with "you can't". The honest statement is narrower and more useful: you can build internal, low-stakes tools yourself this month. You shouldn't build anything that holds other people's personal information, takes payments, or that the business would suffer to lose, without a professional owning security and support. Inside that boundary, the person closest to the problem is often the best person to build the fix.

## Your exercise: napkin to prototype

1. Write the most annoying repetitive process in your work on one card, in three sentences, as if explaining it to a new employee. If your first draft is vague, rewrite it.
2. Turn the card into a build request using this template: what the tool takes in, what it does, what it produces, who uses it, plus the line "this is an internal prototype, use fake data only".
3. Run it in any assistant that can write code. Save the result as a single HTML file if offered, and open it in your browser. If something breaks, paste the error message back in and ask for a fix. That loop is the whole skill.
4. Use the tool once on a realistic but fake example, and write down the first thing you'd fix.
5. Make the tier call in one sentence: usable internally next week as it is, or needs a professional before anyone outside the business touches it?

The gap between those two lists is the lesson of this class.

## Explain it back

Your business partner asks: "If AI can write software now, why would we ever pay a developer again?" In three sentences, with no jargon, give them the honest answer. Then compare it with "The short version" and the DIY rules.

If you couldn't explain why it got cheaper, reread the restaurant. If you weren't sure where the line sits, reread the shed and the wiring.

## Before you move on

- I can explain why custom software got cheap, in one sentence, to a colleague.
- I have one napkin idea sorted into a tier, with reasons.
- I know which traps my idea would walk into, and the first step over each.

## Words used in this class

- **Marginal cost:** what one extra copy or one extra user costs. For software in 2026, near zero. The whole story of this class.
- **AI coding assistant:** a tool that writes, explains and fixes code from plain-English requests. The sous-chef.
- **Vibe coding:** describing software conversationally and accepting the code without reading it. Flat-pack without the instructions. Fine for prototypes and internal tools, never for sensitive or customer-facing work.
- **Prototype:** a first working version, built to learn from, not to rely on.
- **Hosting:** the rented computer where a tool lives so other people can reach it.
- **Dependencies:** other people's free code building blocks that your tool relies on. They need occasional updates, like recalled car parts.
- **Secrets:** passwords, access keys and similar credentials. Store them properly, never paste them into chat tools.
- **Production-ready:** a prototype that has been made secure, backed up, monitored and supported, usually by a professional. Also called "productionising" it.
- **Local LLM-assisted development:** running a coding model on your own hardware inside your code editor, so your code never leaves the building.
