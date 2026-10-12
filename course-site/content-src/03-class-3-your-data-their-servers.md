# Class 3: Your Data, Their Servers
### Cloud versus local AI, what "training on your data" means, and what Australian privacy law expects of you

**Time:** about 25 minutes of reading, plus a 10-minute settings exercise.
**By the end of this class you can:** trace where your text goes when you type it, choose between cloud, local and contracted business tiers for a given task, switch off training on your data on each major platform, and run a three-question drill before pasting anything sensitive.

## Follow one message on its journey

You type a customer's details into a chatbot and press enter. Your text travels over the internet to the vendor's servers, usually in the United States. A model running on their hardware processes it together with everything else in the conversation, and a reply travels back. On the way, your text is typically stored in your account history so you can see past chats, logged on the vendor's systems for operations and safety work, and in some circumstances readable by vendor staff or contractors reviewing flagged or sampled conversations. Later, when you delete the chat, you remove your view of it and start the vendor's deletion process. You do not make the text un-happen. Hold that journey in mind. Every rule in this class is a decision about one leg of it.

## Cloud AI, stated honestly

You get convenience (nothing to install or maintain), scale (the biggest models live in datacentres, not laptops) and automatic updates. You give up control over exactly where your data sits, who at the vendor can technically access it, and what happens to it under legal process in the vendor's home country. For a small Australian business the practical risk of that last point is low, but it is not zero and it is not yours to waive, so it belongs in the decision rather than in a blind spot.

## Local AI, stated honestly

The model runs on your own machine or office server. Your data never leaves the building, you can work offline, and nobody's terms of service stand between you and your files. In exchange you own the maintenance: someone chooses the model, installs updates, and notices when quality drops. And the models that fit on ordinary hardware are smaller than the frontier cloud models, so they trail them on hard reasoning while being perfectly adequate for drafting, summarising and searching your own material.

## What local actually needs in 2026

Useful rules of thumb. A small open-weights model (a model whose numbers are published so anyone can run it, such as Meta's Llama family, or Qwen, Mistral and Gemma models of similar size, around 7 to 9 billion parameters, where a parameter is one number in the model) runs acceptably on a machine with 16GB of memory, including an ordinary modern laptop and any Apple Silicon Mac with 16GB. A mid-size model of 12 to 32 billion parameters wants 24 to 32GB of memory or a graphics card with 12GB or more of video memory. The free tools that make this close to point-and-click are Ollama and LM Studio: install one, click a model name, and you have a private chatbox. That is genuinely the whole setup.

## The hybrid pattern we recommend

Do not treat this as an either-or decision, because in practice it is a sorting rule.

- Cloud consumer tools, free or cheap tiers: low-sensitivity work. Marketing copy, brainstorming, summarising public documents, translating jargon.
- Contracted business tiers, such as ChatGPT Business, Claude Team, Microsoft 365 Copilot or Google Workspace with Gemini: ordinary work data, because these tiers carry contractual promises not to train on your content and come with admin controls.
- Local models, or a contracted tool with a signed agreement: the genuinely sensitive material. Anything under a non-disclosure agreement, health information, pre-decisional financials, employee disputes, raw client lists.

Most ten-person businesses land comfortably on the middle row plus one local option for the sharp edges.

## "Training on your data", precisely

Training means adjusting a model's numbers using text. If a vendor trains on your data, your prompts and documents may influence future versions of a model that everyone uses. What this does not mean: your client list does not become a database another user can query. Regurgitation of one small business's documents is very unlikely. The everyday risks are quieter and more certain: retention (your data sitting in vendor logs for months or years), human review (vendor staff reading sampled or flagged conversations), and exposure if the vendor is breached. Training sets the headline. Retention and review set the daily reality.

## The opt-out map, consumer tiers

Settings move, so treat these as the shape of the thing and re-check quarterly. The exact click-paths live in Document 5.

- **ChatGPT:** Free and Plus conversations may be used to improve models unless you opt out in Settings, Data controls. Pro is excluded. Business and Enterprise are excluded by contract.
- **Claude:** consumer chats are kept about 30 days by default, and since the August 2025 terms change, training on your chats is an opt-in. If you opt in, retention stretches to five years, so leave it off at work. Team and Enterprise content is not used for training.
- **Gemini:** consumer prompts feed product improvement only if Gemini Apps Activity is switched on. Find it and switch it off. Workspace business prompts are not used to train models outside your organisation by default.
- **Copilot:** consumer Copilot chats may be used to improve Microsoft's services unless you opt out in privacy settings. Anything used while signed in with a work or school account sits under commercial data protection and is not used to train foundation models.
- **Local tools:** nothing is transmitted, so there is nothing to opt out of.

## The cheapest security upgrade in this course

Move staff off free consumer accounts and onto a business tier. The core of what you buy is contractual: no training on your business content, a data processing agreement, admin controls and defined retention. On consumer tiers those promises mostly do not exist. For roughly the price of a lunch per person per month, the scariest paragraph in this class stops applying to you.

## What a data processing agreement is

A DPA (data processing agreement, the contract clauses saying what a vendor may do with personal information you hand it: purpose limits, security measures, breach notification, deletion on request, subcontractor rules) comes with business and enterprise tiers automatically. Consumer tiers offer no DPA and no equivalent promise. If your business handles personal information and staff use AI tools for work, you need the tool's business tier with its DPA, or you need to keep sensitive data out of the tool. There is no third option that survives scrutiny.

## The Australian Privacy Act, briefly and practically

Who is covered: organisations with annual turnover above $3 million, plus many smaller ones regardless of size, including health service providers, businesses that trade in personal information and Commonwealth contractors. A small-business exemption still exists but has been flagged for removal in future reform rounds, so do not build a strategy on it. What matters for AI tools, in four points.

1. APP 8 (the Australian Privacy Principle on cross-border disclosure): when staff paste personal information into a US-hosted chatbot, you generally remain responsible for how it is handled overseas. Contractual protections are your friend here.
2. APP 11 (security): you must take reasonable steps to protect personal information. A written AI policy plus business-tier accounts are exactly such steps.
3. From 10 December 2026, privacy policies must describe significant automated decision-making (decisions about people made or substantially shaped by software, AI included).
4. A statutory tort for serious invasions of privacy has applied since June 2025, and if a vendor suffers a breach involving your personal information that risks serious harm, the Notifiable Data Breaches scheme may require you to tell the regulator, the OAIC (the Office of the Australian Information Commissioner), and the affected people.

None of this needs a lawyer for basic compliance. All of it needs one page of policy, which Class 6 and Documents 3 and 5 hand you.

## The decision drill

Three questions before anything goes into a tool. Does this text contain personal information, secrets, or anything under a non-disclosure agreement? If yes, is the tool on a business tier with a DPA, or running locally? If neither, rewrite the prompt to remove the sensitive parts (initials instead of names, "a client" instead of the client) or move to the local tool. Repeat until automatic. This drill is 90 percent of AI data hygiene.

## Myth, meet reality

**"If I delete the chat, the data is gone."** Deletion removes your view, not necessarily their copies. Consumer-tier conversations typically persist in logs for a period after deletion, longer if they were selected for training or flagged for review, and deletion does nothing about copies in transit, caches or backups. On business tiers, retention is contractually defined and deletion requests are honoured in a stated timeframe, which is part of what you pay for. Treat anything you paste into a consumer tool as permanent, because you cannot reliably make it impermanent afterwards. The decision about what not to paste happens before the paste.

## Your exercise: settings safari

1. Open the AI account you use most, on the device you use most.
2. Find three things and write down the click-path, because menus move: the data or privacy settings page, the toggle controlling whether conversations are used for training or product improvement, and the place to view or delete stored history.
3. Turn the training or improvement toggle off. Read what the interface says will change.
4. Find the temporary or no-save chat mode, if the tool has one, and run one harmless prompt through it.
5. If this is a work account, write one question for your admin, for example: are we on a business tier where our content is excluded from training? Ask it next week. The finding of this exercise is usually the same one: the controls exist, and nobody advertises them.

## Before you move on

- I can say where my text goes when I type it into my usual tool.
- I know which tier my account is on and whether training is off.
- I can run the decision drill out loud without reading it.

## Words used in this class

- **Cloud AI:** the model runs on the vendor's servers and your data travels to them.
- **Local AI:** the model runs on your hardware and your data stays with you.
- **Open weights:** a model whose numbers are published so anyone can download and run it, often free for businesses below a very large size.
- **Parameter:** one of the numbers in a model. "8B parameters" means eight billion numbers, and more of them generally means more capability and more hardware.
- **Ollama and LM Studio:** free programs that make running a local model close to point-and-click.
- **Retention:** how long the vendor keeps your data even without training on it. The quieter, more certain risk.
- **DPA:** data processing agreement, the contract defining what a vendor may do with your personal information.
- **APP:** Australian Privacy Principle, one of the 13 rules in the Privacy Act. APP 8 covers cross-border disclosure, APP 11 covers security.
- **Notifiable Data Breaches scheme:** the requirement to tell the OAIC and affected people about eligible breaches likely to cause serious harm, including breaches at your vendor.
- **ADM:** automated decision-making, decisions about people made or substantially shaped by software. Disclosure duties begin 10 December 2026.
