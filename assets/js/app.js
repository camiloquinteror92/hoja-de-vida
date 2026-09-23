/* Orquesta el sitio: idioma, tema, las dos vistas (hoja de vida y portafolio),
   la transición entre ellas y la entrada animada. */
(function () {
  "use strict";

  const S = window.SITE;
  const hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap) {
    const plugins = [window.ScrollTrigger, window.SplitText].filter(Boolean);
    if (plugins.length) gsap.registerPlugin(...plugins);
  }
  const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionOK = () => hasGsap && !reduceMQ.matches;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(name, attrs, parent) {
    const node = document.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };

  /* ---------- Idioma ---------- */
  const qsLang = new URLSearchParams(window.location.search).get("lang");
  let lang = qsLang === "es" || qsLang === "en" ? qsLang : store.get("lang") === "es" ? "es" : "en";
  const ui = () => S.ui[lang];

  /* ---------- Tema ---------- */
  const themeBtn = $("#theme-toggle");
  function setTheme(dark) {
    document.body.classList.toggle("dark-theme", dark);
    themeBtn.innerHTML = `<i class="fas ${dark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i>`;
    themeBtn.setAttribute("aria-label", dark ? ui().themeToLight : ui().themeToDark);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0b0b0d" : "#f5f5f7");
  }
  const savedTheme = store.get("theme");
  let dark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(dark);
  themeBtn.addEventListener("click", () => {
    dark = !dark;
    store.set("theme", dark ? "dark" : "light");
    setTheme(dark);
  });

  /* ---------- Hoja de vida ---------- */
  function renderCV() {
    const c = S.cv[lang];
    $("#about-text").textContent = c.about;

    const exp = $("#experience-list");
    exp.textContent = "";
    c.experience.forEach((job) => {
      const item = el("article", { class: "job" }, exp);
      const head = el("div", { class: "job-head" }, item);
      el("h3", { class: "job-role", text: job.role }, head);
      el("p", { class: "job-dates", text: job.dates }, head);
      el("p", { class: "job-org", text: job.org }, item);
      el("p", { class: "job-context", text: job.context }, item);
      const ul = el("ul", { class: "job-bullets" }, item);
      job.bullets.forEach((b) => el("li", { text: b }, ul));
    });

    const earlier = $("#earlier-list");
    earlier.textContent = "";
    c.earlier.forEach((e) => {
      const item = el("article", { class: "early" }, earlier);
      const head = el("div", { class: "job-head" }, item);
      el("h3", { class: "job-role", text: `${e.org}, ${e.role}` }, head);
      el("p", { class: "job-dates", text: e.dates }, head);
      el("p", { class: "early-text", text: e.text }, item);
    });

    const skills = $("#skills-list");
    skills.textContent = "";
    c.skills.forEach((g) => {
      const group = el("div", { class: "skill-group" }, skills);
      el("h3", { class: "skill-name", text: g.name }, group);
      const chips = el("ul", { class: "chips" }, group);
      g.items.forEach((s) => el("li", { class: "chip", text: s }, chips));
    });

    const edu = $("#education-list");
    edu.textContent = "";
    c.education.forEach((e) => {
      const item = el("article", { class: "edu" }, edu);
      const head = el("div", { class: "job-head" }, item);
      el("h3", { class: "job-role", text: e.title }, head);
      el("p", { class: "job-dates", text: e.dates }, head);
      el("p", { class: "job-org", text: e.org }, item);
    });
    $("#languages-text").textContent = c.languages;
  }

  /* ---------- Portafolio ---------- */
  function renderPortfolio() {
    const p = S.portfolio[lang];
    $("#pf-title").textContent = p.title;
    $("#pf-lead").textContent = p.lead;
    $("#pf-note").textContent = p.note;
    $("#pf-player-title").textContent = p.playerTitle;
    $("#pf-player-hint").textContent = p.playerHint;
    $("#pf-cases-title").textContent = p.casesTitle;
    $("#pf-closing-title").textContent = p.closingTitle;
    $("#pf-closing-lead").textContent = p.closingLead;

    const cases = $("#cases");
    cases.textContent = "";
    p.cases.forEach((cs) => {
      const card = el("article", { class: "case" }, cases);
      el("p", { class: "case-tag", text: cs.tag }, card);
      el("h3", { class: "case-title", text: cs.title }, card);
      const dl = el("dl", { class: "case-body" }, card);
      [["problem", cs.problem], ["did", cs.did], ["result", cs.result]].forEach(([k, v]) => {
        el("dt", { text: p[k] }, dl);
        el("dd", { class: k === "result" ? "case-result" : "", text: v }, dl);
      });
    });
  }

  /* ---------- Textos fijos ---------- */
  function renderStatic() {
    const u = ui();
    document.documentElement.lang = u.htmlLang;
    $$("[data-t]").forEach((node) => {
      const v = u[node.getAttribute("data-t")];
      if (v) node.textContent = v;
    });
    const langBtn = $("#lang-toggle");
    langBtn.textContent = u.langBtn;
    langBtn.setAttribute("aria-label", u.langLabel);
    $$(".js-cv-pdf").forEach((a) => a.setAttribute("href", u.cvPdf));
    $("#scroll-to-top").setAttribute("aria-label", u.backToTop);
    themeBtn.setAttribute("aria-label", dark ? u.themeToLight : u.themeToDark);
    document.title = current === "portfolio" ? u.titlePortfolio : u.titleCv;
  }

  /* ---------- Título tipeado ---------- */
  let typing = null;
  function typeTitle(text) {
    const target = $("#job-title");
    if (typing) clearInterval(typing);
    if (!motionOK()) { target.textContent = text; return; }
    let i = 0;
    target.textContent = "";
    typing = setInterval(() => {
      if (i < text.length) target.textContent += text.charAt(i++);
      else { clearInterval(typing); typing = null; }
    }, 55);
  }

  /* ---------- Entradas animadas (un solo momento por vista) ---------- */
  const activeSplits = new Set();
  function revertSplits() {
    activeSplits.forEach((s) => s.revert());
    activeSplits.clear();
  }

  /* Sube el texto letra por letra (o palabra por palabra) desde una máscara. */
  function splitRise(node, unit) {
    if (window.SplitText) {
      const split = SplitText.create(node, { type: unit === "chars" ? "words,chars" : "words", mask: unit, aria: "auto" });
      activeSplits.add(split);
      return gsap.from(split[unit], {
        yPercent: 110, duration: 0.8, ease: "power4.out",
        stagger: unit === "chars" ? 0.018 : 0.05,
        onComplete: () => { split.revert(); activeSplits.delete(split); }
      });
    }
    return gsap.from(node, { autoAlpha: 0, y: 18, duration: 0.7, ease: "power3.out" });
  }

  let cvIntroDone = false;
  function introCV() {
    const text = ui().heroTitle;
    if (!motionOK() || cvIntroDone) { cvIntroDone = true; typeTitle(text); return; }
    cvIntroDone = true;
    $("#job-title").textContent = "";
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero .avatar", { autoAlpha: 0, scale: 0.8, duration: 0.6 })
      .add(splitRise($(".hero-name"), "chars"), "-=0.3")
      .add(() => typeTitle(text), "-=0.35")
      .from([".hero-stack", ".hero-line", ".hero-meta"], { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08 }, "+=0.35")
      .from(".hero-ctas .btn", { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.08 }, "-=0.2");
  }

  let pfIntroDone = false;
  function introPortfolio() {
    if (!motionOK() || pfIntroDone) { pfIntroDone = true; return; }
    pfIntroDone = true;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.add(splitRise($("#pf-title"), "words"))
      .from(["#pf-lead", "#pf-note"], { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08 }, "-=0.45")
      .from(".pf-player-wrap", { autoAlpha: 0, y: 24, duration: 0.7 }, "-=0.25");
  }

  /* ---------- Vistas ---------- */
  const views = { cv: $("#view-cv"), portfolio: $("#view-portfolio") };
  let current = null;

  function viewFromHash() {
    if (window.location.hash === "#portfolio") return "portfolio";
    if (window.location.hash === "#cv" || window.location.hash === "") return "cv";
    return current || "cv";
  }

  function updateNav(name) {
    $(".seg").setAttribute("data-active", name);
    $$(".seg-btn").forEach((a) => {
      if (a.dataset.view === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function show(name, animate) {
    if (name === current) return;
    const next = views[name];
    const prev = current ? views[current] : null;
    current = name;
    updateNav(name);
    document.title = name === "portfolio" ? ui().titlePortfolio : ui().titleCv;
    if (name !== "portfolio" && player) player.pause();

    const swap = () => {
      /* Solo queda visible la vista pedida, también al entrar con un enlace directo. */
      Object.entries(views).forEach(([key, view]) => { view.hidden = key !== name; });
      if (prev && hasGsap) gsap.set(prev, { clearProps: "all" });
      window.scrollTo(0, 0);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    if (animate && prev && motionOK()) {
      gsap.timeline()
        .to(prev, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in" })
        .add(swap)
        .fromTo(next, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" })
        .add(() => (name === "portfolio" ? introPortfolio() : introCV()), "<");
    } else {
      swap();
      if (name === "portfolio") introPortfolio(); else introCV();
    }
  }

  window.addEventListener("hashchange", () => show(viewFromHash(), true));

  /* ---------- Idioma: botón ---------- */
  function renderAll() {
    revertSplits();
    renderStatic();
    renderCV();
    renderPortfolio();
  }

  $("#lang-toggle").addEventListener("click", () => {
    lang = lang === "en" ? "es" : "en";
    store.set("lang", lang);
    renderAll();
    typeTitle(ui().heroTitle);
    if (player) player.refresh();
    if (matcher) matcher.refresh();
  });

  /* ---------- Volver arriba ---------- */
  const topBtn = $("#scroll-to-top");
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: motionOK() ? "smooth" : "auto" }));

  /* ---------- Arranque ---------- */
  renderAll();
  const player = window.Player ? window.Player.init($("#player"), { lang: () => lang }) : null;
  const matcher = window.Matcher ? window.Matcher.init($("#fit-dialog"), { lang: () => lang }) : null;
  $$("[data-open-fit]").forEach((b) => b.addEventListener("click", () => matcher && matcher.open()));
  document.body.classList.add("js-ready");
  show(viewFromHash(), false);
})();
