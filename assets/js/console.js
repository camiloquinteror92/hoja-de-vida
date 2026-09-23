/* Terminal (botón de la barra superior o la tecla `) y paleta de comandos (Ctrl/⌘ + K).
   Todo corre en el navegador; los textos salen de content.js en los dos idiomas. */
(function () {
  "use strict";

  const EMAIL = "camiloquinteror@outlook.com";
  const LINKEDIN = "https://www.linkedin.com/in/camilo-quinteror/";
  const GITHUB = "https://github.com/camiloquinteror92";
  const PHONE = "+57 311 647 1257";

  function h(name, attrs, parent) {
    const node = document.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  const fillIn = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ""));
  const fold = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const modKey = isMac ? "⌘K" : "Ctrl+K";

  /* actions: { go(view, anchor), openFit(text), playFlow(id, fail), toggleTheme(), isDark(),
                toggleLang(), pdfUrl() } */
  function init(opts) {
    const S = window.SITE;
    const C = () => S.console[opts.lang()];
    const A = opts.actions;
    const hasGsap = typeof window.gsap !== "undefined";
    const motionOK = () => hasGsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ============================ Terminal ============================ */
    const term = h("dialog", { class: "term-dialog" }, document.body);
    const box = h("div", { class: "term" }, term);
    const bar = h("div", { class: "term-bar" }, box);
    const lights = h("span", { class: "term-lights", "aria-hidden": "true" }, bar);
    ["r", "y", "g"].forEach((c) => h("i", { class: "l-" + c }, lights));
    const title = h("span", { class: "term-title" }, bar);
    const closeBtn = h("button", { class: "term-close", type: "button" }, bar);
    closeBtn.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>';
    const out = h("div", { class: "term-out", role: "log", "aria-live": "polite" }, box);
    const form = h("form", { class: "term-line" }, box);
    h("span", { class: "term-prompt", "aria-hidden": "true", text: "$" }, form);
    const input = h("input", { class: "term-input", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false" }, form);

    const history = [];
    let hIndex = 0;
    let greeted = false;
    let busy = null; // animación de deploy en curso

    function line(parts, cls) {
      const p = h("p", { class: "term-row " + (cls || "") }, out);
      (Array.isArray(parts) ? parts : [parts]).forEach((part) => {
        if (typeof part === "string") p.appendChild(document.createTextNode(part));
        else p.appendChild(part);
      });
      out.scrollTop = out.scrollHeight;
      return p;
    }
    const span = (text, cls) => h("span", { class: cls, text });
    const link = (text, href) => h("a", { href, target: href.startsWith("http") ? "_blank" : "_self", rel: "noopener", text });
    function action(text, fn) {
      const b = h("button", { type: "button", class: "term-action", text });
      b.addEventListener("click", fn);
      return b;
    }

    function stopBusy() {
      if (busy) { busy.forEach((t) => clearTimeout(t)); busy = null; }
    }

    const commands = {
      help() {
        line(C().helpTitle, "t-muted");
        C().help.forEach(([cmd, desc]) => line([span(cmd.padEnd(14, " "), "t-accent"), desc]));
      },
      whoami() { line(C().whoami); },
      about() { line(S.cv[opts.lang()].about); },
      experience() {
        const cv = S.cv[opts.lang()];
        cv.experience.forEach((j) => line([span(j.dates.padEnd(22, " "), "t-muted"), span(j.role, "t-accent"), ", " + j.org]));
        cv.earlier.forEach((e) => line([span(e.dates.padEnd(22, " "), "t-muted"), e.role + ", " + e.org]));
      },
      skills() {
        S.cv[opts.lang()].skills.forEach((g) => line([span(g.name + ": ", "t-accent"), g.items.join(", ")]));
      },
      stack() {
        const nodes = S.player.diagrams.system.nodes;
        Object.values(nodes).forEach((n) => {
          const [a, b] = n[opts.lang()];
          line([span("• " + a, "t-accent"), span("  " + b, "t-muted")]);
        });
      },
      cases() {
        S.portfolio[opts.lang()].cases.forEach((c) => line([span("• " + c.title + ": ", "t-accent"), c.result]));
      },
      deploy(args) {
        const fail = args.includes("--fail");
        const flow = S.player.flows.find((f) => f.id === "deploy");
        const lang = opts.lang();
        const steps = fail ? flow.steps.slice(0, -1).concat([flow.failureStep]) : flow.steps;
        stopBusy();
        line(C().deployStart, "t-muted");
        input.disabled = true;
        const delay = motionOK() ? 520 : 0;
        busy = [];
        steps.forEach((st, i) => {
          busy.push(setTimeout(() => {
            const stamp = "[+" + ((i + 1) * 0.5).toFixed(1) + "s] ";
            const bad = st.tone === "fail";
            line([span(stamp, "t-muted"), span(bad ? "✖ " : "✔ ", bad ? "t-err" : "t-ok"), st[lang]], bad ? "t-err" : "");
          }, delay * (i + 1)));
        });
        busy.push(setTimeout(() => {
          line(fail ? C().deployFail : C().deployOk, fail ? "t-err" : "t-ok");
          line(action("▶ " + C().watch, () => { close(); A.playFlow("deploy", fail); }));
          input.disabled = false;
          input.focus();
          busy = null;
        }, delay * (steps.length + 1)));
      },
      fit(args) {
        const q = args.join(" ").trim();
        if (!q) { line(C().fitUsage, "t-muted"); return; }
        line(fillIn(C().fitOpening, { q }), "t-muted");
        setTimeout(() => { close(); A.openFit(q); }, motionOK() ? 350 : 0);
      },
      portfolio() {
        line(fillIn(C().opening, { x: "#portfolio" }), "t-muted");
        setTimeout(() => { close(); A.go("portfolio"); }, motionOK() ? 300 : 0);
      },
      labs() {
        line(fillIn(C().opening, { x: "labs" }), "t-muted");
        setTimeout(() => { close(); A.go("portfolio", "#pf-labs-title"); }, motionOK() ? 300 : 0);
      },
      cv() { line(link(C().pdf, A.pdfUrl())); },
      contact() {
        line([span(C().contactEmail + ": ", "t-muted"), link(EMAIL, "mailto:" + EMAIL)]);
        line([span("LinkedIn: ", "t-muted"), link(LINKEDIN, LINKEDIN)]);
        line([span("GitHub: ", "t-muted"), link(GITHUB, GITHUB)]);
        line([span(C().contactPhone + ": ", "t-muted"), link(PHONE, "tel:" + PHONE.replace(/\s/g, ""))]);
      },
      theme(args) {
        const want = args[0];
        if (!want || (want === "dark") !== A.isDark()) A.toggleTheme();
        line(fillIn(C().themeNow, { t: A.isDark() ? C().themeDark : C().themeLight }), "t-muted");
      },
      lang(args) {
        const want = args[0];
        if (!want || want !== opts.lang()) A.toggleLang();
        line(C().langNow, "t-muted");
      },
      clear() { out.textContent = ""; },
      exit() { close(); },
      ls() { line(C().files, "t-accent"); },
      cat(args) {
        const file = (args[0] || "").replace(/\/$/, "");
        const map = { "about.txt": "about", experience: "experience", "skills.json": "skills", cases: "cases", "contact.vcf": "contact" };
        if (map[file]) commands[map[file]]([]);
        else line(fillIn(C().noFile, { f: file || "?" }), "t-err");
      },
      sudo(args) {
        if (args.join(" ").toLowerCase().startsWith("hire")) {
          line(C().hire, "t-ok");
          line(link("mailto:" + EMAIL, "mailto:" + EMAIL));
        } else {
          line("sudo: " + (args.join(" ") || "?"), "t-muted");
        }
      },
      echo(args) { line(args.join(" ")); }
    };
    const aliases = { exp: "experience", jobs: "experience", resume: "cv", projects: "portfolio", quit: "exit", cls: "clear", hire: "sudo", "?": "help" };

    function run(raw) {
      const text = raw.trim();
      if (!text) return;
      history.push(text);
      hIndex = history.length;
      line([span("$ ", "t-ok"), text], "t-cmd");
      const [name, ...args] = text.split(/\s+/);
      const key = aliases[name.toLowerCase()] || name.toLowerCase();
      const fn = commands[key];
      if (!fn) { line(fillIn(C().notFound, { cmd: name }), "t-err"); return; }
      fn(key === "sudo" && name.toLowerCase() === "hire" ? ["hire"].concat(args) : args);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value;
      input.value = "";
      run(v);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        if (hIndex > 0) { hIndex -= 1; input.value = history[hIndex]; }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (hIndex < history.length - 1) { hIndex += 1; input.value = history[hIndex]; }
        else { hIndex = history.length; input.value = ""; }
        e.preventDefault();
      } else if (e.key === "Tab") {
        const v = input.value.trim().toLowerCase();
        if (v && !v.includes(" ")) {
          const hit = Object.keys(commands).find((c) => c.startsWith(v));
          if (hit) input.value = hit + " ";
        }
        e.preventDefault();
      }
    });

    function renderTerm() {
      title.textContent = C().title;
      closeBtn.setAttribute("aria-label", C().close);
      input.setAttribute("aria-label", C().input);
      term.setAttribute("aria-label", C().title);
    }

    function openTerminal() {
      closePalette();
      if (!term.open) {
        if (typeof term.showModal === "function") term.showModal(); else term.setAttribute("open", "");
        if (motionOK()) gsap.fromTo(box, { y: 24, autoAlpha: 0, scale: 0.98 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      }
      if (!greeted) {
        greeted = true;
        line(fillIn(C().welcome, { k: modKey }), "t-muted");
        run("whoami");
      }
      setTimeout(() => input.focus(), 40);
    }

    function close() {
      stopBusy();
      input.disabled = false;
      if (term.open) { if (term.close) term.close(); else term.removeAttribute("open"); }
    }

    closeBtn.addEventListener("click", close);
    term.addEventListener("click", (e) => { if (e.target === term) close(); });
    term.addEventListener("close", () => { stopBusy(); input.disabled = false; });

    /* ============================ Paleta ============================ */
    const pal = h("dialog", { class: "pal-dialog" }, document.body);
    const pbox = h("div", { class: "pal" }, pal);
    const pinput = h("input", { class: "pal-input", type: "text", autocomplete: "off", spellcheck: "false", role: "combobox",
      "aria-expanded": "true", "aria-controls": "pal-list", "aria-autocomplete": "list" }, pbox);
    const plist = h("ul", { class: "pal-list", id: "pal-list", role: "listbox" }, pbox);
    const pfoot = h("p", { class: "pal-foot" }, pbox);

    const ITEMS = [
      { id: "portfolio", icon: "fa-diagram-project", run: () => A.go("portfolio") },
      { id: "labs", icon: "fa-flask", run: () => A.go("portfolio", "#pf-labs-title") },
      { id: "deploy", icon: "fa-rocket", run: () => A.playFlow("deploy", false) },
      { id: "deployFail", icon: "fa-rotate-left", run: () => A.playFlow("deploy", true) },
      { id: "fit", icon: "fa-wand-magic-sparkles", run: () => A.openFit() },
      { id: "terminal", icon: "fa-terminal", run: () => openTerminal() },
      { id: "cv", icon: "fa-user", run: () => A.go("cv") },
      { id: "pdf", icon: "fa-file-pdf", run: () => { window.location.href = A.pdfUrl(); } },
      { id: "email", icon: "fa-envelope", run: () => { window.location.href = "mailto:" + EMAIL; } },
      { id: "copyEmail", icon: "fa-copy", run: () => copyEmail() },
      { id: "linkedin", icon: "fa-linkedin fab", run: () => window.open(LINKEDIN, "_blank", "noopener") },
      { id: "theme", icon: "fa-circle-half-stroke", run: () => A.toggleTheme() },
      { id: "lang", icon: "fa-language", run: () => A.toggleLang() }
    ];
    let shown = [];
    let cursor = 0;

    function copyEmail() {
      const done = () => A.toast && A.toast(C().palette.copied);
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, done);
      else done();
    }

    function renderList() {
      const P = C().palette;
      const q = fold(pinput.value.trim());
      shown = ITEMS.filter((it) => !q || fold(P.actions[it.id]).includes(q));
      cursor = Math.min(cursor, Math.max(0, shown.length - 1));
      plist.textContent = "";
      if (!shown.length) { h("li", { class: "pal-empty", text: P.empty }, plist); return; }
      shown.forEach((it, i) => {
        const li = h("li", { class: "pal-item" + (i === cursor ? " is-active" : ""), role: "option",
          id: "pal-opt-" + it.id, "aria-selected": String(i === cursor) }, plist);
        h("i", { class: (it.icon.includes("fab") ? "" : "fas ") + it.icon, "aria-hidden": "true" }, li);
        h("span", { text: P.actions[it.id] }, li);
        li.addEventListener("mousemove", () => { if (cursor !== i) { cursor = i; mark(); } });
        li.addEventListener("click", () => choose(i));
      });
      pinput.setAttribute("aria-activedescendant", "pal-opt-" + shown[cursor].id);
    }

    function mark() {
      Array.from(plist.children).forEach((li, i) => {
        li.classList.toggle("is-active", i === cursor);
        li.setAttribute("aria-selected", String(i === cursor));
        if (i === cursor) li.scrollIntoView({ block: "nearest" });
      });
      if (shown[cursor]) pinput.setAttribute("aria-activedescendant", "pal-opt-" + shown[cursor].id);
    }

    function choose(i) {
      const it = shown[i];
      if (!it) return;
      closePalette();
      it.run();
    }

    pinput.addEventListener("input", () => { cursor = 0; renderList(); });
    pinput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { cursor = (cursor + 1) % Math.max(1, shown.length); mark(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { cursor = (cursor - 1 + shown.length) % Math.max(1, shown.length); mark(); e.preventDefault(); }
      else if (e.key === "Enter") { choose(cursor); e.preventDefault(); }
    });
    pal.addEventListener("click", (e) => { if (e.target === pal) closePalette(); });

    function openPalette() {
      if (term.open) close();
      pinput.value = "";
      cursor = 0;
      renderPalette();
      if (!pal.open) {
        if (typeof pal.showModal === "function") pal.showModal(); else pal.setAttribute("open", "");
        if (motionOK()) gsap.fromTo(pbox, { y: -12, autoAlpha: 0, scale: 0.98 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out" });
      }
      setTimeout(() => pinput.focus(), 30);
    }

    function closePalette() {
      if (pal.open) { if (pal.close) pal.close(); else pal.removeAttribute("open"); }
    }

    function renderPalette() {
      const P = C().palette;
      pal.setAttribute("aria-label", P.label);
      pinput.setAttribute("placeholder", P.placeholder);
      pinput.setAttribute("aria-label", P.placeholder);
      pfoot.textContent = P.foot;
      renderList();
    }

    /* ============================ Teclado ============================ */
    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName)
        || (document.activeElement && document.activeElement.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (pal.open) closePalette(); else openPalette();
      } else if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openTerminal();
      }
    });

    function refresh() {
      renderTerm();
      renderPalette();
    }

    refresh();
    return { openTerminal, openPalette, refresh, modKey };
  }

  window.Console = { init };
})();
