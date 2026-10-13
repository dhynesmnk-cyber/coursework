# Document 5: Data Security Basics for AI Tools

**Part of the "AI Without the Sales Pitch" participant pack.**
**Applies to:** ChatGPT (OpenAI), Claude (Anthropic), Gemini and Google Workspace (Google), Copilot and Microsoft 365 (Microsoft), and local tools (Ollama, LM Studio with Llama, Mistral, Qwen or similar).
**Written for:** someone who has never read a privacy policy. Everything here assumes zero background.
**Last verified: 13 October 2026.** Settings menus move and policies get updated. Re-check quarterly; the review box at the end tells you how.

---

## In plain terms

Typing into a chatbot sends your words to a company's computers, where copies are kept. Free accounts may use what you type to improve their products; paid business accounts promise in a contract not to. So: switch off the training settings today, use work accounts for work, and never paste anything you couldn't explain to the person it's about.

## 1. What happens when you type into a chatbot

Picture posting a letter to a company overseas. They read it, write back, and keep a copy on file.

Step by step:

1. **You type and press enter.** Your message goes over the internet to the company's computers, usually in the United States. It travels encrypted, which means scrambled so casual eavesdroppers can't read it.
2. **The model reads it.** The model (the very large stack of numbers from Class 1) reads your message together with the rest of the conversation, and writes a reply that comes back to your screen.
3. **Copies are kept.** Your message is usually:
   - **stored in your account history,** so you can scroll back;
   - **logged on the company's systems,** for running the service, safety checks and, depending on your settings and plan, possibly improving the model;
   - **possibly read by company staff or contractors** under their review policies, for example when a safety system flags a conversation.
4. **Deleting isn't erasing.** Deleting the chat removes it from your view and starts the company's deletion process. It doesn't mean the text never existed on their systems.

Treat chats on free consumer accounts as permanent. Treat chats on business accounts as governed by a contract: much better, but the data still left your building.

**With a local tool** (Ollama, LM Studio), none of this happens. The model runs on your own computer and your text goes nowhere. The trade-off is that updates, security and maintenance are your job.

## 2. "Training on your data", in plain words

Think of a teacher marking thousands of essays. Reading them slowly shapes how the teacher teaches next year. Your essay played a small part, but the teacher can't hand it to another student, because it isn't kept in a filing cabinet for anyone to open.

**Training** means adjusting a model's numbers using text, so future versions behave differently. If a company trains on your data, your prompts and files can become part of what shapes the next model.

**What it doesn't mean:** the model doesn't become a database someone can search for your client list. A model repeating a specific small business's documents word for word is very unlikely.

**What it does mean, in practice:**
- your business information sits in the company's systems for far longer;
- human reviewers may read it as part of quality and safety work;
- it's exposed if the company is ever hacked;
- it may subtly influence a product your competitors also use.

For most businesses, the everyday risks are how long data is kept, who reads it, and breaches, more than training itself. But the training setting usually decides how long and how widely your data is kept, which is why the opt-outs below matter.

## 3. Opt-outs and defaults, platform by platform (step by step)

**ChatGPT (OpenAI).** Consumer Free/Plus: conversations may be used to improve models unless you opt out. Steps: profile icon, Settings, Data controls, turn off "Improve the model for everyone." For one-off sensitive chats use Temporary Chat (it is not used for training and disappears from history). Pro plan: not used for training. Business and Enterprise plans: business data excluded from training by default, with contractual commitments and admin controls. Retention after deletion on consumer plans is generally around 30 days and longer for data selected for training or flagged for review.

**Claude (Anthropic).** Consumer Free/Pro: chats are retained for about 30 days by default. Under the consumer terms updated in August 2025, using your chats for training is an opt-in: you are asked to choose, and if you allow it, retention extends to up to five years. Steps: Settings, Privacy, and make sure the "use my data for training" style choice is off. If you never saw a prompt, go looking in Privacy settings anyway. Team and Enterprise plans: your content is not used to train models.

**Gemini (Google).** Consumer Gemini app: your prompts are saved to your Google Account activity and may be used to improve Google products only if "Gemini Apps Activity" is on. Steps: gemini.google.com, Settings, Gemini Apps Activity, switch it off (this also stops the human-review pipeline for saved prompts; note Google may still keep some data for other purposes such as abuse protection). Google Workspace (paid business plans): prompts and files in Gemini features are not used to train models outside your organisation by default, and Workspace data protections apply. NotebookLM: works with sources you upload; check the same activity settings apply to your account type.

**Copilot (Microsoft).** Consumer Copilot (personal Microsoft account): chats may be used to improve Microsoft's products and services unless you opt out. Steps: Microsoft account privacy dashboard (privacy.microsoft.com), manage product and service improvement settings, and in the Copilot app settings turn off conversation data sharing where offered. Work or school account (Microsoft 365 Copilot or Copilot Chat signed in with your organisational account): prompts and responses are not used to train foundation models, covered by Microsoft's commercial data protection and Data Protection Addendum.

**The most important point on this page:** the same-looking Copilot app behaves completely differently depending on which account you're signed into. Personal account: personal rules. Work account: work protections. Check the account before you paste.

**Local (Ollama, LM Studio, Llama and other open models).** Nothing to opt out of; your data never leaves the machine. Your security job moves to the machine itself:
- keep the operating system updated;
- don't make a local AI server reachable from the internet without professional help;
- remember that anyone who can use the computer can see the chats.

## 4. What a Data Processing Agreement (DPA) is, and when you need one

Think of the register a business keeps of who holds keys to the building: who has which key, which doors it opens, and when they hand it back.

A **DPA** is that register for personal information. It's the contract between you and a software company that says what they may do with personal information you give them:

- use it only for the service you're paying for;
- keep it secure, to a defined standard;
- tell you if there's a breach;
- delete it when you leave;
- follow limits on any subcontractors.

**You need one** whenever your business puts personal information into someone else's software. Personal information is anything that identifies a person: names with contact details, health information, employment records, an individual's financial details.

Business and enterprise tiers of all four major platforms include a DPA automatically, and that's a large part of what the higher price actually buys. Consumer accounts offer no DPA and nothing equivalent. That's why "the free account is fine for work" is the sentence that starts most AI data incidents.

## 5. Never put these into a consumer AI tool

- Passwords, access keys, login details, payment card numbers. Into any AI tool, ever, business tier included wherever you can avoid it.
- Client lists or personal information in bulk (names plus contact details, dates of birth, tax file or Medicare numbers).
- Client financial data: bank details, financial statements under NDA, tax records of identifiable people.
- Health or medical information about any identifiable person.
- Anything covered by an NDA or professional confidentiality, unless the tool's business-tier contract covers it and the NDA allows it.
- Employee disciplinary or grievance material. Not on consumer tools at all; on contracted tools, only the minimum needed.
- Financial results that aren't public yet, tender pricing, or news before it's announced.

**If the task genuinely needs that material,** use the business tier with the DPA, your Microsoft 365 or Google Workspace tool signed in with a work account, or a local model. Or blank out the sensitive parts first and put them back afterwards in your own software.

## 6. The four habits that do most of the work

1. **Work data on work accounts.** Personal accounts stay personal. Check which account you're signed into before pasting, every time; the icons look alike.
2. **The decision drill.** Before pasting: personal information? Secrets? Under NDA? If any answer is yes, change tool or blank it out.
3. **Settings once, then every quarter.** Do the opt-outs above today, and diary a quarterly re-check in the same slot as your Document 6 pricing review.
4. **Report the same day.** If anything sensitive went where it shouldn't, tell the policy owner that day (Document 3, section 7; Document 10, scenario 1). Reported fast, an incident is a line in a log. Discovered late, it's a crisis.

## 7. Quarterly review box

**Next review due: [date].**

On review day, for each tool in use:

1. Sign in and open the privacy or data settings.
2. Confirm the training and retention settings are still as this document describes.
3. Check the vendor's privacy page for changes (each vendor shows a "last updated" date).
4. Record anything that changed in the tool register.

Ten minutes per tool. This document and Document 6 go out of date fastest, which is why both carry dates.

## Australian context, in one paragraph

If your organisation handles personal information and is covered by the Privacy Act (most organisations over $3 million turnover, plus many smaller ones in health, personal-information trading and Commonwealth contracting), then: you stay responsible for that information when it goes to an overseas AI vendor (APP 8); you must take reasonable steps to protect it (APP 11), and business tiers plus a written policy are exactly such steps; an eligible data breach at your vendor can trigger your duty to notify the OAIC and the affected people; and from 10 December 2026, your privacy policy must describe significant automated decision-making about people. The OAIC's generative AI guidance boils down to four words: minimise, secure, be transparent, keep people accountable. This document puts all four into practice. It's practical guidance, not legal advice. For your specific situation, especially with health information, talk to a lawyer who knows privacy.
