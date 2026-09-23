/* "Revisa si encajo": compara una vacante (o unas habilidades sueltas) con la experiencia de Camilo.
   Todo corre en el navegador; nada se envía a ningún servidor. */
(function () {
  "use strict";

  function el(name, attrs, parent) {
    const node = document.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  const ICONS = { match: "fa-circle-check", partial: "fa-circle-half-stroke", gap: "fa-circle-xmark" };
  const ORDER = { match: 0, partial: 1, gap: 2 };
  const SITE_URL = "https://camiloquinteror92.github.io/hoja-de-vida/";

  function init(dialog, opts) {
    const M = window.SITE.matcher;
    const hasGsap = typeof window.gsap !== "undefined";
    const motionOK = () => hasGsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const U = () => M.ui[opts.lang()];
    let lastText = "";
    let lastFound = null;
    let lastUnmatched = [];
    let typing = null;

    /* ---------- Estructura ---------- */
    const sheet = el("div", { class: "fit-sheet" }, dialog);
    const head = el("div", { class: "fit-head" }, sheet);
    const title = el("h2", { id: "fit-title", class: "fit-title" }, head);
    const close = el("button", { type: "button", class: "icon-btn fit-close" }, head);
    close.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>';
    const lead = el("p", { class: "fit-lead" }, sheet);
    const area = el("textarea", { class: "fit-input", rows: "4", id: "fit-input" }, sheet);
    const chips = el("div", { class: "fit-chips" }, sheet);
    const row = el("div", { class: "fit-actions" }, sheet);
    const btnGo = el("button", { type: "button", class: "btn btn-accent" }, row);
    const btnSample = el("button", { type: "button", class: "btn" }, row);
    const privacy = el("p", { class: "fit-privacy" }, sheet);
    const msg = el("p", { class: "fit-msg", role: "status" }, sheet);
    const results = el("div", { class: "fit-results", hidden: "" }, sheet);

    dialog.setAttribute("aria-labelledby", "fit-title");

    function renderChips() {
      const u = U();
      chips.textContent = "";
      el("span", { class: "fit-chips-label", text: u.chipsLabel }, chips);
      u.chips.forEach((c) => {
        const b = el("button", { type: "button", class: "chip-btn", text: c }, chips);
        b.addEventListener("click", () => {
          const current = area.value.trim();
          /* Si ya hay una vacante pegada, el ejemplo la reemplaza; si hay palabras, se suma. */
          if (!current || current.includes("\n")) {
            area.value = c;
          } else {
            const parts = current.split(",").map((p) => p.trim()).filter(Boolean);
            if (!parts.some((p) => p.toLowerCase() === c.toLowerCase())) parts.push(c);
            area.value = parts.join(", ");
          }
          run(true);
        });
      });
    }

    function renderText() {
      const u = U();
      title.textContent = u.title;
      close.setAttribute("aria-label", u.close);
      lead.textContent = u.lead;
      area.setAttribute("placeholder", u.placeholder);
      area.setAttribute("aria-label", u.placeholder);
      btnSample.textContent = u.sample;
      btnGo.textContent = u.analyze;
      privacy.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> ' + u.privacy;
      renderChips();
      if (lastFound) render(analyze(lastText), false, lastUnmatched);
    }

    /* ---------- Análisis ---------- */
    function analyze(text) {
      const lang = opts.lang();
      const found = [];
      M.rules.forEach((r) => {
        let idx = -1;
        r.re.forEach((re) => {
          const m = re.exec(text);
          if (m && (idx === -1 || m.index < idx)) idx = m.index;
        });
        if (idx !== -1) found.push({ status: r.status, label: r[lang][0], ev: r[lang][1], idx });
      });

      const yre = new RegExp(M.years.re.source, "gi");
      let best = 0;
      let bestIdx = -1;
      let m;
      while ((m = yre.exec(text))) {
        const n = parseInt(m[1], 10);
        if (n > best && n <= 20) { best = n; bestIdx = m.index; }
      }
      if (best > 0) {
        const Y = M.years[lang];
        const status = best <= 3 ? "match" : "partial";
        found.push({ status, label: Y.label.replace("{n}", best), ev: status === "match" ? Y.match : Y.partial, idx: bestIdx });
      }

      found.sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.idx - b.idx);
      return found;
    }

    /* Si el reclutador escribió palabras sueltas (no una vacante), devuelve cada término. */
    function keywordTerms(text) {
      const clean = text.trim();
      const words = clean.split(/\s+/).length;
      const keywordMode = !clean.includes("\n") && (words <= 12 || (/[,;]/.test(clean) && words <= 40));
      if (!keywordMode) return null;
      return clean.split(/[,;/]|\s+y\s+|\s+and\s+/i).map((s) => s.trim()).filter((s) => s.length >= 2);
    }

    function isKnown(term) {
      if (M.rules.some((r) => r.re.some((re) => re.test(term)))) return true;
      return new RegExp(M.years.re.source, "i").test(term);
    }

    function counts(found) {
      const c = { match: 0, partial: 0, gap: 0 };
      found.forEach((f) => { c[f.status] += 1; });
      c.total = found.length;
      c.score = c.total ? Math.round(((c.match + c.partial * 0.5) / c.total) * 100) : 0;
      return c;
    }

    function summary(found) {
      const u = U();
      const c = counts(found);
      const group = (s) => found.filter((f) => f.status === s).map((f) => f.label).join(", ");
      const lines = [u.mailIntro, ""];
      if (c.match) lines.push(`${u.strong}: ${group("match")}`);
      if (c.partial) lines.push(`${u.partial}: ${group("partial")}`);
      if (c.gap) lines.push(`${u.gap}: ${group("gap")}`);
      lines.push("", `${c.score}% ${u.fit}. ${SITE_URL}`, "", u.mailOutro);
      return lines.join("\n");
    }

    /* ---------- Resultados ---------- */
    function render(found, animate, unmatched) {
      const u = U();
      const c = counts(found);
      results.textContent = "";
      results.hidden = false;

      const top = el("div", { class: "fit-top" }, results);
      const ring = el("div", { class: "fit-ring" }, top);
      ring.innerHTML =
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<circle class="ring-track" cx="60" cy="60" r="52"></circle>' +
        '<circle class="ring-fill" cx="60" cy="60" r="52"></circle></svg>' +
        `<div class="ring-label"><span class="ring-num">${animate ? 0 : c.score}</span><span class="ring-unit">% ${u.fit}</span></div>`;
      const legend = el("div", { class: "fit-legend" }, top);
      el("p", { class: "fit-covered", text: u.covered.replace("{n}", c.match).replace("{m}", c.total) }, legend);
      const pills = el("div", { class: "fit-pills" }, legend);
      [["match", u.strong], ["partial", u.partial], ["gap", u.gap]].forEach(([k, label]) => {
        if (!c[k]) return;
        const p = el("span", { class: "pill pill-" + k }, pills);
        p.innerHTML = `<i class="fas ${ICONS[k]}" aria-hidden="true"></i> ${label} <b>${c[k]}</b>`;
      });

      const list = el("ul", { class: "fit-list" }, results);
      found.forEach((f) => {
        const li = el("li", { class: "fit-item is-" + f.status }, list);
        const icon = el("i", { class: "fas " + ICONS[f.status], "aria-hidden": "true" }, li);
        icon.setAttribute("title", u[f.status === "match" ? "strong" : f.status]);
        const body = el("div", {}, li);
        el("p", { class: "fit-label", text: f.label }, body);
        el("p", { class: "fit-ev", text: f.ev }, body);
      });

      if (unmatched && unmatched.length) {
        const note = el("p", { class: "fit-unmatched" }, results);
        note.innerHTML = '<i class="fas fa-circle-info" aria-hidden="true"></i> ';
        note.appendChild(document.createTextNode(u.unmatched.replace("{terms}", unmatched.join(", "))));
      }

      const act = el("div", { class: "fit-actions fit-after" }, results);
      const mail = el("a", { class: "btn btn-accent", href: "mailto:camiloquinteror@outlook.com?subject=" +
        encodeURIComponent(u.mailSubject) + "&body=" + encodeURIComponent(summary(found)) }, act);
      mail.innerHTML = '<i class="fas fa-envelope" aria-hidden="true"></i> ' + u.email;
      const copy = el("button", { type: "button", class: "btn" }, act);
      copy.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> <span>' + u.copy + "</span>";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(summary(found));
          copy.querySelector("span").textContent = u.copied;
          setTimeout(() => { copy.querySelector("span").textContent = U().copy; }, 1800);
        } catch (e) {
          area.focus();
        }
      });

      const fill = ring.querySelector(".ring-fill");
      const circ = 2 * Math.PI * 52;
      fill.style.strokeDasharray = circ;
      if (animate && motionOK()) {
        fill.style.strokeDashoffset = circ;
        const counter = { v: 0 };
        const num = ring.querySelector(".ring-num");
        const tl = gsap.timeline();
        tl.from(top, { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.out" })
          .to(fill, { strokeDashoffset: circ * (1 - c.score / 100), duration: 1.1, ease: "power3.out" }, "<0.1")
          .to(counter, { v: c.score, duration: 1.1, ease: "power3.out", onUpdate: () => { num.textContent = Math.round(counter.v); } }, "<")
          .from(list.children, { autoAlpha: 0, y: 10, duration: 0.35, stagger: 0.05, ease: "power2.out" }, "-=0.8")
          .from(act, { autoAlpha: 0, y: 8, duration: 0.35 }, "-=0.2");
      } else {
        fill.style.strokeDashoffset = circ * (1 - c.score / 100);
      }
    }

    /* explicit: el reclutador pidió revisar (botón, Enter o un ejemplo). Si no, es la búsqueda en vivo. */
    function run(explicit) {
      const u = U();
      const text = area.value.trim();
      msg.textContent = "";
      if (!text) {
        results.hidden = true;
        lastFound = null;
        if (explicit) { msg.textContent = u.empty; area.focus(); }
        return;
      }
      const found = analyze(text);
      const terms = keywordTerms(text);
      const unmatched = terms ? terms.filter((t) => !isKnown(t)) : [];
      if (!found.length) {
        results.hidden = true;
        lastFound = null;
        if (explicit) msg.textContent = u.none;
        return;
      }
      lastText = text;
      lastFound = found;
      lastUnmatched = unmatched;
      render(found, explicit, unmatched);
      if (explicit) results.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
    }

    btnGo.addEventListener("click", () => run(true));
    btnSample.addEventListener("click", () => {
      area.value = M.samples[opts.lang()];
      run(true);
    });
    /* Búsqueda en vivo mientras escribe. */
    area.addEventListener("input", () => {
      clearTimeout(typing);
      typing = setTimeout(() => run(false), 350);
    });
    /* Enter revisa cuando son palabras sueltas; Shift+Enter hace un salto de línea. */
    area.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !area.value.includes("\n")) {
        e.preventDefault();
        clearTimeout(typing);
        run(true);
      }
    });
    close.addEventListener("click", () => closeDialog());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) closeDialog(); });

    function open() {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      if (motionOK()) {
        gsap.fromTo(sheet, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
      }
      setTimeout(() => area.focus(), 60);
    }

    function closeDialog() {
      const done = () => { if (dialog.close) dialog.close(); else dialog.removeAttribute("open"); };
      if (motionOK()) gsap.to(sheet, { y: 24, autoAlpha: 0, duration: 0.25, ease: "power2.in", onComplete: done });
      else done();
    }

    renderText();
    return { open, refresh: renderText };
  }

  window.Matcher = { init };
})();
