# Class 3: Your Data, Their Servers
### Cloud versus local AI, what "training on your data" means, and what Australian privacy law expects of you

---

## Registration page description (150 words)

When you type a customer's details into a chatbot, where do they go, who can see them, and can they come back to bite you? This class answers all three in plain English. We explain the difference between cloud AI (your data travels to a vendor's servers; you get convenience and scale) and local AI (the model runs on your own hardware; you get control and privacy, plus a maintenance burden), and we show what a sensible hybrid looks like for a small business: cloud tools for low-sensitivity tasks, local or contracted tools for customer data, financials and anything under a non-disclosure agreement. You will learn what "training on your data" actually means, how to opt out on ChatGPT, Claude, Gemini and Copilot step by step, and the practical Australian Privacy Act obligations that apply when your staff paste personal information into a US-hosted tool. Bring your phone: we will do the opt-out settings live, together, in class.

---

## Detailed outline

**1. Follow the data.**
Every AI interaction is a shipment. Your prompt (which may contain names, prices, diagnoses, quotes, employee grievances) travels over the internet to the vendor's servers, is processed by a model running on their hardware, and the reply travels back. The vendor's servers are usually in the United States, sometimes routed through other regions. Once data has made that trip, "delete it from my chat history" means something narrower than people assume.

**2. Cloud AI: the honest trade-off.**
You get convenience (nothing to install or maintain), scale (the biggest models live in datacentres, not laptops), and automatic updates. You give up control over exactly where your data sits, who at the vendor can technically access it, and what happens to it under legal process in the vendor's home country (for US providers, laws such as the CLOUD Act allow US authorities to compel data; the practical risk for a small Australian business is low but it is not zero and it is not yours to waive).

**3. Local AI: the honest trade-off.**
The model runs on your own machine or office server. Your data never leaves. You get privacy, control, and the ability to work offline. You give up convenience: someone has to install it, update it, and troubleshoot it, and the models that fit on ordinary hardware are smaller and less capable than the frontier cloud models. The gap has narrowed dramatically; for many drafting, summarising and search tasks a local model is now entirely adequate.

**4. What hardware local AI actually needs in 2026.**
Rules of thumb. A small open-weight model (around 7 to 9 billion parameters, for example Meta's Llama 3.1 8B or a Qwen or Gemma model of similar size) runs acceptably on a machine with 16GB of memory, including an ordinary modern laptop and any Apple Silicon Mac with 16GB unified memory; it is slow on a CPU-only Windows laptop but usable. A mid-size model (12 to 32 billion parameters) wants 16 to 32GB of memory and ideally a graphics card with 12GB+ of video memory or a Mac with 24GB+ unified memory. Beyond that you are buying serious hardware. The free tools that make this approachable are Ollama and LM Studio: you install one of them, click a model name, and you have a private chatbox. That is genuinely all it takes to start.

**5. The realistic limits of local for a non-technical user.**
Someone has to own it: choosing models, updating them, noticing when output quality drops. Setup is now easy; judgment is still required. The best local models still trail the best cloud models on hard reasoning. There is no built-in file ecosystem (your Google Drive does not appear inside Ollama). And a local model on one laptop is not shared with the office unless someone sets up a server. For most small businesses the honest conclusion is a hybrid, not a switch.

**6. The hybrid pattern we recommend.**
Cloud consumer tools (free or Plus-tier) for low-sensitivity work: drafting marketing copy, summarising public documents, brainstorming, plain-language translation of jargon. Contracted business tiers (ChatGPT Business/Team, Claude Team, Microsoft 365 Copilot, Google Workspace with Gemini) for work data, because those tiers come with contractual commitments not to train on your content and, for Microsoft and Google, integration with your existing permissions. Local models for the genuinely sensitive: anything under NDA, health information, pre-decisional financials, employee disputes, or client lists in raw form. Class 5 revisits this for software work.

**7. "Training on your data": what it means.**
Training is the process of adjusting the model's numbers using text. If a vendor trains on your data, your prompts and documents may influence future versions of the model that everyone uses. Output is not a database lookup; the model will not verbatim regurgitate your client list to another user. The real risks are subtler: retention (your data sitting in vendor logs for months or years), human review (staff or contractors at the vendor reading flagged or sampled conversations for quality and safety work), and exposure in a breach. Training is the headline risk; retention and review are the everyday ones.

**8. The opt-out map, consumer tiers (verify quarterly; settings move).**
OpenAI ChatGPT: consumer conversations may be used to improve models unless you opt out, in Settings, Data controls, turn off "Improve the model for everyone" (and consider Temporary Chat, which excludes the conversation from training). Pro is excluded from training; Business and Enterprise are excluded by default. Anthropic Claude: consumer chats are retained about 30 days and, under the terms updated in August 2025, using your chats for training is an opt-in with a choice offered to existing users; if you opt in, retention extends to five years, so leave it off unless you have a reason. Team and Enterprise content is not used for training. Google Gemini: consumer prompts are saved and may be used to improve Google products only if "Gemini Apps Activity" is switched on; check gemini.google.com activity settings and turn it off if it is on; Workspace (business) prompts are not used to train models outside your domain by default. Microsoft Copilot: consumer Copilot chats may be used to improve Microsoft's services unless you opt out in Microsoft privacy settings; anything used with a work or school account sits under Microsoft's commercial data protection, where prompts and responses are not used to train foundation models. Meta Llama: runs locally, nothing is sent anywhere, no opt-out needed because there is no data flow to opt out of.

**9. The business-tier difference, stated plainly.**
The single most useful purchase a small business can make is moving staff off consumer accounts onto a business tier. The core of what you buy is contractual: no training on your business content, data protection agreements, admin controls over accounts, and defined retention. On consumer tiers those promises mostly do not exist. This is the cheapest security upgrade in this entire series.

**10. What a data processing agreement (DPA) is and when you need one.**
A DPA is a contract clause-set that says what the vendor may do with personal information you hand it: purpose limits, security measures, breach notification, deletion on request, sub-contractor rules. Business and enterprise tiers include one automatically; consumer tiers do not offer one. If your business handles personal information and staff use AI tools for work, you need the tool's business tier with its DPA, or you need to ban sensitive data from the tool. There is no third option that survives scrutiny.

**11. The Australian Privacy Act, briefly and practically.**
Who is covered: organisations with annual turnover above $3 million, plus many smaller ones already caught regardless of size (health service providers, businesses trading in personal information, Commonwealth contractors, and others). A small-business exemption still exists but has been flagged for removal in future reform rounds, so do not build a strategy on it. Your obligations that matter here: APP 8 says if you send personal information overseas (which every US-hosted chatbot does) you generally remain responsible for how it is handled, so use vendors with contractual protections; APP 11 requires reasonable steps to protect personal information from misuse and unauthorised access, and a written AI policy plus business-tier accounts are exactly such steps; from 10 December 2026, privacy policies must describe any significant automated decision-making (decisions about people made or substantially shaped by software, AI included); a statutory tort for serious invasions of privacy has applied since June 2025, letting individuals sue for serious privacy invasions without proving financial loss; and if a vendor suffers a data breach involving your personal information that risks serious harm, you may have to notify the OAIC and the individuals under the Notifiable Data Breaches scheme. The OAIC has published guidance on generative AI and privacy: minimise what you paste, be transparent, keep humans in the loop. None of this requires a lawyer for basic compliance; all of it requires a policy, which Class 6 and Documents 3 and 5 provide.

**12. The decision drill.**
Three questions before anything goes into a tool: Does this text contain personal information, secrets, or anything under NDA? If yes, is the tool on a business tier with a DPA, or is it local? If neither, rewrite the prompt to remove the sensitive parts (initials instead of names, "a client" instead of the client) or use the local tool. That drill, repeated until it is automatic, is 90% of AI data hygiene.

---

## Myth to bust: "If I delete the chat, the data is gone."

Deleting a conversation removes it from your interface, which is where you can see it, not necessarily where it lives. On consumer tiers, vendors typically retain conversation data for a period (days to months; on Claude's consumer plan, around 30 days by default and up to five years if you opted in to training; on ChatGPT consumer, retained data can persist for around 30 days after deletion and longer if it was selected for training or flagged for review), may have copied prompts into logs, and may have human reviewers looking at samples. Deleting also does nothing about the copy that sat in transit, in caches, or in the vendor's backups. On business and enterprise tiers, retention is contractually defined and deletion requests are honoured in a stated timeframe, which is one of the main things you are paying for. The practical lesson is the one parents teach about the internet: treat anything you paste into a consumer AI tool as permanent, because you cannot reliably make it impermanent afterwards. The time to decide what not to paste is before you paste it, which is why the decision drill in this class exists.

---

## Practical exercise: "Settings safari"

**Time: 25 minutes. Needs: phones or laptops, attendees' own accounts (free tiers are fine).**

1. Everyone opens their most-used AI app and, working from the printed step sheet, finds three things: the data/privacy settings page, the toggle that controls whether conversations are used for training or product improvement, and the place to view or delete stored history. On ChatGPT: Settings, Data controls. On Claude: Settings, Privacy. On Gemini: the Gemini Apps Activity page linked from settings. On Copilot: Microsoft privacy dashboard, plus the work-account distinction.
2. Turn training/improvement toggles off. Note what the interface says will change.
3. Find Temporary Chat (ChatGPT) or an equivalent no-save mode and run one prompt through it.
4. For anyone on a work account, locate who the admin is and write down one question to ask them next week (for example, "Are we on a business tier where content is excluded from training?").
5. Debrief: how many clicks did it take? What was hard to find? The point: these controls exist but vendors do not advertise them, so knowing the path is the skill.

---

## Glossary

- **Cloud AI:** the model runs on the vendor's servers; your data travels to them over the internet.
- **Local AI:** the model runs on your own hardware; your data stays with you.
- **Open weights:** a model whose numbers are published so anyone can download and run it. Llama, Mistral, Qwen and Gemma are examples. "Open weights" is not quite "open source" (the full training data and code are usually not published), but for your purposes it means runnable on your machine, often under a free licence for businesses below a size threshold.
- **Parameter:** one of the numbers in the model. "8B parameters" means eight billion numbers. More parameters generally means more capability and more hardware required.
- **Ollama / LM Studio:** free programs that make running local models close to point-and-click. Install, pick a model, chat.
- **Training on your data:** using your prompts or documents to adjust the model's numbers for future versions. Opt-out (or opt-in, at Anthropic) exists on consumer tiers; business tiers exclude it contractually.
- **Retention:** how long the vendor keeps your data even without training on it. The quieter, more certain risk.
- **DPA (data processing agreement):** the contract defining what a vendor may do with your personal information. Comes with business tiers.
- **APP (Australian Privacy Principle):** the 13 rules in the Privacy Act. APP 8 covers cross-border disclosure, APP 11 covers security.
- **Notifiable Data Breaches scheme:** the requirement to tell the OAIC and affected people about eligible data breaches likely to cause serious harm. Applies to you even when the breach happens at your vendor.
- **ADM (automated decision-making):** decisions about people made or substantially shaped by software. From 10 December 2026 your privacy policy must describe significant ADM.
- **Hybrid approach:** cloud tools for low-sensitivity work, business-tier or local tools for sensitive work. The recommended default for small business.
