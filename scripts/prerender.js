/* Escribe el contenido en inglés directamente en index.html (para agentes de IA y buscadores que
   no ejecutan JavaScript) y genera cv.md, cv.es.md, resume.json y llms.txt.
   La única fuente de texto es assets/js/content.js.

   Correr después de cambiar cualquier texto:   node scripts/prerender.js   */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const URL = "https://camiloquinteror92.github.io/hoja-de-vida/";
const UPDATED = "2026-09-23";

global.window = {};
require(path.join(ROOT, "assets", "js", "content.js"));
const S = window.SITE;

/* Fechas en formato máquina para JSON Resume; el texto visible de las fechas vive en content.js. */
const ISO = {
  "OWLY SAS": ["2025-10", null],
  "MO Technologies": ["2023-11", "2025-09"],
  "INVIAS": ["2023-01", "2023-10"],
  "Veci": ["2018-03", "2022-10"],
  "Authentic Trust": ["2015-07", "2016-06"],
  "Corpbanca Investment Banking": ["2014-06", "2015-01"]
};
const FAIL_LABEL = { en: "If the new version fails:", es: "Si la versión nueva falla:" };
const PORTFOLIO_LABEL = { en: "Portfolio", es: "Portafolio" };

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fill(html, name, content) {
  const open = `<!--pre:${name}-->`;
  const close = `<!--/pre:${name}-->`;
  const i = html.indexOf(open);
  const j = html.indexOf(close);
  if (i === -1 || j === -1 || j < i) throw new Error(`Falta el marcador ${name} en index.html`);
  return html.slice(0, i + open.length) + content + html.slice(j);
}

/* ---------- Bloques HTML: mismo marcado que pinta app.js ---------- */
function htmlBlocks(lang) {
  const cv = S.cv[lang];
  const p = S.portfolio[lang];
  return {
    about: esc(cv.about),
    experience: cv.experience.map((job) =>
      `<article class="job"><div class="job-head"><h3 class="job-role">${esc(job.role)}</h3><p class="job-dates">${esc(job.dates)}</p></div>` +
      `<p class="job-org">${esc(job.org)}</p><p class="job-context">${esc(job.context)}</p>` +
      `<ul class="job-bullets">${job.bullets.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join(""),
    earlier: cv.earlier.map((e) =>
      `<article class="early"><div class="job-head"><h3 class="job-role">${esc(e.org + ", " + e.role)}</h3><p class="job-dates">${esc(e.dates)}</p></div>` +
      `<p class="early-text">${esc(e.text)}</p></article>`).join(""),
    skills: cv.skills.map((g) =>
      `<div class="skill-group"><h3 class="skill-name">${esc(g.name)}</h3><ul class="chips">` +
      `${g.items.map((s) => `<li class="chip">${esc(s)}</li>`).join("")}</ul></div>`).join(""),
    education: cv.education.map((e) =>
      `<article class="edu"><div class="job-head"><h3 class="job-role">${esc(e.title)}</h3><p class="job-dates">${esc(e.dates)}</p></div>` +
      `<p class="job-org">${esc(e.org)}</p></article>`).join(""),
    languages: esc(cv.languages),
    pfLead: esc(p.lead),
    pfNote: esc(p.note),
    pfHint: esc(p.playerHint),
    pfClosing: esc(p.closingLead),
    cases: p.cases.map((c) =>
      `<article class="case"><p class="case-tag">${esc(c.tag)}</p><h3 class="case-title">${esc(c.title)}</h3><dl class="case-body">` +
      `<dt>${esc(p.problem)}</dt><dd>${esc(c.problem)}</dd><dt>${esc(p.did)}</dt><dd>${esc(c.did)}</dd>` +
      `<dt>${esc(p.result)}</dt><dd class="case-result">${esc(c.result)}</dd></dl></article>`).join(""),
    /* Versión en texto del diagrama: la leen los agentes; con JavaScript se reemplaza por el diagrama. */
    flows: `<div class="player-text">` + S.player.flows.map((f) =>
      `<h3>${esc(f.tab[lang])}</h3><p>${esc(f.intro[lang])}</p><ol>${f.steps.map((s) => `<li>${esc(s[lang])}</li>`).join("")}</ol>` +
      (f.failureStep ? `<p>${esc(FAIL_LABEL[lang])} ${esc(f.failureStep[lang])}</p>` : "")).join("") + `</div>`
  };
}

/* ---------- Ficha estructurada para Google y agentes (schema.org) ---------- */
function jsonLd() {
  const cv = S.cv.en;
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: URL,
    dateModified: UPDATED,
    mainEntity: {
      "@type": "Person",
      name: "Camilo Quintero Rodríguez",
      alternateName: "Camilo Quintero",
      jobTitle: "Senior Backend Engineer",
      description: cv.about,
      url: URL,
      email: "mailto:camiloquinteror@outlook.com",
      address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
      worksFor: { "@type": "Organization", name: "OWLY SAS" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Pontificia Universidad Javeriana" },
      knowsAbout: cv.skills.flatMap((g) => g.items),
      knowsLanguage: ["es", "en"],
      sameAs: ["https://www.linkedin.com/in/camilo-quinteror/", "https://github.com/camiloquinteror92"]
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

/* ---------- Hoja de vida en Markdown ---------- */
function markdown(lang) {
  const u = S.ui[lang];
  const cv = S.cv[lang];
  const p = S.portfolio[lang];
  const L = [];
  L.push("# Camilo Quintero Rodríguez", "");
  L.push(`**${u.heroTitle}**. ${u.heroStack}.`, "", u.availability, "");
  L.push(
    "- Email: camiloquinteror@outlook.com",
    "- LinkedIn: https://www.linkedin.com/in/camilo-quinteror/",
    "- GitHub: https://github.com/camiloquinteror92",
    `- ${PORTFOLIO_LABEL[lang]}: ${URL}${lang === "es" ? "?lang=es" : ""}#portfolio`,
    ""
  );
  L.push(`## ${u.aboutTitle}`, "", cv.about, "");
  L.push(`## ${u.experienceTitle}`, "");
  cv.experience.forEach((j) => {
    L.push(`### ${j.role}, ${j.org} (${j.dates})`, "", `_${j.context}_`, "");
    j.bullets.forEach((x) => L.push(`- ${x}`));
    L.push("");
  });
  L.push(`## ${u.earlierTitle}`, "");
  cv.earlier.forEach((e) => L.push(`- **${e.org}, ${e.role}** (${e.dates}): ${e.text}`));
  L.push("", `## ${u.skillsTitle}`, "");
  cv.skills.forEach((g) => L.push(`- **${g.name}:** ${g.items.join(", ")}`));
  L.push("", `## ${u.educationTitle}`, "");
  cv.education.forEach((e) => L.push(`- **${e.title}**, ${e.org} (${e.dates})`));
  L.push("", `**${u.languagesLabel}:** ${cv.languages}`, "");
  L.push(`## ${p.title}`, "", p.lead, "", p.note, "", `### ${p.playerTitle}`, "");
  S.player.flows.forEach((f) => {
    L.push(`#### ${f.tab[lang]}`, "", f.intro[lang], "");
    f.steps.forEach((s, i) => L.push(`${i + 1}. ${s[lang]}`));
    if (f.failureStep) L.push("", `${FAIL_LABEL[lang]} ${f.failureStep[lang]}`);
    L.push("");
  });
  L.push(`### ${p.casesTitle}`, "");
  p.cases.forEach((c) => {
    L.push(`#### ${c.title} (${c.tag})`, "",
      `- **${p.problem}:** ${c.problem}`, `- **${p.did}:** ${c.did}`, `- **${p.result}:** ${c.result}`, "");
  });
  return L.join("\n");
}

/* ---------- JSON Resume (jsonresume.org) ---------- */
function resume() {
  const cv = S.cv.en;
  const p = S.portfolio.en;
  const dates = (org) => {
    const [start, end] = ISO[org] || [];
    if (!start) throw new Error(`Falta la fecha ISO de ${org} en scripts/prerender.js`);
    return end ? { startDate: start, endDate: end } : { startDate: start };
  };
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: "Camilo Quintero Rodríguez",
      label: "Senior Backend Engineer",
      email: "camiloquinteror@outlook.com",
      phone: "+57 311 647 1257",
      url: URL,
      summary: cv.about,
      location: { city: "Bogotá", countryCode: "CO" },
      profiles: [
        { network: "LinkedIn", username: "camilo-quinteror", url: "https://www.linkedin.com/in/camilo-quinteror/" },
        { network: "GitHub", username: "camiloquinteror92", url: "https://github.com/camiloquinteror92" }
      ]
    },
    work: cv.experience.map((j) => ({ name: j.org, position: j.role, ...dates(j.org), summary: j.context, highlights: j.bullets }))
      .concat(cv.earlier.map((e) => ({ name: e.org, position: e.role, ...dates(e.org), summary: e.text }))),
    education: [
      { institution: "Pontificia Universidad Javeriana", area: "Economics", studyType: "Bachelor", startDate: "2010", endDate: "2015" },
      { institution: "Platzi", area: "Python, Django, AWS and frontend development", studyType: "Continuing education", startDate: "2022" }
    ],
    skills: cv.skills.map((g) => ({ name: g.name, keywords: g.items })),
    languages: [
      { language: "Spanish", fluency: "Native speaker" },
      { language: "English", fluency: "Professional working proficiency" }
    ],
    projects: [{
      name: "Owly CRM",
      description: p.lead,
      url: URL + "#portfolio",
      highlights: p.cases.map((c) => `${c.title}: ${c.result}`)
    }],
    meta: { canonical: URL + "resume.json", version: "v1.0.0", lastModified: UPDATED }
  };
}

/* ---------- llms.txt (llmstxt.org) ---------- */
function llms() {
  return [
    "# Camilo Quintero Rodríguez",
    "",
    "> Senior backend engineer and CTO in Bogotá, Colombia (remote, UTC−5). Builds multi-tenant SaaS on AWS with Python and Django. Built Owly CRM, a sales platform for real-estate developers, from the first commit to production. Economist and former investment analyst. Open to senior backend roles, remote, full-time or contract.",
    "",
    "Contact: camiloquinteror@outlook.com. LinkedIn: https://www.linkedin.com/in/camilo-quinteror/",
    "",
    "## CV",
    "",
    `- [CV in Markdown](${URL}cv.md): full CV in English, including the Owly CRM case study`,
    `- [CV en Markdown (español)](${URL}cv.es.md): la misma hoja de vida en español`,
    `- [JSON Resume](${URL}resume.json): machine-readable CV (jsonresume.org schema)`,
    `- [CV PDF, English](${URL}CV-Camilo-Quintero-EN.pdf)`,
    `- [CV PDF, español](${URL}CV-Camilo-Quintero.pdf)`,
    "",
    "## Portfolio",
    "",
    `- [Owly CRM case study](${URL}#portfolio): interactive walkthrough of the architecture (a request, real time, integrations, a deploy) and four problems solved`,
    "",
    "## Optional",
    "",
    "- [GitHub profile](https://github.com/camiloquinteror92)",
    ""
  ].join("\n");
}

/* ---------- Escribir ---------- */
const indexPath = path.join(ROOT, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
const blocks = htmlBlocks("en");
Object.entries(blocks).forEach(([name, content]) => { html = fill(html, name, content); });
html = fill(html, "jsonld", jsonLd());
fs.writeFileSync(indexPath, html, "utf8");

const out = {
  "cv.md": markdown("en"),
  "cv.es.md": markdown("es"),
  "resume.json": JSON.stringify(resume(), null, 2) + "\n",
  "llms.txt": llms()
};
Object.entries(out).forEach(([file, text]) => fs.writeFileSync(path.join(ROOT, file), text, "utf8"));

console.log("index.html: " + Object.keys(blocks).length + " bloques + JSON-LD");
Object.entries(out).forEach(([file, text]) => console.log(`${file}: ${text.length} caracteres`));
