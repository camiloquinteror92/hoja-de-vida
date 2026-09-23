/* Contenido del sitio en inglés y español. Todo el texto visible sale de aquí. */
window.SITE = {
  ui: {
    en: {
      htmlLang: "en",
      navCv: "CV",
      navPortfolio: "Portfolio",
      langBtn: "Español",
      langLabel: "Ver en español",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme",
      titleCv: "Camilo Quintero, Senior Backend Engineer",
      titlePortfolio: "Owly CRM case study, Camilo Quintero",
      heroTitle: "Senior Backend Engineer",
      heroStack: "Python, Django and AWS",
      heroLine: "I build multi-tenant SaaS on AWS, from the data model to the deploy.",
      availability: "Bogotá, Colombia. Remote, UTC−5. Open to full-time or contract roles.",
      ctaPortfolio: "See how I built Owly CRM",
      ctaDownload: "Download CV (PDF)",
      cvPdf: "CV-Camilo-Quintero-EN.pdf",
      aboutTitle: "About",
      experienceTitle: "Experience",
      earlierTitle: "Before engineering: founder and finance",
      skillsTitle: "Skills",
      educationTitle: "Education and languages",
      languagesLabel: "Languages",
      contactTitle: "Contact",
      contactLead: "Email is the fastest way to reach me.",
      phone: "Phone",
      fitTitle: "Hiring for a role?",
      fitLead: "Paste the job description, or type the skills you need, and see what I have done for each one.",
      fitCta: "Check the fit with your role",
      backToTop: "Back to top",
      updated: "Updated September 2026",
      machineLabel: "For AI agents and applicant tracking systems:"
    },
    es: {
      htmlLang: "es",
      navCv: "Hoja de vida",
      navPortfolio: "Portafolio",
      langBtn: "English",
      langLabel: "View in English",
      themeToDark: "Cambiar a tema oscuro",
      themeToLight: "Cambiar a tema claro",
      titleCv: "Camilo Quintero, Ingeniero Backend Senior",
      titlePortfolio: "Caso de estudio de Owly CRM, Camilo Quintero",
      heroTitle: "Ingeniero Backend Senior",
      heroStack: "Python, Django y AWS",
      heroLine: "Construyo SaaS multi-tenant en AWS, del modelo de datos al deploy.",
      availability: "Bogotá, Colombia. Remoto, UTC−5. Disponible para tiempo completo o por contrato.",
      ctaPortfolio: "Mira cómo construí Owly CRM",
      ctaDownload: "Descargar hoja de vida (PDF)",
      cvPdf: "CV-Camilo-Quintero.pdf",
      aboutTitle: "Perfil",
      experienceTitle: "Experiencia",
      earlierTitle: "Antes de la ingeniería: emprendimiento y finanzas",
      skillsTitle: "Habilidades",
      educationTitle: "Educación e idiomas",
      languagesLabel: "Idiomas",
      contactTitle: "Contacto",
      contactLead: "El correo es la forma más rápida de contactarme.",
      phone: "Teléfono",
      fitTitle: "¿Estás contratando?",
      fitLead: "Pega la descripción de la vacante, o escribe las habilidades que buscas, y mira qué he hecho en cada una.",
      fitCta: "Revisa si encajo con tu vacante",
      backToTop: "Volver arriba",
      updated: "Actualizado en septiembre de 2026",
      machineLabel: "Para agentes de IA y sistemas de reclutamiento:"
    }
  },

  cv: {
    en: {
      about: "Backend engineer and CTO who builds multi-tenant SaaS on AWS. I built Owly CRM, a sales platform used by Colombian real-estate developers, from the first commit to production: Django and PostgreSQL at the core, real-time features over WebSockets, integrations with a construction ERP and a mortgage bank, and applied AI. Before that, I spent two years building lending software as a backend engineer. I'm an economist and a former investment analyst, so I build for the business outcome, not just the ticket.",
      experience: [
        {
          org: "OWLY SAS",
          role: "Chief Technology Officer",
          dates: "Oct 2025 – Present",
          context: "Multi-tenant CRM SaaS for real-estate developers, Bogotá",
          bullets: [
            "Architected and built Owly CRM from zero: Django 4.2 and DRF, PostgreSQL 16, Redis and Celery across 40 modular apps, with a React and TypeScript frontend. Shipped the first production deploy on AWS in three days.",
            "Designed tenant isolation for every customer's data: a tenant-aware base model and a scoped API layer, enforced by a CI check that fails the build if any endpoint ships without tenant scoping.",
            "Built zero-downtime deployments on ECS Fargate: migrations run before new tasks take traffic, failed deploys roll back automatically, and a CI gate blocks backward-incompatible schema changes (expand/contract).",
            "Integrated SINCO, a construction ERP (154 endpoints, two-way sync of units, sales and payments), and Davivienda's mortgage platform (mutual TLS, AES-GCM payload encryption, OAuth, plus an inbound API for the bank's presale results).",
            "Replaced 5-second polling (12 requests per minute per open tab) with WebSockets, using Django Channels and Redis, for notifications and internal chat.",
            "Cut the heaviest list views from about 17 s to under 1 s: removed N+1 queries, paginated by ID and fixed Postgres planner traps (JIT on annotated EXISTS, an unnecessary DISTINCT).",
            "Shipped ML lead scoring (scikit-learn), LLM and voice agents (Claude, OpenAI, ElevenLabs) exposed over MCP, and the financial engines behind quotes: tiered commissions, discounts and housing-subsidy eligibility."
          ]
        },
        {
          org: "MO Technologies",
          role: "Backend Developer II",
          dates: "Nov 2023 – Sep 2025",
          context: "Credit-management platform: loans, payments and user administration · Promoted from Backend Developer in Sep 2024",
          bullets: [
            "Built and maintained Python and Django microservices on AWS (S3, EC2, Lambda) with PostgreSQL, Docker and GitLab CI/CD.",
            "On the credit core for a Colombian digital bank, caught an interest-capitalization defect (interest charged on unpaid interest, which is illegal in Colombia) that an external compliance review had missed. I escalated it with the numbers, and it was fixed before launch with zero customers affected."
          ]
        },
        {
          org: "INVIAS",
          role: "Python Developer",
          dates: "Jan 2023 – Oct 2023",
          context: "Colombia's National Roads Institute",
          bullets: [
            "Built a Flask reporting tool that ingests an external JSON API and exports filtered reports to PDF and CSV."
          ]
        }
      ],
      earlier: [
        { org: "Veci", role: "Co-founder and CEO", dates: "2018 – 2022", text: "App-based neighborhood commerce. COP 100M in sales in the first 8 months, backed by iNNpulsa, Colombia's innovation agency. I also co-founded Fit your Food and A la Casa." },
        { org: "Authentic Trust", role: "Co-founder and CEO", dates: "2015 – 2016", text: "Real-estate project structuring: valuation and debt." },
        { org: "Corpbanca Investment Banking", role: "Investment Analyst", dates: "2014 – 2015", text: "Financial models, due diligence and investment-committee presentations." }
      ],
      skills: [
        { name: "Backend", items: ["Python", "Django", "Django REST Framework", "Celery", "Django Channels", "REST API design", "pytest"] },
        { name: "Data", items: ["PostgreSQL", "Query tuning", "pgvector", "Redis", "PgBouncer"] },
        { name: "Cloud and DevOps", items: ["AWS ECS Fargate", "RDS", "ElastiCache", "S3", "CloudFront", "SES", "Secrets Manager", "CodePipeline", "Terraform", "Docker", "CI/CD"] },
        { name: "Frontend", items: ["React", "TypeScript"] },
        { name: "AI and ML", items: ["LLM agents (Claude, OpenAI)", "MCP", "Voice agents (ElevenLabs)", "scikit-learn"] },
        { name: "Domain", items: ["Lending and fintech", "ERP and banking integrations", "Financial modeling"] }
      ],
      education: [
        { title: "B.A. in Economics", org: "Pontificia Universidad Javeriana, Bogotá", dates: "2010 – 2015" },
        { title: "Continuing education in Python, Django, AWS and frontend", org: "Platzi", dates: "2022 – Present" }
      ],
      languages: "Spanish (native) and English (professional working proficiency)"
    },
    es: {
      about: "Ingeniero backend y CTO que construye SaaS multi-tenant en AWS. Construí Owly CRM, una plataforma de ventas que usan constructoras colombianas, desde el primer commit hasta producción: Django y PostgreSQL en el núcleo, funciones en tiempo real con WebSockets, integraciones con un ERP de construcción y con un banco hipotecario, e IA aplicada. Antes pasé dos años construyendo software de crédito como ingeniero backend. Soy economista y fui analista de inversiones, así que construyo pensando en el resultado de negocio, no solo en el ticket.",
      experience: [
        {
          org: "OWLY SAS",
          role: "Gerente de Tecnología (CTO)",
          dates: "oct 2025 – actualidad",
          context: "SaaS multi-tenant de CRM para constructoras, Bogotá",
          bullets: [
            "Diseñé y construí Owly CRM desde cero: Django 4.2 y DRF, PostgreSQL 16, Redis y Celery en 40 apps modulares, con frontend en React y TypeScript. Primer deploy a producción en AWS en tres días.",
            "Diseñé el aislamiento de los datos de cada cliente: un modelo base por empresa y una capa de API filtrada, con un chequeo de CI que rompe el build si algún endpoint sale sin filtro por empresa.",
            "Construí despliegues sin caídas en ECS Fargate: las migraciones corren antes de que las tareas nuevas reciban tráfico, un deploy fallido se revierte solo y un gate de CI bloquea cambios de esquema incompatibles (expand/contract).",
            "Integré SINCO, un ERP de construcción (154 endpoints, sincronización en ambos sentidos de unidades, ventas y pagos), y la plataforma hipotecaria de Davivienda (TLS mutuo, cifrado AES-GCM, OAuth y una API de entrada para los resultados de preventa del banco).",
            "Reemplacé el polling cada 5 segundos (12 peticiones por minuto por pestaña abierta) por WebSockets, con Django Channels y Redis, para notificaciones y chat interno.",
            "Bajé las vistas de listado más pesadas de unos 17 s a menos de 1 s: eliminé consultas N+1, paginé por ID y corregí trampas del planificador de Postgres (JIT con EXISTS anotados, un DISTINCT innecesario).",
            "Entregué scoring de leads con ML (scikit-learn), agentes de IA y de voz (Claude, OpenAI, ElevenLabs) expuestos por MCP, y los motores financieros de las cotizaciones: comisiones por niveles, descuentos y elegibilidad a subsidios de vivienda."
          ]
        },
        {
          org: "MO Technologies",
          role: "Backend Developer II",
          dates: "nov 2023 – sep 2025",
          context: "Plataforma de gestión de crédito: préstamos, pagos y administración de usuarios · Ascendido desde Backend Developer en sep 2024",
          bullets: [
            "Construí y mantuve microservicios en Python y Django sobre AWS (S3, EC2, Lambda) con PostgreSQL, Docker y CI/CD en GitLab.",
            "En el core de crédito de un banco digital colombiano detecté un error de capitalización de intereses (cobrar intereses sobre intereses no pagados, algo ilegal en Colombia) que una revisión externa de cumplimiento no había visto. Lo escalé con los números y se corrigió antes del lanzamiento, sin ningún cliente afectado."
          ]
        },
        {
          org: "INVIAS",
          role: "Desarrollador Python",
          dates: "ene 2023 – oct 2023",
          context: "Instituto Nacional de Vías",
          bullets: [
            "Construí una herramienta de reportes en Flask que consume una API externa en JSON y exporta reportes filtrados a PDF y CSV."
          ]
        }
      ],
      earlier: [
        { org: "Veci", role: "Cofundador y CEO", dates: "2018 – 2022", text: "Comercio de barrio apoyado en una app. COP 100 millones en ventas en los primeros 8 meses, con apoyo de iNNpulsa Colombia. También cofundé Fit your Food y A la Casa." },
        { org: "Authentic Trust", role: "Cofundador y CEO", dates: "2015 – 2016", text: "Estructuración de proyectos inmobiliarios: valoración y deuda." },
        { org: "Corpbanca Banca de Inversión", role: "Analista de inversiones", dates: "2014 – 2015", text: "Modelos financieros, due diligence y presentaciones a comités de inversión." }
      ],
      skills: [
        { name: "Backend", items: ["Python", "Django", "Django REST Framework", "Celery", "Django Channels", "Diseño de APIs REST", "pytest"] },
        { name: "Datos", items: ["PostgreSQL", "Optimización de consultas", "pgvector", "Redis", "PgBouncer"] },
        { name: "Nube y DevOps", items: ["AWS ECS Fargate", "RDS", "ElastiCache", "S3", "CloudFront", "SES", "Secrets Manager", "CodePipeline", "Terraform", "Docker", "CI/CD"] },
        { name: "Frontend", items: ["React", "TypeScript"] },
        { name: "IA y ML", items: ["Agentes con LLM (Claude, OpenAI)", "MCP", "Agentes de voz (ElevenLabs)", "scikit-learn"] },
        { name: "Dominio", items: ["Crédito y fintech", "Integraciones con ERP y banca", "Modelación financiera"] }
      ],
      education: [
        { title: "Economista", org: "Pontificia Universidad Javeriana, Bogotá", dates: "2010 – 2015" },
        { title: "Formación continua en Python, Django, AWS y frontend", org: "Platzi", dates: "2022 – actualidad" }
      ],
      languages: "Español (nativo) e inglés (nivel profesional)"
    }
  },

  portfolio: {
    en: {
      title: "Owly CRM, from the first commit to production",
      lead: "A multi-tenant sales platform used by real-estate developers in Colombia. I designed and built it as CTO. Below is how it works inside, and four problems I solved along the way.",
      note: "The code is private, so this page stays at the level of a conference talk: how the pieces fit, not the source.",
      playerTitle: "How it works inside",
      playerHint: "Pick a flow and press play, or go step by step.",
      play: "Play",
      pause: "Pause",
      replay: "Replay",
      prev: "Previous step",
      next: "Next step",
      stepOf: "Step {n} of {m}",
      ready: "Press play to watch it run.",
      failure: "Simulate a failed deploy",
      casesTitle: "Four problems I solved",
      problem: "The problem",
      did: "What I did",
      result: "Result",
      closingTitle: "Want to know if I fit your role?",
      closingLead: "Paste your job description, or type the skills you need, and get an honest answer in two seconds.",
      cases: [
        {
          tag: "Performance",
          title: "From about 17 s to under 1 s",
          problem: "The busiest list screens, with filters, took up to 17 seconds to load.",
          did: "Read the query plans instead of guessing. Removed N+1 queries, paginated by ID before loading wide rows, and fixed two Postgres planner traps: JIT triggered by annotated EXISTS, and an unnecessary DISTINCT.",
          result: "Under 1 second on the same data."
        },
        {
          tag: "Reliability",
          title: "Deploys without downtime",
          problem: "A deploy logged every user out in a loop: the new code started before its database migration.",
          did: "Made each new task migrate before serving traffic, required backward-compatible migrations (expand/contract) with a CI gate, turned on automatic rollback, and gave old tasks time to drain.",
          result: "New versions go out without interrupting anyone, and a failed release rolls back on its own."
        },
        {
          tag: "Real time",
          title: "From polling to WebSockets",
          problem: "Notifications and chat asked the server every 5 seconds: 12 requests a minute for every open tab, growing with every new user.",
          did: "Moved both to WebSockets with Django Channels. Redis fans each event out to the company's group, so only the right screens hear about it.",
          result: "That load disappeared, and messages arrive instantly."
        },
        {
          tag: "Fintech, at MO Technologies",
          title: "The bug nobody was looking for",
          problem: "A digital bank's credit core charged interest on unpaid interest, which is illegal in Colombia. An external compliance review had missed it.",
          did: "Spotted it while testing the database, did the math to be sure, took it to the tech lead first, and escalated to the COO with the numbers.",
          result: "Fixed before launch. Zero customers affected."
        }
      ]
    },
    es: {
      title: "Owly CRM, del primer commit a producción",
      lead: "Una plataforma de ventas multi-tenant que usan constructoras en Colombia. La diseñé y la construí como CTO. Abajo está cómo funciona por dentro y cuatro problemas que resolví en el camino.",
      note: "El código es privado, así que esta página se queda al nivel de una charla técnica: cómo encajan las piezas, no el código fuente.",
      playerTitle: "Cómo funciona por dentro",
      playerHint: "Elige un flujo y dale play, o recórrelo paso a paso.",
      play: "Reproducir",
      pause: "Pausar",
      replay: "Repetir",
      prev: "Paso anterior",
      next: "Paso siguiente",
      stepOf: "Paso {n} de {m}",
      ready: "Dale play para verlo funcionar.",
      failure: "Simular un deploy fallido",
      casesTitle: "Cuatro problemas que resolví",
      problem: "El problema",
      did: "Qué hice",
      result: "Resultado",
      closingTitle: "¿Quieres saber si encajo con tu vacante?",
      closingLead: "Pega la descripción de la vacante, o escribe las habilidades que buscas, y en dos segundos tienes una respuesta honesta.",
      cases: [
        {
          tag: "Rendimiento",
          title: "De unos 17 s a menos de 1 s",
          problem: "Las pantallas de listado más usadas, con filtros, tardaban hasta 17 segundos en cargar.",
          did: "Leí los planes de ejecución en vez de adivinar. Eliminé consultas N+1, paginé por ID antes de cargar filas anchas y corregí dos trampas del planificador de Postgres: el JIT que disparaban unos EXISTS anotados y un DISTINCT innecesario.",
          result: "Menos de 1 segundo con los mismos datos."
        },
        {
          tag: "Confiabilidad",
          title: "Deploys sin caídas",
          problem: "Un deploy sacó a todos los usuarios en un bucle: el código nuevo arrancó antes que su migración de base de datos.",
          did: "Hice que cada tarea nueva migre antes de recibir tráfico, exigí migraciones compatibles hacia atrás (expand/contract) con un gate de CI, activé el rollback automático y les di tiempo a las tareas viejas para terminar.",
          result: "Las versiones nuevas salen sin interrumpir a nadie, y una versión fallida se revierte sola."
        },
        {
          tag: "Tiempo real",
          title: "Del polling a WebSockets",
          problem: "Las notificaciones y el chat le preguntaban al servidor cada 5 segundos: 12 peticiones por minuto por cada pestaña abierta, y crecía con cada usuario nuevo.",
          did: "Pasé ambos a WebSockets con Django Channels. Redis reparte cada evento al grupo de la empresa, así solo se enteran las pantallas correctas.",
          result: "Esa carga desapareció y los mensajes llegan al instante."
        },
        {
          tag: "Fintech, en MO Technologies",
          title: "El error que nadie estaba buscando",
          problem: "El core de crédito de un banco digital cobraba intereses sobre intereses no pagados, algo ilegal en Colombia. Una revisión externa de cumplimiento no lo había detectado.",
          did: "Lo vi probando la base de datos, hice las cuentas para estar seguro, lo llevé primero al líder técnico y lo escalé al COO con los números.",
          result: "Se corrigió antes del lanzamiento. Cero clientes afectados."
        }
      ]
    }
  },

  /* Diagrama interactivo. Coordenadas en un viewBox de 900 x 500. */
  player: {
    diagrams: {
      system: {
        nodes: {
          cdn:     { x: 330, y: 80,  en: ["CloudFront + S3", "the web app"],        es: ["CloudFront + S3", "la app web"] },
          ws:      { x: 560, y: 80,  en: ["WebSockets", "Django Channels"],         es: ["WebSockets", "Django Channels"] },
          redis:   { x: 790, y: 80,  en: ["Redis", "queue and pub/sub"],            es: ["Redis", "cola y pub/sub"] },
          browser: { x: 100, y: 250, en: ["Browser", "React + TypeScript"],         es: ["Navegador", "React + TypeScript"] },
          alb:     { x: 330, y: 250, en: ["Load balancer", "health checks"],        es: ["Balanceador", "chequeos de salud"] },
          api:     { x: 560, y: 250, en: ["Django API", "ECS Fargate"],             es: ["API en Django", "ECS Fargate"] },
          celery:  { x: 790, y: 250, en: ["Workers", "Celery on ECS"],              es: ["Workers", "Celery en ECS"] },
          db:      { x: 330, y: 420, en: ["PostgreSQL", "RDS"],                     es: ["PostgreSQL", "RDS"] },
          pgb:     { x: 560, y: 420, en: ["PgBouncer", "connection pool"],          es: ["PgBouncer", "pool de conexiones"] },
          ext:     { x: 790, y: 420, en: ["ERP and bank", "mutual TLS"],            es: ["ERP y banco", "TLS mutuo"] }
        },
        edges: [
          ["browser", "cdn"], ["browser", "alb"], ["browser", "ws"], ["alb", "api"], ["api", "pgb"],
          ["pgb", "db"], ["api", "redis"], ["redis", "ws"], ["redis", "celery"], ["celery", "ext"], ["celery", "pgb"]
        ]
      },
      pipeline: {
        nodes: {
          push:     { x: 110, y: 90,  en: ["Merge to main", "CI gates"],             es: ["Merge a main", "gates de CI"] },
          build:    { x: 335, y: 90,  en: ["Build", "CodePipeline"],                 es: ["Build", "CodePipeline"] },
          image:    { x: 560, y: 90,  en: ["Image", "ECR"],                          es: ["Imagen", "ECR"] },
          tasks:    { x: 790, y: 90,  en: ["New tasks", "next to the old ones"],     es: ["Tareas nuevas", "junto a las viejas"] },
          migrate:  { x: 790, y: 250, en: ["Migrate first", "expand / contract"],    es: ["Primero migra", "expand / contract"] },
          rollback: { x: 560, y: 250, en: ["Rollback", "automatic"],                 es: ["Rollback", "automático"], tone: "fail" },
          health:   { x: 790, y: 410, en: ["Health check", "/api/health/"],          es: ["Chequeo de salud", "/api/health/"] },
          live:     { x: 560, y: 410, en: ["Traffic shifts", "old tasks drain"],     es: ["Cambia el tráfico", "las viejas se apagan"], tone: "ok" }
        },
        edges: [
          ["push", "build"], ["build", "image"], ["image", "tasks"], ["tasks", "migrate"],
          ["migrate", "health"], ["health", "live"], ["health", "rollback"]
        ]
      }
    },
    flows: [
      {
        id: "request",
        diagram: "system",
        tab: { en: "A request", es: "Una petición" },
        intro: { en: "What happens when a salesperson opens their list of leads.", es: "Qué pasa cuando un asesor abre su lista de leads." },
        steps: [
          { path: ["browser", "cdn"], en: "The web app loads from CloudFront and S3, cached close to the user.", es: "La app web carga desde CloudFront y S3, en caché cerca del usuario." },
          { path: ["browser", "alb"], en: "It calls the API with the user's login token.", es: "Llama a la API con el token de sesión del usuario." },
          { path: ["alb", "api"], en: "The load balancer hands the request to a healthy Django container on ECS Fargate.", es: "El balanceador le pasa la petición a un contenedor de Django sano en ECS Fargate." },
          { at: "api", en: "Middleware resolves the user's company, and every query is filtered by it. A CI check fails the build if any endpoint isn't.", es: "Un middleware identifica la empresa del usuario y cada consulta queda filtrada por ella. Un chequeo de CI rompe el build si algún endpoint no lo está." },
          { path: ["api", "pgb"], en: "Queries go through PgBouncer, so hundreds of requests share a few database connections.", es: "Las consultas pasan por PgBouncer, así cientos de peticiones comparten unas pocas conexiones." },
          { path: ["pgb", "db"], en: "PostgreSQL answers. This list used to take about 17 s. After tuning, it takes under 1 s.", es: "PostgreSQL responde. Esta lista tardaba unos 17 s. Después de optimizarla, menos de 1 s." },
          { path: ["db", "pgb", "api", "alb", "browser"], en: "The JSON goes back and the list renders.", es: "El JSON vuelve y la lista aparece en pantalla." }
        ]
      },
      {
        id: "realtime",
        diagram: "system",
        tab: { en: "Real time", es: "Tiempo real" },
        intro: { en: "Before, every open tab asked the server “anything new?” every 5 seconds: 12 requests a minute, per tab.", es: "Antes, cada pestaña abierta le preguntaba al servidor “¿hay algo nuevo?” cada 5 segundos: 12 peticiones por minuto, por pestaña." },
        steps: [
          { path: ["browser", "ws"], en: "When the app opens, it keeps one WebSocket connection open.", es: "Al abrir la app, queda abierta una sola conexión WebSocket." },
          { at: "api", en: "Something happens: a customer replies on WhatsApp, or a colleague updates a quote.", es: "Pasa algo: un cliente responde por WhatsApp o un colega actualiza una cotización." },
          { path: ["api", "redis"], en: "Django publishes the event to that company's group in Redis.", es: "Django publica el evento en el grupo de esa empresa en Redis." },
          { path: ["redis", "ws"], en: "Every WebSocket server subscribed to the group receives it.", es: "Cada servidor de WebSockets suscrito al grupo lo recibe." },
          { path: ["ws", "browser"], en: "Every open screen of that company updates at once. No more polling.", es: "Todas las pantallas abiertas de esa empresa se actualizan al instante. Se acabó el polling." }
        ]
      },
      {
        id: "integrations",
        diagram: "system",
        tab: { en: "Integrations", es: "Integraciones" },
        intro: { en: "Talking to outside systems without making anyone wait.", es: "Hablar con sistemas externos sin hacer esperar a nadie." },
        steps: [
          { path: ["browser", "alb", "api"], en: "A salesperson sends a buyer's application to the mortgage bank.", es: "Un asesor envía la solicitud de un comprador al banco hipotecario." },
          { path: ["api", "redis"], en: "Django puts the job on a queue, so the screen never waits on an outside system.", es: "Django pone el trabajo en una cola, así la pantalla nunca espera a un sistema externo." },
          { path: ["redis", "celery"], en: "A Celery worker picks it up.", es: "Un worker de Celery lo toma." },
          { path: ["celery", "ext"], en: "It calls the bank over mutual TLS with AES-GCM encrypted payloads, or the construction ERP: 154 endpoints, synced both ways.", es: "Llama al banco con TLS mutuo y datos cifrados con AES-GCM, o al ERP de construcción: 154 endpoints, sincronizados en ambos sentidos." },
          { path: ["ext", "celery", "pgb", "db"], en: "The answer is saved, filtered by the right company.", es: "La respuesta se guarda, filtrada por la empresa correcta." },
          { path: ["celery", "redis", "ws", "browser"], en: "The worker publishes the update, and the salesperson sees it live.", es: "El worker publica la novedad y el asesor la ve en vivo." }
        ]
      },
      {
        id: "deploy",
        diagram: "pipeline",
        tab: { en: "A deploy", es: "Un deploy" },
        intro: { en: "Why this exists: a deploy once logged everyone out in a loop, because new code ran before its database migration.", es: "Por qué existe: un deploy sacó a todos los usuarios en un bucle, porque el código nuevo corrió antes que su migración." },
        steps: [
          { at: "push", en: "A merge to main starts the pipeline. A CI gate blocks any migration that would break the version still running.", es: "Un merge a main arranca el pipeline. Un gate de CI bloquea cualquier migración que rompería la versión que sigue corriendo." },
          { path: ["push", "build"], en: "CodePipeline builds and tests.", es: "CodePipeline construye y prueba." },
          { path: ["build", "image"], en: "The Docker image goes to ECR.", es: "La imagen de Docker queda en ECR." },
          { path: ["image", "tasks"], en: "ECS starts new tasks next to the old ones. Nobody is logged out.", es: "ECS arranca tareas nuevas junto a las viejas. Nadie pierde su sesión." },
          { path: ["tasks", "migrate"], en: "Each new task migrates the database before it serves a single request.", es: "Cada tarea nueva migra la base de datos antes de atender una sola petición." },
          { path: ["migrate", "health"], en: "The load balancer waits for the health check to pass.", es: "El balanceador espera a que pase el chequeo de salud." },
          { path: ["health", "live"], tone: "ok", en: "Traffic shifts. The old tasks finish their open requests and shut down.", es: "El tráfico cambia. Las tareas viejas terminan lo que tenían abierto y se apagan." }
        ],
        failureStep: { path: ["health", "rollback"], tone: "fail", en: "The health check fails, so the circuit breaker rolls back on its own. Users keep working on the previous version.", es: "El chequeo falla, así que el circuit breaker hace rollback solo. Los usuarios siguen trabajando en la versión anterior." }
      }
    ]
  },

  matcher: {
    ui: {
      en: {
        title: "Check the fit with your role",
        lead: "Paste a job description, or type the skills you need. For each one you'll see what I've actually done, and I'll be upfront about what I haven't.",
        placeholder: "Paste a job description, or type skills separated by commas: Python, AWS, fintech…",
        chipsLabel: "Try one:",
        chips: ["Python", "AWS", "Fintech", "Real time", "AI", "Leadership", "Kubernetes"],
        sample: "Try a full job description",
        analyze: "Check the fit",
        privacy: "This runs entirely in your browser. Nothing you type leaves this page.",
        empty: "Type a skill or paste a job description first.",
        none: "I couldn't match that. Try a job description, or terms like Python, AWS, fintech or real time.",
        unmatched: "Nothing to show for: {terms}. I only list what I can back up with real work.",
        fit: "fit",
        strong: "Strong match",
        partial: "Partial",
        gap: "Not yet",
        covered: "{n} of {m} requirements covered",
        email: "Email Camilo with this summary",
        copy: "Copy summary",
        copied: "Copied",
        close: "Close",
        mailSubject: "Your profile and our role",
        mailIntro: "Hi Camilo, I checked the fit with our role on your site:",
        mailOutro: "Let's talk."
      },
      es: {
        title: "Revisa si encajo con tu vacante",
        lead: "Pega la descripción de la vacante o escribe las habilidades que buscas. En cada una verás lo que de verdad he hecho, y te diré con franqueza lo que no.",
        placeholder: "Pega la descripción de la vacante, o escribe habilidades separadas por comas: Python, AWS, finanzas…",
        chipsLabel: "Prueba con:",
        chips: ["Python", "AWS", "Finanzas", "Tiempo real", "IA", "Liderazgo", "Kubernetes"],
        sample: "Probar con una vacante completa",
        analyze: "Revisar el encaje",
        privacy: "Esto corre solo en tu navegador. Nada de lo que escribes sale de esta página.",
        empty: "Primero escribe una habilidad o pega la descripción de una vacante.",
        none: "No encontré coincidencias. Prueba con la descripción de una vacante o con términos como Python, AWS, finanzas o tiempo real.",
        unmatched: "Nada que mostrar para: {terms}. Solo muestro lo que puedo respaldar con trabajo real.",
        fit: "encaje",
        strong: "Encaje fuerte",
        partial: "Parcial",
        gap: "Todavía no",
        covered: "Cubro {n} de {m} requisitos",
        email: "Escríbele a Camilo con este resumen",
        copy: "Copiar resumen",
        copied: "Copiado",
        close: "Cerrar",
        mailSubject: "Tu perfil y nuestra vacante",
        mailIntro: "Hola Camilo, revisé en tu sitio el encaje con nuestra vacante:",
        mailOutro: "Hablemos."
      }
    },
    samples: {
      en: "Senior Backend Engineer (Python/Django), remote, LATAM\n\nWe're a fintech startup building lending products. You will own services end to end.\n\nRequirements\n- 5+ years of backend experience with Python and Django / Django REST Framework\n- Strong PostgreSQL skills and experience optimizing slow queries\n- Redis and Celery, or another task queue\n- AWS (ECS or EKS), Docker and Terraform\n- CI/CD and automated testing\n- Designing REST APIs and integrating third-party APIs\n- Kubernetes is a plus\n\nNice to have\n- React\n- GraphQL\n- Experience with LLMs\n\nFluent English and overlap with US Eastern time.",
      es: "Ingeniero Backend Senior (Python/Django), remoto\n\nSomos una fintech que construye productos de crédito. Serás dueño de servicios de punta a punta.\n\nRequisitos\n- 5+ años de experiencia backend con Python y Django / Django REST Framework\n- Buen manejo de PostgreSQL y experiencia optimizando consultas lentas\n- Redis y Celery u otra cola de tareas\n- AWS (ECS o EKS), Docker y Terraform\n- CI/CD y pruebas automatizadas\n- Diseño de APIs REST e integración con APIs de terceros\n- Kubernetes es un plus\n\nDeseable\n- React\n- GraphQL\n- Experiencia con LLMs\n\nInglés fluido y trabajo en horario de EE. UU."
    },
    /* status: match | partial | gap. Cada regla se evalúa sobre lo que escribe el reclutador,
       en inglés o en español. Solo aparecen cosas que Camilo puede respaldar con trabajo real. */
    rules: [
      { id: "python", status: "match", re: [/\bpython\b/i], en: ["Python", "Python every day since 2023: Django backends at OWLY and MO, Flask at INVIAS."], es: ["Python", "Python a diario desde 2023: backends en Django en OWLY y MO, Flask en INVIAS."] },
      { id: "django", status: "match", re: [/\bdjango\b/i], en: ["Django", "Built Owly CRM on Django 4.2: 40 modular apps in production."], es: ["Django", "Construí Owly CRM en Django 4.2: 40 apps modulares en producción."] },
      { id: "drf", status: "match", re: [/django rest framework|\bdrf\b/i], en: ["Django REST Framework", "Owly's whole API runs on DRF, plus a public partner API."], es: ["Django REST Framework", "Toda la API de Owly corre en DRF, más una API pública para aliados."] },
      { id: "apis", status: "match", re: [/\brestful\b|\brest\s*apis?\b|\bapis?\b|\bapi\s*design|dise[ñn]o de apis|\bendpoints?\b/i, /\bREST\b/], en: ["APIs", "Designed Owly's REST API, a public partner API and an inbound API that a bank calls."], es: ["APIs", "Diseñé la API REST de Owly, una API pública para aliados y una API de entrada que llama un banco."] },
      { id: "backend", status: "match", re: [/back[- ]?end|server[- ]side|lado del servidor/i], en: ["Backend development", "Backend is my core: APIs, data models, async jobs and infrastructure, in Python and Django."], es: ["Desarrollo backend", "El backend es mi fuerte: APIs, modelos de datos, trabajos asíncronos e infraestructura, en Python y Django."] },
      { id: "fullstack", status: "match", re: [/full[- ]?stack/i], en: ["Full stack", "Django backend and a React and TypeScript frontend on Owly, with a backend focus."], es: ["Full stack", "Backend en Django y frontend en React y TypeScript en Owly, con foco en backend."] },
      { id: "frontend", status: "match", re: [/front[- ]?end|\bui\b|interfaz/i], en: ["Frontend", "React and TypeScript across Owly's frontend. My focus is backend."], es: ["Frontend", "React y TypeScript en todo el frontend de Owly. Mi foco es el backend."] },
      { id: "flask", status: "match", re: [/\bflask\b/i], en: ["Flask", "Built a Flask reporting tool at INVIAS."], es: ["Flask", "Construí una herramienta de reportes en Flask en INVIAS."] },
      { id: "fastapi", status: "partial", re: [/fastapi/i], en: ["FastAPI", "Not in production. I build APIs with Django REST Framework, and the Python side carries over."], es: ["FastAPI", "No en producción. Construyo APIs con Django REST Framework y lo de Python se traslada."] },
      { id: "databases", status: "match", re: [/postgres|\bsql\b|relational databases?|databases?|bases? de datos/i], en: ["Databases and SQL", "PostgreSQL 16 in production. Tuned the slowest views from about 17 s to under 1 s."], es: ["Bases de datos y SQL", "PostgreSQL 16 en producción. Bajé las vistas más lentas de unos 17 s a menos de 1 s."] },
      { id: "mysql", status: "partial", re: [/mysql|mariadb|sql server|\boracle\b/i], en: ["Other SQL databases", "My production work is PostgreSQL. The SQL and tuning skills carry over."], es: ["Otras bases SQL", "Mi trabajo en producción es con PostgreSQL. SQL y optimización se trasladan."] },
      { id: "nosql", status: "gap", re: [/nosql|mongo|dynamo|cassandra|couchbase|firestore/i], en: ["NoSQL databases", "Not in production. My data work is PostgreSQL and Redis."], es: ["Bases NoSQL", "No en producción. Mi trabajo de datos es con PostgreSQL y Redis."] },
      { id: "redis", status: "match", re: [/\bredis\b|\bcach(e|é|ing)/i], en: ["Redis and caching", "Redis as Celery broker, cache and the WebSocket channel layer."], es: ["Redis y caché", "Redis como broker de Celery, caché y capa de canales de WebSockets."] },
      { id: "queues", status: "match", re: [/\bcelery\b|task queues?|job queues?|background (jobs|tasks|workers)|\bcolas?\b|as[ií]ncron|asynchronous/i], en: ["Celery and background jobs", "Celery workers and scheduled jobs for integrations, notifications and syncs."], es: ["Celery y trabajos en segundo plano", "Workers de Celery y tareas programadas para integraciones, notificaciones y sincronizaciones."] },
      { id: "streaming", status: "partial", re: [/kafka|kinesis|rabbitmq|\bsqs\b|pub\s*\/?\s*sub|event[- ]driven|orientad[ao] a eventos|message (brokers?|queues?)/i], en: ["Messaging and event streams", "Queues and pub/sub on Redis (Celery, Channels). No Kafka or RabbitMQ in production yet."], es: ["Mensajería y eventos", "Colas y pub/sub sobre Redis (Celery, Channels). Todavía no uso Kafka ni RabbitMQ en producción."] },
      { id: "aws", status: "match", re: [/\baws\b|amazon web services/i], en: ["AWS", "Run Owly on AWS end to end: ECS Fargate, RDS, ElastiCache, S3, CloudFront, SES."], es: ["AWS", "Opero Owly en AWS de punta a punta: ECS Fargate, RDS, ElastiCache, S3, CloudFront, SES."] },
      { id: "cloud", status: "match", re: [/\bcloud\b|\bnube\b/i], en: ["Cloud", "My cloud is AWS: containers, managed databases, CDN, email and infrastructure as code."], es: ["Nube", "Mi nube es AWS: contenedores, bases de datos administradas, CDN, correo e infraestructura como código."] },
      { id: "containers", status: "match", re: [/\becs\b|fargate|containers?|contenedores/i], en: ["Containers on ECS", "Containers on ECS Fargate with rolling deploys and automatic rollback."], es: ["Contenedores en ECS", "Contenedores en ECS Fargate con deploys graduales y rollback automático."] },
      { id: "serverless", status: "match", re: [/\blambda\b|serverless/i], en: ["Serverless and Lambda", "AWS Lambda at MO Technologies."], es: ["Serverless y Lambda", "AWS Lambda en MO Technologies."] },
      { id: "kubernetes", status: "gap", re: [/kubernetes|\bk8s\b|\beks\b|\bhelm\b/i], en: ["Kubernetes", "Not in production. I run containers on ECS Fargate, and the concepts carry over."], es: ["Kubernetes", "No en producción. Corro contenedores en ECS Fargate y los conceptos se trasladan."] },
      { id: "docker", status: "match", re: [/\bdocker\b/i], en: ["Docker", "Docker for every service, locally and in production."], es: ["Docker", "Docker en todos los servicios, en local y en producción."] },
      { id: "iac", status: "match", re: [/terraform|infrastructure as code|infraestructura como c[oó]digo|\biac\b|cloudformation|\bcdk\b|pulumi/i], en: ["Infrastructure as code", "Owly's infrastructure is written in Terraform."], es: ["Infraestructura como código", "La infraestructura de Owly está escrita en Terraform."] },
      { id: "devops", status: "match", re: [/devops|dev ops|\bsre\b|site reliability|infrastructure|infraestructura/i], en: ["DevOps and infrastructure", "CI/CD, Terraform, zero-downtime deploys with automatic rollback, and I handle production incidents."], es: ["DevOps e infraestructura", "CI/CD, Terraform, deploys sin caídas con rollback automático, y atiendo los incidentes de producción."] },
      { id: "cicd", status: "match", re: [/ci\s*\/\s*cd|\bci\b|continuous (integration|delivery|deployment)|integraci[oó]n continua|despliegue continuo|github actions|codepipeline|jenkins|circleci/i], en: ["CI/CD", "CI/CD with AWS CodePipeline (and GitLab CI at MO), with gates that block unsafe migrations."], es: ["CI/CD", "CI/CD con AWS CodePipeline (y GitLab CI en MO), con gates que bloquean migraciones inseguras."] },
      { id: "git", status: "match", re: [/\bgit\b|github|gitlab|version control|control de versiones/i], en: ["Git", "Git and a pull-request flow with required CI checks."], es: ["Git", "Git y flujo de pull requests con chequeos de CI obligatorios."] },
      { id: "testing", status: "match", re: [/\btest(s|ing)?\b|pytest|\btdd\b|pruebas|testing/i], en: ["Automated testing", "pytest suites and contract tests that fail the build in CI."], es: ["Pruebas automatizadas", "Suites de pytest y pruebas de contrato que rompen el build en CI."] },
      { id: "realtime", status: "match", re: [/websockets?|real[- ]time|tiempo real|socket\.io|server[- ]sent events|\bsse\b/i], en: ["Real-time features", "Replaced polling with WebSockets (Django Channels and Redis) for notifications and chat."], es: ["Tiempo real", "Reemplacé el polling por WebSockets (Django Channels y Redis) para notificaciones y chat."] },
      { id: "saas", status: "match", re: [/multi[- ]?tenan|\bsaas\b|multi[- ]?empresa/i], en: ["Multi-tenant SaaS", "Designed Owly's tenant isolation, enforced by a CI check."], es: ["SaaS multi-tenant", "Diseñé el aislamiento por empresa de Owly, con un chequeo de CI que lo hace cumplir."] },
      { id: "microservices", status: "match", re: [/micro[- ]?servic/i], en: ["Microservices", "Python and Django microservices at MO Technologies."], es: ["Microservicios", "Microservicios en Python y Django en MO Technologies."] },
      { id: "architecture", status: "match", re: [/system design|architect|arquitect|scalab|escalab|distributed systems|sistemas distribuidos|high[- ]availability|alta disponibilidad/i], en: ["System design", "Designed Owly from zero: API, real-time layer, async workers, integrations and infrastructure."], es: ["Diseño de sistemas", "Diseñé Owly desde cero: API, capa de tiempo real, workers, integraciones e infraestructura."] },
      { id: "performance", status: "match", re: [/performance|rendimiento|optimi[sz]|latency|latencia|query tuning|profiling|slow queries|consultas lentas/i], en: ["Performance", "Cut the heaviest views from about 17 s to under 1 s by reading query plans."], es: ["Rendimiento", "Bajé las vistas más pesadas de unos 17 s a menos de 1 s leyendo planes de ejecución."] },
      { id: "integrations", status: "match", re: [/integrat|integraci[oó]n|third[- ]party|terceros|external apis?|\berp\b|webhooks?|payment gateways?|pasarelas? de pago/i], en: ["Third-party integrations", "Two-way ERP integration (154 endpoints) and a mortgage-bank integration over mutual TLS."], es: ["Integraciones con terceros", "Integración en ambos sentidos con un ERP (154 endpoints) y con un banco hipotecario por TLS mutuo."] },
      { id: "security", status: "match", re: [/security|seguridad|oauth|\bjwt\b|authentication|autenticaci[oó]n|encryption|cifrado|\bm?tls\b|owasp|\bsso\b/i], en: ["Security and auth", "OAuth, JWT and Firebase auth, mutual TLS and AES-GCM payload encryption with a bank."], es: ["Seguridad y autenticación", "OAuth, autenticación con JWT y Firebase, TLS mutuo y cifrado AES-GCM con un banco."] },
      { id: "firebase", status: "match", re: [/firebase/i], en: ["Firebase", "Firebase Authentication in production at Owly."], es: ["Firebase", "Firebase Authentication en producción en Owly."] },
      { id: "finance", status: "match", re: [/fin(tech|anc|anz)|lending|\bloans?\b|pr[eé]stamos?|credit|cr[eé]dito|payments?|\bpagos?\b|banking|\bbancos?\b|\bbanca\b|\bbank|investment|inversi[oó]n|inversiones|financial services|servicios financieros/i], en: ["Finance and fintech", "Economist and former investment analyst. Two years on a lending platform at MO, and I built OWLY's financial engines: commissions, discounts and housing subsidies."], es: ["Finanzas y fintech", "Economista y ex analista de inversiones. Dos años en una plataforma de crédito en MO, y construí los motores financieros de OWLY: comisiones, descuentos y subsidios de vivienda."] },
      { id: "business", status: "match", re: [/econom|business|negocio|product (mindset|sense|thinking|minded)|stakeholders?/i], en: ["Business sense", "Economist from Javeriana, former investment analyst and startup founder for 7 years. I build for the business outcome."], es: ["Visión de negocio", "Economista de la Javeriana, ex analista de inversiones y fundador de startups durante 7 años. Construyo pensando en el resultado de negocio."] },
      { id: "crm", status: "match", re: [/\bcrm\b|salesforce|hubspot/i], en: ["CRM", "Built Owly CRM from zero: leads, pipelines, quotes, deals and commissions."], es: ["CRM", "Construí Owly CRM desde cero: leads, pipelines, cotizaciones, negocios y comisiones."] },
      { id: "realestate", status: "match", re: [/real[- ]estate|proptech|inmobiliari|constructoras?|construction|construcci[oó]n|vivienda|housing|mortgage|hipotec/i], en: ["Real estate and construction", "Owly serves real-estate developers: sales, quotes, a construction ERP and a mortgage bank."], es: ["Inmobiliario y construcción", "Owly atiende constructoras: ventas, cotizaciones, un ERP de construcción y un banco hipotecario."] },
      { id: "messaging", status: "match", re: [/whatsapp|omni-?channel|omnicanal|\bsms\b|twilio|sendgrid/i], en: ["Messaging (WhatsApp, email, SMS)", "Omnichannel messaging in Owly: WhatsApp, email and SMS, with real-time updates."], es: ["Mensajería (WhatsApp, correo, SMS)", "Mensajería omnicanal en Owly: WhatsApp, correo y SMS, con actualizaciones en tiempo real."] },
      { id: "llm", status: "match", re: [/\bllms?\b|large language models?|generative ai|gen\s?ai|ia generativa|openai|anthropic|\bclaude\b|\bgpt|\bai\b|\bia\b|artificial intelligence|inteligencia artificial|\brag\b|embeddings?|vector (db|database|search)|agentic|ai agents?|agentes de ia/i], en: ["AI and LLMs", "LLM and voice agents in production (Claude, OpenAI, ElevenLabs) exposed over MCP, plus pgvector embeddings."], es: ["IA y LLMs", "Agentes de IA y de voz en producción (Claude, OpenAI, ElevenLabs) expuestos por MCP, y embeddings con pgvector."] },
      { id: "ml", status: "match", re: [/machine learning|aprendizaje autom[aá]tico|\bml\b|scikit|predictive model/i], en: ["Machine learning", "ML lead scoring with scikit-learn."], es: ["Machine learning", "Scoring de leads con ML en scikit-learn."] },
      { id: "dataeng", status: "partial", re: [/airflow|\bspark\b|\betl\b|snowflake|bigquery|\bdbt\b|data pipelines?/i], en: ["Data pipelines", "ETL-style syncs with a construction ERP. No Spark or Airflow in production."], es: ["Pipelines de datos", "Sincronizaciones tipo ETL con un ERP de construcción. Sin Spark ni Airflow en producción."] },
      { id: "react", status: "match", re: [/\breact\b/i], en: ["React", "Owly's frontend is React and TypeScript."], es: ["React", "El frontend de Owly es React y TypeScript."] },
      { id: "typescript", status: "match", re: [/typescript|javascript/i], en: ["TypeScript and JavaScript", "TypeScript across Owly's frontend."], es: ["TypeScript y JavaScript", "TypeScript en todo el frontend de Owly."] },
      { id: "graphql", status: "gap", re: [/graphql/i], en: ["GraphQL", "Not in production. My APIs are REST."], es: ["GraphQL", "No en producción. Mis APIs son REST."] },
      { id: "mobile", status: "gap", re: [/\bios\b|android|react native|flutter|\bswift\b|m[oó]vil|mobile/i], en: ["Mobile apps", "No native mobile work. My work is backend and web."], es: ["Apps móviles", "No he hecho apps nativas. Mi trabajo es backend y web."] },
      { id: "otherlang", status: "gap", re: [/\bgolang\b|\bgo\s*(developer|engineer|services?)\b|\bjava\b|node\.?js|\bnode\b|\bruby\b|\bphp\b|laravel|\bc#|asp\.net|\bdotnet\b|\brust\b|\bscala\b|\belixir\b|\bkotlin\b/i], en: ["Other backend languages", "Not professionally. Python is my backend language."], es: ["Otros lenguajes backend", "No de forma profesional. Mi lenguaje backend es Python."] },
      { id: "othercloud", status: "partial", re: [/\bgcp\b|google cloud|azure/i], en: ["GCP or Azure", "My cloud is AWS. The architecture patterns carry over."], es: ["GCP o Azure", "Mi nube es AWS. Los patrones de arquitectura se trasladan."] },
      { id: "observability", status: "partial", re: [/observability|observabilidad|monitoring|monitoreo|logging|cloudwatch|datadog|sentry|prometheus|grafana|new relic|opentelemetry/i], en: ["Observability", "CloudWatch logs, health checks and an in-app performance monitor. No dedicated APM stack yet."], es: ["Observabilidad", "Logs en CloudWatch, chequeos de salud y un monitor de rendimiento propio. Todavía sin una herramienta APM dedicada."] },
      { id: "agile", status: "match", re: [/\bagile\b|scrum|kanban|[aá]gil/i], en: ["Agile", "Agile sprints with Jira at MO. As CTO I run planning and delivery."], es: ["Metodologías ágiles", "Sprints ágiles con Jira en MO. Como CTO manejo la planeación y la entrega."] },
      { id: "leadership", status: "match", re: [/tech(nical)? lead|team lead|\bleader\b|leadership|liderazgo|l[ií]der|mentor|\bcto\b|head of engineering|engineering manager|ownership|manage (a )?team|gesti[oó]n de equipos?|end to end|punta a punta/i], en: ["Ownership and leadership", "As CTO I own architecture, delivery and technical direction."], es: ["Liderazgo y ownership", "Como CTO soy dueño de la arquitectura, la entrega y la dirección técnica."] },
      { id: "startup", status: "match", re: [/startup|start-up|early[- ]stage|founding engineer|zero to one|0\s*(to|->|→)\s*1|greenfield|fast[- ]paced|emprend/i], en: ["Startup experience", "Built Owly from the first commit, after 7 years founding and running startups."], es: ["Experiencia en startups", "Construí Owly desde el primer commit, después de 7 años fundando y dirigiendo startups."] },
      { id: "english", status: "match", re: [/english|ingl[eé]s/i], en: ["English", "Professional working proficiency. I explain architecture in English."], es: ["Inglés", "Nivel profesional. Explico arquitectura en inglés."] },
      { id: "remote", status: "match", re: [/remote|remoto|time\s?zones?|zona horaria|\best\b|\bpst\b|\bcst\b|latam|latin america|latinoam[eé]rica|nearshore|us hours|us eastern|ee\.?\s?uu/i], en: ["Remote and time zone", "Remote from Bogotá (UTC−5): full overlap with US Eastern and Central hours."], es: ["Remoto y zona horaria", "Remoto desde Bogotá (UTC−5): coincido por completo con el horario del este y centro de EE. UU."] },
      { id: "degree", status: "partial", re: [/computer science|ciencias de la computaci[oó]n|ingenier[ií]a de sistemas|bachelor|degree in|t[ií]tulo (profesional )?en/i], en: ["Degree", "B.A. in Economics. Self-taught engineer, shipping production systems since 2023."], es: ["Título", "Economista. Ingeniero autodidacta, con sistemas en producción desde 2023."] }
    ],
    /* Años de experiencia: se detectan aparte porque dependen del número. */
    years: {
      re: /(\d{1,2})\s*\+?\s*(?:years?|yrs?|años)/gi,
      en: { label: "{n}+ years of experience", match: "Engineering since 2023 and CTO since 2025.", partial: "Engineering since 2023 and CTO since 2025, after 7 years building companies. Judge the depth by the work on this page." },
      es: { label: "{n}+ años de experiencia", match: "Ingeniería desde 2023 y CTO desde 2025.", partial: "Ingeniería desde 2023 y CTO desde 2025, después de 7 años construyendo empresas. Juzga la profundidad por el trabajo de esta página." }
    }
  }
};
