/* md.js — a small, dependency-free Markdown renderer covering the subset
 * used by the course content: headings, paragraphs, bold/italic, inline
 * code, fenced code blocks, ordered/unordered lists (one level of nesting),
 * tables, blockquotes, horizontal rules and links.
 * Exposes: window.renderMarkdown(src) -> HTML string
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(s) {
    let out = escapeHtml(s);
    // inline code first, so markers inside code are protected
    out = out.replace(/`([^`]+)`/g, function (_, c) {
      return "<code>" + c + "</code>";
    });
    // bold
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // italic (single *) — avoid touching bold leftovers
    out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    // links [text](url)
    out = out.replace(
      /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
    return out;
  }

  function renderTable(rows) {
    // rows: array of raw lines starting with the header row
    if (rows.length < 2) return "";
    const parseRow = (r) =>
      r
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
    const header = parseRow(rows[0]);
    const body = rows.slice(2).map(parseRow); // rows[1] is the --- separator
    let html = '<div class="table-wrap"><table><thead><tr>';
    header.forEach((h) => (html += "<th>" + inline(h) + "</th>"));
    html += "</tr></thead><tbody>";
    body.forEach((cells) => {
      html += "<tr>";
      for (let i = 0; i < header.length; i++) {
        html += "<td>" + inline(cells[i] || "") + "</td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function renderMarkdown(src) {
    const lines = String(src || "").split("\n");
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // fenced code block
      const fence = line.match(/^```(\w*)/);
      if (fence) {
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          buf.push(lines[i]);
          i++;
        }
        i++; // skip closing fence
        out.push(
          '<pre class="code-block"><code>' + escapeHtml(buf.join("\n")) + "</code></pre>"
        );
        continue;
      }

      // table (header row followed by |---| separator)
      if (
        /^\|(.+)\|\s*$/.test(line) &&
        i + 1 < lines.length &&
        /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])
      ) {
        const rows = [];
        while (i < lines.length && /^\|(.+)\|\s*$/.test(lines[i])) {
          rows.push(lines[i].trim());
          i++;
        }
        out.push(renderTable(rows));
        continue;
      }

      // headings
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = Math.min(h[1].length + 1, 6); // page already has an h1
        out.push("<h" + level + ">" + inline(h[2]) + "</h" + level + ">");
        i++;
        continue;
      }

      // horizontal rule
      if (/^\s*---+\s*$/.test(line)) {
        out.push("<hr>");
        i++;
        continue;
      }

      // blockquote
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        out.push("<blockquote>" + inline(buf.join(" ")) + "</blockquote>");
        continue;
      }

      // unordered list
      if (/^\s*[-*]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          let text = lines[i].replace(/^\s*[-*]\s+/, "");
          i++;
          // continuation lines (indented, not a new item)
          while (
            i < lines.length &&
            /^\s{2,}\S/.test(lines[i]) &&
            !/^\s*[-*]\s+/.test(lines[i]) &&
            !/^\s*\d+\.\s/.test(lines[i])
          ) {
            text += " " + lines[i].trim();
            i++;
          }
          items.push("<li>" + inline(text) + "</li>");
        }
        out.push("<ul>" + items.join("") + "</ul>");
        continue;
      }

      // ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          let text = lines[i].replace(/^\s*\d+\.\s+/, "");
          i++;
          while (
            i < lines.length &&
            /^\s{2,}\S/.test(lines[i]) &&
            !/^\s*\d+\.\s/.test(lines[i]) &&
            !/^\s*[-*]\s+/.test(lines[i])
          ) {
            text += " " + lines[i].trim();
            i++;
          }
          items.push("<li>" + inline(text) + "</li>");
        }
        out.push("<ol>" + items.join("") + "</ol>");
        continue;
      }

      // blank line
      if (/^\s*$/.test(line)) {
        i++;
        continue;
      }

      // paragraph (gather consecutive non-empty, non-special lines)
      const buf = [];
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^\s*[-*]\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\s*---+\s*$/.test(lines[i]) &&
        !/^\|.+\|\s*$/.test(lines[i])
      ) {
        buf.push(lines[i]);
        i++;
      }
      if (buf.length) out.push("<p>" + inline(buf.join(" ")) + "</p>");
      else i++; // safety: never loop forever
    }

    return out.join("\n");
  }

  window.renderMarkdown = renderMarkdown;
})();
