# Class 1: It's Just Numbers, Honest
### What AI actually is, what it isn't, and why the difference matters to you

**Time:** about 20 minutes of reading, plus a 15-minute exercise.
**By the end of this class you can:** explain in two plain sentences what an AI model is, tell a model apart from a product like ChatGPT, list three tasks these tools are reliably good at today and three they are not, and name the economic change that matters most to a small business.

## Start with something you have already used

Your phone keyboard guesses your next word as you type. It is rarely magical and often right, because it has seen enough of your sentences to know their shape. A large language model (the "LL" in LLM, a model trained on vast amounts of text) is that same idea at enormous scale. Instead of learning from your last three words, it learns patterns from more written material than any human could read in a lifetime. Hold that picture. Nearly everything in this course follows from it.

## What a model actually is

A model is a stack of numbers: billions of them, arranged in a specific structure, and that is it. A useful way to picture that stack is a mixing desk with billions of faders. During training, a computer programme nudges those faders a hair at a time, checks how good the guess was, and nudges again, millions of times, until the guesses line up with the examples it was shown. Then the faders are locked. The finished model is simply that desk: a file of billions of numbers in a fixed arrangement.

When you use the model, your text runs across those numbers at speed and out comes the most plausible continuation. There is no mind in the file and no ghost in the machine. When someone says the model "thinks" or "understands", they are reaching for a metaphor, and metaphors are fine in conversation as long as you know that is all they are.

## Why confident nonsense happens

The model is tuned to produce plausible text, and plausible is not the same as true. Where its reading contains plenty of examples of what an answer looks like but nothing reliable about your exact question, it produces the shape of an answer: a confident sentence, a realistic-looking reference, a number in the right range. The industry calls this a hallucination (output that is confident, plausible and wrong). Plain English is better: the model made it up. This one fact explains most AI horror stories, and it is why every later class in this course ends with a human checking names, numbers, dates and quotes.

## Tokens, in one paragraph

Models read in mouthfuls of text called tokens (chunks of roughly three-quarters of an English word). You will never need to count them. You need the concept because prices, speed and memory limits are all measured in tokens, and because Class 4 uses it to explain why a long conversation gets worse near the end.

## The engine and the car

The model is the engine. ChatGPT, Claude, Gemini and Copilot are cars: software products built around an engine, complete with a user interface, a billing system, a terms-of-service agreement and a company trying to make money. Two cars can share an engine, and one company can swap the engine under its car without much ceremony. The practical payoff for you is consumer power. Cars can be test-driven, compared, cancelled and negotiated. Keep the engine in mind as an implementation detail and judge the car on what it does with your work.

## What these tools are good at today

- Drafting and rewriting text of almost any kind, from emails to policy documents.
- Summarising long material and pulling structure out of messy notes.
- Translating jargon into plain language, in both directions.
- First drafts of spreadsheets formulas, checklists and code.
- Brainstorming options when you need fifteen ideas and have three.

Notice the pattern: every one of these is a task where a rough first draft saves time and a human checks the result. That is the sweet spot, and it is a large one.

## What they are bad at today

- Reliable facts, unless you supply them or the product fetches them with a live search you can inspect.
- Arithmetic across many steps. Ask for a formula or a small program instead, then check it.
- Knowing anything about your business that you have not told them in this conversation or stored setting.
- Admitting uncertainty. These tools do not say "I don't know" unless they were tuned to.

## The quiet story that matters most

In 1995, custom software meant developers, servers, licences and physical media, so it was built once and sold to thousands, and a ten-person business bent its processes around whatever was shrink-wrapped. Copying and running software is now effectively free at the margin (the cost of one extra copy or one extra user is close to zero), and AI tools now write much of the routine code. Software tailored to your one specific business, which used to be a six-figure conversation, can now be an afternoon. Class 5 is entirely about this, because it is the change that will actually show up in your budget.

## Cloud or local, the thirty-second version

Most products run in the cloud (on the vendor's servers, with your text travelling to them over the internet). Some models publish their numbers so you can run them on your own machine, which is called running locally. Cloud buys convenience and scale. Local buys control and privacy, plus a maintenance job. Class 3 turns this into a decision you can make about your own data.

## Myth, meet reality

**"AI understands language."** It produces language that reads as if understanding sits behind it, because the patterns it absorbed were written by people who did understand. When it explains a tax rule it is not consulting a concept of tax. It is reproducing the shape of text that tax explanations take, which is why it is brilliant on the common case and badly wrong on the unusual one. Treat every output as fluent pattern-matching, not as understanding, and you have the single habit that prevents most AI-related business disasters.

## Your exercise: two products, one task

1. Write one real work task as a request. For example: draft a polite reminder email to a customer who is 30 days overdue on an invoice of $2,300.
2. Paste the identical request into two different products, using free accounts if that is all you have. Nothing sensitive goes in.
3. Compare the two answers for length, tone, confidence, and any invented detail such as a fake interest rate or deadline. Note which one you would send with less editing.
4. Add one hard constraint, such as "maximum 80 words, no apologies, mention that work continues on schedule", and run both again. Note how much the answers improve.
5. Write one sentence answering this: was the difference between the products bigger, or the difference made by your constraint? Most people find the constraint wins, and that finding is Class 4 in miniature.

## Before you move on

- I can explain what a model is without saying "it thinks".
- I can name the product I use most and say which company's engine likely sits under it.
- I can list one task I will try this week and one task I will keep fully human for now.

## Words used in this class

- **Model:** the trained file of numbers that does the pattern-matching. The engine.
- **Product or app:** the software around a model that you actually use, such as ChatGPT or Copilot. The car.
- **Token:** a mouthful of text, roughly three-quarters of an English word. The unit prices and limits are measured in.
- **Prompt:** the text you type to the model.
- **System prompt:** standing instructions placed before your prompt that shape tone, format and rules. Class 4 and Document 1 cover writing your own.
- **Context window:** the maximum text a model can consider at once, like the size of its desk.
- **Hallucination:** confident, plausible, wrong output. The model made it up.
- **Training:** the one-off, expensive process of setting the model's numbers using large datasets. It happens at the vendor, long before you type anything.
- **Weights:** another word for the model's numbers. "Open weights" means published, so anyone can run the model on their own hardware.
- **Local model:** a model running on your computer or office server instead of a vendor's cloud.
