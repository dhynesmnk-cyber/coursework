# Class 3: Your Data, Their Servers
### Cloud versus local AI, what "training on your data" means, and what Australian privacy law expects of you

**Time:** about 25 minutes of reading, plus a 10-minute settings exercise.
**By the end of this class you can:** trace where your text goes when you type it, choose between cloud, local and contracted business tiers for a given task, switch off training on your data on each major platform, and run a three-question drill before pasting anything sensitive.

## The short version

When you type into a chatbot, you are sending your words to someone else's computer, and they keep a copy. Paid business accounts come with a contract about what they may do with that copy; free accounts mostly don't. So the rule is simple: work data goes into work accounts, and anything truly sensitive either stays out or stays on your own machine.

## Follow one message on its journey

Picture typing into a chatbot as posting a letter to a company overseas.

You write a customer's details into the chat and press enter. The letter travels over the internet to the vendor's computers, usually in the United States. Their model reads it, along with everything earlier in the conversation, and posts a reply back. Along the way, three things usually happen to your letter:

- **It's filed.** A copy goes into your chat history, so you can scroll back to it.
- **It's logged.** A copy sits in the vendor's own records, for running and protecting the service.
- **It may be read.** In some circumstances, vendor staff or contractors read a sample of conversations, or ones flagged by their safety systems.

When you later delete the chat, you shred your own copy and ask the vendor to shred theirs, which they do on their own timetable. You can't un-post the letter.

Hold that journey in mind. Every rule in this class is a decision about one leg of it.

## Cloud AI, honestly

**Cloud AI** means the model runs on the vendor's computers. Class 1 compared it to a hire car.

What you get: nothing to install or maintain, the biggest and most capable models (which live in warehouses of computers, not laptops), and automatic updates.

What you give up: control over exactly where your data sits, who at the vendor could technically see it, and what happens to it under the laws of the vendor's home country. For a small Australian business the practical risk of that last point is low. It isn't zero, though, and it isn't yours to wave away on your customers' behalf, so it belongs in the decision rather than in a blind spot.

## Local AI, honestly

**Local AI** means the model runs on your own computer or office server. That's the ute you own.

What you get: your data never leaves the building, it works with no internet, and nobody's terms and conditions sit between you and your files.

What you give up: you do the servicing. Someone has to choose the model, install updates and notice if the quality drops. And the models small enough to run on ordinary computers are less capable than the biggest cloud ones. They trail on hard reasoning, but they're perfectly good at drafting, summarising and searching your own documents.

## What local needs in 2026

A model is a stack of numbers, and each number is called a **parameter**. More parameters usually means a more capable model, and also a bigger file that needs more memory to run. Think of it as a bigger book needing a bigger desk to lay it open on.

Rough rules of thumb:

- **Small models,** around 7 to 9 billion parameters, run acceptably on a computer with 16GB of memory. That includes an ordinary modern laptop and any Apple Silicon Mac with 16GB. Examples are Meta's Llama family and similar-sized Qwen, Mistral and Gemma models. These are **open-weights** models, meaning their numbers are published so anyone can run them.
- **Mid-size models,** 12 to 32 billion parameters, want 24 to 32GB of memory, or a graphics card with 12GB or more of its own memory.

Two free programs make this close to point-and-click: **Ollama** and **LM Studio**. Install one, click a model name, and you have a private chat window. That's genuinely the whole setup.

## The hybrid pattern we recommend

Don't treat cloud versus local as either-or. Treat it as a sorting rule, like deciding what goes in the general bin, the recycling and the locked shredding bin.

- **Free or cheap consumer accounts:** low-sensitivity work. Marketing copy, brainstorming, summarising public documents, translating jargon.
- **Contracted business accounts,** such as ChatGPT Business, Claude Team, Microsoft 365 Copilot or Google Workspace with Gemini: ordinary work data. These tiers carry contract promises not to train on your content, and they come with admin controls.
- **Local models, or a contracted tool with a signed agreement:** the genuinely sensitive material. Anything under a non-disclosure agreement, health information, financials before they're announced, employee disputes, raw client lists.

Most ten-person businesses land comfortably on the middle row, plus one local option for the sharp edges.

## "Training on your data", precisely

Picture a teacher who marks thousands of essays every year. Reading all those essays slowly changes how the teacher thinks good writing looks, and that shapes next year's teaching. Your essay played a tiny part. But the teacher can't hand your essay to another student, because it isn't kept in a filing cabinet for anyone to open. It just nudged their habits.

**Training on your data** is like that. Your prompts and documents may be used to adjust the numbers inside a future version of a model that everyone uses. It does not mean your client list becomes a database another customer can search. A model repeating one small business's documents word for word is very unlikely.

The everyday risks are quieter, and more certain:

- **Retention:** your data sitting in the vendor's records for months or years. That's the essay sitting in the staffroom filing cabinet.
- **Human review:** vendor staff reading sampled or flagged conversations.
- **Breaches:** your data being exposed if the vendor is hacked.

Training is the headline. Retention and review are the daily reality.

## The opt-out map, consumer accounts

Settings move, so treat this as the shape of things and re-check every quarter. The exact click-paths are in Document 5.

- **ChatGPT:** Free and Plus conversations may be used to improve models unless you opt out in Settings, Data controls. Pro is excluded. Business and Enterprise are excluded by contract.
- **Claude:** consumer chats are kept about 30 days by default, and since the August 2025 terms change, training on your chats is opt-in. If you opt in, retention stretches to five years, so leave it off at work. Team and Enterprise content is not used for training.
- **Gemini:** consumer prompts feed product improvement only if Gemini Apps Activity is switched on. Find it and switch it off. Workspace business prompts are not used to train models outside your organisation by default.
- **Copilot:** consumer Copilot chats may be used to improve Microsoft's services unless you opt out in privacy settings. Anything used while signed in with a work or school account sits under commercial data protection and isn't used to train foundation models.
- **Local tools:** nothing leaves your machine, so there's nothing to opt out of.

## The cheapest security upgrade in this course

Move staff off free consumer accounts and onto a business tier.

Think of the difference between letting a stranger mind your shop and hiring a staff member with a signed contract. The work might be identical. What changes is the paperwork: what they may do with what they see, how long they keep it, and who's responsible if it goes wrong.

That's what a business tier buys: no training on your business content, a data processing agreement, admin controls, and a defined time your data is kept. On consumer accounts those promises mostly don't exist. For roughly the price of a lunch per person per month, the scariest paragraph in this class stops applying to you.

## What a data processing agreement is

Think of the register a business keeps of who holds keys to the building: who has which key, which doors it opens, and when they hand it back.

A **data processing agreement**, or DPA, is that register for your customers' personal information. It's the part of the contract that says what the vendor may do with personal information you give it: what for, how it's secured, how fast they tell you about a breach, deleting it when asked, and the rules for any subcontractors.

Business and enterprise tiers come with a DPA automatically. Consumer accounts offer no DPA and nothing equivalent. If your business handles personal information and staff use AI tools for work, you need the tool's business tier with its DPA, or you need to keep sensitive data out of the tool. There's no third option that survives scrutiny.

## The Australian Privacy Act, briefly and practically

**Who's covered:** organisations with annual turnover above $3 million, plus many smaller ones regardless of size, including health service providers, businesses that trade in personal information, and Commonwealth contractors. A small-business exemption still exists, but it has been flagged for removal in future reforms, so don't build your plans on it.

The Act is built from 13 rules called the Australian Privacy Principles, or APPs. Four points matter for AI tools:

1. **APP 8, sending data overseas.** When staff paste personal information into a US-hosted chatbot, you generally stay responsible for how it's handled overseas. It's like a builder who stays responsible for a subcontractor's work. Contract protections are your friend here.
2. **APP 11, security.** You must take reasonable steps to protect personal information. A written AI policy plus business-tier accounts are exactly such steps.
3. **Automated decisions.** From 10 December 2026, privacy policies must describe significant automated decision-making: decisions about people that software, including AI, makes or substantially shapes.
4. **Serious invasions and breaches.** A legal right to sue over serious invasions of privacy has applied since June 2025. And if a vendor suffers a breach involving your customers' personal information that risks serious harm, the Notifiable Data Breaches scheme may require you to tell the regulator (the Office of the Australian Information Commissioner, or OAIC) and the affected people.

None of this needs a lawyer for basic compliance. All of it needs one page of policy, which Class 6 and Documents 3 and 5 hand you.

## The decision drill

Before you paste anything, picture writing it on a postcard: something that passes through several hands on the way. Then ask three questions.

1. Does this text contain personal information, secrets, or anything under a non-disclosure agreement?
2. If yes, is the tool on a business tier with a DPA, or running locally?
3. If neither, rewrite the text to remove the sensitive parts (initials instead of names, "a client" instead of the client's name), or move to the local tool.

Repeat until it's automatic. This drill is 90 percent of AI data hygiene.

## Myth, meet reality

**"If I delete the chat, the data is gone."** Deleting removes your copy of the letter, not necessarily theirs.

Consumer conversations usually stay in the vendor's records for a while after you delete them, and longer if they were picked for training or flagged for review. Deleting does nothing about copies already in backups. On business tiers, how long data is kept is set by contract, and deletion requests are honoured within a stated time. That's part of what you pay for.

Treat anything you paste into a consumer tool as permanent, because you can't reliably make it impermanent afterwards. The decision about what not to paste happens before the paste.

## Your exercise: settings safari

1. Open the AI account you use most, on the device you use most.
2. Find three things and write down the click-path, because menus move: the data or privacy settings page, the switch that controls whether conversations are used for training or "product improvement", and the place to view or delete your history.
3. Turn the training or improvement switch off. Read what the screen says will change.
4. Find the temporary or no-save chat mode, if the tool has one, and run one harmless prompt through it.
5. If this is a work account, write one question for your admin, for example: "Are we on a business tier where our content is excluded from training?" Ask it next week.

The finding is usually the same: the controls exist, and nobody advertises them.

## Explain it back

Your newest staff member asks: "Is it okay if I paste a customer's complaint email into ChatGPT to help me reply?" In three sentences, with no jargon, explain what happens to that email and what they should do. Then compare your answer with "The short version" and the decision drill.

If you weren't sure where the email ends up, reread the letter's journey. If you mixed up training and retention, reread the teacher and the filing cabinet.

## Before you move on

- I can say where my text goes when I type it into my usual tool.
- I know which tier my account is on and whether training is off.
- I can run the decision drill out loud without reading it.

## Words used in this class

- **Cloud AI:** the model runs on the vendor's computers and your data travels to them. The hire car.
- **Local AI:** the model runs on your hardware and your data stays with you. The ute you own.
- **Open weights:** a model whose numbers are published, so anyone can download and run it. Often free for businesses below a very large size.
- **Parameter:** one of the numbers in a model. "8B parameters" means eight billion numbers. More usually means more capable, and more hardware.
- **Ollama and LM Studio:** free programs that make running a local model close to point-and-click.
- **Training on your data:** using your text to adjust the numbers in a future model. The teacher's habits, not a filing cabinet.
- **Retention:** how long the vendor keeps your data, even if it never trains on it. The quieter, more certain risk.
- **DPA:** data processing agreement, the contract saying what a vendor may do with your customers' personal information. The key register.
- **APP:** Australian Privacy Principle, one of the 13 rules in the Privacy Act. APP 8 covers sending data overseas, APP 11 covers security.
- **Notifiable Data Breaches scheme:** the requirement to tell the OAIC and affected people about breaches likely to cause serious harm, including breaches at your vendor.
- **ADM:** automated decision-making, decisions about people made or substantially shaped by software. Disclosure duties begin 10 December 2026.
