/* app.js — course SPA: routing, auth (Netlify Identity), progress, quizzes,
 * worksheets, Q&A, certificate, personalised document downloads.
 * Depends on: config.js, content.js, quizzes.js, md.js, netlify-identity-widget.
 */
(function () {
  "use strict";

  const CFG = window.COURSE_CONFIG;
  const CONTENT = window.COURSE_CONTENT;
  const QUIZZES = window.COURSE_QUIZZES;
  const WORKSHEETS = window.COURSE_WORKSHEETS;

  const state = {
    user: null,          // identity user object
    access: null,        // {tier, learnerName, businessName, ...}
    progress: null,      // {lessons:{}, quizzes:{}, worksheets:{}}
    qaThreads: [],
    qaTimer: null,
  };

  const API = "/.netlify/functions/";

  // ── tiny helpers ──────────────────────────────────────────────────────
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function api(path, opts) {
    const res = await fetch(API + path, opts);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
    if (!res.ok) throw new Error((data && data.error) || res.status);
    return data;
  }

  function toast(msg, kind) {
    const t = el('<div class="toast ' + (kind || "") + '">' + esc(msg) + "</div>");
    $("#toasts").appendChild(t);
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 400);
    }, 4200);
  }

  // ── progress persistence (server, with local cache) ──────────────────
  let saveTimer = null;
  function cacheKey() { return "awspp-progress-" + (state.user ? state.user.id : "anon"); }

  function defaultProgress() { return { lessons: {}, quizzes: {}, worksheets: {} }; }

  async function loadProgress() {
    if (CFG.demoMode) {
      const cached = localStorage.getItem(cacheKey());
      state.progress = cached ? JSON.parse(cached) : defaultProgress();
    } else {
      try {
        state.progress = await api("progress");
        if (!state.progress || typeof state.progress !== "object") state.progress = defaultProgress();
        localStorage.setItem(cacheKey(), JSON.stringify(state.progress));
      } catch (e) {
        const cached = localStorage.getItem(cacheKey());
        state.progress = cached ? JSON.parse(cached) : defaultProgress();
      }
    }
    ["lessons", "quizzes", "worksheets"].forEach((k) => {
      if (!state.progress[k]) state.progress[k] = {};
    });
  }

  function saveProgress() {
    localStorage.setItem(cacheKey(), JSON.stringify(state.progress));
    if (CFG.demoMode) return; // preview: browser storage only
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      if (!state.user) return;
      try {
        await api("progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state.progress),
        });
      } catch (e) { /* cached locally; will retry on next change */ }
    }, 1200);
  }

  // ── auth ──────────────────────────────────────────────────────────────
  function onAuthChange() {
    state.user = window.netlifyIdentity
      ? window.netlifyIdentity.currentUser()
      : null;
    if (state.user) {
      document.body.classList.add("signed-in");
      refreshAccess().then(() => route());
    } else {
      document.body.classList.remove("signed-in");
      state.access = null;
      state.progress = null;
      route();
    }
  }

  async function refreshAccess() {
    if (CFG.demoMode) {
      const saved = localStorage.getItem("awspp-demo-access");
      state.access = saved ? JSON.parse(saved) : { tier: "preview" };
      await loadProgress();
      return;
    }
    try {
      state.access = await api("access");
    } catch (e) {
      state.access = { tier: null };
    }
    await loadProgress();
  }

  function hasAccess() {
    if (CFG.demoMode) return !!state.user;
    return !!(state.user && state.access && state.access.tier);
  }

  function requireAccess() {
    if (!state.user) {
      window.netlifyIdentity.open("signup");
      return false;
    }
    if (!hasAccess()) {
      location.hash = "#/redeem";
      return false;
    }
    return true;
  }

  // ── personalisation ──────────────────────────────────────────────────
  function personalise(md) {
    const biz = state.access && state.access.businessName;
    const learner = state.access && state.access.learnerName;
    let out = String(md);
    if (biz) {
      out = out.replace(/\[Business Name\]/g, esc(biz));
      out = out.replace(/\[business\]/g, esc(biz));
    }
    if (learner) {
      out = out.replace(/\[Your name\]/g, esc(learner));
    }
    return out;
  }

  function personalisationNote() {
    const biz = state.access && state.access.businessName;
    if (biz) {
      return '<p class="fine">Your business name (<strong>' + esc(biz) +
        '</strong>) has been filled into this document automatically. Other bracketed fields like [Name] and [date] are yours to complete. <a href="#/profile">Change details</a>.</p>';
    }
    return '<p class="fine">Tip: add your business name in <a href="#/profile">your profile</a> and every document download will have it pre-filled into the templates.</p>';
  }

  // ── print / download ─────────────────────────────────────────────────
  const PRINT_CSS = `
    body{font-family:Georgia,'Source Serif 4','Times New Roman',serif;max-width:800px;margin:40px auto;
      padding:0 24px;color:#1d2a30;line-height:1.55}
    h1{font-size:24px}h2{font-size:19px;margin-top:28px}h3{font-size:16px}
    a{color:#0e3b49}
    table{border-collapse:collapse;width:100%;font-size:13px}
    th,td{border:1px solid #b9b4a8;padding:6px 8px;text-align:left;vertical-align:top}
    th{background:#f2f0ea}
    pre{background:#f4f4f0;border:1px solid #ddd;padding:12px;white-space:pre-wrap;font-size:12px;border-radius:6px}
    blockquote{border-left:3px solid #dd9a35;margin-left:0;padding-left:14px;color:#4c3c1e;background:#fbf6ec}
    .print-footer{margin-top:40px;border-top:1px solid #ccc;padding-top:8px;font-size:11px;color:#666}
    @media print{.no-print{display:none}}
  `;

  function printHtml(title, bodyHtml, footer) {
    const w = window.open("", "_blank");
    if (!w) { toast("Allow pop-ups to print/save this document.", "warn"); return; }
    w.document.write(
      "<!doctype html><html><head><meta charset='utf-8'><title>" + esc(title) +
      "</title><style>" + PRINT_CSS + "</style></head><body>" +
      '<div class="no-print" style="text-align:right;margin-bottom:12px">' +
      '<button onclick="window.print()" style="padding:8px 16px;font-size:14px;cursor:pointer">Print / Save as PDF</button></div>' +
      "<h1>" + esc(title) + "</h1>" + bodyHtml +
      (footer ? '<div class="print-footer">' + esc(footer) + "</div>" : "") +
      "</body></html>"
    );
    w.document.close();
  }

  function downloadHtml(filename, title, bodyHtml) {
    const doc =
      "<!doctype html><html><head><meta charset='utf-8'><title>" + esc(title) +
      "</title><style>" + PRINT_CSS + "</style></head><body><h1>" + esc(title) +
      "</h1>" + bodyHtml + "</body></html>";
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ── views ─────────────────────────────────────────────────────────────

  function viewLanding() {
    const brand = CFG.brand;
    const demo = CFG.demoMode;
    const heroCta = demo
      ? '<a class="btn btn-primary" href="#/learn">Start the course</a><a class="btn btn-outline-light" href="#/inside">See what is inside</a>'
      : (state.user
          ? (hasAccess()
            ? '<a class="btn btn-primary" href="#/learn">Continue your course</a>'
            : '<a class="btn btn-primary" href="#/redeem">Redeem your access code</a>')
          : '<a class="btn btn-primary" href="#/buy">Buy access</a><button class="btn btn-outline-light" id="hero-login">Sign in</button>');
    return `
    <header class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">Plain-language AI training for Australian small business</p>
        <h1>${esc(brand.courseTitle)}</h1>
        <p class="tagline">You have heard the word "AI" four thousand times. Nobody has sat you down and explained what it actually does on your laptop on a Tuesday afternoon. This course does that, in plain Australian English, with the paperwork to prove it.</p>
        <div class="hero-cta">${heroCta}</div>
        <ul class="hero-chips">
          <li>Six classes, 15 to 25 minutes each</li>
          <li>Ten documents you can use on Monday</li>
          <li>Quizzes, worksheets and a certificate</li>
          <li>A human answers your questions</li>
        </ul>
        <p class="hero-note">${demo
          ? "This is the open preview: accounts and payments are switched off, so look through everything. Your progress is saved in this browser."
          : "Read it in an evening or spread it over six weeks. Every document downloads pre-filled with your business name."}</p>
      </div>
    </header>

    <section class="band">
      <div class="wrap">
        <span class="eyebrow">Who it is for</span>
        <h2>Written for people who run things, not for tech people</h2>
        <p class="section-lede">If you can attach a file to an email, you have every skill this course assumes. There is no coding in it and no homework you will not do.</p>
        <div class="grid grid-3">
          <div class="card feature-card">
            <h3>If you run the business</h3>
            <p>You will leave able to answer the only two questions that matter: what is staff allowed to paste into these tools, and what does a vendor's demo actually prove. You get a one-page policy and a one-week rollout plan for the team.</p>
          </div>
          <div class="card feature-card">
            <h3>If you manage the office</h3>
            <p>You get the documents: the cheat sheet on the wall, the incident card by the coffee machine, and the meeting-to-follow-up workflow that ends "I will type these notes up tonight" forever.</p>
          </div>
          <div class="card feature-card">
            <h3>If you are on the tools or the front desk</h3>
            <p>Short classes you can finish on a lunch break, explanations that never say "simply", and a certificate at the end worth putting on the wall. Bring your scepticism; the course keeps it.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band band-alt" id="inside">
      <div class="wrap">
        <span class="eyebrow">Outcomes</span>
        <h2>By the end of the six classes you can</h2>
        <ul class="outcomes">
          <li>Explain what an AI model is, and what it is not, in two sentences a customer would follow.</li>
          <li>Read a vendor's claims and separate today's working software from next year's brochure, using named real-world cases.</li>
          <li>Say where your data goes when you type it into a chatbot, and pick the tier or tool to match, including the opt-out settings on each platform.</li>
          <li>Write requests that come back usable on the first or second try, and set up standing instructions so the tool already knows your business.</li>
          <li>Put the collapsed cost of custom software to work on one annoying process of your own, with honest boundaries on what to build.</li>
          <li>Hand your team a one-page AI policy and a same-day incident plan, and mean both.</li>
        </ul>
        <span class="eyebrow" style="margin-top:44px">The classes</span>
        <h2>Six evenings' worth, at your pace</h2>
        <ol class="curriculum">
          ${CONTENT.classes.map((c, i) => `
            <li><div><strong>Class ${i + 1}: ${esc(c.title.replace(/^Class \d+:\s*/i, ""))}</strong>
            <span>${esc(c.subtitle || "")}</span></div></li>`).join("")}
        </ol>
        <span class="eyebrow" style="margin-top:44px">Included downloads</span>
        <h2>The ten-document pack</h2>
        <div class="doc-grid">
          ${CONTENT.docs.map((d, i) => `
            <a class="doc-pill" href="#/doc/${i}"><span class="pill-num">${String(i + 1).padStart(2, "0")}</span> ${esc(d.title.replace(/^Document \d+:\s*/i, ""))}</a>`).join("")}
        </div>
      </div>
    </section>

    <section class="band band-dark">
      <div class="wrap">
        <span class="eyebrow">How it works</span>
        <h2 style="color:#fff">Four steps, no ceremony</h2>
        <div class="steps" style="margin-top:36px">
          <div class="step">
            <h3>${demo ? "Open the course" : "Buy and redeem"}</h3>
            <p>${demo ? "In this preview you walk straight in. In the live course you pay by card, get an access code and create an account." : "Pay by card through Stripe, get your access code instantly, create an account and unlock the course."}</p>
          </div>
          <div class="step">
            <h3>Read a class</h3>
            <p>Fifteen to twenty-five minutes each. Progress saves to your account, so any device picks up where you left off.</p>
          </div>
          <div class="step">
            <h3>Do the worksheet</h3>
            <p>Each class exercise becomes a plan for your own business, filled in on screen and printable.</p>
          </div>
          <div class="step">
            <h3>Take the documents</h3>
            <p>Add your business name once; all ten print or download with it pre-filled. Pass the quizzes and the certificate unlocks.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band" id="buy">
      <div class="wrap">
        <div style="text-align:center">
          <span class="eyebrow">Licences</span>
          <h2>${demo ? "What the licences will be" : "Choose your licence"}</h2>
          <p class="section-lede" style="margin-left:auto;margin-right:auto">${demo
            ? "Payments are switched off in this preview. These are the two licences the live course sells, so you can see what your money buys."
            : "One-time payment. Lifetime access, including refreshed pricing and platform data. Payment handled securely by Stripe."}</p>
        </div>
        <div class="grid grid-2 price-grid">
          <div class="card price-card">
            <h3>Individual</h3>
            <p class="price">${esc(CFG.stripe.individualPrice)}</p>
            <p class="price-note">one-time, per person</p>
            <ul>
              <li>One login, all six classes</li>
              <li>Quizzes, worksheets and certificate</li>
              <li>All ten documents, personalised and downloadable</li>
              <li>Ask-a-question, answered by a human</li>
              <li>Lifetime access including content refreshes</li>
            </ul>
            ${demo
              ? '<a class="btn btn-dark" href="#/learn">Look through it now</a>'
              : (CFG.stripe.individualLink
                ? '<a class="btn btn-dark" href="' + esc(CFG.stripe.individualLink) + '">Buy individual access</a>'
                : '<p class="fine">Checkout link not configured yet.</p>')}
          </div>
          <div class="card price-card featured">
            <h3>Whole business</h3>
            <p class="price">${esc(CFG.stripe.businessPrice)}</p>
            <p class="price-note">one-time, whole team</p>
            <ul>
              <li>One account for the whole team (share the login, we designed it that way)</li>
              <li>Everything in Individual</li>
              <li>Documents pre-filled with your business name</li>
              <li>The one-week rollout plan sized for up to ~50 staff</li>
              <li>Ideal for owner + office manager + team leads</li>
            </ul>
            ${demo
              ? '<a class="btn btn-primary" href="#/learn">Look through it now</a>'
              : (CFG.stripe.businessLink
                ? '<a class="btn btn-primary" href="' + esc(CFG.stripe.businessLink) + '">Buy business access</a>'
                : '<p class="fine">Checkout link not configured yet.</p>')}
          </div>
        </div>
        ${demo
          ? '<p class="fine center" style="margin-top:26px">Preview build: no account, no card, no data leaving your browser. Switch to the live course any time by flipping one setting.</p>'
          : '<p class="fine center" style="margin-top:26px">Already bought? <a href="#/redeem">Redeem your access code</a>. Problems with purchase or access: email <a href="mailto:' + esc(brand.supportEmail) + '">' + esc(brand.supportEmail) + '</a>.</p>'}
      </div>
    </section>

    <section class="band band-alt">
      <div class="wrap" style="max-width:820px">
        <span class="eyebrow">Fair questions</span>
        <h2>Asked before, answered plainly</h2>
        <div class="faq">
          <div class="faq-item">
            <h3>Do I need to be technical?</h3>
            <p>No. The class about building software is about deciding what to build and checking it, not typing code. Every technical word in the course is translated in the same sentence, in brackets.</p>
          </div>
          <div class="faq-item">
            <h3>How long does it take?</h3>
            <p>Six classes of fifteen to twenty-five minutes, plus a worksheet and a five-question quiz each. One evening if you are keen. Six lunch breaks if you are sensible.</p>
          </div>
          <div class="faq-item">
            <h3>Is this a sales pitch for one of the AI companies?</h3>
            <p>The opposite. The course compares every major tool, names each one's weaknesses, and teaches you to hold any vendor to evidence, us included. The money is in the course, not in referrals.</p>
          </div>
          <div class="faq-item">
            <h3>What if the pricing and policy information goes stale?</h3>
            <p>It will, eventually, and the course says so out loud. Documents 5 and 6 carry a "last verified" date and a quarterly review routine, and your licence includes refreshes, so you always know how old the numbers are.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="wrap">
        <p><strong>${esc(brand.courseTitle)}</strong> by ${esc(brand.sellerName)} &middot; Support: <a href="mailto:${esc(brand.supportEmail)}">${esc(brand.supportEmail)}</a></p>
        <p class="fine">Practical guidance, not legal advice. Pricing and platform data inside the course carries a verified date and a quarterly review routine.</p>
      </div>
    </footer>`;
  }

  function viewRedeem() {
    return `
    <div class="wrap narrow">
      <h1>Redeem your access code</h1>
      <p>Enter the code from your purchase confirmation. It looks like <code>ABCD-1234</code>.</p>
      <form id="redeem-form" class="stack-form">
        <input type="text" id="redeem-code" placeholder="XXXX-XXXX" autocomplete="off"
          style="text-transform:uppercase" required>
        <button class="btn btn-primary" type="submit">Unlock the course</button>
      </form>
      <p class="fine">No code yet? <a href="#/buy">Choose a licence</a>. Problems: email <a href="mailto:${esc(CFG.brand.supportEmail)}">${esc(CFG.brand.supportEmail)}</a> and we will sort it out the same business day.</p>
    </div>`;
  }

  function sidebar() {
    const lessonDone = CONTENT.classes.filter((_, i) => state.progress.lessons["c" + i] && state.progress.lessons["c" + i].completed).length;
    const quizDone = CONTENT.classes.filter((_, i) => state.progress.quizzes["c" + i] && state.progress.quizzes["c" + i].passed).length;
    return `
    <nav class="sidebar">
      <a class="side-link" href="#/learn">Dashboard</a>
      <p class="side-head">Classes <span class="badge">${lessonDone}/${CONTENT.classes.length}</span></p>
      ${CONTENT.classes.map((c, i) => {
        const p = state.progress.lessons["c" + i] || {};
        return `<a class="side-link ${p.completed ? "done" : ""}" href="#/class/${i}">
          <span class="side-num">${p.completed ? "&#10003;" : i + 1}</span> ${esc(c.title.replace(/^Class \d+:\s*/i, ""))}</a>`;
      }).join("")}
      <p class="side-head">Document pack <span class="badge">${CONTENT.docs.length}</span></p>
      ${CONTENT.docs.map((d, i) => `<a class="side-link doc-link" href="#/doc/${i}">${esc(d.title.replace(/^Document \d+:\s*/i, ""))}</a>`).join("")}
      <p class="side-head">More</p>
      <a class="side-link" href="#/qa">Ask a question ${unreadQaBadge()}</a>
      <a class="side-link" href="#/certificate">Certificate <span class="badge">${quizDone}/${CONTENT.classes.length}</span></a>
      <a class="side-link" href="#/profile">Profile &amp; personalisation</a>
      <a class="side-link" href="#/extras">Extras</a>
    </nav>`;
  }

  function markActiveNav() {
    const current = location.hash || "#/";
    const links = document.querySelectorAll(".side-link");
    Array.prototype.forEach.call(links, (a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("active", href === current || (current === "#/" && href === "#/learn"));
    });
  }

  function unreadQaBadge() {
    const unread = (state.qaThreads || []).some((t) =>
      (t.replies || []).some((r) => !((state.progress.qaSeen || {})[t.key] >= r.at))
    );
    return unread ? '<span class="badge badge-hot">new reply</span>' : "";
  }

  function shell(inner) {
    return `
    <div class="app-layout">
      ${sidebar()}
      <main class="main">${inner}</main>
    </div>`;
  }

  function viewLearn() {
    const total = CONTENT.classes.length;
    const lessonDone = CONTENT.classes.filter((_, i) => state.progress.lessons["c" + i] && state.progress.lessons["c" + i].completed).length;
    const quizDone = CONTENT.classes.filter((_, i) => state.progress.quizzes["c" + i] && state.progress.quizzes["c" + i].passed).length;
    const wsDone = WORKSHEETS.filter((w) => {
      const vals = state.progress.worksheets["c" + w.classIndex] || {};
      return Object.keys(vals).length > 0;
    }).length;
    let nextClass = CONTENT.classes.findIndex((_, i) => !(state.progress.lessons["c" + i] && state.progress.lessons["c" + i].completed));
    if (nextClass === -1) nextClass = 0;
    return shell(`
      <h1>Welcome back${state.access && state.access.learnerName ? ", " + esc(state.access.learnerName.split(" ")[0]) : ""}</h1>
      <p class="lede">Tier: <strong>${esc(String(state.access.tier))}</strong>${state.access && state.access.businessName ? " &middot; Business: <strong>" + esc(state.access.businessName) + "</strong>" : ""}</p>
      <div class="grid grid-3 stat-grid">
        <div class="card stat"><p class="stat-num">${lessonDone}/${total}</p><p>classes completed</p>
          <div class="bar"><span style="width:${Math.round((lessonDone / total) * 100)}%"></span></div></div>
        <div class="card stat"><p class="stat-num">${quizDone}/${total}</p><p>quizzes passed</p>
          <div class="bar"><span style="width:${Math.round((quizDone / total) * 100)}%"></span></div></div>
        <div class="card stat"><p class="stat-num">${wsDone}/${total}</p><p>worksheets started</p>
          <div class="bar"><span style="width:${Math.round((wsDone / total) * 100)}%"></span></div></div>
      </div>
      <p><a class="btn btn-primary" href="#/class/${nextClass}">Continue: Class ${nextClass + 1}</a></p>
      <h2>How this course works</h2>
      <ol>
        <li>Read a class (15 to 25 minutes). Mark it complete when done; your progress is saved to your account.</li>
        <li>Do the worksheet. It turns the class exercise into a plan for your own business, and you can print it.</li>
        <li>Take the five-question quiz. Four out of five passes. Pass all six and your certificate unlocks.</li>
        <li>Download documents as you need them, from the Document pack in the sidebar. Add your business name in your profile first and the templates come pre-filled.</li>
        <li>Question about your situation? Use <em>Ask a question</em> on any screen. Replies from us appear in your course inbox.</li>
      </ol>
      ${qaPreview()}
    `);
  }

  function qaPreview() {
    const threads = (state.qaThreads || []).slice(0, 3);
    if (!threads.length) return "";
    return `
      <h2>Your latest questions</h2>
      ${threads.map(threadHtml).join("")}
      <p><a href="#/qa">Open question inbox</a></p>`;
  }

  function threadHtml(t) {
    const replies = (t.replies || []).map((r) =>
      '<div class="qa-reply"><p class="qa-meta">Reply from ' + esc(CFG.brand.sellerName) + " &middot; " + esc(new Date(r.at).toLocaleString()) + "</p><div>" + window.renderMarkdown(r.text) + "</div></div>"
    ).join("");
    return `
    <div class="qa-thread">
      <p class="qa-meta">You asked${t.lesson ? " about " + esc(t.lesson) : ""} &middot; ${esc(new Date(t.createdAt).toLocaleString())}</p>
      <p>${esc(t.question)}</p>
      ${replies || '<p class="fine">Waiting for a reply. We answer every question, usually within one business day.</p>'}
    </div>`;
  }

  function viewClass(i) {
    const c = CONTENT.classes[i];
    if (!c) return viewLearn();
    const p = state.progress.lessons["c" + i] || {};
    const quiz = QUIZZES[i];
    const quizResult = state.progress.quizzes["c" + i];
    const ws = WORKSHEETS[i];
    return shell(`
      <p class="crumb"><a href="#/learn">Dashboard</a> &rsaquo; Class ${i + 1}</p>
      <h1>${esc(c.title)}</h1>
      ${c.subtitle ? '<p class="lede">' + esc(c.subtitle) + "</p>" : ""}
      <div class="tabs" id="class-tabs">
        <button class="tab active" data-tab="lesson">Lesson</button>
        <button class="tab" data-tab="worksheet">Worksheet</button>
        <button class="tab" data-tab="quiz">Quiz ${quizResult && quizResult.passed ? "&#10003;" : ""}</button>
      </div>

      <section class="tab-panel" data-panel="lesson">
        <article class="prose">${window.renderMarkdown(c.md)}</article>
        <div class="lesson-actions">
          <button class="btn ${p.completed ? "btn-done" : "btn-primary"}" id="mark-complete">
            ${p.completed ? "Completed \u2713" : "Mark class complete"}</button>
          <button class="btn btn-ghost" id="ask-about-lesson">Ask a question about this class</button>
          <button class="btn btn-ghost" id="print-lesson">Print lesson</button>
        </div>
      </section>

      <section class="tab-panel hidden" data-panel="worksheet">
        <h2>${esc(ws.title)}</h2>
        <p>${esc(ws.intro)}</p>
        <form id="worksheet-form" class="stack-form">
          ${ws.fields.map((f) => `
            <label class="field">
              <span class="field-label">${esc(f.label)}</span>
              ${f.type === "textarea"
                ? '<textarea rows="4" data-field="' + f.id + '" placeholder="' + esc(f.placeholder || "") + '">' + esc((state.progress.worksheets["c" + i] || {})[f.id] || "") + "</textarea>"
                : '<input type="text" data-field="' + f.id + '" value="' + esc((state.progress.worksheets["c" + i] || {})[f.id] || "") + '" placeholder="' + esc(f.placeholder || "") + '">'}
            </label>`).join("")}
          <div class="lesson-actions">
            <button type="button" class="btn btn-primary" id="ws-save">Save answers</button>
            <button type="button" class="btn btn-ghost" id="ws-print">Print worksheet</button>
          </div>
        </form>
      </section>

      <section class="tab-panel hidden" data-panel="quiz">
        <h2>Class ${i + 1} quiz</h2>
        <p>Five questions. Four correct passes. Answers are explained the moment you finish.</p>
        <div id="quiz-root">${renderQuiz(quiz, quizResult)}</div>
      </section>
    `);
  }

  function renderQuiz(quiz, prev) {
    if (prev && prev.passed) {
      return '<div class="quiz-passed"><p><strong>Passed</strong> with ' + prev.score + "/5 on " +
        esc(new Date(prev.at).toLocaleDateString()) + '. Retake any time.</p></div>' +
        quizFormHtml(quiz);
    }
    return quizFormHtml(quiz);
  }

  function quizFormHtml(quiz) {
    return `
      <form id="quiz-form">
        ${quiz.questions.map((q, qi) => `
          <div class="quiz-q" role="radiogroup" aria-labelledby="qq-${qi}">
            <p class="quiz-q-label" id="qq-${qi}">${qi + 1}. ${esc(q.q)}</p>
            ${q.options.map((opt, oi) => `
              <label class="quiz-opt">
                <input type="radio" name="q${qi}" value="${oi}" required>
                <span>${esc(opt)}</span>
              </label>`).join("")}
            <p class="quiz-why hidden" data-why="${qi}"></p>
          </div>`).join("")}
        <button type="submit" class="btn btn-primary">Check my answers</button>
        <p id="quiz-result" class="quiz-result"></p>
      </form>`;
  }

  function viewDocs() {
    return shell(`
      <h1>The ten-document pack</h1>
      <p class="lede">Every document states which platforms it applies to, notes the platform differences, and is written for a reader with no technical background. Add your business name in <a href="#/profile">your profile</a> and downloads come pre-filled.</p>
      <div class="grid grid-2">
        ${CONTENT.docs.map((d, i) => `
          <a class="card doc-card" href="#/doc/${i}">
            <h3>${esc(d.title)}</h3>
            <p class="fine">${esc((d.md.split("\n").find((l) => l.trim() && !l.startsWith("**") && !l.startsWith("#")) || "").slice(0, 140))}...</p>
          </a>`).join("")}
      </div>`);
  }

  function viewDoc(i) {
    const d = CONTENT.docs[i];
    if (!d) return viewDocs();
    return shell(`
      <p class="crumb"><a href="#/learn">Dashboard</a> &rsaquo; <a href="#/docs">Documents</a></p>
      <h1>${esc(d.title)}</h1>
      <div class="doc-actions">
        <button class="btn btn-primary" id="doc-print">Print / Save as PDF</button>
        <button class="btn btn-ghost" id="doc-download">Download (HTML)</button>
        <button class="btn btn-ghost" id="ask-about-doc">Ask a question about this document</button>
      </div>
      ${personalisationNote()}
      <article class="prose">${window.renderMarkdown(personalise(d.md))}</article>
    `);
  }

  function viewQa() {
    return shell(`
      <h1>Ask a question</h1>
      ${CFG.demoMode
        ? '<p class="demo-note">Preview mode: question sending is switched off in this build. In the live course your question goes straight to ' + esc(CFG.brand.sellerName) + ', and the reply appears right here in your course, usually within one business day.</p>'
        : '<p>Questions go straight to ' + esc(CFG.brand.sellerName) + '. Replies appear below in your course, and we answer every question, usually within one business day.</p>'}
      <form id="qa-form" class="stack-form">
        <label class="field"><span class="field-label">Your question</span>
          <textarea id="qa-text" rows="6" ${CFG.demoMode ? "disabled" : "required"} placeholder="e.g. We're a 12-person bookkeeping firm on Google Workspace. Is the Gemini bundling enough, or should we also buy Claude Team seats for client documents?"></textarea></label>
        <label class="field"><span class="field-label">What are you working on? (optional)</span>
          <input id="qa-context" type="text" ${CFG.demoMode ? "disabled" : ""} placeholder="auto-filled when you ask from a lesson"></label>
        <button class="btn btn-primary" type="submit" ${CFG.demoMode ? "disabled" : ""}>${CFG.demoMode ? "Sending off in preview" : "Send question"}</button>
      </form>
      <h2>Your questions</h2>
      <div id="qa-list">${(state.qaThreads || []).length
        ? state.qaThreads.map(threadHtml).join("")
        : '<p class="fine">No questions yet.</p>'}</div>
    `);
  }

  function viewCertificate() {
    const total = CONTENT.classes.length;
    const passed = CONTENT.classes.filter((_, i) => state.progress.quizzes["c" + i] && state.progress.quizzes["c" + i].passed).length;
    const complete = passed === total;
    const name = (state.access && state.access.learnerName) || "";
    const biz = (state.access && state.access.businessName) || "";
    return shell(`
      <h1>Certificate of completion</h1>
      ${complete ? `
        <p>All six quizzes passed. Print it, frame it, pin it near the coffee machine.</p>
        <div class="cert-preview">
          <p class="cert-kicker">Certificate of Completion</p>
          <h2 class="cert-title">${esc(CFG.brand.courseTitle)}</h2>
          <p class="cert-award">awarded to</p>
          <p class="cert-name">${esc(name || "[add your name in Profile]")}</p>
          ${biz ? '<p class="cert-biz">' + esc(biz) + "</p>" : ""}
          <p class="cert-date">${esc(new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }))}</p>
          <p class="cert-seller">${esc(CFG.brand.sellerName)}</p>
        </div>
        <p><button class="btn btn-primary" id="print-cert">Print / Save as PDF</button>
        ${!name ? ' <span class="fine">Add your name in <a href="#/profile">Profile</a> first so it appears on the certificate.</span>' : ""}</p>
      ` : `
        <p>Pass all six class quizzes to unlock your certificate. Progress: <strong>${passed} of ${total}</strong>.</p>
        <ul class="cert-progress">
          ${CONTENT.classes.map((c, i) => {
            const q = state.progress.quizzes["c" + i];
            return '<li>' + (q && q.passed ? "&#10003;" : "&#9675;") + ' Class ' + (i + 1) + ": " + esc(c.title.replace(/^Class \d+:\s*/i, "")) +
              (q && !q.passed ? ' <span class="fine">(best score ' + q.score + "/5, retake any time)</span>" : "") + "</li>";
          }).join("")}
        </ul>
      `}`);
  }

  function viewProfile() {
    const a = state.access || {};
    return shell(`
      <h1>Profile &amp; personalisation</h1>
      <p>These details fill the document templates and your certificate. Nothing here is sold or shared; it is stored with your course account.</p>
      <form id="profile-form" class="stack-form">
        <label class="field"><span class="field-label">Your name</span>
          <input id="pf-learner" type="text" value="${esc(a.learnerName || "")}" placeholder="e.g. Sam Nguyen"></label>
        <label class="field"><span class="field-label">Business name (filled into every document template)</span>
          <input id="pf-business" type="text" value="${esc(a.businessName || "")}" placeholder="e.g. Nguyen Plumbing Pty Ltd"></label>
        <label class="field"><span class="field-label">Policy owner / contact name (used in the shadow AI policy)</span>
          <input id="pf-contact" type="text" value="${esc(a.contactName || "")}" placeholder="e.g. Sam Nguyen, Owner"></label>
        <label class="field"><span class="field-label">Contact email or phone for the policy</span>
          <input id="pf-contactdetail" type="text" value="${esc(a.contactEmail || "")}" placeholder="e.g. sam@nguyenplumbing.com.au / 0400 000 000"></label>
        <button class="btn btn-primary" type="submit">Save profile</button>
      </form>
      <h2>Account</h2>
      <p class="fine">Signed in as ${esc(state.user.email)} &middot; Tier: ${esc(String(a.tier))} &middot;
      <a href="#" id="logout-link">Sign out</a></p>
    `);
  }

  function viewExtras() {
    return shell(`
      <h1>Extras</h1>
      <p class="lede">Bonus material included with your licence.</p>
      <div class="grid grid-2">
        ${CONTENT.extras.map((x, i) => `
          <a class="card doc-card" href="#/extra/${i}">
            <h3>${esc(x.title)}</h3>
            <p class="fine">${esc(x.subtitle || "")}</p>
          </a>`).join("")}
      </div>`);
  }

  function viewExtra(i) {
    const x = CONTENT.extras[i];
    if (!x) return viewExtras();
    return shell(`
      <p class="crumb"><a href="#/learn">Dashboard</a> &rsaquo; <a href="#/extras">Extras</a></p>
      <h1>${esc(x.title)}</h1>
      <div class="doc-actions">
        <button class="btn btn-primary" id="doc-print">Print / Save as PDF</button>
        <button class="btn btn-ghost" id="doc-download">Download (HTML)</button>
      </div>
      <article class="prose">${window.renderMarkdown(x.md)}</article>
    `);
  }

  function viewCodeIssued(code, tier) {
    return `
    <div class="wrap narrow">
      <h1>Payment received. Here is your access code.</h1>
      <div class="code-box"><span id="issued-code">${esc(code)}</span></div>
      <p>Licence: <strong>${esc(tier)}</strong>. Write this code down or screenshot it; it is shown once here (we can reissue by email if you lose it).</p>
      ${state.user
        ? '<p><a class="btn btn-primary" href="#/redeem">Redeem it now</a></p>'
        : '<p><button class="btn btn-primary" id="signup-to-redeem">Create your account, then redeem</button></p>'}
      <p class="fine">Questions: <a href="mailto:${esc(CFG.brand.supportEmail)}">${esc(CFG.brand.supportEmail)}</a></p>
    </div>`;
  }

  // ── router ────────────────────────────────────────────────────────────
  const appRoot = () => $("#app");

  function route() {
    stopQaPolling();
    const hash = location.hash || "#/";
    const m = hash.match(/^#\/([a-z-]*)\/?(\d+)?/i);
    const section = m ? m[1] || "" : "";
    const param = m && m[2] != null ? parseInt(m[2], 10) : null;
    let html = "";

    if (CFG.demoMode && (section === "redeem" || section === "code")) {
      html = viewLearn();
    } else if (section === "code") {
      html = viewCodeIssued(sessionStorage.getItem("issued-code") || "(reload from your confirmation page)", sessionStorage.getItem("issued-tier") || "");
    } else if (!hasAccess()) {
      if (section === "redeem" && state.user) html = viewRedeem();
      else if (section === "buy") { html = viewLanding(); }
      else html = viewLanding();
    } else if (section === "" ) html = CFG.demoMode ? viewLanding() : viewLearn();
    else if (section === "learn") html = viewLearn();
    else if (section === "class") html = viewClass(param);
    else if (section === "docs") html = viewDocs();
    else if (section === "doc") html = viewDoc(param);
    else if (section === "qa") html = viewQa();
    else if (section === "certificate") html = viewCertificate();
    else if (section === "profile") html = viewProfile();
    else if (section === "extras") html = viewExtras();
    else if (section === "extra") html = viewExtra(param);
    else html = viewLearn();

    appRoot().innerHTML = html;
    bindRouteEvents(section, param);
    markActiveNav();
    window.scrollTo(0, 0);
    if (section === "qa") {
      loadQa().then(() => {
        const list = $("#qa-list");
        if (list) {
          list.innerHTML = state.qaThreads.length
            ? state.qaThreads.map(threadHtml).join("")
            : '<p class="fine">No questions yet.</p>';
        }
      });
      startQaPolling(true);
    } else if (section === "learn") {
      loadQa();
    }
  }

  function bindRouteEvents(section, param) {
    // tabs
    $$(".tab").forEach((btn) => btn.addEventListener("click", () => {
      $$(".tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      $$(".tab-panel").forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.tab));
    }));

    // lesson actions
    const mark = $("#mark-complete");
    if (mark) mark.addEventListener("click", () => {
      state.progress.lessons["c" + param] = { completed: Date.now() };
      saveProgress();
      mark.textContent = "Completed \u2713";
      mark.classList.remove("btn-primary");
      mark.classList.add("btn-done");
      toast("Class marked complete.");
    });

    const askLesson = $("#ask-about-lesson");
    if (askLesson) askLesson.addEventListener("click", () => {
      sessionStorage.setItem("qa-context", "Class " + (param + 1) + ": " + CONTENT.classes[param].title);
      location.hash = "#/qa";
    });
    const askDoc = $("#ask-about-doc");
    if (askDoc) askDoc.addEventListener("click", () => {
      sessionStorage.setItem("qa-context", CONTENT.docs[param].title);
      location.hash = "#/qa";
    });

    const printLesson = $("#print-lesson");
    if (printLesson) printLesson.addEventListener("click", () => {
      printHtml(CONTENT.classes[param].title, window.renderMarkdown(CONTENT.classes[param].md),
        CFG.brand.courseTitle + " by " + CFG.brand.sellerName);
    });

    // worksheet
    const wsSave = $("#ws-save");
    if (wsSave) wsSave.addEventListener("click", () => {
      const vals = {};
      $$("#worksheet-form [data-field]").forEach((f) => { vals[f.dataset.field] = f.value; });
      state.progress.worksheets["c" + param] = vals;
      saveProgress();
      toast("Worksheet saved to your account.");
    });
    const wsPrint = $("#ws-print");
    if (wsPrint) wsPrint.addEventListener("click", () => {
      const ws = WORKSHEETS[param];
      const vals = state.progress.worksheets["c" + param] || {};
      const body = "<p>" + esc(ws.intro) + "</p>" + ws.fields.map((f) =>
        "<h3>" + esc(f.label) + "</h3><p style='white-space:pre-wrap;border-bottom:1px solid #ccc;min-height:2.5em'>" +
        esc(vals[f.id] || "") + "</p>").join("");
      printHtml(ws.title, body, CFG.brand.courseTitle + " &middot; " + esc((state.access && state.access.businessName) || ""));
    });

    // quiz
    const quizForm = $("#quiz-form");
    if (quizForm) quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const quiz = QUIZZES[param];
      let score = 0;
      quiz.questions.forEach((q, qi) => {
        const chosen = quizForm.querySelector('input[name="q' + qi + '"]:checked');
        const why = quizForm.querySelector('[data-why="' + qi + '"]');
        $$('.quiz-opt input[name="q' + qi + '"]', quizForm).forEach((r) => {
          r.closest(".quiz-opt").classList.remove("right", "wrong");
        });
        if (chosen) {
          const oi = parseInt(chosen.value, 10);
          if (oi === q.answer) {
            score++;
            chosen.closest(".quiz-opt").classList.add("right");
          } else {
            chosen.closest(".quiz-opt").classList.add("wrong");
            const correctOpt = quizForm.querySelectorAll('.quiz-opt input[name="q' + qi + '"]')[q.answer];
            if (correctOpt) correctOpt.closest(".quiz-opt").classList.add("right");
          }
        }
        why.textContent = (q.answer + 1 === parseInt((chosen || {}).value, 10) + 1 ? "Correct. " : "Answer: " + q.options[q.answer] + ". ") + q.why;
        why.classList.remove("hidden");
      });
      const passed = score / quiz.questions.length >= CFG.quizPassMark;
      const prev = state.progress.quizzes["c" + param];
      if (!prev || score > prev.score) {
        state.progress.quizzes["c" + param] = { score: score, passed: passed || !!(prev && prev.passed), at: Date.now() };
        saveProgress();
      }
      $("#quiz-result").innerHTML = passed
        ? "<strong>Passed: " + score + "/" + quiz.questions.length + ".</strong> Certificate progress updated."
        : "<strong>" + score + "/" + quiz.questions.length + ".</strong> You need " + Math.ceil(quiz.questions.length * CFG.quizPassMark) + " to pass. Read the explanations and try again.";
      $("#quiz-result").classList.add(passed ? "pass" : "fail");
    });

    // doc print/download
    const docPrint = $("#doc-print");
    if (docPrint) docPrint.addEventListener("click", () => {
      const item = section === "extra" ? CONTENT.extras[param] : CONTENT.docs[param];
      const body = window.renderMarkdown(section === "extra" ? item.md : personalise(item.md));
      printHtml(item.title, body, CFG.brand.courseTitle + " by " + CFG.brand.sellerName +
        ((state.access && state.access.businessName) ? " &middot; prepared for " + esc(state.access.businessName) : ""));
    });
    const docDl = $("#doc-download");
    if (docDl) docDl.addEventListener("click", () => {
      const item = section === "extra" ? CONTENT.extras[param] : CONTENT.docs[param];
      const body = window.renderMarkdown(section === "extra" ? item.md : personalise(item.md));
      const fname = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) + ".html";
      downloadHtml(fname, item.title, body);
    });

    // certificate
    const printCert = $("#print-cert");
    if (printCert) printCert.addEventListener("click", () => {
      const name = (state.access && state.access.learnerName) || "Course Participant";
      const biz = (state.access && state.access.businessName) || "";
      printHtml("Certificate of Completion", `
        <div style="text-align:center;border:6px double #0e3b49;padding:48px 32px;margin-top:16px">
          <p style="letter-spacing:.2em;text-transform:uppercase;font-size:12px">Certificate of Completion</p>
          <h2 style="font-size:28px;margin:12px 0">${esc(CFG.brand.courseTitle)}</h2>
          <p>awarded to</p>
          <p style="font-size:26px;font-weight:bold;margin:8px 0">${esc(name)}</p>
          ${biz ? "<p style='font-size:16px'>" + esc(biz) + "</p>" : ""}
          <p style="margin-top:24px">having completed all six classes and passed all six quizzes</p>
          <p style="margin-top:24px">${esc(new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }))}</p>
          <p style="margin-top:32px;font-size:13px">${esc(CFG.brand.sellerName)}</p>
        </div>`, "");
    });

    // profile
    const pf = $("#profile-form");
    if (pf) pf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = {
        learnerName: $("#pf-learner").value.trim(),
        businessName: $("#pf-business").value.trim(),
        contactName: $("#pf-contact").value.trim(),
        contactEmail: $("#pf-contactdetail").value.trim(),
      };
      if (CFG.demoMode) {
        state.access = { ...state.access, ...fields };
        localStorage.setItem("awspp-demo-access", JSON.stringify(state.access));
        toast("Saved for this preview. Accounts switch on in the live build.");
        return;
      }
      try {
        await api("access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        await refreshAccess();
        toast("Profile saved. Documents will now use your business name.");
      } catch (err) { toast("Could not save profile: " + err.message, "warn"); }
    });
    const logout = $("#logout-link");
    if (logout) logout.addEventListener("click", (e) => {
      e.preventDefault();
      window.netlifyIdentity.logout();
    });

    // redeem
    const rf = $("#redeem-form");
    if (rf) rf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = $("#redeem-code").value.trim().toUpperCase();
      try {
        const res = await api("redeem-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code }),
        });
        state.access = await api("access");
        await loadProgress();
        toast("Access unlocked: " + res.tier + " licence. Welcome in.");
        location.hash = "#/learn";
      } catch (err) {
        toast(err.message === "not_found" ? "That code was not recognised. Check the characters, or email us." :
              err.message === "already_used" ? "That code has already been redeemed. Email us and we will sort it out." :
              "Could not redeem: " + err.message, "warn");
      }
    });

    // Q&A form
    const qf = $("#qa-form");
    if (qf) {
      const ctx = sessionStorage.getItem("qa-context");
      if (ctx) { $("#qa-context").value = ctx; sessionStorage.removeItem("qa-context"); }
      qf.addEventListener("submit", async (e) => {
        e.preventDefault();
        const question = $("#qa-text").value.trim();
        const lesson = $("#qa-context").value.trim();
        if (!question) return;
        try {
          await api("qa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: question, lesson: lesson }),
          });
          sendFormNotification(question, lesson);
          $("#qa-text").value = "";
          toast("Question sent. Our reply will appear here in your course.");
          await loadQa();
          $("#qa-list").innerHTML = state.qaThreads.length
            ? state.qaThreads.map(threadHtml).join("")
            : '<p class="fine">No questions yet.</p>';
        } catch (err) { toast("Could not send: " + err.message, "warn"); }
      });
    }

    // issued-code page
    const su = $("#signup-to-redeem");
    if (su) su.addEventListener("click", () => window.netlifyIdentity.open("signup"));
    const heroLogin = $("#hero-login");
    if (heroLogin) heroLogin.addEventListener("click", () => window.netlifyIdentity.open("login"));
  }

  // Netlify Forms leg: sends the question to the site owner's email inbox.
  function sendFormNotification(question, lesson) {
    const body = new URLSearchParams();
    body.append("form-name", CFG.netlifyFormName);
    body.append("email", state.user ? state.user.email : "");
    body.append("user_id", state.user ? state.user.id : "");
    body.append("lesson", lesson || "");
    body.append("question", question);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).catch(() => { /* storage leg already succeeded; email leg is best-effort */ });
  }

  // ── Q&A loading & polling ─────────────────────────────────────────────
  async function loadQa() {
    if (!hasAccess() || CFG.demoMode) { state.qaThreads = []; return; }
    try {
      const res = await api("qa");
      state.qaThreads = res.threads || [];
    } catch (e) { state.qaThreads = []; }
  }

  function startQaPolling(active) {
    stopQaPolling();
    if (!active) return;
    state.qaTimer = setInterval(async () => {
      const before = JSON.stringify(state.qaThreads);
      await loadQa();
      if (JSON.stringify(state.qaThreads) !== before) {
        const list = $("#qa-list");
        if (list) list.innerHTML = state.qaThreads.map(threadHtml).join("");
        toast("New reply on one of your questions.");
      }
    }, CFG.qaPollSeconds * 1000);
  }

  function stopQaPolling() {
    if (state.qaTimer) clearInterval(state.qaTimer);
    state.qaTimer = null;
  }

  // ── Stripe success handling ───────────────────────────────────────────
  async function handleStripeReturn() {
    const params = new URLSearchParams(location.search);
    const sid = params.get("session_id");
    if (!sid) return false;
    history.replaceState(null, "", location.pathname + location.hash);
    try {
      const res = await api("issue-code?session_id=" + encodeURIComponent(sid));
      sessionStorage.setItem("issued-code", res.code);
      sessionStorage.setItem("issued-tier", res.tier);
      location.hash = "#/code";
      return true;
    } catch (e) {
      toast("Payment received but code issuing failed. Email " + CFG.brand.supportEmail + " with your receipt and we will issue it manually.", "warn");
      return true;
    }
  }

  // ── boot ──────────────────────────────────────────────────────────────
  async function boot() {
    // apply brand colours
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--primary", CFG.colors.primary);
    rootStyle.setProperty("--accent", CFG.colors.accent);
    Array.prototype.forEach.call(document.querySelectorAll(".seller-name-slot"), (n) => (n.textContent = CFG.brand.sellerName));
    document.title = CFG.brand.courseTitle + " by " + CFG.brand.sellerName;

    if (CFG.demoMode) {
      // Preview build: no Identity, no Stripe. One synthetic local user,
      // progress in localStorage, question sending disabled in the view.
      document.body.classList.add("demo", "signed-in");
      const chip = document.getElementById("tb-demo");
      if (chip) chip.classList.remove("hidden");
      state.user = { id: "demo", email: "preview@localhost" };
      await refreshAccess();
      route();
    } else if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", (user) => {
        state.user = user;
        if (user) {
          document.body.classList.add("signed-in");
          refreshAccess().then(async () => { await handleStripeReturn(); route(); });
        } else {
          handleStripeReturn().then(() => route());
        }
      });
      window.netlifyIdentity.on("login", () => onAuthChange());
      window.netlifyIdentity.on("logout", () => onAuthChange());
    } else {
      route();
    }
    window.addEventListener("hashchange", route);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
