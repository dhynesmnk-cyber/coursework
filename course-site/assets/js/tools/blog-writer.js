/* blog-writer.js — Blog Writer tool (AI), in two steps:
 *   1. the visitor's website -> business details + topic ideas (blog-topics job)
 *   2. check the details, pick a topic -> the post (blog-writer job)
 * "No website?" skips straight to step 2 with empty details.
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;
  const FORM_KEY = "awspp-blog-form";

  // Example outputs: a clearly fictional business on a reserved .example domain.
  const EXAMPLE_TOPICS = {
    url: "https://smith-roofing.example/",
    business: {
      name: "Smith Roofing (example)",
      industry: "Roofing and gutters",
      location: "Ballarat VIC",
      services: ["Roof restoration", "Gutter replacement", "Leak repairs", "Roof inspections"],
      audience: "Homeowners in Ballarat and nearby towns, many in older weatherboard houses",
      summary: "A family-run roofing business doing repairs, restorations and gutters around Ballarat. Free quotes and photos of every job.",
    },
    topics: [
      { title: "Is Your Roof Ready for a Ballarat Winter?", keyword: "roof maintenance ballarat", intent: "local", why: "Local searches show a mix of small roofers and directories, with no page answering the seasonal question directly." },
      { title: "Roof Restoration or Replacement: How to Tell Which You Need", keyword: "roof restoration vs replacement", intent: "commercial", why: "A common question before a big spend; the top results are general guides that don't mention Victorian conditions." },
      { title: "Why Is My Ceiling Stained After Rain?", keyword: "water stain on ceiling after rain", intent: "informational", why: "People search the symptom, not the trade, and a clear answer leads naturally to a leak inspection." },
      { title: "How Often Should Gutters Be Cleaned Under Gum Trees?", keyword: "how often to clean gutters", intent: "informational", why: "Answered vaguely by national sites; local tree cover gives a specific angle." },
      { title: "What a Roof Inspection Actually Checks (and What It Costs to Book)", keyword: "roof inspection ballarat", intent: "local", why: "Few local pages explain the inspection itself, which is what people want before booking." },
    ],
    method: "Example only: in a real run, Claude reads your site and searches the web before suggesting topics.",
  };

  const EXAMPLE_POST = {
    title: "Is Your Roof Ready for a Ballarat Winter?",
    metaDescription: "Five checks a Ballarat homeowner can do in an afternoon before winter rain and frost find the weak spots in the roof.",
    post: [
      "Most winter roof leaks in Ballarat start as an autumn problem nobody looked at. A blocked gutter, a cracked ridge cap or a lifted tile is easy to fix in April and expensive to fix in July, when water has already found the ceiling.",
      "The good news: most of the warning signs are visible from the ground or a ladder in an afternoon.",
      "",
      "## Start with the gutters",
      "",
      "Clear gutters are the single cheapest protection you have. Leaves from deciduous trees fill them in late autumn, and the first heavy rain then backs up under the roof line instead of running away.",
      "",
      "Scoop them out, then run a hose from the high end and watch where the water goes. If it pools or spills over the front, the gutter needs re-falling or a downpipe is blocked.",
      "",
      "## Look for lifted or cracked tiles",
      "",
      "Frost and summer heat move tiles over time. From the ground, look for tiles that sit higher than their neighbours or show a different colour, which often means a crack holding water.",
      "",
      "## Common Questions",
      "",
      "**How often should a roof be inspected?**",
      "Once a year is a sensible rhythm for most homes, ideally in autumn before the wet months. Homes under large trees or older than about 30 years benefit from a check in spring as well.",
      "",
      "**Can I fix a cracked tile myself?**",
      "Swapping a single tile is a common DIY job if you are comfortable on a ladder and the roof is not steep. Anything involving ridge capping, valleys or more than a couple of tiles is worth a professional look.",
      "",
      "Pick a dry weekend this month, clear the gutters and walk the property with your eyes up. If anything looks lifted, cracked or stained, book a check before the first big frost rather than after it.",
    ].join("\n"),
  };

  const INTENT_LABEL = { informational: "answers a question", commercial: "helps someone choose", local: "local search" };

  function render() {
    const esc = T.ui.esc;
    const saved = T.local.get(FORM_KEY, {});
    return `
      <section class="tool-step" id="blog-step1">
        <h2 class="step-head"><span class="step-num">1</span> Start with your website</h2>
        <p class="fine step-lede">We read your site to work out what you do, then search the web for what people ask about it, and suggest topics you could realistically rank for. Takes a minute or two.</p>
        <form class="stack-form tool-form" id="blog-site-form" novalidate>
          <label class="field"><span class="field-label">Your website</span>
            <input type="url" name="url" maxlength="300" value="${esc(saved.website || "")}" placeholder="e.g. smithroofing.com.au"></label>
          <div class="tool-actions">
            <button class="btn btn-primary" type="submit">Find topic ideas</button>
            <button class="btn btn-ghost show-example" type="button">See an example</button>
            <button class="link-btn" type="button" id="blog-skip">No website? Fill in your details instead</button>
          </div>
        </form>
        <div class="tool-output" aria-live="polite"></div>
      </section>
      <section class="tool-step hidden" id="blog-step2"></section>
      ${T.aiFooter()}`;
  }

  function step2Html(found, saved) {
    const esc = T.ui.esc;
    const b = (found && found.business) || {};
    const topics = (found && found.topics) || [];
    const val = (k, fallback) => esc(b[k] || (found ? "" : saved[k]) || fallback || "");
    const notes = found
      ? [b.summary, b.services && b.services.length ? "Services: " + b.services.join(", ") + "." : ""].filter(Boolean).join("\n")
      : saved.notes || "";
    const opt = (name, value, label, def) =>
      '<option value="' + value + '"' + ((saved[name] || def) === value ? " selected" : "") + ">" + label + "</option>";
    return `
      <h2 class="step-head"><span class="step-num">2</span> ${found ? "Check your details and pick a topic" : "Your details and topic"}</h2>
      <form class="stack-form tool-form" id="blog-post-form" novalidate>
        <div class="field-row">
          <label class="field"><span class="field-label">Business name</span>
            <input type="text" name="business" maxlength="120" value="${val("name", saved.business)}" placeholder="e.g. Smith Roofing"></label>
          <label class="field"><span class="field-label">Industry</span>
            <input type="text" name="industry" maxlength="120" value="${val("industry")}" placeholder="e.g. roofing and gutters"></label>
        </div>
        <div class="field-row">
          <label class="field"><span class="field-label">Location</span>
            <input type="text" name="location" maxlength="120" value="${val("location")}" placeholder="e.g. Ballarat VIC"></label>
          <label class="field"><span class="field-label">Who it's for</span>
            <input type="text" name="audience" maxlength="300" value="${val("audience")}" placeholder="e.g. homeowners with older houses"></label>
        </div>
        <label class="field"><span class="field-label">What you offer, and facts to include</span>
          <textarea name="notes" rows="3" maxlength="1500" placeholder="e.g. Family-owned since 1998, licensed, servicing Ballarat and surrounds, free quotes">${esc(notes)}</textarea></label>
        <fieldset class="field">
          <legend class="field-label">Topic</legend>
          ${found && found.method ? '<p class="fine">' + esc(found.method) + " These are well-informed ideas, not guarantees: no tool can promise a ranking.</p>" : ""}
          <div class="topic-list">
            ${topics.map((t, i) => `
              <label class="topic-option">
                <input type="radio" name="topicChoice" value="${i}" ${i === 0 ? "checked" : ""}>
                <span><strong>${esc(t.title)}</strong>
                  <span class="topic-meta">Targets "${esc(t.keyword)}" &middot; ${esc(INTENT_LABEL[t.intent] || t.intent)}</span>
                  <span class="fine">${esc(t.why)}</span></span>
              </label>`).join("")}
            <label class="topic-option">
              <input type="radio" name="topicChoice" value="custom" ${topics.length ? "" : "checked"}>
              <span><strong>${topics.length ? "My own topic" : "What should the post be about?"}</strong>
                <input type="text" name="customTopic" maxlength="300" value="${topics.length ? "" : esc(saved.topic || "")}" placeholder="e.g. Getting your roof ready for winter"></span>
            </label>
          </div>
        </fieldset>
        <div class="field-row">
          <label class="field"><span class="field-label">Tone</span>
            <select name="tone">
              ${opt("tone", "plain and friendly", "Plain and friendly", "plain and friendly")}
              ${opt("tone", "professional", "Professional", "plain and friendly")}
              ${opt("tone", "warm and chatty", "Warm and chatty", "plain and friendly")}
            </select></label>
          <label class="field"><span class="field-label">Length</span>
            <select name="length">
              ${opt("length", "600", "Short (about 600 words)", "900")}
              ${opt("length", "900", "Medium (about 900 words)", "900")}
              ${opt("length", "1200", "Long (about 1,200 words)", "900")}
            </select></label>
        </div>
        <div class="tool-actions">
          <button class="btn btn-primary" type="submit">Write my post</button>
          <button class="btn btn-ghost show-example" type="button">See an example post</button>
        </div>
      </form>
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function renderPost(r) {
    const esc = T.ui.esc;
    return `
      <div class="result-box">
        <div class="result-meta">
          <p><span class="meta-label">Title</span> <span id="blog-title">${esc(r.title)}</span></p>
          <p><span class="meta-label">Meta description</span> <span id="blog-meta">${esc(r.metaDescription)}</span></p>
        </div>
        <div class="tool-actions">
          <button class="btn btn-dark" type="button" data-copy="#blog-md">Copy Markdown</button>
          <button class="btn btn-ghost" type="button" id="blog-download">Download .md</button>
          <button class="btn btn-ghost" type="button" data-copy="#blog-meta">Copy meta description</button>
        </div>
        <article class="prose result-prose">${T.ui.renderMarkdown(r.post)}</article>
        <textarea id="blog-md" class="visually-hidden" readonly aria-hidden="true" tabindex="-1">${esc(r.post)}</textarea>
      </div>
      <div class="notice">
        <strong>Before you publish:</strong> check every fact, price and claim against what you actually do (AI can sound sure and still be wrong), add a real photo of your own work, and decide whether to say AI helped draft it. Class 6 covers disclosure.
      </div>`;
  }

  // Show step 2, filled from the website read (found) or from saved values.
  function showStep2(root, found) {
    const step2 = root.querySelector("#blog-step2");
    const saved = T.local.get(FORM_KEY, {});
    step2.innerHTML = step2Html(found, saved);
    step2.classList.remove("hidden");
    const topics = (found && found.topics) || [];
    const website = (found && found.url) || saved.website || "";

    T.wireAiTool(step2, {
      tool: "blog-writer",
      form: "#blog-post-form",
      example: EXAMPLE_POST,
      steps: ["Reading your brief", "Planning the sections", "Writing the post", "Writing the questions section", "Tidying up"],
      collect(form) {
        const v = T.formValues(form);
        const choice = v.topicChoice;
        const picked = choice !== "custom" && topics[parseInt(choice, 10)];
        const topic = picked ? picked.title : v.customTopic;
        if (!v.business) throw new Error("Please add your business name.");
        if (!topic) throw new Error("Please pick a topic or type your own.");
        const input = {
          business: v.business, industry: v.industry, location: v.location, audience: v.audience,
          notes: v.notes, topic: topic, keyword: picked ? picked.keyword : "", website: website,
          tone: v.tone, length: v.length,
        };
        T.local.set(FORM_KEY, Object.assign({}, saved, input, { website: website }));
        return input;
      },
      renderResult: renderPost,
      afterRender(out, r) {
        const dl = out.querySelector("#blog-download");
        if (dl) dl.addEventListener("click", () => {
          const name = (r.title || "blog-post").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "blog-post";
          T.download(name + ".md", "# " + r.title + "\n\n" + r.post + "\n", "text/markdown");
        });
      },
    });
    const radios = step2.querySelectorAll('[name="topicChoice"]');
    const custom = step2.querySelector('[name="customTopic"]');
    custom.addEventListener("focus", () => { radios[radios.length - 1].checked = true; });
    return step2;
  }

  function bind(root) {
    const step1 = root.querySelector("#blog-step1");
    T.wireAiTool(step1, {
      tool: "blog-topics",
      form: "#blog-site-form",
      example: EXAMPLE_TOPICS,
      steps: ["Reading your website", "Working out what you do", "Searching what people ask", "Checking what ranks", "Choosing topics"],
      collect(form) {
        const v = T.formValues(form);
        if (!v.url) throw new Error("Enter your website address, or fill in your details instead.");
        T.local.set(FORM_KEY, Object.assign(T.local.get(FORM_KEY, {}), { website: v.url }));
        return { url: v.url };
      },
      renderResult(r, isExample) {
        const esc = T.ui.esc;
        return `<div class="notice notice-ok">${isExample ? "" : "Read <strong>" + esc(r.url) + "</strong>. "}Found ${r.topics.length} topic idea${r.topics.length === 1 ? "" : "s"} for <strong>${esc(r.business.name || "your business")}</strong>. Check the details below, pick a topic, and write the post.</div>`;
      },
      afterRender(out, r) {
        const step2 = showStep2(root, r);
        if (step2.scrollIntoView) step2.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    });
    root.querySelector("#blog-skip").addEventListener("click", () => {
      const step2 = showStep2(root, null);
      const first = step2.querySelector('[name="business"]');
      if (first) first.focus();
    });
  }

  T.register({
    slug: "blog-writer",
    title: "Blog Writer",
    kind: "ai",
    blurb: "Give it your website: it works out what you do, suggests topics people actually search for, then writes a ready-to-edit post in Australian English.",
    related: [
      { slug: "class-4-talking-to-the-software", why: "a worked example of a four-part request: role, task, material, constraints." },
      { slug: "doc-04-prompting-cheat-sheet", why: "see the first-draft pattern from the cheat sheet in action." },
      { slug: "class-6-keeping-your-house-in-order", why: "practise the disclosure and checking habits before anything goes public." },
    ],
    render,
    bind,
  });
})();
