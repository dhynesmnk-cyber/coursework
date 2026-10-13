/* follower-sorter.js — Instagram Follower Sorter (free, browser only).
 * Reads the JSON files from Instagram's "Download your information" export
 * and sorts accounts by relationship and follow date. Nothing is uploaded.
 * Parsing ported from bee-free-tools' instagramInfoWorker.ts, without the
 * worker, and with honest labels (follow date, not "engagement").
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;
  const DAY = 86400;
  const SHOW = 150; // rows shown per list; CSV has everything

  // Accept followers_1.json (array), following.json ({ relationships_following: [...] })
  // and similar wrappers. Returns [{ username, href, timestamp }].
  function parseExport(json) {
    let entries = [];
    if (Array.isArray(json)) entries = json;
    else if (json && typeof json === "object") {
      const key = Object.keys(json).find((k) => Array.isArray(json[k]));
      entries = key ? json[key] : [];
    }
    const now = Date.now() / 1000;
    const out = [];
    let skipped = 0;
    entries.forEach((e) => {
      if (!e || typeof e !== "object") { skipped++; return; }
      // Facebook-style { name, timestamp }
      if (typeof e.name === "string" && !e.string_list_data) {
        const ts = Number(e.timestamp);
        if (!e.name.trim()) { skipped++; return; }
        out.push({ username: e.name.trim(), href: "", timestamp: Number.isFinite(ts) && ts > 0 && ts < now + DAY ? ts : 0 });
        return;
      }
      const d = Array.isArray(e.string_list_data) ? e.string_list_data[0] : null;
      if (!d) { skipped++; return; }
      // Only link to Instagram itself; the file is the visitor's, but stay safe.
      const href = typeof d.href === "string" && /^https:\/\/(www\.)?instagram\.com\//i.test(d.href) ? d.href : "";
      const fromHref = href.replace(/\/+$/, "").split("/").pop() || "";
      const username = String(d.value || e.title || fromHref || "").trim();
      if (!username) { skipped++; return; }
      const ts = Number(d.timestamp);
      out.push({ username, href, timestamp: Number.isFinite(ts) && ts > 0 && ts < now + DAY ? ts : 0 });
    });
    return { accounts: out, skipped };
  }

  function sinceLabel(ts, now) {
    if (!ts) return "Unknown";
    const days = (now - ts) / DAY;
    if (days <= 30) return "Last 30 days";
    if (days <= 182) return "1 to 6 months";
    if (days <= 365) return "6 to 12 months";
    return "Over a year";
  }

  function sort(followers, following, nowMs) {
    const now = (nowMs || Date.now()) / 1000;
    const key = (a) => a.username.toLowerCase();
    const followerSet = new Set(followers.map(key));
    const followingSet = new Set(following.map(key));
    const byNewest = (a, b) => b.timestamp - a.timestamp;
    const label = (a) => Object.assign({}, a, { since: sinceLabel(a.timestamp, now) });
    const buckets = { "Last 30 days": 0, "1 to 6 months": 0, "6 to 12 months": 0, "Over a year": 0, Unknown: 0 };
    followers.forEach((a) => { buckets[sinceLabel(a.timestamp, now)]++; });
    return {
      followerCount: followers.length,
      followingCount: following.length,
      buckets,
      recent: followers.filter((a) => a.timestamp && now - a.timestamp <= 30 * DAY).sort(byNewest).map(label),
      mutual: following.length ? followers.filter((a) => followingSet.has(key(a))).sort(byNewest).map(label) : [],
      notFollowingBack: following.filter((a) => !followerSet.has(key(a))).sort(byNewest).map(label),
      notFollowedBack: following.length ? followers.filter((a) => !followingSet.has(key(a))).sort(byNewest).map(label) : [],
    };
  }

  function readJsonFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        try { resolve(JSON.parse(r.result)); } catch (e) { reject(new Error(file.name + " isn't a JSON file. Choose the JSON format when you request your download.")); }
      };
      r.onerror = () => reject(new Error("Couldn't read " + file.name + "."));
      r.readAsText(file);
    });
  }

  function listHtml(id, title, items, note) {
    const esc = T.ui.esc;
    if (!items) return "";
    return `
      <details class="list-details" ${items.length && items.length <= 30 ? "open" : ""}>
        <summary><strong>${esc(title)}</strong> <span class="badge">${items.length}</span> <span class="fine">${esc(note)}</span></summary>
        ${items.length ? `<ul class="account-list">${items.slice(0, SHOW).map((a) =>
          "<li>" + (a.href ? '<a href="' + esc(a.href) + '" target="_blank" rel="noopener nofollow">' + esc(a.username) + "</a>" : esc(a.username)) +
          ' <span class="fine">' + esc(a.since) + "</span></li>").join("")}</ul>` : '<p class="fine">None.</p>'}
        ${items.length > SHOW ? '<p class="fine">Showing the newest ' + SHOW + ". Download the CSV for all " + items.length + ".</p>" : ""}
        ${items.length ? '<button class="btn btn-ghost btn-sm" type="button" data-csv="' + id + '">Download CSV</button>' : ""}
      </details>`;
  }

  function render() {
    return `
      <form class="stack-form tool-form" novalidate>
        <p>In Instagram, open <em>Accounts Centre</em>, then <em>Your information and permissions</em>, then <em>Download your information</em>. Ask for <strong>Followers and following</strong> in <strong>JSON</strong> format. When it arrives, unzip it and pick the files below from the <code>followers_and_following</code> folder.</p>
        <div class="field-row">
          <label class="field"><span class="field-label">Followers file (followers_1.json)</span>
            <input type="file" name="followers" accept=".json,application/json"></label>
          <label class="field"><span class="field-label">Following file (following.json, optional)</span>
            <input type="file" name="following" accept=".json,application/json"></label>
        </div>
        <div class="tool-actions"><button class="btn btn-primary" type="submit">Sort my followers</button></div>
      </form>
      ${T.freeFooter("Runs entirely in your browser. The files never leave your device, which makes this a handy way to see Class 3's 'where does my data go' question answered by design.")}
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function bind(root) {
    const form = root.querySelector("form");
    const out = root.querySelector(".tool-output");
    let lists = {};
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fFile = form.querySelector('[name="followers"]').files[0];
      const gFile = form.querySelector('[name="following"]').files[0];
      if (!fFile && !gFile) { out.innerHTML = '<div class="notice notice-bad">Choose your followers file first.</div>'; return; }
      try {
        const followers = fFile ? parseExport(await readJsonFile(fFile)) : { accounts: [], skipped: 0 };
        const following = gFile ? parseExport(await readJsonFile(gFile)) : { accounts: [], skipped: 0 };
        if (!followers.accounts.length && !following.accounts.length) {
          throw new Error("No accounts found in those files. Check you picked the followers and following files from the JSON download.");
        }
        const r = sort(followers.accounts, following.accounts);
        lists = { recent: r.recent, mutual: r.mutual, notFollowingBack: r.notFollowingBack, notFollowedBack: r.notFollowedBack };
        const esc = T.ui.esc;
        out.innerHTML = `
          <div class="result-box">
            <div class="grid grid-3 stat-grid">
              <div class="card stat"><p class="stat-num">${r.followerCount}</p><p>followers</p></div>
              <div class="card stat"><p class="stat-num">${r.followingCount || "-"}</p><p>accounts you follow</p></div>
              <div class="card stat"><p class="stat-num">${r.recent.length}</p><p>new followers in the last 30 days</p></div>
            </div>
            <p class="fine">When your followers started following you: ${Object.keys(r.buckets).filter((k) => r.buckets[k]).map((k) => esc(k) + " " + r.buckets[k]).join(" · ")}. This is follow date only; the export doesn't say who likes or comments.</p>
            ${listHtml("recent", "New followers", r.recent, "followed you in the last 30 days")}
            ${gFile ? listHtml("mutual", "Mutual", r.mutual, "you follow each other") : ""}
            ${gFile ? listHtml("notFollowingBack", "Don't follow you back", r.notFollowingBack, "you follow them, they don't follow you") : ""}
            ${gFile && fFile ? listHtml("notFollowedBack", "You don't follow back", r.notFollowedBack, "they follow you, you don't follow them") : ""}
            ${!gFile ? '<p class="fine">Add your following.json file to see mutual follows and who doesn\'t follow you back.</p>' : ""}
            ${followers.skipped + following.skipped ? '<p class="fine">' + (followers.skipped + following.skipped) + " entries couldn't be read and were skipped.</p>" : ""}
          </div>`;
      } catch (err) {
        out.innerHTML = '<div class="notice notice-bad">' + T.ui.esc(err.message) + "</div>";
      }
    });
    out.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-csv]");
      if (!btn) return;
      const id = btn.getAttribute("data-csv");
      const csv = T.toCsv(lists[id] || [], [
        { key: "username", label: "Username" }, { key: "href", label: "Profile link" }, { key: "since", label: "Follow date range" },
      ]);
      T.download("instagram-" + id + ".csv", csv, "text/csv");
    });
  }

  T.lib = T.lib || {};
  T.lib.followers = { parseExport, sort, sinceLabel };

  T.register({
    slug: "follower-sorter",
    title: "Instagram Follower Sorter",
    kind: "free",
    blurb: "Load your Instagram data download to see new followers, mutual follows and who doesn't follow you back. Nothing leaves your browser.",
    related: [
      { slug: "class-3-your-data-their-servers", why: "a tool that processes personal data without sending it anywhere, by design." },
      { slug: "doc-02-data-ingestion-guide", why: "see what a platform's data export actually contains before you hand one to an AI tool." },
    ],
    render,
    bind,
  });
})();
