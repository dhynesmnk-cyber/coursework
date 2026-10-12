# Research Notes and Sources

**AI Without the Sales Pitch. What was verified, when, and where it came from.**
**Research date: 13 October 2026.** This file underpins Documents 5 and 6 and Classes 2 and 3. Re-verify quarterly.

---

## 1. Pricing and plan structures (verified 13 October 2026, web research)

**ChatGPT (OpenAI).** OpenAI's pricing page confirms Free plus paid plans (Go, Plus, Business, Enterprise) priced per user per month. Third-party trackers (CloudZero, Sep 2026; alloypress, Jul 2026; dancumberlandlabs, Oct 2026; coworker.ai, Jul 2026) converge on: Go ~US$8/mo (select markets), Plus US$20/mo, Pro US$100–200/mo by usage tier, Business (formerly Team) ~US$25–30/user/mo, Enterprise quote-only with procurement reports converging on US$45–75/seat/mo with seat minimums. Note: "Team" was renamed "Business"; older articles still say Team.

**Claude (Anthropic).** claude.com/pricing (accessed via search): Free; Pro US$17/mo annual or US$20 monthly; Max from US$100/mo (US$200 higher tier); Team ~US$25/seat/mo annual (5-seat minimum typical) with a Premium tier (~US$150/seat) adding Claude Code allowances; Enterprise quote-only. A 2026 Anthropic solutions page references a US$20/seat annual structure with a 20-seat minimum and retired plan names, confirming churn in naming; always quote the live pricing page.

**Gemini / Google Workspace.** Google's Workspace pricing and knowledge-base pages confirm Gemini features are bundled into Workspace plans (the separate "Gemini for Workspace" add-on era ended in 2025). Third-party (eesel.ai, Jun 2026): Business Starter ~US$7, Standard ~US$14, Plus ~US$22–26/user/mo; Enterprise quote-only. Consumer: free Gemini app; Google AI Pro ~US$19.99/mo; AI Ultra US$249.99/mo (Google's own AI plans page).

**Microsoft Copilot.** microsoft.com/copilot/pricing/business (current): lists US$32/user/mo annual for a "Premium with Copilot" tier; third-party trackers (gosearch.ai, Sep 2026) report Copilot Free US$0, Copilot Pro ~US$20/mo, Microsoft 365 Copilot Business ~US$21/user/mo annual commitment (up to 300 users), Enterprise ~US$30/user/mo annual with qualifying M365 plan, and Copilot Chat included free with M365 business subscriptions (metered agents extra). Microsoft's support pages confirm the free consumer Copilot at copilot.cloud.microsoft and the distinction from paid Microsoft 365 Copilot. Because Microsoft's own pages show multiple figures for similarly named offers, Document 6 carries a range and a verify warning.

**Meta Llama (local).** Open weights under the Meta Community Licence, free for businesses below the hyperscale usage threshold; no per-seat cost; hardware is the cost. See local AI section below.

## 2. Data-handling policies (verified 13 October 2026)

- **OpenAI:** enterprise-privacy page (Jan 2026) states business data is not used for training by default. Multiple privacy trackers (text.com Jun 2026; sonomos.ai May 2026; strac.io) confirm: consumer Free/Plus trained on by default unless opted out (Settings, Data controls); Pro excluded; Business/Enterprise excluded by default with DPAs.
- **Anthropic:** "Updates to Consumer Terms and Privacy Policy" (anthropic.com, Aug 2025) confirms training on consumer data moved to an opt-in with a consent prompt, and opting in extends retention from ~30 days to up to 5 years. Anthropic privacy centre (2026) confirms the 30-day default and 5-year opt-in retention; Team/Enterprise excluded from training.
- **Google:** Workspace knowledge base confirms Workspace prompt data protections (not trained on outside the domain; 18-month default retention for certain Gemini app data). Ars Technica (Apr 2026) documents the consumer settings maze: training/product improvement on consumer prompts requires Gemini Apps Activity to be on; users must find and disable it themselves.
- **Microsoft:** learn.microsoft.com (Aug 2026) confirms Microsoft 365 Copilot prompts/responses/Graph data are not used to train foundation LLMs and are covered by the Microsoft DPA (enterprise data protection) when signed in with a work account; consumer Copilot chats may be used for product improvement unless opted out (meprism.com opt-out guide, Aug 2026; whathumansask.com, Jul 2026, summarising the consumer/work split).

## 3. Marketing versus reality: the named cases used in Class 2

- **Deloitte Australia / Department of Home Affairs report (October 2025):** Deloitte agreed to partially refund a ~$290,000 portion (report total reported ~$440,000) after reviewers (notably Dr Christopher Rudge) found apparent AI-generated errors including fabricated references and quotations; Deloitte admitted AI use contrary to contractual terms. Sources: Fortune (7 Oct 2025), CFO Dive (14 Oct 2025), US News, AI Incident Database (#1193).
- **Klarna:** early-2024 claim that its AI assistant did the work of 700 customer-service agents; May 2025 public reversal by CEO Sebastian Siemiatkowski, resuming human hiring for quality. Forrester's "AI washing" framing (attributing financially motivated cuts to technology) is cited via reporting referenced in search results.
- **Air Canada chatbot:** BC Civil Resolution Tribunal decision (Feb 2024) held the airline liable for its chatbot's wrong bereavement-fare information; the "separate legal entity" defence failed. (Pre-dates the 12-month window; used as a foundational case with its date stated.)
- **SEC "AI washing" enforcement (March 2024):** Delphia fined US$225,000 and Global Predictions US$175,000 for false claims about AI use. (Foundational case, dated as such; FTC/ACCC/ASIC scrutiny of AI claims continues per klover.ai enterprise analysis, Sep 2026.)
- **McDonald's IBM drive-through AI trial ended (June 2024)** after viral order hallucinations. (Foundational case, dated.)
- **"PhD-level"/AGI-timeline claims** (OpenAI and peers, 2025–2026) used as the live future-tense example, framed as roadmap language rather than today's capability.

Where cases pre-date the "last 12 months" window they are explicitly dated in the class copy, because the teaching value outweighs recency and the class promises honesty about dates.

## 4. Local AI state of play (2025–2026)

- Hardware rules of thumb (sitepoint.com definitive guide, Feb 2026; pinggy.io, Jun 2026; iproyal.com, Aug 2026; localllm.in): ~7–9B open models usable on 16GB machines including Apple Silicon unified memory; 12–32B models want 24–32GB memory or a 12GB+ VRAM GPU; CPU-only Windows laptops run small models slowly but workably.
- Tooling: Ollama and LM Studio remain the accessible entry points (install, select model, chat); vLLM/Jan noted for advanced users. Open-weight families cited: Meta Llama (3.1/4 generation), Qwen, Mistral, Gemma.
- Limitations as taught: capability gap versus frontier cloud models, no native ecosystem integrations, one-person maintenance burden, sharing across an office requires server setup.

## 5. Australian Privacy Act implications

- **Privacy and Other Legislation Amendment Act 2024 (first tranche):** staged commencement; stronger OAIC powers, higher civil penalties, children's online privacy code process (OAIC APP Guidelines update confirmed via OAIC LinkedIn, 2025).
- **Statutory tort for serious invasions of privacy:** in force since 10 June 2025; no turnover test.
- **Automated decision-making transparency (APP 1):** from **10 December 2026**, privacy policies must describe, in general terms, significant automated decision-making including AI-shaped decisions (OAIC consultation on ADM guidance, May 2026; xcdit.com.au and responsibleaiaustralia.com.au compliance notes, 2026).
- **APP 8 (cross-border disclosure)** and **APP 11 (security)** applied to chatbot use as taught in Class 3; **Notifiable Data Breaches scheme** applied to vendor breaches in Document 10.
- **Small-business exemption:** still present; removal flagged in future reform tranches (second tranche not yet legislated as at research date). Course advice: do not build a strategy on the exemption.
- **OAIC generative AI guidance:** minimise, secure, be transparent, keep humans accountable; cited as the plainest official statement of "reasonable steps."
- All Privacy Act content in the package is framed as practical guidance with an explicit not-legal-advice line (facilitator notes).

## 6. Currency warning

Pricing figures, plan names (OpenAI's Team→Business rename; Anthropic's tier-name churn; Microsoft's multiple similarly priced offers) and settings paths in Documents 5, 6 and 9 will drift. Both time-sensitive documents carry "last verified: 13 October 2026" headers and quarterly review instructions. The conceptual content (Classes 1 to 6, Documents 1 to 4, 7, 8, 10) is deliberately built on mechanics that change slowly.
