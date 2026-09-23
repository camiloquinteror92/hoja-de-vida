/* Simuladores del portafolio: la carrera de consultas (unos 17 s contra menos de 1 s), polling
   contra WebSockets y el cálculo de interés sobre interés. Todo corre en el navegador. */
(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  function h(name, attrs, parent) {
    const node = document.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  function s(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  const fillIn = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ""));

  function init(root, opts) {
    const hasGsap = typeof window.gsap !== "undefined";
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionOK = () => hasGsap && !reduceMQ.matches;
    const L = () => window.SITE.labs[opts.lang()];
    const locale = () => (opts.lang() === "es" ? "es-CO" : "en-US");
    const num = (n, digits) => new Intl.NumberFormat(locale(), {
      minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0
    }).format(n);
    const money = (n) => new Intl.NumberFormat(locale(), {
      style: "currency", currency: "COP", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0
    }).format(n);
    const compact = (n) => new Intl.NumberFormat(locale(), { notation: "compact", maximumFractionDigits: 1 }).format(n);

    /* Cuenta animada hasta el valor nuevo (sin animación si el usuario pidió menos movimiento). */
    function countTo(node, value, format) {
      const from = Number(node.dataset.value || 0);
      node.dataset.value = String(value);
      if (!motionOK() || from === value) { node.textContent = format(value); return; }
      const proxy = { v: from };
      gsap.to(proxy, { v: value, duration: 0.6, ease: "power2.out", overwrite: true,
        onUpdate: () => { node.textContent = format(Math.round(proxy.v)); } });
    }

    root.textContent = "";
    const tabs = h("div", { class: "player-tabs", role: "tablist" }, root);
    const body = h("div", { class: "lab-body" }, root);
    const labs = [queryLab(), realtimeLab(), interestLab()];
    let active = 0;
    labs.forEach((lab, i) => { lab.el.hidden = i !== active; body.appendChild(lab.el); });

    function renderTabs() {
      tabs.textContent = "";
      L().tabs.forEach((label, i) => {
        const b = h("button", { type: "button", role: "tab", class: "tab", "aria-selected": String(i === active), text: label }, tabs);
        b.addEventListener("click", () => select(i));
      });
    }

    function select(i) {
      if (i === active) return;
      labs[active].stop();
      labs[active].el.hidden = true;
      active = i;
      labs[active].el.hidden = false;
      renderTabs();
      if (motionOK()) {
        gsap.fromTo(labs[active].el, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
      }
      labs[active].start();
    }

    /* ======================= 1. La carrera de consultas ======================= */
    function queryLab() {
      const el = h("div", { class: "lab lab-query" });
      const intro = h("p", { class: "lab-intro" }, el);
      const race = h("div", { class: "race" }, el);
      const lanes = ["before", "after"].map((key) => {
        const lane = h("div", { class: "lane lane-" + key }, race);
        const head = h("div", { class: "lane-head" }, lane);
        const name = h("span", { class: "lane-name" }, head);
        const time = h("span", { class: "lane-time" }, head);
        const count = h("span", { class: "lane-count" }, head);
        const track = h("div", { class: "lane-track" }, lane);
        const bar = h("div", { class: "lane-fill" }, track);
        const log = h("ol", { class: "lane-log" }, lane);
        return { key, el: lane, name, time, count, bar, log, items: [] };
      });
      const actions = h("div", { class: "lab-actions" }, el);
      const btn = h("button", { class: "btn btn-accent", type: "button" }, actions);
      const result = h("p", { class: "lab-result", "aria-live": "polite" }, actions);
      const note = h("p", { class: "lab-note" }, el);

      const SPEED = 17 / 7; // 17 s simulados se ven en unos 7 s
      let raf = null;
      let ran = false;

      const stepsOf = (key) => L().query[key + "_steps"];
      const total = (key) => stepsOf(key).reduce((a, st) => a + st[1], 0);
      const totalQ = (key) => stepsOf(key).reduce((a, st) => a + st[2], 0);
      const axis = () => total("before"); // las dos barras comparten la escala de "antes"

      function buildLogs() {
        lanes.forEach((lane) => {
          lane.log.textContent = "";
          lane.items = stepsOf(lane.key).map(([text, dur]) => {
            const li = h("li", { class: "is-pending" }, lane.log);
            h("span", { class: "log-time", text: num(dur, dur < 1 ? 2 : 1) + " s" }, li);
            h("span", { class: "log-text", text }, li);
            return li;
          });
        });
      }

      function paint(simT) {
        const q = L().query;
        lanes.forEach((lane) => {
          const end = total(lane.key);
          const t = Math.min(simT, end);
          let acc = 0;
          let queries = 0;
          stepsOf(lane.key).forEach(([, dur, qn], i) => {
            const done = simT > 0 && t >= acc + dur - 1e-9;
            const running = simT > 0 && !done && t >= acc;
            if (done) queries += qn;
            else if (running && qn > 0) queries += Math.min(qn, Math.floor(qn * (t - acc) / dur) + 1);
            lane.items[i].className = done ? "is-done" : running ? "is-running" : "is-pending";
            acc += dur;
          });
          lane.bar.style.width = (t / axis() * 100).toFixed(2) + "%";
          lane.time.textContent = num(t, t > 0 && t < 1 ? 2 : 1) + " s";
          lane.count.textContent = queries + " " + (queries === 1 ? q.query : q.queries);
          lane.el.classList.toggle("is-finished", simT > 0 && simT >= end);
        });
      }

      function finish() {
        const q = L().query;
        result.textContent = fillIn(q.result, {
          x: num(Math.floor(total("before") / total("after"))),
          q: num(totalQ("before") - totalQ("after"))
        });
        btn.disabled = false;
        btn.textContent = q.again;
        ran = true;
      }

      function run() {
        stop();
        buildLogs();
        result.textContent = "";
        if (!motionOK()) { paint(axis()); finish(); return; }
        btn.disabled = true;
        const t0 = performance.now();
        const tick = (now) => {
          const simT = Math.min(axis(), (now - t0) / 1000 * SPEED);
          paint(simT);
          if (simT < axis()) raf = requestAnimationFrame(tick);
          else { raf = null; finish(); }
        };
        raf = requestAnimationFrame(tick);
      }

      function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        btn.disabled = false;
      }

      function render() {
        const q = L().query;
        intro.textContent = q.intro;
        note.textContent = q.note;
        lanes[0].name.textContent = q.before;
        lanes[1].name.textContent = q.after;
        btn.textContent = ran ? q.again : q.run;
        buildLogs();
        paint(ran ? axis() : 0);
        if (ran) finish(); else result.textContent = "";
      }

      btn.addEventListener("click", run);
      return { el, render, stop, start() {} };
    }

    /* ======================= 2. Polling contra WebSockets ======================= */
    function realtimeLab() {
      const TABS = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000];
      const COMPANIES = ["A", "B", "C"];
      const CYCLE = 1.4; // 5 s de polling se ven en 1,4 s
      const SERVER = { x: 470, y: 116, w: 150, h: 68 };
      const target = { x: SERVER.x, y: SERVER.y + SERVER.h / 2 };

      const el = h("div", { class: "lab lab-rt" });
      const intro = h("p", { class: "lab-intro" }, el);
      const controls = h("div", { class: "rt-controls" }, el);
      const modes = h("div", { class: "player-tabs", role: "radiogroup" }, controls);
      const bPoll = h("button", { type: "button", class: "tab", role: "radio" }, modes);
      const bSock = h("button", { type: "button", class: "tab", role: "radio" }, modes);
      const sliderWrap = h("label", { class: "rt-slider" }, controls);
      const sliderText = h("span", {}, sliderWrap);
      const slider = h("input", { type: "range", min: "0", max: String(TABS.length - 1), step: "1", value: "4" }, sliderWrap);
      const sliderOut = h("output", { class: "rt-slider-value" }, sliderWrap);

      const stage = h("div", { class: "rt-stage" }, el);
      const svg = s("svg", { viewBox: "0 0 640 300", class: "rt-svg", role: "img" }, stage);
      const linkLayer = s("g", { class: "rt-links" }, svg);
      const packetLayer = s("g", {}, svg);
      const dotLayer = s("g", {}, svg);
      const server = s("g", { class: "rt-server", transform: `translate(${SERVER.x} ${SERVER.y})` }, svg);
      s("rect", { width: SERVER.w, height: SERVER.h, rx: 15, class: "node-box" }, server);
      const serverT1 = s("text", { x: SERVER.w / 2, y: 30, class: "node-title", "text-anchor": "middle" }, server);
      const serverT2 = s("text", { x: SERVER.w / 2, y: 50, class: "node-sub", "text-anchor": "middle" }, server);

      const dots = [];
      const labels = [];
      COMPANIES.forEach((c, ci) => {
        const baseX = 50 + ci * 130;
        for (let k = 0; k < 8; k++) {
          const x = baseX + (k % 2) * 40;
          const y = 58 + Math.floor(k / 2) * 50;
          const link = s("line", { x1: x, y1: y, x2: target.x, y2: target.y, class: "rt-link" }, linkLayer);
          const dot = s("circle", { cx: x, cy: y, r: 10, class: "rt-dot c" + ci }, dotLayer);
          dots.push({ company: ci, x, y, dot, link, waiting: false });
        }
        labels.push(s("text", { x: baseX + 20, y: 282, class: "node-sub rt-company", "text-anchor": "middle" }, svg));
      });

      const stats = h("div", { class: "rt-stats" }, el);
      const mkStat = () => {
        const box = h("div", { class: "stat" }, stats);
        return { num: h("span", { class: "stat-num" }, box), label: h("span", { class: "stat-label" }, box) };
      };
      const statMin = mkStat();
      const statDay = mkStat();
      const statWait = mkStat();

      const actions = h("div", { class: "lab-actions" }, el);
      const sendBtn = h("button", { class: "btn btn-accent", type: "button" }, actions);
      const result = h("p", { class: "lab-result", "aria-live": "polite" }, actions);
      const note = h("p", { class: "lab-note" }, el);

      let mode = "polling";
      let next = 0; // empresa a la que va el próximo mensaje
      let loop = null;
      let onScreen = false;
      let visible = false;
      const live = new Set();

      function packet(from, to, cls, duration, done) {
        const p = s("circle", { cx: from.x, cy: from.y, r: 4, class: "rt-packet " + cls }, packetLayer);
        const tween = gsap.to(p, { attr: { cx: to.x, cy: to.y }, duration, ease: "power1.inOut",
          onComplete: () => { p.remove(); live.delete(tween); if (done) done(); } });
        live.add(tween);
      }

      function flash(d) {
        d.dot.classList.remove("is-hit");
        void d.dot.getBoundingClientRect();
        d.dot.classList.add("is-hit");
      }

      function busy() {
        server.classList.remove("is-busy");
        void server.getBoundingClientRect();
        server.classList.add("is-busy");
      }

      /* Un ciclo de polling: cada grupo de pestañas pregunta una vez, en un momento al azar. */
      function pollCycle() {
        dots.forEach((d) => {
          const call = gsap.delayedCall(Math.random() * CYCLE, () => {
            live.delete(call);
            packet(d, target, "is-ask", 0.55, () => {
              busy();
              if (d.waiting) {
                d.waiting = false;
                packet(target, d, "is-answer", 0.45, () => flash(d));
              }
            });
          });
          live.add(call);
        });
      }

      function running() { return mode === "polling" && onScreen && visible && motionOK(); }

      function syncLoop() {
        if (running() && !loop) {
          pollCycle();
          loop = setInterval(pollCycle, CYCLE * 1000);
        } else if (!running() && loop) {
          clearInterval(loop);
          loop = null;
        }
      }

      function clearLive() {
        live.forEach((t) => t.kill());
        live.clear();
        packetLayer.textContent = "";
      }

      function setMode(m) {
        mode = m;
        clearLive();
        dots.forEach((d) => { d.waiting = false; });
        el.classList.toggle("is-sockets", m === "sockets");
        bPoll.setAttribute("aria-checked", String(m === "polling"));
        bSock.setAttribute("aria-checked", String(m === "sockets"));
        bPoll.setAttribute("aria-selected", String(m === "polling"));
        bSock.setAttribute("aria-selected", String(m === "sockets"));
        result.textContent = "";
        if (loop) { clearInterval(loop); loop = null; }
        updateStats();
        syncLoop();
      }

      function updateStats() {
        const r = L().realtime;
        const n = TABS[Number(slider.value)] || TABS[4];
        sliderOut.textContent = num(n);
        const perMin = mode === "polling" ? n * 12 : 0;
        countTo(statMin.num, perMin, (v) => num(v));
        countTo(statDay.num, perMin * 600, (v) => num(v));
        statWait.num.textContent = mode === "polling" ? r.waitPolling : r.waitSockets;
        statWait.num.dataset.value = "0";
      }

      function send() {
        const r = L().realtime;
        const ci = next;
        next = (next + 1) % COMPANIES.length;
        const name = r.company + " " + COMPANIES[ci];
        const group = dots.filter((d) => d.company === ci);
        busy();
        if (mode === "sockets") {
          result.textContent = fillIn(r.sentSockets, { c: name });
          group.forEach((d) => (motionOK() ? packet(target, d, "is-answer", 0.4, () => flash(d)) : flash(d)));
        } else {
          result.textContent = fillIn(r.sentPolling, { c: name });
          if (motionOK() && onScreen) group.forEach((d) => { d.waiting = true; });
          else group.forEach((d) => flash(d));
        }
      }

      function render() {
        const r = L().realtime;
        intro.textContent = r.intro;
        note.textContent = r.note;
        bPoll.textContent = r.polling;
        bSock.textContent = r.sockets;
        sliderText.textContent = r.tabsLabel;
        serverT1.textContent = r.server[0];
        serverT2.textContent = r.server[1];
        labels.forEach((t, i) => { t.textContent = r.company + " " + COMPANIES[i]; });
        statMin.label.textContent = r.perMin;
        statDay.label.textContent = r.perDay;
        statWait.label.textContent = r.wait;
        sendBtn.textContent = r.send;
        svg.setAttribute("aria-label", r.intro);
        updateStats();
      }

      bPoll.addEventListener("click", () => setMode("polling"));
      bSock.addEventListener("click", () => setMode("sockets"));
      slider.addEventListener("input", updateStats);
      sendBtn.addEventListener("click", send);

      new IntersectionObserver((entries) => {
        entries.forEach((e) => { onScreen = e.isIntersecting; });
        syncLoop();
      }, { threshold: 0.2 }).observe(stage);

      setMode("polling");
      return {
        el, render,
        start() { visible = true; syncLoop(); },
        stop() { visible = false; syncLoop(); clearLive(); }
      };
    }

    /* ======================= 3. Interés sobre interés ======================= */
    function interestLab() {
      const el = h("div", { class: "lab lab-int" });
      const intro = h("p", { class: "lab-intro" }, el);
      const grid = h("div", { class: "int-grid" }, el);
      const form = h("div", { class: "int-inputs" }, grid);

      function field(attrs, withOutput) {
        const wrap = h("label", { class: "int-field" }, form);
        const text = h("span", { class: "int-label" }, wrap);
        const row = h("span", { class: "int-row" }, wrap);
        const input = h("input", attrs, row);
        const out = withOutput ? h("output", { class: "int-out-value" }, row) : null;
        return { text, input, out };
      }
      const fAmount = field({ type: "number", min: "1000000", max: "5000000000", step: "1000000", value: "20000000", inputmode: "numeric" });
      const fRate = field({ type: "number", min: "0.1", max: "6", step: "0.1", value: "1.9", inputmode: "decimal" });
      const fMonths = field({ type: "range", min: "1", max: "36", step: "1", value: "12" }, true);

      const outBox = h("div", { class: "int-results" }, grid);
      const mk = (cls) => {
        const box = h("div", { class: "stat " + (cls || "") }, outBox);
        return { num: h("span", { class: "stat-num" }, box), label: h("span", { class: "stat-label" }, box) };
      };
      const sLegal = mk();
      const sIllegal = mk();
      const sExtra = mk("is-bad");

      const chart = s("svg", { viewBox: "0 0 640 240", class: "int-chart", role: "img" }, h("div", { class: "int-chart-wrap" }, el));
      const X0 = 70, X1 = 600, Y0 = 200, Y1 = 22;
      s("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, class: "int-axis" }, chart);
      const area = s("polygon", { class: "int-gap" }, chart);
      const lineLegal = s("polyline", { class: "int-line int-legal" }, chart);
      const lineIllegal = s("polyline", { class: "int-line int-illegal" }, chart);
      const tMax = s("text", { x: X0 - 10, y: Y1 + 4, class: "node-sub", "text-anchor": "end" }, chart);
      s("text", { x: X0 - 10, y: Y0 + 4, class: "node-sub", "text-anchor": "end", text: "0" }, chart);
      s("text", { x: X0, y: Y0 + 22, class: "node-sub", "text-anchor": "middle", text: "0" }, chart);
      const tEnd = s("text", { x: X1, y: Y0 + 22, class: "node-sub", "text-anchor": "end" }, chart);
      /* Leyenda arriba a la izquierda: al final las dos curvas quedan muy cerca y los rótulos se pisarían. */
      s("line", { x1: X0 + 18, y1: Y1 + 2, x2: X0 + 42, y2: Y1 + 2, class: "int-line int-illegal" }, chart);
      const tIllegal = s("text", { x: X0 + 50, y: Y1 + 7, class: "int-tag int-tag-illegal" }, chart);
      s("line", { x1: X0 + 18, y1: Y1 + 24, x2: X0 + 42, y2: Y1 + 24, class: "int-line int-legal" }, chart);
      const tLegal = s("text", { x: X0 + 50, y: Y1 + 29, class: "int-tag int-tag-legal" }, chart);
      const note = h("p", { class: "lab-note" }, el);

      /* Lee un número y lo deja dentro de su rango; si no es válido, usa el valor por defecto. */
      function read(input, fallback) {
        const v = Number(String(input.value).replace(",", "."));
        const min = Number(input.min);
        const max = Number(input.max);
        if (!Number.isFinite(v) || v <= 0) return fallback;
        return Math.min(max, Math.max(min, v));
      }

      /* animate: dibuja las curvas la primera vez que el simulador se ve. */
      let drawn = false;
      function compute(animate) {
        const t = L().interest;
        const P = read(fAmount.input, 20000000);
        const r = read(fRate.input, 1.9) / 100;
        const m = Math.round(read(fMonths.input, 12));
        fMonths.out.textContent = String(m);

        const legalAt = (k) => P * r * k;
        const illegalAt = (k) => P * (Math.pow(1 + r, k) - 1);
        const legal = legalAt(m);
        const illegal = illegalAt(m);
        const extra = illegal - legal;

        countTo(sLegal.num, Math.round(legal), money);
        countTo(sIllegal.num, Math.round(illegal), money);
        countTo(sExtra.num, Math.round(extra), (v) => "+" + money(v));
        sExtra.label.textContent = t.extra + " (+" + num(legal > 0 ? extra / legal * 100 : 0, 1) + "%)";

        const top = illegal || 1;
        const xs = (k) => X0 + (X1 - X0) * (k / m);
        const ys = (v) => Y0 - (Y0 - Y1) * (v / top);
        const pts = (f) => Array.from({ length: m + 1 }, (_, k) => `${xs(k).toFixed(1)},${ys(f(k)).toFixed(1)}`);
        const pl = pts(legalAt);
        const pi = pts(illegalAt);
        lineLegal.setAttribute("points", pl.join(" "));
        lineIllegal.setAttribute("points", pi.join(" "));
        area.setAttribute("points", pi.concat(pl.slice().reverse()).join(" "));
        tMax.textContent = "$" + compact(top);
        tEnd.textContent = fillIn(t.monthsAxis, { m });
        tLegal.textContent = t.chartLegal;
        tIllegal.textContent = t.chartIllegal;
        chart.setAttribute("aria-label", t.illegal + ": " + money(illegal) + ". " + t.legal + ": " + money(legal) + ".");

        if (animate && !drawn && motionOK()) {
          drawn = true;
          [lineLegal, lineIllegal].forEach((ln) => {
            const len = ln.getTotalLength ? ln.getTotalLength() : 800;
            gsap.fromTo(ln, { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", clearProps: "strokeDasharray,strokeDashoffset" });
          });
          gsap.from(area, { autoAlpha: 0, duration: 0.8, delay: 0.5 });
        }
      }

      function render() {
        const t = L().interest;
        intro.textContent = t.intro;
        note.textContent = t.note;
        fAmount.text.textContent = t.amount;
        fRate.text.textContent = t.rate;
        fMonths.text.textContent = t.months;
        sLegal.label.textContent = t.legal;
        sIllegal.label.textContent = t.illegal;
        compute(false);
      }

      [fAmount.input, fRate.input, fMonths.input].forEach((i) => i.addEventListener("input", () => compute(false)));
      return { el, render, stop() {}, start() { compute(true); } };
    }

    function refresh() {
      renderTabs();
      labs.forEach((lab) => lab.render());
    }

    function stop() { labs.forEach((lab) => lab.stop()); }
    function start() { labs[active].start(); }

    refresh();
    start();
    return { refresh, stop, start, select };
  }

  window.Labs = { init };
})();
