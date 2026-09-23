# Camilo Quintero Rodríguez

**Ingeniero Backend Senior**. Python, Django y AWS.

Bogotá, Colombia. Remoto, UTC−5. Disponible para tiempo completo o por contrato.

- Email: camiloquinteror@outlook.com
- LinkedIn: https://www.linkedin.com/in/camilo-quinteror/
- GitHub: https://github.com/camiloquinteror92
- Portafolio: https://camiloquinteror92.github.io/hoja-de-vida/?lang=es#portfolio

## Perfil

Ingeniero backend y CTO que construye SaaS multi-tenant en AWS. Construí Owly CRM, una plataforma de ventas que usan constructoras colombianas, desde el primer commit hasta producción: Django y PostgreSQL en el núcleo, funciones en tiempo real con WebSockets, integraciones con un ERP de construcción y con un banco hipotecario, e IA aplicada. Antes pasé dos años construyendo software de crédito como ingeniero backend. Soy economista y fui analista de inversiones, así que construyo pensando en el resultado de negocio, no solo en el ticket.

## Experiencia

### Gerente de Tecnología (CTO), OWLY SAS (oct 2025 – actualidad)

_SaaS multi-tenant de CRM para constructoras, Bogotá_

- Diseñé y construí Owly CRM desde cero: Django 4.2 y DRF, PostgreSQL 16, Redis y Celery en 40 apps modulares, con frontend en React y TypeScript. Primer deploy a producción en AWS en tres días.
- Diseñé el aislamiento de los datos de cada cliente: un modelo base por empresa y una capa de API filtrada, con un chequeo de CI que rompe el build si algún endpoint sale sin filtro por empresa.
- Construí despliegues sin caídas en ECS Fargate: las migraciones corren antes de que las tareas nuevas reciban tráfico, un deploy fallido se revierte solo y un gate de CI bloquea cambios de esquema incompatibles (expand/contract).
- Integré SINCO, un ERP de construcción (154 endpoints, sincronización en ambos sentidos de unidades, ventas y pagos), y la plataforma hipotecaria de Davivienda (TLS mutuo, cifrado AES-GCM, OAuth y una API de entrada para los resultados de preventa del banco).
- Reemplacé el polling cada 5 segundos (12 peticiones por minuto por pestaña abierta) por WebSockets, con Django Channels y Redis, para notificaciones y chat interno.
- Bajé las vistas de listado más pesadas de unos 17 s a menos de 1 s: eliminé consultas N+1, paginé por ID y corregí trampas del planificador de Postgres (JIT con EXISTS anotados, un DISTINCT innecesario).
- Entregué scoring de leads con ML (scikit-learn), agentes de IA y de voz (Claude, OpenAI, ElevenLabs) expuestos por MCP, y los motores financieros de las cotizaciones: comisiones por niveles, descuentos y elegibilidad a subsidios de vivienda.

### Backend Developer II, MO Technologies (nov 2023 – sep 2025)

_Plataforma de gestión de crédito: préstamos, pagos y administración de usuarios · Ascendido desde Backend Developer en sep 2024_

- Construí y mantuve microservicios en Python y Django sobre AWS (S3, EC2, Lambda) con PostgreSQL, Docker y CI/CD en GitLab.
- En el core de crédito de un banco digital colombiano detecté un error de capitalización de intereses (cobrar intereses sobre intereses no pagados, algo ilegal en Colombia) que una revisión externa de cumplimiento no había visto. Lo escalé con los números y se corrigió antes del lanzamiento, sin ningún cliente afectado.

### Desarrollador Python, INVIAS (ene 2023 – oct 2023)

_Instituto Nacional de Vías_

- Construí una herramienta de reportes en Flask que consume una API externa en JSON y exporta reportes filtrados a PDF y CSV.

## Antes de la ingeniería: emprendimiento y finanzas

- **Veci, Cofundador y CEO** (2018 – 2022): Comercio de barrio apoyado en una app. COP 100 millones en ventas en los primeros 8 meses, con apoyo de iNNpulsa Colombia. También cofundé Fit your Food y A la Casa.
- **Authentic Trust, Cofundador y CEO** (2015 – 2016): Estructuración de proyectos inmobiliarios: valoración y deuda.
- **Corpbanca Banca de Inversión, Analista de inversiones** (2014 – 2015): Modelos financieros, due diligence y presentaciones a comités de inversión.

## Habilidades

- **Backend:** Python, Django, Django REST Framework, Celery, Django Channels, Diseño de APIs REST, pytest
- **Datos:** PostgreSQL, Optimización de consultas, pgvector, Redis, PgBouncer
- **Nube y DevOps:** AWS ECS Fargate, RDS, ElastiCache, S3, CloudFront, SES, Secrets Manager, CodePipeline, Terraform, Docker, CI/CD
- **Frontend:** React, TypeScript
- **IA y ML:** Agentes con LLM (Claude, OpenAI), MCP, Agentes de voz (ElevenLabs), scikit-learn
- **Dominio:** Crédito y fintech, Integraciones con ERP y banca, Modelación financiera

## Educación e idiomas

- **Economista**, Pontificia Universidad Javeriana, Bogotá (2010 – 2015)
- **Formación continua en Python, Django, AWS y frontend**, Platzi (2022 – actualidad)

**Idiomas:** Español (nativo) e inglés (nivel profesional)

## Owly CRM, del primer commit a producción

Una plataforma de ventas multi-tenant que usan constructoras en Colombia. La diseñé y la construí como CTO. Abajo está cómo funciona por dentro y cuatro problemas que resolví en el camino.

El código es privado, así que esta página se queda al nivel de una charla técnica: cómo encajan las piezas, no el código fuente.

### Cómo funciona por dentro

#### Una petición

Qué pasa cuando un asesor abre su lista de leads.

1. La app web carga desde CloudFront y S3, en caché cerca del usuario.
2. Llama a la API con el token de sesión del usuario.
3. El balanceador le pasa la petición a un contenedor de Django sano en ECS Fargate.
4. Un middleware identifica la empresa del usuario y cada consulta queda filtrada por ella. Un chequeo de CI rompe el build si algún endpoint no lo está.
5. Las consultas pasan por PgBouncer, así cientos de peticiones comparten unas pocas conexiones.
6. PostgreSQL responde. Esta lista tardaba unos 17 s. Después de optimizarla, menos de 1 s.
7. El JSON vuelve y la lista aparece en pantalla.

#### Tiempo real

Antes, cada pestaña abierta le preguntaba al servidor “¿hay algo nuevo?” cada 5 segundos: 12 peticiones por minuto, por pestaña.

1. Al abrir la app, queda abierta una sola conexión WebSocket.
2. Pasa algo: un cliente responde por WhatsApp o un colega actualiza una cotización.
3. Django publica el evento en el grupo de esa empresa en Redis.
4. Cada servidor de WebSockets suscrito al grupo lo recibe.
5. Todas las pantallas abiertas de esa empresa se actualizan al instante. Se acabó el polling.

#### Integraciones

Hablar con sistemas externos sin hacer esperar a nadie.

1. Un asesor envía la solicitud de un comprador al banco hipotecario.
2. Django pone el trabajo en una cola, así la pantalla nunca espera a un sistema externo.
3. Un worker de Celery lo toma.
4. Llama al banco con TLS mutuo y datos cifrados con AES-GCM, o al ERP de construcción: 154 endpoints, sincronizados en ambos sentidos.
5. La respuesta se guarda, filtrada por la empresa correcta.
6. El worker publica la novedad y el asesor la ve en vivo.

#### Un deploy

Por qué existe: un deploy sacó a todos los usuarios en un bucle, porque el código nuevo corrió antes que su migración.

1. Un merge a main arranca el pipeline. Un gate de CI bloquea cualquier migración que rompería la versión que sigue corriendo.
2. CodePipeline construye y prueba.
3. La imagen de Docker queda en ECR.
4. ECS arranca tareas nuevas junto a las viejas. Nadie pierde su sesión.
5. Cada tarea nueva migra la base de datos antes de atender una sola petición.
6. El balanceador espera a que pase el chequeo de salud.
7. El tráfico cambia. Las tareas viejas terminan lo que tenían abierto y se apagan.

Si la versión nueva falla: El chequeo falla, así que el circuit breaker hace rollback solo. Los usuarios siguen trabajando en la versión anterior.

### Cuatro problemas que resolví

#### De unos 17 s a menos de 1 s (Rendimiento)

- **El problema:** Las pantallas de listado más usadas, con filtros, tardaban hasta 17 segundos en cargar.
- **Qué hice:** Leí los planes de ejecución en vez de adivinar. Eliminé consultas N+1, paginé por ID antes de cargar filas anchas y corregí dos trampas del planificador de Postgres: el JIT que disparaban unos EXISTS anotados y un DISTINCT innecesario.
- **Resultado:** Menos de 1 segundo con los mismos datos.

#### Deploys sin caídas (Confiabilidad)

- **El problema:** Un deploy sacó a todos los usuarios en un bucle: el código nuevo arrancó antes que su migración de base de datos.
- **Qué hice:** Hice que cada tarea nueva migre antes de recibir tráfico, exigí migraciones compatibles hacia atrás (expand/contract) con un gate de CI, activé el rollback automático y les di tiempo a las tareas viejas para terminar.
- **Resultado:** Las versiones nuevas salen sin interrumpir a nadie, y una versión fallida se revierte sola.

#### Del polling a WebSockets (Tiempo real)

- **El problema:** Las notificaciones y el chat le preguntaban al servidor cada 5 segundos: 12 peticiones por minuto por cada pestaña abierta, y crecía con cada usuario nuevo.
- **Qué hice:** Pasé ambos a WebSockets con Django Channels. Redis reparte cada evento al grupo de la empresa, así solo se enteran las pantallas correctas.
- **Resultado:** Esa carga desapareció y los mensajes llegan al instante.

#### El error que nadie estaba buscando (Fintech, en MO Technologies)

- **El problema:** El core de crédito de un banco digital cobraba intereses sobre intereses no pagados, algo ilegal en Colombia. Una revisión externa de cumplimiento no lo había detectado.
- **Qué hice:** Lo vi probando la base de datos, hice las cuentas para estar seguro, lo llevé primero al líder técnico y lo escalé al COO con los números.
- **Resultado:** Se corrigió antes del lanzamiento. Cero clientes afectados.
