/* website-check.js — Website Check tool (free, no AI). Fetches the page and
 * robots.txt through the site-check function (or takes pasted HTML), then
 * scores structured data and reports which AI crawlers may read the site.
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;
  const lib = () => T.lib.site;

  function render() {
    const esc = T.ui.esc;
    const saved = T.local.get("awspp-sitecheck-form", {});
    const kinds = lib().KINDS;
    return `
      <form class="stack-form tool-form" novalidate>
        <div class="field-row">
          <label class="field"><span class="field-label">Website address</span>
            <input type="url" name="url" maxlength="300" value="${esc(saved.url || "")}" placeholder="e.g. smithroofing.com.au"></label>
          <label class="field"><span class="field-label">Type of business</span>
            <select name="kind">
              ${Object.keys(kinds).map((k) => '<option value="' + k + '"' + ((saved.kind || "local") === k ? " selected" : "") + ">" + esc(kinds[k].label) + "</option>").join("")}
            </select></label>
        </div>
        <details class="field paste-details">
          <summary>No public website yet, or the check can't reach it? Paste the page source instead</summary>
          <label class="field"><span class="field-label">Page HTML (View Source, then copy all)</span>
            <textarea name="html" rows="5" placeholder="&lt;!doctype html&gt;..."></textarea></label>
          <label class="field"><span class="field-label">robots.txt (optional)</span>
            <textarea name="robots" rows="3" placeholder="User-agent: *&#10;Disallow:"></textarea></label>
        </details>
        <div class="tool-actions">
          <button class="btn btn-primary" type="submit">Check my site</button>
        </div>
      </form>
      ${T.freeFooter("Free and no AI involved. The page is fetched once to read it and nothing is kept.")}
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function scoreWord(score) {
    return score >= 80 ? "Strong" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs work";
  }

  function renderResult(res, crawlers, robotsFound, url) {
    const esc = T.ui.esc;
    const optOut = lib().trainingOptOut(crawlers);
    const blockedSearch = crawlers.filter((c) => c.purpose === "search" && !c.allowed);
    const row = (c) => `<tr><td><code>${esc(c.token)}</code></td><td>${esc(c.who)}</td>
      <td class="${c.allowed ? "ok-text" : "bad-text"}">${c.allowed ? "Allowed" : "Blocked"}</td>
      <td class="fine">${c.rule ? esc(c.rule) + (c.via === "*" ? " (applies to all crawlers)" : "") : "No rule"}</td></tr>`;
    return `
      <div class="result-box">
        ${url ? '<p class="fine">Checked <a href="' + esc(url) + '" target="_blank" rel="noopener nofollow">' + esc(url) + "</a></p>" : ""}
        <h3>Structured data: ${res.score}/100 (${scoreWord(res.score)})</h3>
        <p class="fine">Structured data (schema.org JSON-LD) is a small block of code that states your business details in a form search engines and AI assistants can read reliably. It helps them get your details right; it doesn't guarantee any ranking or special listing.</p>
        <ul class="check-list">
          ${res.checks.map((c) => `<li class="${c.ok ? "ok" : "miss"}"><span class="check-mark" aria-hidden="true">${c.ok ? "✓" : "✗"}</span>
            <span><strong>${esc(c.label)}</strong> <span class="fine">${c.points}/${c.max}</span>${c.ok ? "" : '<br><span class="fine">' + esc(c.fix) + "</span>"}</span></li>`).join("")}
        </ul>
        ${res.found.length ? '<p class="fine">Types found on the page: ' + esc(res.found.join("; ")) + "</p>" : '<p class="fine">No structured data found on this page.</p>'}
        ${res.score < 100 ? `
          <h3>Suggested starting point</h3>
          <p class="fine">Replace everything in [square brackets], then paste it into your page's &lt;head&gt;, or into your website builder's "custom code" or SEO settings. Check it with Google's Rich Results Test afterwards.</p>
          <pre class="code-out" id="schema-out">${esc(lib().suggestJsonLd(res))}</pre>
          <div class="tool-actions"><button class="btn btn-dark btn-sm" type="button" data-copy="#schema-out">Copy code</button></div>` : ""}

        <h3>AI crawlers on your homepage</h3>
        <p class="fine">${robotsFound ? "Based on your robots.txt file." : "No robots.txt was found, so every crawler is allowed by default."} robots.txt is a request, not a lock: reputable crawlers follow it.</p>
        <div class="table-wrap"><table class="plain-table">
          <thead><tr><th>Crawler</th><th>Who</th><th>Homepage</th><th>Why</th></tr></thead>
          <tbody>
            <tr class="group-row"><td colspan="4">Used to train AI models</td></tr>
            ${crawlers.filter((c) => c.purpose === "training").map(row).join("")}
            <tr class="group-row"><td colspan="4">Used for search and AI answers that can cite or link to you</td></tr>
            ${crawlers.filter((c) => c.purpose === "search").map(row).join("")}
          </tbody>
        </table></div>
        ${blockedSearch.length ? '<div class="notice notice-warn">Search crawlers are blocked (' + esc(blockedSearch.map((c) => c.token).join(", ")) + "). Those services can't read your site, so they won't show or cite it. If that isn't deliberate, remove the matching Disallow lines.</div>" : ""}
        ${optOut ? `
          <p>Whether to let AI companies train on your public pages is your call; Class 3 walks through the trade-off. If you'd rather opt out of training but stay visible in search, <strong>add</strong> these lines to the end of your robots.txt (don't replace the file):</p>
          <pre class="code-out" id="robots-out">${esc(optOut)}</pre>
          <div class="tool-actions"><button class="btn btn-dark btn-sm" type="button" data-copy="#robots-out">Copy lines</button></div>` : '<p class="fine">All the training crawlers listed are already blocked.</p>'}
      </div>`;
  }

  function bind(root) {
    const form = root.querySelector("form");
    const out = root.querySelector(".tool-output");
    const submit = form.querySelector('[type="submit"]');
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = T.formValues(form);
      T.local.set("awspp-sitecheck-form", { url: v.url, kind: v.kind });
      let html = v.html;
      let robots = v.robots;
      let robotsFound = !!robots;
      let url = "";
      if (!html) {
        if (!v.url) { out.innerHTML = '<div class="notice notice-bad">Enter your website address, or paste the page source.</div>'; return; }
        submit.disabled = true;
        out.innerHTML = '<div class="job-status" role="status"><span class="spinner" aria-hidden="true"></span><span>Reading your site...</span></div>';
        try {
          const res = await fetch("/.netlify/functions/site-check?url=" + encodeURIComponent(v.url), { cache: "no-store" });
          let data = null;
          try { data = await res.json(); } catch (err) { data = null; }
          if (!res.ok || !data || data.error) {
            throw new Error(data && data.error ? data.error : res.status === 404
              ? "The website check only works on the live site. Paste the page source instead."
              : "Couldn't check that site right now. Paste the page source instead.");
          }
          html = data.html;
          robots = data.robots && data.robots.text;
          robotsFound = !!(data.robots && data.robots.status && data.robots.status < 400 && robots);
          url = data.url;
        } catch (err) {
          out.innerHTML = '<div class="notice notice-bad">' + T.ui.esc(err.message || "Couldn't reach the website check. Paste the page source instead.") + "</div>";
          const d = root.querySelector(".paste-details");
          if (d) d.open = true;
          return;
        } finally {
          submit.disabled = false;
        }
      }
      const doc = new DOMParser().parseFromString(html, "text/html");
      const res = lib().audit(doc, { kind: v.kind, pageUrl: url || (v.url ? "https://" + v.url.replace(/^https?:\/\//i, "") : "") });
      const crawlers = lib().crawlerReport(robots, robotsFound);
      out.innerHTML = renderResult(res, crawlers, robotsFound, url);
      T.bindCopyButtons(out);
    });
  }

  T.register({
    slug: "website-check",
    title: "Website Check",
    kind: "free",
    badge: "Free · no AI",
    blurb: "See whether search engines and AI assistants can read your business details, and which AI crawlers your site lets in.",
    related: [
      { slug: "class-3-your-data-their-servers", why: "decide whether AI companies may train on your public pages, then set it in one file." },
      { slug: "class-5-software-without-the-software-bill", why: "a small, single-job tool of the kind Class 5 suggests building for yourself." },
    ],
    render,
    bind,
  });
})();
