# Document 5: Data Security Basics for AI Tools

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and Google Workspace (Google), Copilot and Microsoft 365 (Microsoft), and local tools (Ollama, LM Studio with Llama, Mistral, Qwen or similar).
**Written for:** someone who has never read a privacy policy. Everything here assumes zero background.
**Last verified: 13 October 2026.** Settings menus move and policies get updated. Re-check quarterly; the review box at the end tells you how.

---

## 1. What happens when you type into a chatbot

You type a message. It is sent over the internet to the company's servers (usually in the United States). There, a model (a very large stack of numbers doing pattern-matching) processes your text together with everything else in the conversation, and generates a reply, which is sent back to your screen. Along the way, your text is typically: transmitted encrypted (safe from casual eavesdropping), stored in your account history (so you can see past chats), logged on the company's systems (for operations, safety review and, depending on settings and plan, possible model improvement), and potentially visible to some of the company's staff or contractors under their review policies (for example, conversations flagged by safety systems). Deleting the chat later removes it from your view and starts the company's deletion process, but it does not mean the text never existed on their systems. Treat consumer-tier chats as permanent. Treat business-tier chats as governed by contract, which is much better but still means the data left your building.

With a local tool (Ollama, LM Studio), none of the above happens: the model runs on your machine and your text goes nowhere. The trade-off is that updates, security and maintenance are your problem.

## 2. "Training on your data", in plain words

Training means adjusting the model's numbers using text, so future versions behave differently. If a company trains on your data, your prompts and files can become part of the material that shapes the next model. What this does not mean: the model does not become a database someone can query for your client list. Regurgitation of a specific small business's documents is very unlikely. What it does mean, in practice: your business information sits in the company's systems far longer, may be read by human reviewers as part of quality and safety work, is exposed if the company is ever breached, and may subtly influence a product that your competitors also use. For most businesses the everyday risks are retention, human review and breach exposure rather than training itself, but training is the one that sets how long and how widely your data is kept, which is why the opt-outs below matter.

## 3. Opt-out and defaults, platform by platform (step-by-step)

**ChatGPT (OpenAI).** Consumer Free/Plus: conversations may be used to improve models unless you opt out. Steps: profile icon, Settings, Data controls, turn off "Improve the model for everyone." For one-off sensitive chats use Temporary Chat (it is not used for training and disappears from history). Pro plan: not used for training. Business and Enterprise plans: business data excluded from training by default, with contractual commitments and admin controls. Retention after deletion on consumer plans is generally around 30 days and longer for data selected for training or flagged for review.

**Claude (Anthropic).** Consumer Free/Pro: chats are retained for about 30 days by default. Under the consumer terms updated in August 2025, using your chats for training is an opt-in: you are asked to choose, and if you allow it, retention extends to up to five years. Steps: Settings, Privacy, and make sure the "use my data for training" style choice is off. If you never saw a prompt, go looking in Privacy settings anyway. Team and Enterprise plans: your content is not used to train models.

**Gemini (Google).** Consumer Gemini app: your prompts are saved to your Google Account activity and may be used to improve Google products only if "Gemini Apps Activity" is on. Steps: gemini.google.com, Settings, Gemini Apps Activity, switch it off (this also stops the human-review pipeline for saved prompts; note Google may still keep some data for other purposes such as abuse protection). Google Workspace (paid business plans): prompts and files in Gemini features are not used to train models outside your organisation by default, and Workspace data protections apply. NotebookLM: works with sources you upload; check the same activity settings apply to your account type.

**Copilot (Microsoft).** Consumer Copilot (personal Microsoft account): chats may be used to improve Microsoft's products and services unless you opt out. Steps: Microsoft account privacy dashboard (privacy.microsoft.com), manage product and service improvement settings, and in the Copilot app settings turn off conversation data sharing where offered. Work or school account (Microsoft 365 Copilot or Copilot Chat signed in with your organisational account): prompts and responses are not used to train foundation models, covered by Microsoft's commercial data protection and Data Protection Addendum. This is the single most important distinction on this page: the same-looking app behaves completely differently depending on which account you are signed in with.

**Local (Ollama, LM Studio, Llama and other open models).** Nothing to opt out of; your data never leaves the machine. Your security job moves to the machine itself: keep the operating system updated, do not expose a local AI server to the internet without professional help, and remember that anyone who can use the computer can see the chats.

## 4. What a Data Processing Agreement (DPA) is, and when you need one

A DPA is the contract between you and a software company that says what they may do with personal information you give them: only for the service you are paying for, with defined security, with breach notification, with deletion when you leave, and with limits on their subcontractors. You need one whenever your business puts personal information (anything identifying a person: names with contact details, health information, employment records, financial details of individuals) into someone else's software. Business and enterprise tiers of all four major platforms include DPAs automatically, and that inclusion is a large part of what the higher price actually buys. Consumer tiers offer no DPA and no equivalent promise, which is why "the free account is fine for work" is the sentence that starts most AI data incidents.

## 5. Never put these into a consumer AI tool

- Passwords, API keys, login details, payment card numbers. Into any AI tool, ever, business tier included where avoidable.
- Client lists or personal information in bulk (names plus contact details, dates of birth, tax file or Medicare numbers).
- Client financial data: bank details, financial statements under NDA, tax records of identifiable people.
- Health or medical information about any identifiable person.
- Anything covered by an NDA or professional confidentiality, unless the tool's business-tier contract covers it and the NDA permits it.
- Employee disciplinary or grievance material on consumer tools; minimised and on contracted tools only.
- Non-public financial results, tender pricing, or pre-announcement news.

If the task genuinely requires that material, use: the business tier with the DPA, your Microsoft 365 or Google Workspace ecosystem tool with a work account, or a local model. Or redact first and un-redact in your own software afterwards.

## 6. The four habits that do most of the work

1. **Tier discipline.** Work happens on work accounts. Personal accounts stay personal. Check which account you are signed into before pasting, every time; the icons look alike.
2. **The decision drill.** Before pasting: personal information? secrets? NDA? If any yes, change tool or redact.
3. **Settings once, then quarterly.** Do the opt-outs above today, diary a quarterly re-check in the same calendar as your Document 6 pricing review.
4. **Report same-day.** Anything sensitive that went where it should not: tell the policy owner the same day (Document 3, section 7; Document 10, scenario 1). Fast reporting turns incidents into log entries.

## 7. Quarterly review box

**Next review due: [date].** On review day, for each tool in use: sign in, open the privacy/data settings, confirm the training and retention toggles are still set as this document describes, check the vendor's privacy page for policy changes (each vendor publishes a "last updated" date), and record anything that moved in the tool register. Ten minutes per tool. This document and Document 6 are the two that go stale fastest, which is why both carry dates.

## Australian context, in one paragraph

If your organisation handles personal information and is covered by the Privacy Act (most organisations over $3 million turnover, plus many smaller ones in health, personal-information trading and Commonwealth contracting), then you remain responsible for that information when it goes to an overseas AI vendor (APP 8), you must take reasonable steps to protect it (APP 11; business tiers plus a written policy are exactly such steps), an eligible data breach at your vendor can trigger your notification duties to the OAIC and affected people, and from 10 December 2026 your privacy policy must describe significant automated decision-making about people. The OAIC's generative AI guidance boils down to: minimise what you put in, secure it, be transparent, keep humans accountable. This document operationalises all four. It is practical guidance, not legal advice; for your specific situation, especially health information, talk to a privacy-savvy lawyer.
