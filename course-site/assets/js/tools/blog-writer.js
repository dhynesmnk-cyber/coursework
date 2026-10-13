/* blog-writer.js — Blog Writer tool (AI). */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;

  const EXAMPLE = {
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

  function render() {
    const esc = T.ui.esc;
    const saved = T.local.get("awspp-blog-form", {});
    const v = (k) => esc(saved[k] || "");
    const opt = (name, value, label, def) =>
      '<option value="' + value + '"' + ((saved[name] || def) === value ? " selected" : "") + ">" + label + "</option>";
    return `
      <form class="stack-form tool-form" novalidate>
        <div class="field-row">
          <label class="field"><span class="field-label">Business name</span>
            <input type="text" name="business" maxlength="120" value="${v("business")}" placeholder="e.g. Smith Roofing" required></label>
          <label class="field"><span class="field-label">Industry (optional)</span>
            <input type="text" name="industry" maxlength="120" value="${v("industry")}" placeholder="e.g. roofing and gutters"></label>
        </div>
        <label class="field"><span class="field-label">What should the post be about?</span>
          <input type="text" name="topic" maxlength="300" value="${v("topic")}" placeholder="e.g. Getting your roof ready for winter" required></label>
        <div class="field-row">
          <label class="field"><span class="field-label">Who is it for? (optional)</span>
            <input type="text" name="audience" maxlength="300" value="${v("audience")}" placeholder="e.g. homeowners with older houses"></label>
          <label class="field"><span class="field-label">Location (optional)</span>
            <input type="text" name="location" maxlength="120" value="${v("location")}" placeholder="e.g. Ballarat VIC"></label>
        </div>
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
        <label class="field"><span class="field-label">Facts about your business to include (optional)</span>
          <textarea name="notes" rows="3" maxlength="1000" placeholder="e.g. Family-owned since 1998, licensed, servicing Ballarat and surrounds, free quotes">${v("notes")}</textarea></label>
        <div class="tool-actions">
          <button class="btn btn-primary" type="submit">Write my post</button>
          <button class="btn btn-ghost show-example" type="button">See an example</button>
        </div>
      </form>
      ${T.aiFooter()}
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function renderResult(r) {
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

  T.register({
    slug: "blog-writer",
    title: "Blog Writer",
    kind: "ai",
    blurb: "A ready-to-edit blog post in Australian English, written for your customers and for search, from a few details about your business.",
    related: [
      { slug: "class-4-talking-to-the-software", why: "a worked example of a four-part request: role, task, material, constraints." },
      { slug: "doc-04-prompting-cheat-sheet", why: "see the first-draft pattern from the cheat sheet in action." },
      { slug: "class-6-keeping-your-house-in-order", why: "practise the disclosure and checking habits before anything goes public." },
    ],
    render,
    bind(root) {
      T.wireAiTool(root, {
        tool: "blog-writer",
        example: EXAMPLE,
        steps: ["Reading your brief", "Planning the sections", "Writing the post", "Writing the questions section", "Tidying up"],
        collect(form) {
          const v = T.formValues(form);
          if (!v.business) throw new Error("Please add your business name.");
          if (!v.topic) throw new Error("Please say what the post should be about.");
          T.local.set("awspp-blog-form", v);
          return v;
        },
        renderResult,
        afterRender(out, r) {
          const dl = out.querySelector("#blog-download");
          if (dl) dl.addEventListener("click", () => {
            const name = (r.title || "blog-post").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "blog-post";
            T.download(name + ".md", "# " + r.title + "\n\n" + r.post + "\n", "text/markdown");
          });
        },
      });
    },
  });
})();
