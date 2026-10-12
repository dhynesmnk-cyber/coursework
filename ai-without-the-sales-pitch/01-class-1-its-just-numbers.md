# Class 1: It's Just Numbers, Honest
### What AI actually is, what it isn't, and why the difference matters to you

---

## Registration page description (150 words)

Before you decide whether AI belongs in your business, you need to know what it is. Not the science-fiction version, not the marketing version. The real one. In this opening class we take the mystery out of the machine. You will learn that an AI model is a stack of billions of numbers that performs extremely fast pattern-matching, and that when people say a model "thinks" or "understands," they are reaching for a metaphor. You will learn the difference between the model (the engine) and products like ChatGPT, Claude, Gemini and Copilot (the cars built around it), and why that distinction means you can compare, swap and negotiate these tools like any other software purchase. We will finish with the quiet, unglamorous story that matters most: the cost of making and running custom software has collapsed, and that changes what a ten-person business can afford. Bring a laptop if you have one. No experience needed.

---

## Detailed outline

**1. The room-temperature introduction.**
Start with a show of hands: who has used ChatGPT, Claude, Gemini or Copilot in the last month? Who has been told by a supplier, a bank, or a conference speaker that they must "adopt AI" immediately? Both numbers are usually high. The class promise: by the end of the series you will be able to tell the difference between a genuine capability and a sales pitch, and you will have paperwork to prove it to your staff.

**2. What a model actually is: a stack of numbers.**
A large language model (the "LL" in LLM stands for large language) is a file, or more usually a set of files, containing billions of numbers arranged in a fixed structure. Those numbers were produced by a training process that read an enormous amount of text and adjusted the numbers until the structure got good at one task: guessing what comes next. That is the whole mechanism. There is no ghost in the machine, no mind, no understanding in the human sense. When the model produces an answer, it is performing very fast, very large pattern-matching across those numbers and emitting the most plausible continuation of your prompt.

**3. Why "plausible" is not the same as "true".**
Because the model is optimised for plausible-sounding continuation, it can produce a confident sentence that is factually wrong. The industry calls these hallucinations; a plainer word is "confident nonsense." This single fact explains most AI horror stories you have heard, and we will return to it in Classes 4 and 6.

**4. Tokens: the unit the machine actually works in.**
Models do not read words; they read tokens (chunks of text, roughly three-quarters of an English word each). Everything about cost, speed and the "context window" (how much text the model can hold in front of it at once, measured in tokens) is built on this. You do not need to count tokens, but you need to know the concept exists, because in Class 4 it explains why being specific beats being verbose.

**5. The engine and the car.**
The model is the engine. ChatGPT, Claude, Gemini and Copilot are cars: software products wrapped around engines. The car has a user interface, a billing system, a terms-of-service agreement, memory features, file upload, integrations with your email and documents, and a company behind it trying to make money. Two products can use different engines, and one company can swap the engine under the car without telling you much. This framing gives you consumer power: cars can be test-driven, compared, cancelled and negotiated. Engines are an implementation detail.

**6. The same words mean different things on different cars.**
"Memory," "projects," "custom instructions," "connectors" and "agents" all mean slightly different things at OpenAI, Anthropic, Google and Microsoft. In this series we will teach you to read past the branding and ask three questions of any feature: What data does it touch? Where does that data go? What happens when I switch it off?

**7. A very short history, because it explains the cost story.**
In 1995, building software meant hiring developers, buying licences, renting or purchasing servers, and shipping physical media. Every extra copy and every extra user cost real money, so software was built once, sold to thousands, and customised for almost nobody below the size of a bank. Copying and running software is now effectively free at the margin: the 1s and 0s cost nothing to duplicate, and cloud servers rent by the hour. On top of that, AI-assisted tools now write large amounts of the routine code for you. The practical consequence: software that used to require a $200,000 build and a dedicated IT team can now be assembled, tailored to one specific business, and deployed in days, sometimes hours. That collapse in the cost of customised software is the actual story of this decade, and it is Class 5 in full.

**8. What these tools are genuinely good at today.**
Drafting and rewriting text, summarising long documents, translating jargon into plain language, first-draft spreadsheets formulas, brainstorming, drafting code, pulling structure out of messy notes. Notice the pattern: every one of those is a task where a rough first draft saves you time and a human checks the result. That is the sweet spot.

**9. What these tools are genuinely bad at today.**
Reliable facts without verification, arithmetic across many steps, knowing anything about your business that you have not told them, knowing anything recent unless the product has a live search feature, and admitting uncertainty. They have no memory of your Tuesday unless the product stores something for them, and even then it is stored text being replayed, not learning.

**10. Cloud, local, and a preview of the trade-off.**
Most products run in the cloud: your text goes to the vendor's servers, the engine runs there, the answer comes back. Some models (Meta's Llama family, Mistral, Qwen and others) have their weights published so you can run them on your own hardware, which is called running a model locally. Cloud gives convenience and scale; local gives control and privacy plus a maintenance burden. Class 3 covers this properly. Tonight you only need the shape of the trade-off.

**11. The vocabulary you now own.**
Quick recap of the six words that carry the rest of the series: model, token, context window, hallucination, prompt (what you type in), and system prompt (the standing instructions the product or you give the model before your prompt). All six are in the glossary below and in every handout from here on.

**12. Setting expectations for the series.**
Nobody leaves this course an AI believer or an AI sceptic. You leave able to describe, in two sentences, what a tool does with your data and what it produces on your screen today. That is enough to make every purchasing, policy and productivity decision on the list.

---

## Myth to bust: "AI understands language."

It does not, and the distinction is practical rather than philosophical. A model is a stack of numbers that has learned, statistically, which words tend to follow which other words across an unimaginable volume of text. It produces language that reads as if understanding sits behind it, because the patterns it absorbed were written by people who did understand. When a model explains your tax obligations, it is not consulting a concept of taxation; it is reproducing the shape of text that tax explanations take. That is why it can be brilliant on the common case and badly wrong on the unusual one, why it never says "I don't know" unless it was tuned to, and why a human who knows the subject must check anything the model produces before it reaches a customer, a client or the ATO. Treating output as fluent pattern-matching rather than understanding is the single habit that prevents most AI-related business disasters.

---

## Practical exercise: "Two prompts, one model, different cars"

**Time: 20 minutes. Needs: a phone or laptop; free accounts on two of ChatGPT, Claude, Gemini or Copilot (or two browser tabs using logged-out free tiers).**

1. Everyone writes one real work task as a prompt. Examples supplied: "Draft a polite reminder email to a customer who is 30 days overdue on an invoice of $2,300," or "Summarise this 400-word council notice in three bullet points a tradie will actually read."
2. Paste the identical prompt into two different products.
3. Compare: length, tone, confidence, whether either invented a detail (a fake interest rate, a fake deadline), and which one you would send with less editing.
4. Now add one specific constraint to the prompt ("maximum 80 words, no apologies, mention that work continues on schedule") and run it again on both. Note how much the answer changes.
5. Group debrief. The point to land: the engine differs less than the car, but the car's defaults (tone, length, caution) are noticeable, and specificity in your prompt is worth more than the choice of product.

---

## Glossary

- **Model:** the trained stack of numbers that does the pattern-matching. The engine. Examples: GPT-series models (OpenAI), Claude models (Anthropic), Gemini models (Google), Llama (Meta).
- **Product / app:** the software around a model that you actually use: ChatGPT, Claude, Gemini app, Copilot. The car.
- **Token:** the unit of text a model processes, roughly three-quarters of an English word. Pricing and memory limits are measured in tokens.
- **Prompt:** the text you type to the model.
- **System prompt:** standing instructions placed before your prompt that shape the model's behaviour (tone, role, rules). Some products let you write your own; all products have the vendor's own baked in.
- **Context window:** the maximum amount of text (measured in tokens) a model can consider at once, including your prompt, your uploaded document and its reply. Think of it as the size of the desk the model works on.
- **Hallucination:** confident, plausible, wrong output. Plain English: the model made it up.
- **Training:** the expensive, one-off process of adjusting the model's numbers using large datasets. It happens at the vendor, before you ever use the product. It is not happening when you chat.
- **Weights:** another word for the model's numbers. "Open weights" means the numbers are published so others can run the model on their own hardware.
- **Local model:** a model running on your own computer or office server instead of a vendor's cloud.
- **Cloud:** someone else's computers, reached over the internet, rented by the hour or by the user.
