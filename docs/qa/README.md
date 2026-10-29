# QA del backend: tests y Qase

Cómo se prueban el backend de ServiMap y cómo se documentan los casos en [Qase](https://qase.io) (TestOps).

| Documento | Contenido |
|---|---|
| [casos-de-uso.md](casos-de-uso.md) | Casos de uso por rol (Cliente, Prestador, Administrador) |
| [casos-de-prueba.md](casos-de-prueba.md) | Todos los casos de prueba automatizados, con sus metadatos (generado) |
| [casos-de-prueba.csv](casos-de-prueba.csv) | Los mismos casos en el formato de importación de Qase (generado) |
| [trazabilidad.md](trazabilidad.md) | Matriz RF-01..RF-23 contra los casos, y lo que queda pendiente (generado) |

## Capas de prueba

| Capa | Dónde | Qué usa | Base de datos |
|---|---|---|---|
| Unitarios | `tests/*.test.js` | Jest; Prisma y los servicios simulados con `jest.mock`; Supertest en los tests HTTP | No |
| Integración | `tests/integration/*.integration.test.js` | Supertest contra la app real (`src/app.js`) y Prisma contra una base PostgreSQL de test | Sí (`DATABASE_URL_TEST`) |
| E2E | Repositorio del frontend | Navegador + API | — |

## Comandos

```bash
npm test                  # todo: unitarios + integración (la integración se saltea si no hay DATABASE_URL_TEST)
npm test -- --coverage    # lo mismo, con cobertura (lo usa SonarQube)
npm run test:unit         # solo unitarios
npm run test:integration  # solo integración (en serie, contra DATABASE_URL_TEST)
npm run test:qase         # todo, reportando los resultados a Qase
npm run docs:qa           # regenera casos-de-prueba.md/.csv y trazabilidad.md
npm run qase:ids -- export.csv   # completa los IDs numéricos de Qase (ver paso 3)
```

## Variables de entorno

Nunca van en archivos del repositorio: se definen en la terminal, en el `.env` local (que no se sube) o como secrets de GitHub.

| Variable | Para qué | Dónde |
|---|---|---|
| `JWT_SECRET` | Firmar tokens (la app no arranca sin ella) | `.env` / workflow |
| `DATABASE_URL_TEST` | Base PostgreSQL **exclusiva para tests de integración** | `.env` local / secret de GitHub |
| `QASE_MODE` | `testops` activa el reporter de Qase (por defecto, apagado) | `test:qase` lo activa solo |
| `QASE_TESTOPS_API_TOKEN` | Token de la API de Qase | Terminal / secret de GitHub |
| `QASE_TESTOPS_PROJECT` | Código del proyecto en Qase (por ejemplo, `SMB`) | Terminal / secret de GitHub |
| `QASE_TESTOPS_RUN_TITLE` | Título del test run (opcional) | Terminal / workflow |
| `QASE_TESTOPS_RUN_COMPLETE` | `true` cierra el run al terminar (por defecto, `true`) | Terminal / workflow |
| `QASE_ENVIRONMENT` | Slug de un entorno creado en Qase (opcional) | Terminal / variable de GitHub |

El resto de la configuración del reporter está en [`qase.config.json`](../../qase.config.json), sin token ni proyecto. Si Qase no responde, el reporter guarda los resultados en `build/qase-report/` (fallback local) y **los tests no fallan por eso**.

## Base de datos de test

Los tests de integración **crean y borran datos**. Por eso:

- Solo usan `DATABASE_URL_TEST`; nunca `DATABASE_URL`.
- Si `DATABASE_URL_TEST` apunta a la misma base que `DATABASE_URL` (mismo servidor, puerto y nombre), abortan.
- No corren con `NODE_ENV=production`.
- Cada suite crea sus propios usuarios, oficios y solicitudes con un prefijo único (`it<hex>`), y los borra al terminar. No dependen de datos previos ni usan cuentas reales. El administrador de test se crea directo con Prisma porque la API no permite registrarlo.

Opciones para tener una base de test:

1. **Rama de Neon (recomendada si usan Neon):** en la consola de Neon, crear una rama nueva (por ejemplo, `test`) y copiar su connection string. Es una base aparte de la de producción.
2. **PostgreSQL local:** `createdb servimap_test` y usar `postgresql://usuario:clave@localhost:5432/servimap_test?schema=public`.
3. **Docker:** `docker run --name servimap-test -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=servimap_test -p 5432:5432 -d postgres:16`.

Después, aplicar las migraciones **en la base de test** y correr los tests:

```bash
# bash
export DATABASE_URL_TEST="postgresql://..."
DATABASE_URL="$DATABASE_URL_TEST" npx prisma migrate deploy
npm run test:integration
```

```powershell
# PowerShell
$env:DATABASE_URL_TEST = "postgresql://..."
$env:DATABASE_URL = $env:DATABASE_URL_TEST; npx prisma migrate deploy; Remove-Item Env:DATABASE_URL
npm run test:integration
```

También se puede poner `DATABASE_URL_TEST=...` en el `.env` local.

## Qase paso a paso

### 1. Crear el proyecto y el token

1. Crear un proyecto en Qase (por ejemplo, código `SMB` para el backend). El código aparece en la URL: `https://app.qase.io/project/SMB`.
2. Crear un token de API con permiso de escritura desde <https://app.qase.io/apps> (es el enlace que indica la documentación del reporter).

### 2. Importar los casos

1. En el proyecto: **Repository → Import → origen "Qase.io"** y subir [`casos-de-prueba.csv`](casos-de-prueba.csv).
2. Se crean las suites (`Unitarios` / `Integración` y un módulo por debajo) y todos los casos con descripción, precondiciones, postcondiciones, pasos, resultado esperado, prioridad, severidad, tipo, comportamiento, capa y tags (ID propio, RF, rol y capa).

El CSV usa las columnas del formato de Qase (`v2.id, title, description, preconditions, postconditions, tags, priority, severity, type, behavior, automation, status, is_flaky, layer, steps_type, steps_actions, steps_result, ...`). Si la importación se queja de algún encabezado, exportar un caso de prueba desde el proyecto y comparar los nombres de las columnas: Qase exige que coincidan exactamente.

### 3. Vincular los IDs de Qase

Al importar, Qase les asigna un ID numérico a los casos. Para que cada test reporte sobre su caso:

1. En Qase: **Repository → Export → CSV**.
2. `npm run qase:ids -- ruta/al/export.csv` (completa `tests/qase/qase-ids.json` reconociendo el `TC-...` del título).
3. `npm run docs:qa` (actualiza la columna `qaseId` de la documentación).
4. Commitear `tests/qase/qase-ids.json` y `docs/qa/`.

Desde ese momento, el nombre de cada test lleva la marca `(Qase ID: N)` que usa el reporter para vincularlo. Mientras un caso no tenga ID numérico, sus resultados se reportan igual con su título y sus metadatos; si el proyecto tiene activada la creación automática de casos, Qase crea uno nuevo. Por eso conviene importar el CSV y vincular los IDs **antes** del primer `test:qase`.

### 4. Reportar resultados

Local:

```bash
# bash
QASE_TESTOPS_API_TOKEN=... QASE_TESTOPS_PROJECT=SMB npm run test:qase
```

```powershell
# PowerShell
$env:QASE_TESTOPS_API_TOKEN = "..."; $env:QASE_TESTOPS_PROJECT = "SMB"; npm run test:qase
```

`test:qase` corre en serie (`--runInBand`): el reporter de Jest solo recibe los metadatos de cada test (título, campos, suite, tags) cuando los tests corren en el mismo proceso.

CI: el workflow [`backend-ci.yml`](../../.github/workflows/backend-ci.yml) reporta en cada push y PR a `develop` y `main` (ver más abajo).

### 5. Ver los resultados

En Qase: **Test Runs** → el run `Backend CI #<n> (<rama>)` (o `ServiMap backend - Jest` si se corrió local). Ahí se ve el estado de cada caso, la duración, el error de los que fallaron y el historial. En **Repository** cada caso muestra sus últimas ejecuciones y en **Dashboards** se arman métricas por suite, prioridad o tag (por ejemplo, por `RF-09`).

## CI en GitHub Actions

| Workflow | Qué hace |
|---|---|
| `tests.yml` | Tests con cobertura y análisis de SonarQube (Quality Gate). Sin cambios. |
| `backend-ci.yml` | Unitarios con cobertura, integración contra PostgreSQL, verificación de `docs/qa` y reporte a Qase. |

`backend-ci.yml`:

- Levanta un PostgreSQL 16 descartable. Si existe el secret `DATABASE_URL_TEST`, usa esa base en su lugar.
- Aplica las migraciones en la base de test y corre `test:unit -- --coverage` y `test:integration`. Si fallan, el pipeline falla.
- Corre `docs:qa -- --check`: falla si se agregó un test con `caso(...)` sin documentarlo, o si la documentación no se regeneró.
- Si están los secrets `QASE_TESTOPS_API_TOKEN` y `QASE_TESTOPS_PROJECT`, corre `test:qase`. Ese paso tiene `continue-on-error`: un problema de Qase no bloquea el pipeline. En los PR desde forks (sin secrets) se omite con un aviso.
- Guarda la cobertura y el reporte local de Qase como artefacto (`reportes-backend`).

Secrets y variables a configurar en **Settings → Secrets and variables → Actions**:

| Nombre | Tipo | Obligatorio |
|---|---|---|
| `QASE_TESTOPS_API_TOKEN` | Secret | Para reportar a Qase |
| `QASE_TESTOPS_PROJECT` | Secret | Para reportar a Qase |
| `DATABASE_URL_TEST` | Secret | No (si falta, se usa el PostgreSQL del workflow) |
| `QASE_ENVIRONMENT` | Variable | No |

## Agregar un caso nuevo

1. Escribir el test y envolver su nombre: `it(caso('TC-SOL-049', 'descripción'), async () => { ... })`.
2. Documentarlo en el módulo que corresponda de `tests/qase/casos/` (título, descripción, precondiciones, pasos, resultado esperado, postcondiciones, prioridad, severidad, tipo, capa, módulo, rol y RF).
3. `npm run docs:qa` y commitear los archivos regenerados.
4. Importar el caso nuevo en Qase (o crearlo a mano) y vincular su ID (paso 3).

`caso()` falla si el ID no está documentado, y `docs:qa -- --check` falla si un caso documentado no tiene test.
