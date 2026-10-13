# Class 1: It's Just Numbers, Honest
### What AI actually is, what it isn't, and why the difference matters to you

**Time:** about 20 minutes of reading, plus a 15-minute exercise.
**By the end of this class you can:** explain in two plain sentences what an AI model is, tell a model apart from a product like ChatGPT, list three tasks these tools are reliably good at today and three they are not, and name the economic change that matters most to a small business.

## How this course teaches

Every class follows one rule, borrowed from the physicist Richard Feynman: if you can't explain something simply, you don't understand it yet. So each idea arrives as an everyday picture first. The technical word comes second, with a plain translation. Where a picture stops being accurate, we say so. And every class ends by asking you to explain the idea back in your own words, because that is the fastest way to find the part you haven't quite got.

## The short version

An AI chatbot is a very large autocomplete. It has read an enormous amount of text and learned what usually comes next. It doesn't know things the way you do, so it is brilliant at drafting and terrible at being trusted without a check.

## Start with something you already use

Your phone guesses your next word as you type. Type "running a bit" and it offers "late". It isn't reading your mind. It has seen enough of your messages to know the usual shape of your sentences.

A large language model, the thing inside ChatGPT and its rivals, is that same trick at an enormous scale. Your phone learned from your last few thousand messages. A model learned from more writing than a person could read in a hundred lifetimes. Hold that picture. Nearly everything else in this course follows from it.

## What a model actually is

A model is a stack of billions of numbers, arranged in a fixed pattern. That's all it is.

Picture a sound desk in a recording studio, but with billions of sliders instead of forty. Building the model, which the industry calls **training**, works like this. A computer feeds in a sentence with the last word hidden, lets the desk guess the word, checks the guess, and nudges every slider a hair towards a better guess. Then it does that again, billions of times, for weeks, on warehouses of computers. When the guesses are good enough, the sliders are locked. The finished model is that locked desk: a file of numbers.

When you type a question, your words flow across those locked sliders and out comes the most likely next word, then the next, then the next, until a full answer has been written one piece at a time.

**Where the picture breaks:** a real sound desk has a person who knows what each slider does. Nobody can point at one of these billions of numbers and say what it means. The behaviour comes from all of them together, which is part of why even the companies that build these models can't fully predict what they will say.

## Why confident nonsense happens

Think of a student sitting an exam on a topic they never studied. They have read plenty of top-mark essays, so they know exactly what a good answer sounds like: the confident tone, the structure, a reference or two. So they write one. It reads beautifully. Some of it is invented.

That is what a model does when it hasn't seen reliable information about your exact question. It is built to produce the most plausible next words, and plausible is not the same as true. So it produces the shape of an answer: a confident sentence, a realistic-looking reference, a number in roughly the right range.

The industry calls this a **hallucination**. Plain English is better: the model made it up. It doesn't know it made it up, because it has no separate sense of "true" to check against. This one fact explains most AI horror stories. It is why every later class ends with a person checking the names, numbers, dates and quotes before anything leaves the building.

## Tokens: how the model reads

Models don't read whole words. They read in small chunks called **tokens**, roughly three-quarters of an English word each. "Unbelievable" might be three tokens: "un", "believ", "able".

You will never need to count them. You need the idea because tokens are how the meter runs. Prices, speed and memory limits are all measured in tokens, the way your power bill is measured in kilowatt-hours.

## How much it can hold in mind at once

Picture the model working at a desk. Everything it is considering right now has to fit on the desk: your question, any document you pasted, and the conversation so far. The size of that desk is called the **context window**.

When the desk fills up, the oldest papers slide off the far edge and the model can no longer see them. That's why a very long chat starts forgetting what you agreed at the beginning, and why Class 4 says to start a fresh chat for each new task.

## The engine and the car

The model is the engine. ChatGPT, Claude, Gemini and Copilot are cars. Each is a software product built around an engine, with its own dashboard, its own price list, its own terms and conditions, and a company behind it trying to make money.

Two cars can share an engine. A car maker can also swap the engine under the bonnet without much fuss. The practical lesson is that you are a car buyer, not an engineer. Cars can be test-driven, compared, cancelled and negotiated over. Judge the car by what it does with your work, and treat the engine as a detail.

## What these tools are good at today

- Drafting and rewriting almost any kind of text, from emails to policy documents.
- Summarising long material and pulling structure out of messy notes.
- Translating jargon into plain language, and back again.
- First drafts of spreadsheet formulas, checklists and small bits of code.
- Brainstorming, when you need fifteen ideas and have three.

Notice what these have in common. In every case, a rough first draft saves time and a person checks the result. That is the sweet spot, and it's a big one.

## What they are bad at today

- **Facts you haven't given them.** Unless you supply the facts, or the product does a live web search you can inspect, assume the bluffing student.
- **Long sums.** A model predicts the next word, it doesn't calculate. For maths, ask it to write a spreadsheet formula, then check the formula.
- **Your business.** It knows nothing about your clients, prices or habits unless you told it in this conversation or in a saved setting.
- **Saying "I don't know".** These tools rarely admit uncertainty unless they were tuned to. A confident tone tells you nothing about accuracy.

## The quiet change that matters most

Think about suits. A tailored suit used to cost a fortune because a skilled person spent days on it, so most people bought off the rack and lived with sleeves that were a bit long.

Software was the same. In 1995, custom software meant developers, servers, licences and boxes of disks. So it was built once and sold to thousands of businesses, and a ten-person company bent its habits around whatever came off the rack.

Two things have changed. First, making one more copy of software, or adding one more user, now costs almost nothing. Economists call that the **marginal cost**, and for software it's close to zero. Second, AI tools now write much of the routine code. Together, that means software tailored to your one business, which used to be a six-figure conversation, can sometimes be an afternoon. Class 5 is entirely about this, because it's the change that will actually show up in your budget.

## Cloud or local, in thirty seconds

Most AI products run in the **cloud**. That means on the vendor's computers, with your text travelling to them over the internet. It's like hiring a car: convenient, always serviced, but it isn't yours, and they know where you drove.

Some models are published so you can run them on your own computer. That's called running **locally**. It's like owning the ute: nobody else sees where it goes, but you do the servicing. Class 3 turns this into a decision you can make about your own data.

## Myth, meet reality

**"AI understands language."** It produces language that reads as if understanding sits behind it, because it learned from text written by people who did understand.

Picture a parrot that has listened to ten thousand accountants. It can produce a very convincing sentence about tax. It isn't consulting any idea of tax. It is reproducing the shape tax explanations usually take. That is why these tools are brilliant on the common case and confidently wrong on the unusual one.

**Where the picture breaks:** a parrot repeats phrases it heard. A model combines patterns into sentences nobody has written before, which is why it is genuinely useful. But the lesson holds. Treat every output as fluent pattern-matching, not understanding, and you have the one habit that prevents most AI disasters in business.

## Your exercise: two products, one task

1. Write one real work task as a request. For example: draft a polite reminder email to a customer who is 30 days overdue on an invoice of $2,300.
2. Paste the identical request into two different products. Free accounts are fine. Nothing sensitive goes in.
3. Compare the two answers for length, tone and confidence, and look for any invented detail, such as a made-up interest rate or deadline. Note which one you would send with less editing.
4. Add one firm instruction, such as "maximum 80 words, no apologies, mention that work continues on schedule", and run both again. Note how much the answers improve.
5. Write one sentence answering this: was the difference between the two products bigger, or the difference made by your instruction? Most people find the instruction wins. That finding is Class 4 in miniature.

## Explain it back

Imagine a colleague who has never used one of these tools asks you, "So what is AI, actually?" Write your answer in three sentences, with no technical words. Then compare it with "The short version" at the top of this class.

If you found yourself reaching for "it thinks" or "it knows", reread "What a model actually is". If you couldn't say why it makes things up, reread the bluffing student. The part you stumble on is the part you haven't got yet. That stumble is useful, not embarrassing.

## Before you move on

- I can explain what a model is without saying "it thinks".
- I can name the product I use most and say which company's engine likely sits under it.
- I can list one task I will try this week and one task I will keep fully human for now.

## Words used in this class

- **Model:** the trained file of numbers that does the pattern-matching. The engine.
- **Product or app:** the software you actually use, built around a model, such as ChatGPT or Copilot. The car.
- **Training:** the one-off, expensive process of setting the model's numbers by showing it huge amounts of text. It happens at the vendor, long before you type anything.
- **Token:** a small chunk of text, about three-quarters of a word. The unit prices and limits are measured in.
- **Prompt:** the text you type to the model.
- **System prompt:** standing instructions placed before your prompt that shape tone, format and rules. Class 4 and Document 1 cover writing your own.
- **Context window:** how much text the model can consider at once. The size of its desk.
- **Hallucination:** a confident, plausible, wrong answer. The model made it up.
- **Weights:** another word for the model's numbers. "Open weights" means the numbers are published, so anyone can run the model on their own hardware.
- **Local model:** a model running on your own computer or office server instead of a vendor's cloud.
