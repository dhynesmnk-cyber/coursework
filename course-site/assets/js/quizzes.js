/* quizzes.js — end-of-class quizzes. One per class, five questions each.
 * Format: { classIndex (0-based), questions: [{ q, options[4], answer (0-3), why }] }
 */
window.COURSE_QUIZZES = [
  {
    classIndex: 0,
    questions: [
      {
        q: "What is an AI model, in the plainest accurate terms?",
        options: [
          "A small robot living in the cloud that reads your messages",
          "A stack of billions of numbers that performs very fast pattern-matching on text",
          "A database that stores every answer ever written and looks yours up",
          "A program that understands language the way a person does",
        ],
        answer: 1,
        why: "A model is a sound desk with billions of locked sliders: numbers doing very fast pattern-matching. It is not a lookup database and it does not understand; both of those ideas lead to trusting output you should check.",
      },
      {
        q: "ChatGPT, Claude, Gemini and Copilot are best described as:",
        options: [
          "Four different names for the same model",
          "Models themselves, sold under different brands",
          "Software products wrapped around models, with their own billing, terms and features",
          "Government-regulated utilities, like electricity",
        ],
        answer: 2,
        why: "The model is the engine; the product is the car. That distinction is what lets you compare, swap and negotiate these tools like any other software purchase.",
      },
      {
        q: "When a model produces a confident sentence that is factually wrong, this happens because:",
        options: [
          "Someone hacked it",
          "It is optimised for plausible-sounding continuation, not truth",
          "Your prompt was rude",
          "The internet was slow",
        ],
        answer: 1,
        why: "Plausible is not the same as true. Like a student bluffing an exam essay, it knows what a good answer sounds like, not what is true. That is 'hallucination', and the reason every name, number, date and citation needs a human check.",
      },
      {
        q: "The biggest practical shift AI brings to small business, according to this course, is:",
        options: [
          "Robots replacing most jobs within five years",
          "Software that thinks like a human expert",
          "The near-zero marginal cost of customised software",
          "Free marketing for everyone",
        ],
        answer: 2,
        why: "Copying and running software is now effectively free, and AI tools write much of the routine code. Tools that once cost $200,000 to build can now be assembled in days.",
      },
      {
        q: "The 'context window' is:",
        options: [
          "The screen the model shows you",
          "The amount of text the model can consider at once, like the size of its desk",
          "A time limit on your subscription",
          "The period in which the model was trained",
        ],
        answer: 1,
        why: "Everything in a conversation shares the desk. When it overflows, the oldest material falls off the edge, which is why long chats get dumber and fresh chats work better.",
      },
    ],
  },
  {
    classIndex: 1,
    questions: [
      {
        q: "The field test for separating marketing from reality is:",
        options: [
          "If the vendor is a big brand, the claim is real",
          "If the demo was impressive, the product is good",
          "If a claim requires imagining a future that hasn't arrived, it's marketing; if it describes what the software does today with your data, it's probably real",
          "If the price is high, the capability must be high",
        ],
        answer: 2,
        why: "Present tense and verifiable beats future tense and vivid, every time.",
      },
      {
        q: "What happened in the Deloitte case of October 2025?",
        options: [
          "Deloitte's AI won a government contract",
          "Deloitte Australia partially refunded a government report after reviewers found AI-generated errors, including invented references",
          "Deloitte proved AI cannot make mistakes",
          "Deloitte was banned from using computers",
        ],
        answer: 1,
        why: "A global firm with every resource still shipped confident nonsense. It was caught by a human who checked the citations, which is exactly the habit this course drills.",
      },
      {
        q: "The antidote to a choreographed vendor demo is:",
        options: [
          "Asking for a bigger discount",
          "Reading more of their website",
          "A pilot test: your data, your task, your success measure, agreed in writing beforehand",
          "Trusting the reference logos on their homepage",
        ],
        answer: 2,
        why: "If a vendor refuses a pilot on your material, treat the refusal as the answer.",
      },
      {
        q: "When Klarna said its AI was doing the work of 700 customer-service agents, the later reality was:",
        options: [
          "The number was independently audited and confirmed",
          "The company began rehiring human staff after admitting quality suffered",
          "700 more agents were replaced",
          "The claim was about a different company",
        ],
        answer: 1,
        why: "'Handles the volume of X agents' is a marketing figure, not a measured replacement. Cost cutting advertised as AI transformation is what Forrester calls AI washing.",
      },
      {
        q: "'Enterprise-grade' in a brochure most reliably means:",
        options: [
          "The software never makes mistakes",
          "It passed government certification",
          "It is a pricing tier, not a quality guarantee",
          "It runs on your own hardware",
        ],
        answer: 2,
        why: "Learn to translate the sizzle vocabulary: enterprise-grade is about the contract size, not the capability.",
      },
    ],
  },
  {
    classIndex: 2,
    questions: [
      {
        q: "When you type a client's details into a consumer chatbot, the data:",
        options: [
          "Stays on your device",
          "Is instantly and permanently deleted after the reply",
          "Travels to the vendor's servers and is stored under their policy and your plan tier",
          "Is only visible to you",
        ],
        answer: 2,
        why: "Follow the data: it is transmitted, stored, logged, and possibly reviewed. Deleting the chat later removes your view of it, not necessarily their copies.",
      },
      {
        q: "The single most useful purchase for a small business using AI at work is:",
        options: [
          "The most expensive model available",
          "A faster laptop",
          "Moving staff from free consumer accounts onto a business tier",
          "A prompt-engineering course",
        ],
        answer: 2,
        why: "The business tier is where the contractual protections live: no training on your content, a data processing agreement, admin controls, defined retention.",
      },
      {
        q: "Running a model locally (for example Llama via Ollama) means:",
        options: [
          "The model runs on your hardware and your data never leaves the building",
          "The model is smaller and lives in a browser tab",
          "You must pay Meta per query",
          "Your data is encrypted on the vendor's server",
        ],
        answer: 0,
        why: "Local gives privacy, control and offline use; the trade-off is capability and the maintenance burden of owning it.",
      },
      {
        q: "Under the Australian Privacy Principles, when staff paste personal information into a US-hosted AI tool:",
        options: [
          "The vendor becomes legally responsible for it",
          "Nothing; the Privacy Act does not cover AI",
          "You generally remain responsible for how it is handled overseas (APP 8), and must take reasonable steps to protect it (APP 11)",
          "It is automatically a notifiable data breach",
        ],
        answer: 2,
        why: "Obligations follow the data, not the server location. Business tiers, minimising what you paste and a written policy are the 'reasonable steps'.",
      },
      {
        q: "'Training on your data' means:",
        options: [
          "The AI company can sell your client list",
          "Your prompts and documents may be used to adjust the model's numbers for future versions",
          "The model reads your files every night",
          "Your staff must complete a training course",
        ],
        answer: 1,
        why: "Think of a teacher whose habits are shaped by marking thousands of essays: your essay nudged them, but it is not in a filing cabinet anyone can open. The everyday risks are retention, human review and breaches, which is why tier choice beats any in-chat setting.",
      },
    ],
  },
  {
    classIndex: 3,
    questions: [
      {
        q: "A good prompt has four parts:",
        options: [
          "Please, thank you, urgently, ASAP",
          "Role, task, material, constraints",
          "Question, answer, follow-up, rating",
          "Length, font, colour, tone",
        ],
        answer: 1,
        why: "Who it should act as, what to do, the real material to work from, and the limits. Most bad prompts are missing the material and the constraints.",
      },
      {
        q: "Why do very long conversations get worse near the end?",
        options: [
          "The model gets tired",
          "The vendor throttles long chats",
          "The context window overflows and the oldest material falls off the desk",
          "Your internet connection degrades",
        ],
        answer: 2,
        why: "Start a new chat for a new task, and let Projects or Gems carry the standing material instead.",
      },
      {
        q: "A system prompt is:",
        options: [
          "A prompt the vendor refuses to show you",
          "Standing instructions applied before every one of your messages, shaping tone, format and rules",
          "The password for your account",
          "A prompt that must be written in code",
        ],
        answer: 1,
        why: "It is the laminated card on a temp's desk: a briefing you write once and it is read every time. Document 1 has three ready-made templates and exactly where to paste them per platform.",
      },
      {
        q: "The most reliable way to reduce invented facts in output is to:",
        options: [
          "Ask the model to promise not to make things up",
          "Use ALL CAPS in the prompt",
          "Supply the real material, instruct it to answer only from that material, and check names, numbers, dates and citations anyway",
          "Restart the computer",
        ],
        answer: 2,
        why: "Grounding instructions reduce invention; checking remains non-negotiable. There is no setting that makes verification optional.",
      },
      {
        q: "The best defence against a generic, useless first draft is:",
        options: [
          "Switching to a different platform",
          "Iteration: read critically, correct, narrow, re-run; two or three rounds beats one perfect attempt",
          "Asking for it to be 'world-class'",
          "Giving up and writing it manually",
        ],
        answer: 1,
        why: "You are steering a pattern-matcher with feedback. Correction rounds are the actual skill; magic words are theatre.",
      },
    ],
  },
  {
    classIndex: 4,
    questions: [
      {
        q: "Why was custom software so expensive in 1995?",
        options: [
          "Computers were made of gold",
          "Developers, servers, licences and physical distribution all cost real money per copy and per user",
          "The government taxed software",
          "Nobody knew how to program",
        ],
        answer: 1,
        why: "High marginal cost meant shrink-wrapped software built once and sold to thousands. That cost has collapsed, which is the actual story of this decade.",
      },
      {
        q: "'Vibe coding' is acceptable when:",
        options: [
          "The app takes payments from customers",
          "The app holds clients' personal information",
          "The tool is an internal prototype with fake data and low stakes",
          "Never, under any circumstances",
        ],
        answer: 2,
        why: "Like DIY at home: you can change a light bulb (tier one) or build a garden shed (tier two), but wiring (tier three: anything regulated, customer-facing or critical) needs a licensed professional owning security and support.",
      },
      {
        q: "Local LLM-assisted development (code assistance running on your own hardware) matters most when:",
        options: [
          "You want the largest possible model",
          "Your code must never leave the building, for example under NDA or client confidentiality rules",
          "You have no internet at all, ever",
          "You want free enterprise support",
        ],
        answer: 1,
        why: "Local tools trade some capability for total control of where your code goes. Cloud business tiers with no-training terms are the pragmatic middle for most firms.",
      },
      {
        q: "The updated buy-versus-build rule is:",
        options: [
          "Never build anything",
          "Always build everything",
          "Buy the standard stuff (email, accounting, payroll), build the genuinely specific 10%, never build regulated systems yourself",
          "Build first, buy only if the build fails",
        ],
        answer: 2,
        why: "AI moved the line toward building for niche internal needs; it did not erase the line.",
      },
      {
        q: "The line item everyone forgets when building small tools is:",
        options: [
          "The domain name",
          "The coffee",
          "Maintenance: updates, backups, dependencies, and what happens when it breaks on a Friday",
          "The electricity",
        ],
        answer: 2,
        why: "Software is a plant, not a purchase. 'It only runs on Brad's laptop' is a business continuity incident waiting to happen.",
      },
    ],
  },
  {
    classIndex: 5,
    questions: [
      {
        q: "'Shadow AI' means:",
        options: [
          "AI tools that spy on employees",
          "Staff using AI tools for work without the business knowing or approving",
          "A brand of AI software",
          "AI used after hours only",
        ],
        answer: 1,
        why: "The shadow is the invisibility, not malice. The fix is amnesty plus approved tools plus a one-page policy, not a ban.",
      },
      {
        q: "Why do outright AI bans usually fail?",
        options: [
          "Employees are disobedient by nature",
          "Bans are illegal in Australia",
          "They are unenforceable and invisible, so the usage that happens is hidden, which is exactly the risk",
          "AI vendors block banned businesses",
        ],
        answer: 2,
        why: "Banning AI in 2026 is like banning the photocopier in 1986. Surfacing usage beats suppressing it.",
      },
      {
        q: "The four habits that prevent almost every AI incident are:",
        options: [
          "Buy, deploy, train, celebrate",
          "Work data on work accounts, the decision drill before pasting, a person checks what leaves the building, same-day reporting",
          "Firewalls, antivirus, backups, passwords",
          "Read, write, delete, repeat",
        ],
        answer: 1,
        why: "Like food safety in a kitchen: unexciting habits that prevent almost every disaster. Work data on work accounts; screen before pasting; check what leaves the building; tell someone the same day when it goes wrong.",
      },
      {
        q: "If a client asks whether AI was used on their deliverable, the course says:",
        options: [
          "Deny it",
          "Change the subject",
          "Answer honestly and specifically: which tools, which tier, and what a human checked",
          "Say AI does everything now",
        ],
        answer: 2,
        why: "'We draft with contracted AI tools and a qualified person checks everything before it reaches you' is a respectable sentence. Being caught implying verification that never happened ends relationships.",
      },
      {
        q: "A complete AI governance rollout for a business of up to ~50 people takes about:",
        options: [
          "One week: named owner, approved tools, policy circulated, amnesty, tiers fixed, incident card pinned, toolbox talk",
          "Six months and a consultant",
          "One afternoon with no paperwork",
          "It cannot be done below 200 staff",
        ],
        answer: 0,
        why: "One named person, one page, one conversation. Ownership is the difference between paperwork and practice.",
      },
    ],
  },
];

/* Worksheets: one per class, turning the in-class exercise into a
 * self-learner worksheet. Fields are saved to the learner's progress
 * and printable. types: text, textarea, checklist.
 */
window.COURSE_WORKSHEETS = [
  {
    classIndex: 0,
    title: "Worksheet 1: Two prompts, one task",
    intro:
      "You will run one real work task through two different AI products and compare, exactly as the class exercise does. Use free accounts if that is all you have. Nothing sensitive goes in (apply the decision drill: personal information, secrets, NDA).",
    fields: [
      { id: "task", label: "1. Write your real work task as a prompt", type: "textarea", placeholder: "e.g. Draft a polite reminder email to a customer who is 30 days overdue on an invoice of $2,300." },
      { id: "toolA", label: "2. Product A you used (ChatGPT / Claude / Gemini / Copilot)", type: "text" },
      { id: "toolB", label: "3. Product B you used", type: "text" },
      { id: "compare", label: "4. Compare: length, tone, confidence. Did either invent a detail (fake rate, fake deadline)? Which needs less editing?", type: "textarea" },
      { id: "constraint", label: "5. Now add one hard constraint (e.g. 'max 80 words, no apologies, mention work continues on schedule') and re-run on both. What changed?", type: "textarea" },
      { id: "lesson", label: "6. In one sentence: what is worth more, choosing a better product or being more specific?", type: "text" },
      { id: "explainBack", label: "7. Explain it back: in three sentences, with no technical words, explain to a colleague what an AI model is and why it sometimes makes things up. Which part was hardest to put simply? Reread that part of the class.", type: "textarea" },
    ],
  },
  {
    classIndex: 1,
    title: "Worksheet 2: Roast this brochure",
    intro:
      "Find one piece of real AI marketing: a vendor email, a product page, a flyer, a LinkedIn post from a software company. You are going to apply the field test to it.",
    fields: [
      { id: "source", label: "1. What are you roasting? (vendor and product)", type: "text" },
      { id: "today", label: "2. Copy two sentences that describe verifiable today-behaviour", type: "textarea" },
      { id: "future", label: "3. Copy two sentences that require imagining the future ('will', 'soon', 'imagine')", type: "textarea" },
      { id: "rewrite", label: "4. Rewrite the two future sentences as honest present-tense claims", type: "textarea" },
      { id: "questions", label: "5. Write the three hardest questions from the vendor meeting script that this material avoids answering", type: "textarea" },
      { id: "verdict", label: "6. Verdict: would this vendor survive a pilot test on your data? One sentence.", type: "text" },
      { id: "explainBack", label: "7. Explain it back: in three sentences, with no jargon, explain to a colleague how to tell an AI claim worth testing from a brochure. Which part was hardest to put simply?", type: "textarea" },
    ],
  },
  {
    classIndex: 2,
    title: "Worksheet 3: Settings safari",
    intro:
      "Do this on the AI account you use most. Five findings, ten minutes. If you have a work account, do the work one instead (or as well).",
    fields: [
      { id: "tool", label: "1. Which tool and which tier (free / paid personal / work account)?", type: "text" },
      { id: "privacyPath", label: "2. The click-path to its data/privacy settings (write it down; menus move)", type: "text" },
      { id: "trainingToggle", label: "3. Did you find the 'use my data for training / product improvement' toggle? What is it set to now?", type: "textarea" },
      { id: "history", label: "4. Where do you view or delete stored history? Did you delete anything old?", type: "textarea" },
      { id: "temp", label: "5. Does the tool have a temporary / no-save chat mode? Run one prompt through it. What did the interface say would change?", type: "textarea" },
      { id: "adminQuestion", label: "6. If this is a work account: one question to ask your admin next week (e.g. 'are we on a business tier where content is excluded from training?')", type: "text" },
      { id: "explainBack", label: "7. Explain it back: in three sentences, with no jargon, explain to a new staff member where a pasted customer email goes and what they should check first. Which part was hardest to put simply?", type: "textarea" },
    ],
  },
  {
    classIndex: 3,
    title: "Worksheet 4: Build your standing setup",
    intro:
      "By the end of this worksheet your most-used AI tool permanently knows your business. Have one real, non-sensitive work document to hand (redact first if needed).",
    fields: [
      { id: "systemPrompt", label: "1. Draft your five-line system prompt (who we are, who we write to, tone, formats, one 'never' rule). Start from the Document 1 template.", type: "textarea" },
      { id: "installed", label: "2. Where did you paste it? (Custom instructions / Profile / Gem / Project / LM Studio preset)", type: "text" },
      { id: "testTask", label: "3. The real task you tested it on, with your real document", type: "textarea" },
      { id: "correction", label: "4. The one correction you gave it in round two, and how the output improved", type: "textarea" },
      { id: "nextWeek", label: "5. The recurring task this setup will handle next week (this is the commitment that makes it stick)", type: "text" },
      { id: "explainBack", label: "6. Explain it back: in three sentences, with no jargon, explain to a colleague why their AI tool gives generic answers and how a standing briefing fixes it. Which part was hardest to put simply?", type: "textarea" },
    ],
  },
  {
    classIndex: 4,
    title: "Worksheet 5: Napkin to prototype",
    intro:
      "Pick the single most annoying repetitive process in your work and take it as far as a prototype, or as far as an honest decision not to. Use fake data only.",
    fields: [
      { id: "process", label: "1. Describe the process in three sentences, as if to a new employee", type: "textarea" },
      { id: "request", label: "2. Your build request: what goes in, what it does, what comes out, who uses it, plus 'internal prototype, fake data only'", type: "textarea" },
      { id: "result", label: "3. What did the tool produce? Did it run? What broke?", type: "textarea" },
      { id: "firstFix", label: "4. The first thing you would fix after one realistic (fake-data) use", type: "text" },
      { id: "tier", label: "5. Tier call: usable internally next week as-is, or needs a professional before anyone outside touches it? Why?", type: "textarea" },
      { id: "explainBack", label: "6. Explain it back: in three sentences, with no jargon, explain to your business partner what you can safely build yourself and where you'd pay a professional. Which part was hardest to put simply?", type: "textarea" },
    ],
  },
  {
    classIndex: 5,
    title: "Worksheet 6: Your one-week rollout",
    intro:
      "This is the governance rollout from Class 6, filled in for your business. When it is complete, print it: it is your action plan for Monday.",
    fields: [
      { id: "owner", label: "1. Named owner of the policy, tool register and incident log", type: "text" },
      { id: "tools", label: "2. The two or three tools you will approve, and the tier each will be on", type: "textarea" },
      { id: "register", label: "3. First line of your tool register (tool / tier / who uses it / what data touches it)", type: "text" },
      { id: "reporting", label: "4. Where 'oops' reports go (email or phone), and the same-day rule", type: "text" },
      { id: "amnesty", label: "5. When you will ask the team what they are already using, no consequences", type: "text" },
      { id: "toolbox", label: "6. Date of the ten-minute toolbox talk (Documents 3, 8 and 10)", type: "text" },
      { id: "firstWords", label: "7. The first sentence you will say to your team on Monday", type: "textarea" },
      { id: "explainBack", label: "8. Explain it back: in three sentences, with no jargon, answer a staff member who asks 'are we in trouble for using ChatGPT?'. Does it sound like an invitation or a warning?", type: "textarea" },
    ],
  },
];
