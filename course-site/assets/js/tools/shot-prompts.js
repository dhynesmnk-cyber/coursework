/* shot-prompts.js — Product-Shot Prompt Builder (AI). Writes prompts for
 * the visitor's own image tool; no image is generated on this site.
 * An optional photo is shrunk in the browser before it is sent.
 */
(function () {
  "use strict";
  const T = window.COURSE_TOOLS;

  const STYLES = [
    ["studio", "Studio (clean white)"],
    ["lifestyle", "Lifestyle (in use)"],
    ["flatlay", "Flat lay (from above)"],
    ["outdoor", "Outdoor (daylight)"],
  ];
  const MAX_BASE64 = 190 * 1024; // the server allows 200 KB; leave headroom

  const EXAMPLE = {
    productSummary: "A 500 g glass jar of raw honey with a kraft paper label, a black screw lid and a twine bow around the neck.",
    prompts: [
      { style: "studio", prompt: "Using my attached product photo, keep the product exactly as it is (shape, colours, label and text) and place it on a seamless pure white sweep. Soft, even studio lighting from both sides with a gentle overhead fill so the honey glows amber without hot spots. Camera at the jar's label height, centred, product filling about 60% of the frame, a soft natural shadow beneath. Clean, bright, catalogue-ready mood. Square 1:1 aspect ratio. Sharp focus on the product, no watermarks, no added text, no people or hands, commercial product photography quality." },
      { style: "lifestyle", prompt: "Using my attached product photo, keep the product exactly as it is (shape, colours, label and text) and set it on a timber kitchen bench in morning light, beside a plate of toast and a wooden honey dipper, with a soft-focus Australian farmhouse kitchen behind. Warm window light from the left, shallow depth of field so the jar stays crisp. Camera slightly above bench height. Inviting, homely mood. Square 1:1 aspect ratio. Sharp focus on the product, no watermarks, no added text, no people or hands, commercial product photography quality." },
    ],
    tips: [
      "Shoot your source photo near a window on an overcast day: even light makes the AI's job easier.",
      "If the label text comes back garbled, ask the tool to 'keep the label pixel-perfect from my photo' and try again.",
    ],
  };

  // Shrink a photo to JPEG, longest side `max`, so the upload stays small.
  function shrinkPhoto(file, max, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("That photo couldn't be opened. Try a JPEG or PNG (iPhone HEIC photos may need converting)."));
      };
      img.src = url;
    });
  }

  async function photoPayload(file) {
    for (const [max, q] of [[768, 0.82], [640, 0.7], [512, 0.6]]) {
      const data = await shrinkPhoto(file, max, q);
      if (data.length <= MAX_BASE64) return { mediaType: "image/jpeg", data: data };
    }
    throw new Error("That photo is too detailed to send. Try cropping it closer to the product.");
  }

  function render() {
    const esc = T.ui.esc;
    const saved = T.local.get("awspp-shot-form", {});
    const chosen = saved.styles && saved.styles.length ? saved.styles : ["studio", "lifestyle"];
    return `
      <form class="stack-form tool-form" novalidate>
        <label class="field"><span class="field-label">Product name</span>
          <input type="text" name="product" maxlength="120" value="${esc(saved.product || "")}" placeholder="e.g. Raw Yellow Box honey, 500 g jar" required></label>
        <label class="field"><span class="field-label">Short description (optional)</span>
          <textarea name="description" rows="2" maxlength="600" placeholder="e.g. Glass jar, kraft label, black lid, twine bow">${esc(saved.description || "")}</textarea></label>
        <fieldset class="field">
          <legend class="field-label">Styles (pick up to 3)</legend>
          <div class="chip-row">
            ${STYLES.map(([value, label]) => `
              <label class="chip-check"><input type="checkbox" name="styles" value="${value}" ${chosen.indexOf(value) >= 0 ? "checked" : ""}> ${label}</label>`).join("")}
          </div>
        </fieldset>
        <div class="field-row">
          <label class="field"><span class="field-label">Mood</span>
            <select name="mood">
              <option value="professional">Professional</option>
              <option value="warm">Warm</option>
              <option value="bold">Bold</option>
            </select></label>
          <label class="field"><span class="field-label">Shape</span>
            <select name="aspect">
              <option value="1:1">Square 1:1 (Instagram, marketplaces)</option>
              <option value="4:5">Portrait 4:5 (Instagram feed)</option>
              <option value="16:9">Wide 16:9 (website banner)</option>
              <option value="9:16">Tall 9:16 (Stories, Reels)</option>
            </select></label>
        </div>
        <label class="field"><span class="field-label">Product photo (optional, helps accuracy)</span>
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp">
          <span class="fine">Shrunk to about 768 pixels in your browser before sending. Not stored by this site.</span></label>
        <label class="field"><span class="field-label">Anything else? (optional)</span>
          <input type="text" name="notes" maxlength="500" value="${esc(saved.notes || "")}" placeholder="e.g. include a few gum leaves as props"></label>
        <div class="tool-actions">
          <button class="btn btn-primary" type="submit">Write my prompts</button>
          <button class="btn btn-ghost show-example" type="button">See an example</button>
        </div>
      </form>
      ${T.aiFooter()}
      <div class="tool-output" aria-live="polite"></div>`;
  }

  function styleLabel(s) {
    const hit = STYLES.find((x) => x[0] === s);
    return hit ? hit[1] : s;
  }

  function renderResult(r) {
    const esc = T.ui.esc;
    return `
      <div class="result-box">
        <p class="lede">${esc(r.productSummary)}</p>
        ${r.prompts.map((p, i) => `
          <div class="prompt-card">
            <div class="prompt-head"><strong>${esc(styleLabel(p.style))}</strong>
              <button class="btn btn-ghost btn-sm" type="button" data-copy="#shot-prompt-${i}">Copy prompt</button></div>
            <p id="shot-prompt-${i}" class="prompt-text">${esc(p.prompt)}</p>
          </div>`).join("")}
        <p class="tool-actions">
          <a class="btn btn-dark btn-sm" href="https://chatgpt.com/" target="_blank" rel="noopener">Open ChatGPT</a>
          <a class="btn btn-dark btn-sm" href="https://gemini.google.com/app" target="_blank" rel="noopener">Open Gemini</a>
        </p>
        <p class="fine">Paste a prompt, attach your product photo, and send. Image tools still get labels and small text wrong sometimes, so check the result closely before using it.</p>
        ${r.tips && r.tips.length ? "<h3>Tips</h3><ul>" + r.tips.map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul>" : ""}
      </div>`;
  }

  T.register({
    slug: "shot-prompts",
    title: "Product-Shot Prompt Builder",
    kind: "ai",
    blurb: "Turn a phone photo of your product into ready-to-paste prompts for ChatGPT or Gemini: studio, lifestyle, flat lay or outdoor shots.",
    related: [
      { slug: "class-4-talking-to-the-software", why: "see how a precise, structured request gets a usable result first time." },
      { slug: "doc-06-tool-comparison-matrix", why: "the matrix covers which tools generate images and on which plans." },
      { slug: "class-3-your-data-their-servers", why: "think about what you upload: product photos are low risk, photos with customers in them are not." },
    ],
    render,
    bind(root) {
      const saved = T.local.get("awspp-shot-form", {});
      ["mood", "aspect"].forEach((k) => { if (saved[k]) root.querySelector('[name="' + k + '"]').value = saved[k]; });
      T.wireAiTool(root, {
        tool: "shot-prompts",
        example: EXAMPLE,
        steps: ["Looking at your product", "Writing the prompts", "Adding tips"],
        async collect(form) {
          const v = T.formValues(form);
          if (!v.product) throw new Error("Please add the product name.");
          if (!v.styles.length) throw new Error("Please pick at least one style.");
          if (v.styles.length > 3) throw new Error("Please pick no more than three styles.");
          T.local.set("awspp-shot-form", v);
          const file = form.querySelector('[name="photo"]').files[0];
          if (file) v.image = await photoPayload(file);
          return v;
        },
        renderResult,
      });
    },
  });
})();
