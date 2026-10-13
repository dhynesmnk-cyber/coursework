/* leads.js — BeeSearch Leads (AI with live web search) plus a shortlist and
 * pitch writer. The shortlist lives only in this browser (localStorage);
 * nothing about the visitor's prospects is stored on the server.
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;
  const LIST_KEY = "awspp-leads-shortlist";
  const FORM_KEY = "awspp-leads-form";
  const STATUSES = ["New", "Contacted", "Won", "Lost"];

  // Example output: clearly fictional businesses on reserved .example domains.
  const EXAMPLE = {
    searchSummary: "Example only: searched for independent bottle shops and wine bars around Fitzroy and Collingwood.",
    leads: [
      { name: "Smith Street Cellar (example)", website: "https://smith-street-cellar.example", location: "Collingwood VIC", category: "independent bottle shop", whyFit: "Stocks a large range of small Victorian producers and runs weekly tastings, so a local small-batch gin fits their shelf.", publicContact: "https://smith-street-cellar.example/contact", sourceUrl: "https://smith-street-cellar.example" },
      { name: "The Laneway Wine Bar (example)", website: "https://laneway-wine-bar.example", location: "Fitzroy VIC", category: "wine bar", whyFit: "Cocktail list features Australian spirits by name, a sign they promote local producers.", publicContact: "hello@laneway-wine-bar.example", sourceUrl: "https://laneway-wine-bar.example/menu" },
    ],
  };

  const esc = (s) => T.ui.esc(s);
  const loadList = () => T.local.get(LIST_KEY, []);
  const saveList = (list) => T.local.set(LIST_KEY, list);
  const keyOf = (l) => (l.website || l.name || "").toLowerCase();

  function linkOrText(value) {
    if (/^https?:\/\//i.test(value)) return '<a href="' + esc(value) + '" target="_blank" rel="noopener nofollow">' + esc(value.replace(/^https?:\/\//i, "")) + "</a>";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '<a href="mailto:' + esc(value) + '">' + esc(value) + "</a>";
    return esc(value);
  }

  function leadBody(l) {
    return `
      <p class="lead-meta">${esc([l.category, l.location].filter(Boolean).join(" · "))}</p>
      ${l.whyFit ? "<p>" + esc(l.whyFit) + "</p>" : ""}
      <p class="fine">
        ${l.website ? "Website: " + linkOrText(l.website) + "<br>" : ""}
        ${l.publicContact ? "Published contact: " + linkOrText(l.publicContact) + "<br>" : ""}
        ${l.sourceUrl && l.sourceUrl !== l.website ? "Found on: " + linkOrText(l.sourceUrl) : ""}
      </p>`;
  }

  function render() {
    const saved = T.local.get(FORM_KEY, {});
    const v = (k) => esc(saved[k] || "");
    return `
      <form class="stack-form tool-form" novalidate>
        <label class="field"><span class="field-label">What do you sell?</span>
          <input type="text" name="offer" maxlength="300" value="${v("offer")}" placeholder="e.g. Small-batch gin made in the Yarra Valley" required></label>
        <label class="field"><span class="field-label">Who is your ideal customer?</span>
          <input type="text" name="idealCustomer" maxlength="300" value="${v("idealCustomer")}" placeholder="e.g. Independent bottle shops and cocktail bars" required></label>
        <div class="field-row">
          <label class="field"><span class="field-label">Where?</span>
            <input type="text" name="location" maxlength="120" value="${v("location")}" placeholder="e.g. Fitzroy and Collingwood, VIC" required></label>
          <label class="field"><span class="field-label">How many?</span>
            <select name="count">
              <option value="3">Up to 3</option>
              <option value="6" selected>Up to 6</option>
              <option value="10">Up to 10</option>
            </select></label>
        </div>
        <label class="field"><span class="field-label">Good customers you already have (optional)</span>
          <input type="text" name="examples" maxlength="600" value="${v("examples")}" placeholder="Names or websites, so the search finds similar places"></label>
        <div class="tool-actions">
          <button class="btn btn-primary" type="submit">Find leads</button>
          <button class="btn btn-ghost show-example" type="button">See an example</button>
        </div>
      </form>
      <p class="fine tool-fine">Searches the live web with Claude (Anthropic), so a search takes a minute or two. Only businesses and their published business contacts are returned, never private individuals. Your shortlist is saved in this browser only.</p>
      <div class="tool-output" aria-live="polite"></div>

      <section class="shortlist">
        <div class="shortlist-head">
          <h2>Your shortlist</h2>
          <div class="tool-actions">
            <button class="btn btn-ghost btn-sm" type="button" id="leads-csv">Export CSV</button>
            <button class="btn btn-ghost btn-sm" type="button" id="leads-clear">Clear</button>
          </div>
        </div>
        <div id="leads-list"></div>
      </section>

      <div class="notice">
        <strong>Before you email anyone.</strong> Australia's Spam Act 2003 covers commercial emails, including business to business. You can usually rely on inferred consent when a business publishes its email address conspicuously and your message relates to what that business does, unless they say they don't want unsolicited messages. Every message must clearly identify you and include an easy way to opt out, and opt-outs must be honoured within five working days. Check ACMA's guidance for your situation. Practical guidance, not legal advice. Class 3 covers the privacy side.
      </div>`;
  }

  function renderResult(r, isExample) {
    const list = loadList();
    const have = new Set(list.map(keyOf));
    if (!r.leads || !r.leads.length) {
      return '<div class="notice">No matching businesses this time. Try a broader location or a looser description of your ideal customer.</div>';
    }
    return `
      <div class="result-box">
        ${r.searchSummary ? '<p class="fine">' + esc(r.searchSummary) + "</p>" : ""}
        <div class="lead-grid">
          ${r.leads.map((l, i) => `
            <div class="card lead-card">
              <h3>${esc(l.name)}</h3>
              ${leadBody(l)}
              ${isExample ? "" : `<button class="btn btn-dark btn-sm" type="button" data-add="${i}" ${have.has(keyOf(l)) ? "disabled" : ""}>${have.has(keyOf(l)) ? "On your shortlist" : "Add to shortlist"}</button>`}
            </div>`).join("")}
        </div>
        <p class="fine">Check each business yourself before contacting it. Search results can be out of date and AI can misread a page.</p>
      </div>`;
  }

  function renderList(root) {
    const list = loadList();
    const el = root.querySelector("#leads-list");
    if (!list.length) {
      el.innerHTML = '<p class="fine">Nothing saved yet. Add leads from your search results and they will stay here, in this browser, with their status and your notes.</p>';
      return;
    }
    el.innerHTML = list.map((l, i) => `
      <div class="card lead-card saved-lead" data-i="${i}">
        <div class="lead-top">
          <h3>${esc(l.name)}</h3>
          <select data-status="${i}" aria-label="Status for ${esc(l.name)}">
            ${STATUSES.map((s) => '<option' + (l.status === s ? " selected" : "") + ">" + s + "</option>").join("")}
          </select>
        </div>
        ${leadBody(l)}
        <label class="field"><span class="field-label">Notes</span>
          <textarea rows="2" data-notes="${i}" maxlength="2000">${esc(l.notes || "")}</textarea></label>
        <div class="tool-actions">
          <button class="btn btn-primary btn-sm" type="button" data-pitch="${i}">${l.pitch ? "Rewrite pitch" : "Write a pitch"}</button>
          <button class="btn btn-ghost btn-sm" type="button" data-remove="${i}">Remove</button>
        </div>
        <div class="pitch-area" id="pitch-${i}">${l.pitch ? pitchHtml(l.pitch, i) : ""}</div>
      </div>`).join("");
    T.bindCopyButtons(el);
  }

  function pitchHtml(p, i) {
    return `
      <div class="result-box pitch-box">
        <p><span class="meta-label">Subject</span> <span id="pitch-subject-${i}">${esc(p.subject)}</span></p>
        <pre class="pitch-body" id="pitch-body-${i}">${esc(p.body)}</pre>
        <div class="tool-actions">
          <button class="btn btn-dark btn-sm" type="button" data-copy="#pitch-body-${i}">Copy email</button>
          <button class="btn btn-ghost btn-sm" type="button" data-copy="#pitch-subject-${i}">Copy subject</button>
        </div>
        <p class="fine">Read it through and fix anything that isn't true before you send it.</p>
      </div>`;
  }

  function pitchForm(i) {
    const saved = T.local.get(FORM_KEY, {});
    return `
      <form class="pitch-form" data-pitch-form="${i}">
        <div class="field-row">
          <label class="field"><span class="field-label">Your name</span>
            <input type="text" name="senderName" maxlength="80" value="${esc(saved.senderName || "")}" placeholder="e.g. Dana"></label>
          <label class="field"><span class="field-label">Your business</span>
            <input type="text" name="business" maxlength="120" value="${esc(saved.business || "")}" placeholder="e.g. Yarra Gin Co"></label>
          <label class="field"><span class="field-label">Tone</span>
            <select name="tone"><option value="warm">Warm</option><option value="professional">Professional</option><option value="brief">Brief</option></select></label>
        </div>
        <button class="btn btn-primary btn-sm" type="submit">Write it</button>
      </form>`;
  }

  async function writePitch(root, i, form) {
    const list = loadList();
    const lead = list[i];
    const saved = T.local.get(FORM_KEY, {});
    const v = T.formValues(form);
    T.local.set(FORM_KEY, Object.assign(saved, { senderName: v.senderName, business: v.business }));
    const area = root.querySelector("#pitch-" + i);
    if (!saved.offer) {
      area.innerHTML = '<div class="notice notice-bad">Fill in "What do you sell?" at the top of the page first.</div>';
      return;
    }
    area.innerHTML = '<div class="job-status" role="status"><span class="spinner" aria-hidden="true"></span><span>Writing the email...</span></div>';
    try {
      const pitch = await T.runJob("pitch", {
        lead: { name: lead.name, website: lead.website, location: lead.location, category: lead.category, whyFit: lead.whyFit },
        offer: saved.offer, business: v.business, senderName: v.senderName, tone: v.tone,
      });
      const fresh = loadList();
      const idx = fresh.findIndex((l) => keyOf(l) === keyOf(lead));
      if (idx >= 0) { fresh[idx].pitch = pitch; saveList(fresh); }
      renderList(root);
    } catch (err) {
      area.innerHTML = '<div class="notice notice-bad">' + esc(err.message) + "</div>";
    }
  }

  function bind(root) {
    let lastResult = null;
    T.wireAiTool(root, {
      tool: "leads",
      example: EXAMPLE,
      steps: ["Planning the searches", "Searching the web", "Checking the businesses", "Writing up the list"],
      collect(form) {
        const v = T.formValues(form);
        if (!v.offer) throw new Error('Please fill in "What do you sell?".');
        if (!v.idealCustomer) throw new Error("Please describe your ideal customer.");
        if (!v.location) throw new Error("Please add a location.");
        T.local.set(FORM_KEY, Object.assign(T.local.get(FORM_KEY, {}), v));
        v.count = parseInt(v.count, 10) || 6;
        v.exclude = loadList().map((l) => l.name).slice(0, 50);
        return v;
      },
      renderResult,
      afterRender(out, r, isExample) {
        lastResult = isExample ? null : r;
        Array.prototype.forEach.call(out.querySelectorAll("[data-add]"), (btn) => {
          btn.addEventListener("click", () => {
            const lead = lastResult && lastResult.leads[parseInt(btn.dataset.add, 10)];
            if (!lead) return;
            const list = loadList();
            if (!list.some((l) => keyOf(l) === keyOf(lead))) {
              list.unshift(Object.assign({}, lead, { status: "New", notes: "", addedAt: Date.now() }));
              saveList(list);
            }
            btn.disabled = true;
            btn.textContent = "On your shortlist";
            renderList(root);
          });
        });
      },
    });

    const listEl = root.querySelector("#leads-list");
    listEl.addEventListener("change", (e) => {
      const i = e.target.dataset.status;
      if (i == null) return;
      const list = loadList();
      if (list[i]) { list[i].status = e.target.value; saveList(list); }
    });
    listEl.addEventListener("input", (e) => {
      const i = e.target.dataset.notes;
      if (i == null) return;
      const list = loadList();
      if (list[i]) { list[i].notes = e.target.value; saveList(list); }
    });
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.remove != null) {
        const list = loadList();
        list.splice(parseInt(btn.dataset.remove, 10), 1);
        saveList(list);
        renderList(root);
      } else if (btn.dataset.pitch != null) {
        const i = btn.dataset.pitch;
        const area = root.querySelector("#pitch-" + i);
        area.innerHTML = pitchForm(i);
        area.querySelector("form").addEventListener("submit", (ev) => {
          ev.preventDefault();
          writePitch(root, parseInt(i, 10), ev.target);
        });
      }
    });

    root.querySelector("#leads-csv").addEventListener("click", () => {
      const list = loadList();
      if (!list.length) { T.ui.toast("Your shortlist is empty."); return; }
      const csv = T.toCsv(list.map((l) => Object.assign({}, l, {
        pitchSubject: l.pitch ? l.pitch.subject : "",
        pitchBody: l.pitch ? l.pitch.body : "",
      })), [
        { key: "name", label: "Business" }, { key: "status", label: "Status" }, { key: "category", label: "Type" },
        { key: "location", label: "Location" }, { key: "website", label: "Website" }, { key: "publicContact", label: "Published contact" },
        { key: "whyFit", label: "Why it fits" }, { key: "notes", label: "Notes" },
        { key: "pitchSubject", label: "Pitch subject" }, { key: "pitchBody", label: "Pitch email" },
      ]);
      T.download("leads-shortlist.csv", csv, "text/csv");
    });
    root.querySelector("#leads-clear").addEventListener("click", () => {
      if (!loadList().length) return;
      if (!window.confirm("Remove every lead from your shortlist? This can't be undone.")) return;
      saveList([]);
      renderList(root);
    });

    const savedCount = T.local.get(FORM_KEY, {}).count;
    if (savedCount) root.querySelector('[name="count"]').value = savedCount;
    renderList(root);
  }

  T.register({
    slug: "leads",
    title: "BeeSearch Leads",
    kind: "ai",
    blurb: "Find real local businesses that could buy from or stock your product, keep a shortlist, and draft a first email to each.",
    related: [
      { slug: "class-3-your-data-their-servers", why: "the Privacy Act section explains what you can and can't do with contact details." },
      { slug: "doc-05-data-security-basics", why: "keep a lead list somewhere sensible, and know what never to paste into an AI tool." },
    ],
    render,
    bind,
  });
})();
