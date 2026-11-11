# Monitor de seguridad web

Herramienta en Node.js que revisa la seguridad básica de los sitios web de organizaciones chicas (comercios, ONG, clubes, escuelas) y genera un informe con puntaje y recomendaciones que se entienden sin conocimientos técnicos.

Proyecto de la Práctica Profesionalizante (Voluntariado autogestionado) de la Tecnicatura en Programación de Teclab, cuatrimestre 2B-26.

## Qué revisa

| Chequeo | Tipo | Estado |
| --- | --- | --- |
| Certificado SSL/TLS y días hasta su vencimiento | Pasivo | Pendiente |
| Headers de seguridad (HSTS, CSP, X-Frame-Options, etc.) | Pasivo | Pendiente |
| Registros de correo (SPF, DKIM, DMARC) | Pasivo | Pendiente |
| Archivos y rutas expuestas (`.env`, `/admin`, etc.) | Activo | Pendiente |
| Puertos comunes abiertos | Activo | Pendiente |

## Uso responsable

- Los chequeos **pasivos** leen información que cualquier sitio público ya expone (certificado, headers, DNS).
- Los chequeos **activos** solo se ejecutan sobre dominios propios o con autorización del responsable. La configuración de cada sitio obliga a declararlo.
- Para pruebas se usan sitios pensados para eso: [badssl.com](https://badssl.com) y [scanme.nmap.org](http://scanme.nmap.org).

## Alcance por etapas

1. CLI que revisa certificado, headers y DNS de un dominio.
2. Chequeos de archivos expuestos y puertos.
3. Historial en base de datos y revisiones programadas.
4. Alertas (Telegram o email) e informe en HTML o PDF.
5. Panel web.

## Stack

| Parte | Tecnología | Para qué |
| --- | --- | --- |
| Lenguaje | Node.js 22 LTS + TypeScript | Base del proyecto, con tipos para detectar errores antes de ejecutar |
| CLI | commander | Comandos y opciones desde la terminal |
| Chequeos | Módulos nativos `tls`, `dns`, `net` y `fetch` | Certificados, registros DNS, puertos y headers sin dependencias externas |
| Configuración | Zod | Validar el archivo de configuración de cada negocio |
| Historial | SQLite | Guardar los resultados de cada revisión |
| Programación | node-cron | Correr las revisiones automáticamente |
| Alertas | Telegram Bot API o Nodemailer | Avisar cuando algo falla |
| Panel | Express + React + Tailwind | Ver los sitios y su evolución (etapa 5) |
| Calidad | Vitest, ESLint, GitHub Actions | Tests, estilo y verificación automática |
| Gestión | Git, GitHub, Trello (Scrum) | Versionado y sprints semanales |
| Asistencia | Claude (IA) | Apoyo en planificación, explicaciones y revisión de código |

## Cómo ejecutarlo

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev -- ejemplo.com
```

## Seguridad del propio proyecto

- No hay credenciales en el código: los tokens y claves van en un archivo `.env` (ver `.env.example`), que no se sube al repositorio.

## Autor

Alfredo · Tecnicatura en Programación, Teclab
