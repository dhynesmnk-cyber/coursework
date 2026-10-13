/* registry.js — the Tools section's shared plumbing.
 * Each tool file calls COURSE_TOOLS.register({...}) with:
 *   slug, title, kind ("ai" | "free"), blurb, related: [{ slug, why }],
 *   render() -> HTML for the tool body, bind(root) -> wire up events.
 * app.js owns routing and layout; it calls COURSE_TOOLS.init() with its
 * helpers (esc, toast, renderMarkdown) before the first route.
 * Loaded after md.js and before app.js. No dependencies.
 */
(function () {
  "use strict";

  const API = "/.netlify/functions/";
  const tools = [];
  const ui = {
    esc: (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
    toast: (msg) => console.log(msg),
    renderMarkdown: (md) => window.renderMarkdown(md),
  };

  const T = {
    pollMs: 2500,          // tests shorten this
    startTimeoutMs: 45000, // no sign of the background job by then: give up
    totalTimeoutMs: 6 * 60 * 1000,

    init(helpers) { Object.assign(ui, helpers || {}); },
    get ui() { return ui; },
    register(def) { tools.push(def); },
    list() { return tools.slice(); },
    get(slug) { return tools.find((t) => t.slug === slug) || null; },
    // Tools that point at a class or document, for the "Try the tool" callouts.
    forContent(contentSlug) {
      return tools
        .map((t) => ({ tool: t, link: (t.related || []).find((r) => r.slug === contentSlug) }))
        .filter((x) => x.link);
    },
  };

  // ── small helpers for tool files ─────────────────────────────────────
  T.uuid = function () {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    const b = new Uint8Array(16);
    window.crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  };

  // localStorage that never throws (private windows, blocked storage).
  T.local = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* not fatal */ }
    },
  };

  T.copy = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) { /* ignore */ }
      ta.remove();
    }
    ui.toast("Copied to clipboard.");
  };

  T.download = function (filename, text, type) {
    const blob = new Blob([text], { type: (type || "text/plain") + ";charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  T.toCsv = function (rows, columns) {
    const cell = (v) => {
      let s = String(v == null ? "" : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheets running it as a formula
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const head = columns.map((c) => cell(c.label)).join(",");
    return [head].concat(rows.map((r) => columns.map((c) => cell(r[c.key])).join(","))).join("\n");
  };

  // Read a form into a plain object. Checkbox groups become arrays.
  T.formValues = function (form) {
    const out = {};
    Array.prototype.forEach.call(form.elements, (el) => {
      if (!el.name || el.disabled) return;
      if (el.type === "checkbox") {
        out[el.name] = out[el.name] || [];
        if (el.checked) out[el.name].push(el.value);
      } else if (el.type === "radio") {
        if (el.checked) out[el.name] = el.value;
      } else if (el.type !== "file" && el.type !== "submit" && el.type !== "button") {
        out[el.name] = el.value.trim();
      }
    });
    return out;
  };

  // Any button with data-copy="<css selector>" copies that element's text.
  T.bindCopyButtons = function (root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-copy]"), (btn) => {
      btn.addEventListener("click", () => {
        const target = root.querySelector(btn.getAttribute("data-copy"));
        if (target) T.copy(target.value != null && target.tagName !== "DIV" ? target.value : target.textContent);
      });
    });
  };

  // ── AI jobs: start in the background, then poll for the result ───────
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function jobError(message, code) {
    const e = new Error(message);
    e.code = code || "failed";
    return e;
  }

  T.runJob = async function (tool, input, onProgress) {
    const jobId = T.uuid();
    let res;
    try {
      res = await fetch(API + "tool-run-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: jobId, tool: tool, input: input }),
      });
    } catch (e) {
      throw jobError("The AI tools only work on the live website, not from a saved copy.", "offline");
    }
    if (res.status === 404) throw jobError("The AI tools only work on the live website, not from a saved copy.", "offline");
    if (res.status === 413) throw jobError("That request is too large. Try a smaller photo or shorter text.", "too_large");
    if (!res.ok) throw jobError("Couldn't start the job (HTTP " + res.status + "). Please try again.", "start_failed");

    const started = Date.now();
    let running = false;
    let misses = 0;
    for (;;) {
      await sleep(T.pollMs);
      const elapsed = Date.now() - started;
      let data = null;
      try {
        const r = await fetch(API + "tool-status?id=" + encodeURIComponent(jobId), { cache: "no-store" });
        if (r.ok) data = await r.json();
      } catch (e) { data = null; }
      if (!data) {
        if (++misses >= 4) throw jobError("Lost contact with the website. Check your connection and try again.", "network");
        continue;
      }
      misses = 0;
      if (data.status === "done") return data.result;
      if (data.status === "error") throw jobError(data.error || "Something went wrong.", data.code);
      if (data.status === "running") running = true;
      if (onProgress) onProgress(data.status, elapsed);
      if (!running && elapsed > T.startTimeoutMs) throw jobError("The job didn't start. Please try again in a minute.", "no_start");
      if (elapsed > T.totalTimeoutMs) throw jobError("This is taking much longer than usual. Please try again.", "slow");
    }
  };

  // Wire a standard AI tool: form submit -> job -> result, plus an
  // always-available example so the tool still shows what it does when
  // the daily cap is hit or the AI is paused.
  //   opts: { tool, form, out, collect(form) -> input, renderResult(result, isExample) -> html,
  //           afterRender(outEl, result), example, steps: [progress messages] }
  T.wireAiTool = function (root, opts) {
    const form = root.querySelector(opts.form || "form");
    const out = root.querySelector(opts.out || ".tool-output");
    const submit = form.querySelector('[type="submit"]');
    const steps = opts.steps || ["Working on it"];

    function show(result, isExample, note) {
      out.innerHTML =
        (note ? '<div class="notice notice-warn">' + ui.esc(note) + "</div>" : "") +
        (isExample ? '<p class="example-label">Example output</p>' : "") +
        opts.renderResult(result, isExample);
      T.bindCopyButtons(out);
      if (opts.afterRender) opts.afterRender(out, result, isExample);
    }

    const exampleBtn = root.querySelector(".show-example");
    if (exampleBtn && opts.example) exampleBtn.addEventListener("click", () => show(opts.example, true));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let input;
      try {
        input = await opts.collect(form);
      } catch (err) {
        out.innerHTML = '<div class="notice notice-bad">' + ui.esc(err.message) + "</div>";
        return;
      }
      submit.disabled = true;
      const label = submit.textContent;
      submit.textContent = "Working...";
      out.innerHTML = '<div class="job-status" role="status"><span class="spinner" aria-hidden="true"></span><span class="job-text">Starting...</span></div>';
      const text = out.querySelector(".job-text");
      try {
        const result = await T.runJob(opts.tool, input, (status, elapsed) => {
          if (!text) return;
          if (status === "pending") { text.textContent = "Starting..."; return; }
          const i = Math.min(steps.length - 1, Math.floor(elapsed / 8000));
          text.textContent = steps[i] + " (" + Math.round(elapsed / 1000) + "s)";
        });
        show(result, false);
      } catch (err) {
        const fallback = ["limit", "paused", "not_configured", "offline"].indexOf(err.code) >= 0 && opts.example;
        if (fallback) show(opts.example, true, err.message);
        else out.innerHTML = '<div class="notice notice-bad">' + ui.esc(err.message) + "</div>";
      } finally {
        submit.disabled = false;
        submit.textContent = label;
      }
    });
  };

  // ── "Want a custom version?" box at the foot of each tool page ────────
  function builder() {
    const cfg = (window.COURSE_CONFIG && window.COURSE_CONFIG.customBuild) || {};
    return { name: cfg.name || "Dave", email: cfg.email || "" };
  }

  T.customCta = function (tool) {
    const esc = ui.esc;
    const who = esc(builder().name);
    return `
      <aside class="custom-cta" data-tool="${esc(tool ? tool.slug : "tools")}">
        <p><strong>${tool ? "Want a version built for your business?" : "Need a tool these don't cover?"}</strong>
          ${who} builds custom tools like ${tool ? "this one" : "these"}, set up around your services, your data and the way you work.
          <button type="button" class="link-btn cta-open">Ask ${who} about it</button></p>
        <form class="cta-form hidden" novalidate>
          <input type="text" name="bot-field" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="field-row">
            <label class="field"><span class="field-label">Your name</span>
              <input type="text" name="name" maxlength="100" autocomplete="name"></label>
            <label class="field"><span class="field-label">Email</span>
              <input type="email" name="email" maxlength="200" autocomplete="email"></label>
          </div>
          <label class="field"><span class="field-label">What would you want it to do? (optional)</span>
            <textarea name="message" rows="3" maxlength="2000"></textarea></label>
          <div class="tool-actions">
            <button class="btn btn-dark btn-sm" type="submit">Send to ${who}</button>
            <button class="btn btn-ghost btn-sm cta-cancel" type="button">Cancel</button>
          </div>
          <p class="fine cta-status" aria-live="polite"></p>
        </form>
      </aside>`;
  };

  // Wire every custom-build box inside root. Submissions go to Netlify Forms.
  T.bindCustomCta = function (root) {
    Array.prototype.forEach.call(root.querySelectorAll(".custom-cta"), (box) => {
      const form = box.querySelector(".cta-form");
      const status = box.querySelector(".cta-status");
      box.querySelector(".cta-open").addEventListener("click", () => {
        form.classList.toggle("hidden");
        if (!form.classList.contains("hidden")) form.querySelector('[name="name"]').focus();
      });
      box.querySelector(".cta-cancel").addEventListener("click", () => form.classList.add("hidden"));
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const v = T.formValues(form);
        if (!v.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
          status.textContent = "Please add your name and a working email address.";
          return;
        }
        const body = new URLSearchParams();
        body.append("form-name", "custom-build");
        body.append("bot-field", v["bot-field"] || "");
        body.append("name", v.name);
        body.append("email", v.email);
        body.append("tool", box.getAttribute("data-tool"));
        body.append("message", v.message || "");
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        status.textContent = "Sending...";
        try {
          const res = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          box.innerHTML = "<p><strong>Thanks, " + ui.esc(v.name.split(" ")[0]) + ".</strong> " +
            ui.esc(builder().name) + " will be in touch by email, usually within a business day or two.</p>";
        } catch (err) {
          const email = builder().email;
          status.innerHTML = "That didn't send." + (email
            ? ' Please email <a href="mailto:' + ui.esc(email) + '">' + ui.esc(email) + "</a> instead."
            : " Please try again in a moment.");
          btn.disabled = false;
        }
      });
    });
  };

  // Shared markup bits.
  T.aiFooter = function () {
    return '<p class="fine tool-fine">Runs on Claude (Anthropic). What you type is sent to the AI to produce the result and is not stored by this site once you have it. Free runs are limited per day.</p>';
  };
  T.freeFooter = function (text) {
    return '<p class="fine tool-fine">' + ui.esc(text || "Runs entirely in your browser. Nothing you enter leaves your device.") + "</p>";
  };

  window.COURSE_TOOLS = T;
})();
