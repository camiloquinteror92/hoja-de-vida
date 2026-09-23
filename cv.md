# Camilo Quintero Rodríguez

**Senior Backend Engineer**. Python, Django and AWS.

Bogotá, Colombia. Remote, UTC−5. Open to full-time or contract roles.

- Email: camiloquinteror@outlook.com
- LinkedIn: https://www.linkedin.com/in/camilo-quinteror/
- GitHub: https://github.com/camiloquinteror92
- Portfolio: https://camiloquinteror92.github.io/hoja-de-vida/#portfolio

## About

Backend engineer and CTO who builds multi-tenant SaaS on AWS. I built a sales platform used by Colombian real-estate developers, from the first commit to production: Django and PostgreSQL at the core, real-time features over WebSockets, integrations with a construction ERP and a mortgage bank, and applied AI. Before that, I spent two years building lending software as a backend engineer. I'm an economist and a former investment analyst, so I build for the business outcome, not just the ticket.

## Experience

### Chief Technology Officer, OWLY SAS (Oct 2025 – Present)

_Multi-tenant CRM SaaS for real-estate developers, Bogotá_

- Architected and built the company's CRM platform from zero: Django 4.2 and DRF, PostgreSQL 16, Redis and Celery across 40 modular apps, with a React and TypeScript frontend. Shipped the first production deploy on AWS in three days.
- Designed tenant isolation for every customer's data: a tenant-aware base model and a scoped API layer, enforced by a CI check that fails the build if any endpoint ships without tenant scoping.
- Built zero-downtime deployments on ECS Fargate: migrations run before new tasks take traffic, failed deploys roll back automatically, and a CI gate blocks backward-incompatible schema changes (expand/contract).
- Integrated SINCO, a construction ERP (154 endpoints, two-way sync of units, sales and payments), and Davivienda's mortgage platform (mutual TLS, AES-GCM payload encryption, OAuth, plus an inbound API for the bank's presale results).
- Replaced 5-second polling (12 requests per minute per open tab) with WebSockets, using Django Channels and Redis, for notifications and internal chat.
- Cut the heaviest list views from about 17 s to under 1 s: removed N+1 queries, paginated by ID and fixed Postgres planner traps (JIT on annotated EXISTS, an unnecessary DISTINCT).
- Shipped ML lead scoring (scikit-learn), LLM and voice agents (Claude, OpenAI, ElevenLabs) exposed over MCP, and the financial engines behind quotes: tiered commissions, discounts and housing-subsidy eligibility.

### Backend Developer II, MO Technologies (Nov 2023 – Sep 2025)

_Credit-management platform: loans, payments and user administration · Promoted from Backend Developer in Sep 2024_

- Built and maintained Python and Django microservices on AWS (S3, EC2, Lambda) with PostgreSQL, Docker and GitLab CI/CD.
- On the credit core for a Colombian digital bank, caught an interest-capitalization defect (interest charged on unpaid interest, which is illegal in Colombia) that an external compliance review had missed. I escalated it with the numbers, and it was fixed before launch with zero customers affected.

### Python Developer, INVIAS (Jan 2023 – Oct 2023)

_Colombia's National Roads Institute_

- Built a Flask reporting tool that ingests an external JSON API and exports filtered reports to PDF and CSV.

## Before engineering: founder and finance

- **Veci, Co-founder and CEO** (2018 – 2022): App-based neighborhood commerce. COP 100M in sales in the first 8 months, backed by iNNpulsa, Colombia's innovation agency. I also co-founded Fit your Food and A la Casa.
- **Authentic Trust, Co-founder and CEO** (2015 – 2016): Real-estate project structuring: valuation and debt.
- **Corpbanca Investment Banking, Investment Analyst** (2014 – 2015): Financial models, due diligence and investment-committee presentations.

## Skills

- **Backend:** Python, Django, Django REST Framework, Celery, Django Channels, REST API design, pytest
- **Data:** PostgreSQL, Query tuning, pgvector, Redis, PgBouncer
- **Cloud and DevOps:** AWS ECS Fargate, RDS, ElastiCache, S3, CloudFront, SES, Secrets Manager, CodePipeline, Terraform, Docker, CI/CD
- **Frontend:** React, TypeScript
- **AI and ML:** LLM agents (Claude, OpenAI), MCP, Voice agents (ElevenLabs), scikit-learn
- **Domain:** Lending and fintech, ERP and banking integrations, Financial modeling

## Education and languages

- **B.A. in Economics**, Pontificia Universidad Javeriana, Bogotá (2010 – 2015)
- **Continuing education in Python, Django, AWS and frontend**, Platzi (2022 – Present)

**Languages:** Spanish (native) and English (professional working proficiency)

## A multi-tenant SaaS, from the first commit to production

A multi-tenant sales platform used by real-estate developers in Colombia. I designed and built it as CTO. Below is how it works inside, and four problems I solved along the way.

The code is private, so this page stays at the level of a conference talk: how the pieces fit, not the source.

### How it works inside

#### A request

What happens when a salesperson opens their list of leads.

1. The web app loads from CloudFront and S3, cached close to the user.
2. It calls the API with the user's login token.
3. The load balancer hands the request to a healthy Django container on ECS Fargate.
4. Middleware resolves the user's company, and every query is filtered by it. A CI check fails the build if any endpoint isn't.
5. Queries go through PgBouncer, so hundreds of requests share a few database connections.
6. PostgreSQL answers. This list used to take about 17 s. After tuning, it takes under 1 s.
7. The JSON goes back and the list renders.

#### Real time

Before, every open tab asked the server “anything new?” every 5 seconds: 12 requests a minute, per tab.

1. When the app opens, it keeps one WebSocket connection open.
2. Something happens: a customer replies on WhatsApp, or a colleague updates a quote.
3. Django publishes the event to that company's group in Redis.
4. Every WebSocket server subscribed to the group receives it.
5. Every open screen of that company updates at once. No more polling.

#### Integrations

Talking to outside systems without making anyone wait.

1. A salesperson sends a buyer's application to the mortgage bank.
2. Django puts the job on a queue, so the screen never waits on an outside system.
3. A Celery worker picks it up.
4. It calls the bank over mutual TLS with AES-GCM encrypted payloads, or the construction ERP: 154 endpoints, synced both ways.
5. The answer is saved, filtered by the right company.
6. The worker publishes the update, and the salesperson sees it live.

#### A deploy

Why this exists: a deploy once logged everyone out in a loop, because new code ran before its database migration.

1. A merge to main starts the pipeline. A CI gate blocks any migration that would break the version still running.
2. CodePipeline builds and tests.
3. The Docker image goes to ECR.
4. ECS starts new tasks next to the old ones. Nobody is logged out.
5. Each new task migrates the database before it serves a single request.
6. The load balancer waits for the health check to pass.
7. Traffic shifts. The old tasks finish their open requests and shut down.

If the new version fails: The health check fails, so the circuit breaker rolls back on its own. Users keep working on the previous version.

### Four problems I solved

#### From about 17 s to under 1 s (Performance)

- **The problem:** The busiest list screens, with filters, took up to 17 seconds to load.
- **What I did:** Read the query plans instead of guessing. Removed N+1 queries, paginated by ID before loading wide rows, and fixed two Postgres planner traps: JIT triggered by annotated EXISTS, and an unnecessary DISTINCT.
- **Result:** Under 1 second on the same data.

#### Deploys without downtime (Reliability)

- **The problem:** A deploy logged every user out in a loop: the new code started before its database migration.
- **What I did:** Made each new task migrate before serving traffic, required backward-compatible migrations (expand/contract) with a CI gate, turned on automatic rollback, and gave old tasks time to drain.
- **Result:** New versions go out without interrupting anyone, and a failed release rolls back on its own.

#### From polling to WebSockets (Real time)

- **The problem:** Notifications and chat asked the server every 5 seconds: 12 requests a minute for every open tab, growing with every new user.
- **What I did:** Moved both to WebSockets with Django Channels. Redis fans each event out to the company's group, so only the right screens hear about it.
- **Result:** That load disappeared, and messages arrive instantly.

#### The bug nobody was looking for (Fintech, at MO Technologies)

- **The problem:** A digital bank's credit core charged interest on unpaid interest, which is illegal in Colombia. An external compliance review had missed it.
- **What I did:** Spotted it while testing the database, did the math to be sure, took it to the tech lead first, and escalated to the COO with the numbers.
- **Result:** Fixed before launch. Zero customers affected.
