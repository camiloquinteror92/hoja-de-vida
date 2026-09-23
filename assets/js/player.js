/* Diagrama interactivo: recorre los flujos del SaaS paso a paso.
   Funciona sin GSAP (cambios instantáneos); con GSAP anima el paquete y las líneas. */
(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const NODE_W = 176;
  const NODE_H = 64;
  const GAP = 7;

  function svgEl(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    if (parent) parent.appendChild(node);
    return node;
  }

  function htmlEl(name, attrs, parent) {
    const node = document.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  /* Punto donde la recta entre dos nodos sale del rectángulo del primero. */
  function border(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const hw = NODE_W / 2 + GAP;
    const hh = NODE_H / 2 + GAP;
    const sx = dx === 0 ? Infinity : hw / Math.abs(dx);
    const sy = dy === 0 ? Infinity : hh / Math.abs(dy);
    const s = Math.min(sx, sy);
    return { x: from.x + dx * s, y: from.y + dy * s };
  }

  function words(text) {
    return text.trim().split(/\s+/).length;
  }

  function init(root, opts) {
    const data = window.SITE.player;
    const T = () => window.SITE.portfolio[opts.lang()];
    const hasGsap = typeof window.gsap !== "undefined";
    const motionOK = () => hasGsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let flowIndex = 0;
    let step = -1;
    let playing = false;
    let failure = false;
    let running = [];   // animaciones vivas del paso actual
    let pending = null; // siguiente paso programado

    /* ---------- Estructura ---------- */
    root.textContent = "";
    const tabs = htmlEl("div", { class: "player-tabs", role: "tablist" }, root);
    const stage = htmlEl("div", { class: "player-stage" }, root);
    const canvas = htmlEl("div", { class: "player-canvas" }, stage);
    const panel = htmlEl("div", { class: "player-panel" }, root);
    const intro = htmlEl("p", { class: "player-intro" }, panel);
    const stepBox = htmlEl("div", { class: "player-step", "aria-live": "polite" }, panel);
    const stepCount = htmlEl("p", { class: "step-count" }, stepBox);
    const stepText = htmlEl("p", { class: "step-text" }, stepBox);
    const dots = htmlEl("div", { class: "player-dots" }, panel);
    const controls = htmlEl("div", { class: "player-controls" }, panel);
    const btnPrev = htmlEl("button", { class: "icon-btn", type: "button" }, controls);
    btnPrev.innerHTML = '<i class="fas fa-backward-step" aria-hidden="true"></i>';
    const btnPlay = htmlEl("button", { class: "btn btn-accent play-btn", type: "button" }, controls);
    const btnNext = htmlEl("button", { class: "icon-btn", type: "button" }, controls);
    btnNext.innerHTML = '<i class="fas fa-forward-step" aria-hidden="true"></i>';
    const failWrap = htmlEl("label", { class: "fail-toggle" }, controls);
    const failInput = htmlEl("input", { type: "checkbox" }, failWrap);
    const failText = htmlEl("span", {}, failWrap);

    /* Un SVG por diagrama; se muestra el del flujo activo. */
    const diagrams = {};
    Object.entries(data.diagrams).forEach(([key, def]) => {
      const svg = svgEl("svg", { viewBox: "0 0 900 500", class: "diagram", role: "img" }, canvas);
      const edgeLayer = svgEl("g", { class: "edges" }, svg);
      const trailLayer = svgEl("g", { class: "trail" }, svg);
      const nodeLayer = svgEl("g", { class: "nodes" }, svg);
      const packet = svgEl("g", { class: "packet" }, svg);
      svgEl("circle", { r: 15, class: "packet-halo" }, packet);
      svgEl("circle", { r: 6.5, class: "packet-core" }, packet);

      const nodes = {};
      Object.entries(def.nodes).forEach(([id, n]) => {
        const g = svgEl("g", { class: "node" + (n.tone ? " tone-" + n.tone : ""), "data-id": id,
          transform: `translate(${n.x - NODE_W / 2} ${n.y - NODE_H / 2})` }, nodeLayer);
        const body = svgEl("g", { class: "node-body" }, g);
        svgEl("rect", { width: NODE_W, height: NODE_H, rx: 15, class: "node-box" }, body);
        const t1 = svgEl("text", { x: NODE_W / 2, y: 28, class: "node-title", "text-anchor": "middle" }, body);
        const t2 = svgEl("text", { x: NODE_W / 2, y: 47, class: "node-sub", "text-anchor": "middle" }, body);
        nodes[id] = { def: n, g, body, t1, t2 };
      });

      const edges = def.edges.map(([a, b]) => {
        const p1 = border(def.nodes[a], def.nodes[b]);
        const p2 = border(def.nodes[b], def.nodes[a]);
        const line = svgEl("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: "edge" }, edgeLayer);
        return { a, b, line };
      });

      diagrams[key] = { def, svg, trailLayer, packet, nodes, edges };
    });

    const flow = () => data.flows[flowIndex];
    const diagram = () => diagrams[flow().diagram];
    const steps = () => {
      const f = flow();
      if (f.failureStep && failure) return f.steps.slice(0, -1).concat([f.failureStep]);
      return f.steps;
    };

    /* ---------- Textos ---------- */
    function renderText() {
      const lang = opts.lang();
      const t = T();
      tabs.textContent = "";
      data.flows.forEach((f, i) => {
        const b = htmlEl("button", { type: "button", role: "tab", class: "tab", "aria-selected": String(i === flowIndex), text: f.tab[lang] }, tabs);
        b.addEventListener("click", () => selectFlow(i, true));
      });
      Object.values(diagrams).forEach((d) => {
        d.svg.setAttribute("aria-label", t.playerTitle);
        Object.values(d.nodes).forEach((n) => {
          n.t1.textContent = n.def[lang][0];
          n.t2.textContent = n.def[lang][1];
        });
      });
      intro.textContent = flow().intro[lang];
      btnPrev.setAttribute("aria-label", t.prev);
      btnNext.setAttribute("aria-label", t.next);
      failText.textContent = t.failure;
      failWrap.hidden = !flow().failureStep;
      updateCaption(false);
      updatePlayButton();
      renderDots();
    }

    function updateCaption(animate) {
      const lang = opts.lang();
      const t = T();
      const list = steps();
      if (step < 0) {
        stepCount.textContent = "";
        stepText.textContent = t.ready;
      } else {
        stepCount.textContent = t.stepOf.replace("{n}", step + 1).replace("{m}", list.length);
        stepText.textContent = list[step][lang];
      }
      stepBox.classList.toggle("is-fail", step >= 0 && list[step].tone === "fail");
      if (animate && motionOK()) {
        gsap.fromTo(stepBox, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true });
      }
    }

    function renderDots() {
      dots.textContent = "";
      const t = T();
      steps().forEach((s, i) => {
        const d = htmlEl("button", { type: "button", class: "dot" + (i === step ? " is-current" : i < step ? " is-done" : ""),
          "aria-label": t.stepOf.replace("{n}", i + 1).replace("{m}", steps().length) }, dots);
        d.addEventListener("click", () => { pause(); goTo(i, true); });
      });
    }

    function updatePlayButton() {
      const t = T();
      const atEnd = step >= steps().length - 1;
      let label = t.play;
      let icon = "fa-play";
      if (playing) { label = t.pause; icon = "fa-pause"; }
      else if (atEnd) { label = t.replay; icon = "fa-rotate-right"; }
      btnPlay.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i><span>${label}</span>`;
      btnPrev.disabled = step <= 0;
      btnNext.disabled = atEnd;
    }

    /* ---------- Escena ---------- */
    function killRunning() {
      running.forEach((a) => a.kill && a.kill());
      running = [];
      if (pending) {
        if (pending.kill) pending.kill(); else clearTimeout(pending);
        pending = null;
      }
    }

    function clearScene() {
      killRunning();
      Object.values(diagrams).forEach((d) => {
        d.trailLayer.textContent = "";
        Object.values(d.nodes).forEach((n) => {
          n.g.classList.remove("is-lit", "is-visited", "is-dim");
          if (hasGsap) gsap.set(n.body, { clearProps: "transform" });
        });
        d.edges.forEach((e) => e.line.classList.remove("is-dim"));
        d.packet.classList.remove("is-visible", "is-fail", "is-ok");
      });
    }

    function involvedNodes() {
      const set = new Set();
      steps().forEach((s) => {
        if (s.at) set.add(s.at);
        (s.path || []).forEach((id) => set.add(id));
      });
      return set;
    }

    function dimOthers() {
      const keep = involvedNodes();
      const d = diagram();
      Object.entries(d.nodes).forEach(([id, n]) => n.g.classList.toggle("is-dim", !keep.has(id)));
      d.edges.forEach((e) => e.line.classList.toggle("is-dim", !(keep.has(e.a) && keep.has(e.b))));
    }

    /* En pantallas angostas el diagrama se desplaza para seguir la acción. */
    function follow(id) {
      if (stage.scrollWidth <= stage.clientWidth + 4) return;
      const n = diagram().def.nodes[id];
      if (!n) return;
      const x = (n.x / 900) * canvas.clientWidth - stage.clientWidth / 2;
      stage.scrollTo({ left: Math.max(0, x), behavior: motionOK() ? "smooth" : "auto" });
    }

    function light(id) {
      const d = diagram();
      Object.values(d.nodes).forEach((n) => n.g.classList.remove("is-lit"));
      if (d.nodes[id]) {
        d.nodes[id].g.classList.add("is-lit", "is-visited");
        follow(id);
      }
    }

    function pulse(id) {
      const n = diagram().nodes[id];
      if (!n || !motionOK()) return;
      running.push(gsap.fromTo(n.body, { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.out", transformOrigin: "50% 50%" }));
    }

    function placePacket(p) {
      const pk = diagram().packet;
      pk.classList.add("is-visible");
      if (hasGsap) gsap.set(pk, { x: p.x, y: p.y });
      else pk.setAttribute("transform", `translate(${p.x} ${p.y})`);
    }

    /* Aplica un paso. Devuelve cuántos segundos dura su animación. */
    function applyStep(i, animate) {
      const s = steps()[i];
      const d = diagram();
      const defs = d.def.nodes;
      const tone = s.tone || "";
      d.packet.classList.toggle("is-fail", tone === "fail");
      d.packet.classList.toggle("is-ok", tone === "ok");

      if (s.at) {
        light(s.at);
        placePacket(defs[s.at]);
        if (animate) pulse(s.at);
        return animate ? 0.4 : 0;
      }

      const tl = animate ? gsap.timeline() : null;
      let total = 0;
      for (let k = 0; k < s.path.length - 1; k++) {
        const a = s.path[k];
        const b = s.path[k + 1];
        const p1 = border(defs[a], defs[b]);
        const p2 = border(defs[b], defs[a]);
        const line = svgEl("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: "trail-line" + (tone ? " tone-" + tone : "") }, d.trailLayer);
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        d.nodes[a].g.classList.add("is-visited");
        if (animate) {
          const dur = Math.min(1.1, Math.max(0.35, len / 520));
          line.style.strokeDasharray = len;
          line.style.strokeDashoffset = len;
          tl.call(() => light(a));
          tl.set(d.packet, { x: p1.x, y: p1.y });
          tl.to(line, {
            strokeDashoffset: 0, duration: dur, ease: "power1.inOut",
            /* La línea de falla queda punteada al terminar de dibujarse. */
            onComplete: () => { if (tone === "fail") { line.style.strokeDasharray = ""; line.style.strokeDashoffset = ""; } }
          }, ">");
          tl.to(d.packet, { x: p2.x, y: p2.y, duration: dur, ease: "power1.inOut" }, "<");
          tl.call(() => { light(b); pulse(b); });
          total += dur;
        }
      }
      const last = s.path[s.path.length - 1];
      if (!animate) {
        light(last);
        placePacket(border(defs[last], defs[s.path[s.path.length - 2]]));
      } else {
        d.packet.classList.add("is-visible");
        running.push(tl);
      }
      return total;
    }

    /* Deja la escena lista hasta el paso i y anima ese paso. */
    function goTo(i, animate) {
      const list = steps();
      if (i < 0 || i >= list.length) return 0;
      clearScene();
      dimOthers();
      for (let k = 0; k < i; k++) applyStep(k, false);
      step = i;
      const dur = applyStep(i, animate && motionOK());
      updateCaption(true);
      renderDots();
      updatePlayButton();
      return dur;
    }

    function schedule(fn, seconds) {
      if (hasGsap) pending = gsap.delayedCall(seconds, fn);
      else pending = setTimeout(fn, seconds * 1000);
    }

    function advance() {
      const list = steps();
      if (step >= list.length - 1) { pause(); return; }
      const dur = goTo(step + 1, true);
      const hold = 1.3 + words(list[step][opts.lang()]) * 0.22;
      schedule(() => { pending = null; if (playing) advance(); }, dur + hold);
    }

    function play() {
      if (step >= steps().length - 1) step = -1;
      playing = true;
      updatePlayButton();
      advance();
    }

    function pause() {
      playing = false;
      if (pending) {
        if (pending.kill) pending.kill(); else clearTimeout(pending);
        pending = null;
      }
      updatePlayButton();
    }

    function reset() {
      pause();
      clearScene();
      step = -1;
      updateCaption(false);
      renderDots();
      updatePlayButton();
    }

    function selectFlow(i, autoplay) {
      if (i === flowIndex && step >= 0 && !autoplay) return;
      const previous = diagram();
      flowIndex = i;
      failure = false;
      failInput.checked = false;
      reset();
      Object.values(diagrams).forEach((d) => d.svg.classList.toggle("is-active", d === diagram()));
      if (motionOK() && previous !== diagram()) {
        gsap.fromTo(diagram().svg, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" });
      }
      renderText();
      if (autoplay && motionOK()) play();
    }

    /* ---------- Eventos ---------- */
    btnPlay.addEventListener("click", () => (playing ? pause() : play()));
    btnPrev.addEventListener("click", () => { pause(); goTo(step - 1, true); });
    btnNext.addEventListener("click", () => { pause(); goTo(step + 1, true); });
    failInput.addEventListener("change", () => {
      failure = failInput.checked;
      reset();
      play();
    });

    /* Arranca solo cuando el diagrama entra en pantalla; se pausa si sale. */
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started && motionOK()) {
          started = true;
          play();
        } else if (!e.isIntersecting && playing) {
          pause();
        }
      });
    }, { threshold: 0.45 });
    io.observe(stage);

    diagrams[flow().diagram].svg.classList.add("is-active");
    renderText();

    return {
      refresh: renderText,
      pause,
      restartObserver() { started = false; },
      /* Muestra un flujo por id y lo reproduce; lo usan la terminal y la paleta de comandos. */
      showFlow(id, withFailure) {
        const i = data.flows.findIndex((f) => f.id === id);
        if (i < 0) return;
        started = true;
        if (i !== flowIndex) selectFlow(i, false);
        failure = Boolean(withFailure && flow().failureStep);
        failInput.checked = failure;
        reset();
        play();
      }
    };
  }

  window.Player = { init };
})();
