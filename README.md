# ServiMap - Backend

API REST de **ServiMap**, una plataforma web que combina un mapa interactivo con un directorio de prestadores de servicios del hogar (plomería, electricidad, pintura, gas y carpintería).

Los clientes ubican prestadores cercanos, comparan rangos de precio y calificaciones, y envían una solicitud de servicio. El prestador la acepta, la rechaza o la finaliza, y al terminar el cliente califica y comenta. El administrador gestiona los oficios y modera los comentarios.

> El frontend (React + Vite) vive en un repositorio aparte y consume esta API.

**Grupo N° 7:** Baldasarre Valentina, Favonio Delfina, Ferrari Oriana y Oliveira Joaquim.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 o superior |
| Framework | Express 5 |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL (Neon) |
| Autenticación | JWT (jsonwebtoken) y bcryptjs |
| Documentación | Swagger / OpenAPI |
| Pruebas | Jest y Supertest |
| Calidad | GitHub Actions y SonarQube Cloud |
| Despliegue | Vercel |

## Arquitectura

El código se organiza en capas, cada una con una sola responsabilidad:

```
Request → Rutas → Controladores → Servicios → Prisma → PostgreSQL
```

- **Rutas:** definen los endpoints y los middlewares que se aplican a cada uno.
- **Controladores:** reciben el pedido HTTP, validan la entrada y devuelven la respuesta. No tienen lógica de negocio.
- **Servicios:** contienen las reglas del negocio. Reciben datos simples (no `req` ni `res`) y devuelven objetos o lanzan errores con su código HTTP.
- **Prisma:** acceso a la base de datos.

### Estructura de carpetas

```
servimap-backend/
├── .github/workflows/       # CI: tests, cobertura y análisis de SonarQube
├── prisma/
│   ├── schema.prisma        # modelos de la base de datos
│   └── migrations/          # historial de migraciones
├── src/
│   ├── config/              # env.js, prisma.js, swagger.js
│   ├── controllers/         # capa HTTP
│   ├── middlewares/         # autenticación, roles, errores
│   ├── routes/              # definición de endpoints
│   ├── services/            # lógica de negocio
│   ├── app.js               # configuración de Express
│   └── server.js            # arranque del servidor
├── tests/                   # pruebas automáticas (Jest)
├── sonar-project.properties # configuración de SonarQube
├── .env.example
└── package.json
```

Los archivos van en camelCase (por ejemplo `authService.js`, `oficiosRouter.js`), según las convenciones del grupo.

## Roles

| Rol | Qué puede hacer |
|---|---|
| `CLIENTE` | Buscar prestadores, crear y cancelar solicitudes, consultar las suyas y calificar servicios finalizados |
| `PRESTADOR` | Gestionar su perfil y sus oficios, consultar sus solicitudes y calificaciones, y aceptar, rechazar o finalizar solicitudes |
| `ADMINISTRADOR` | Gestionar el catálogo de oficios y moderar comentarios |

Por seguridad, el registro público solo permite crear cuentas de `CLIENTE` o `PRESTADOR`. Las cuentas de administrador se crean directamente en la base de datos.

Para crear una cuenta hay que informar el **DNI** (7 u 8 números; se aceptan puntos o espacios). Es único: una misma persona no puede tener más de una cuenta. El inicio de sesión sigue siendo con email y contraseña.

## Endpoints

| Servicio | Endpoint | Acceso |
|---|---|---|
| Sistema | `GET /health` | Público |
| Auth | `POST /api/auth/register` (requiere `dni`) | Público |
| Auth | `POST /api/auth/login` | Público |
| Auth | `GET /api/auth/me` (incluye el DNI, solo para su dueño) | Autenticado |
| Oficios | `GET /api/oficios` (solo activos) | Público |
| Oficios | `GET /api/oficios/todos` | Administrador |
| Oficios | `POST /api/oficios` | Administrador |
| Oficios | `PUT /api/oficios/:id` (nombre y categoría) | Administrador |
| Oficios | `PATCH /api/oficios/:id/estado` (activa o desactiva, no borra) | Administrador |
| Prestadores | `GET /api/prestadores` (búsqueda con filtros: `oficioId`, `q`, `lat`/`lng`/`radioKm`, `calificacionMin`, `limit`) | Público |
| Prestadores | `GET /api/prestadores/mapa` (marcadores con ubicación aproximada) | Público |
| Prestadores | `GET /api/prestadores/:id` (ficha con contacto, reputación y comentarios) | Público |
| Prestadores | `GET /api/prestadores/me` | Prestador |
| Prestadores | `PUT /api/prestadores/me` | Prestador |
| Prestadores | `PUT /api/prestadores/me/oficios` (reemplaza los oficios del prestador) | Prestador |
| Prestadores | `GET /api/prestadores/me/calificaciones` (sin las moderadas) | Prestador |
| Solicitudes | `POST /api/solicitudes` | Cliente |
| Solicitudes | `GET /api/solicitudes` (las propias; filtro opcional `estado`) | Cliente o prestador |
| Solicitudes | `PATCH /api/solicitudes/:id/aceptar` | Prestador |
| Solicitudes | `PATCH /api/solicitudes/:id/rechazar` | Prestador |
| Solicitudes | `PATCH /api/solicitudes/:id/finalizar` | Prestador |
| Solicitudes | `PATCH /api/solicitudes/:id/cancelar` | Cliente |
| Calificaciones | `POST /api/calificaciones` | Cliente |
| Calificaciones | `GET /api/calificaciones` (incluye las moderadas) | Administrador |
| Calificaciones | `PATCH /api/calificaciones/:id/comentario` | Cliente |
| Calificaciones | `PATCH /api/calificaciones/:id/moderacion` | Administrador |
| Calificaciones | `GET /api/calificaciones/prestador/:prestadorId` (sin las moderadas) | Público |
| Calificaciones | `GET /api/calificaciones/prestador/:prestadorId/reputacion` | Público |

El detalle de cada endpoint (parámetros, respuestas y códigos de error) está en la documentación Swagger.

### Reglas de negocio

- El estado de una solicitud sigue el orden `PENDIENTE` → `ACEPTADA` → `FINALIZADA` (o `RECHAZADA` / `CANCELADA`).
- Solo el prestador dueño de una solicitud puede aceptarla o rechazarla (si está pendiente) y finalizarla (si está aceptada). Solo el cliente dueño puede cancelarla (si está pendiente o aceptada).
- Solo se puede calificar una solicitud `FINALIZADA`, y una sola vez.
- Cada usuario solo accede a sus propias solicitudes.
- Los oficios no se borran: se desactivan, para conservar el historial.
- Los comentarios moderados se conservan con registro de la moderación.
- La búsqueda y el mapa solo muestran prestadores activos, con usuario activo y al menos un oficio activo. El mapa, además, solo muestra los disponibles y con ubicación cargada.
- El DNI es único y solo lo ve su dueño en `GET /api/auth/me`. No se devuelve en el registro, el login ni los listados, y no se puede modificar después de creada la cuenta.

## Seguridad

- Contraseñas hasheadas con **bcryptjs** (nunca se guardan en texto plano).
- Autenticación con **JWT** (firmado con HS256) y control de acceso por rol.
- Mensaje único para email o contraseña incorrectos, para no revelar qué emails existen.
- DNI único por persona, fuera del token y de las respuestas públicas.
- **Helmet** para los headers HTTP de seguridad.
- **CORS** restringido a los orígenes definidos en `CORS_ORIGIN`.
- **Rate limiting** para frenar abusos y fuerza bruta.
- Validación de las entradas en los controladores antes de llegar a los servicios.
- Manejo de errores centralizado: los errores internos no exponen detalles al cliente.
- Prisma usa consultas parametrizadas, lo que previene inyección SQL.
- Secretos y credenciales solo por variables de entorno. El `.env` no se sube al repositorio.

## Puesta en marcha

### Requisitos

- Node.js 20 o superior
- Una base de datos PostgreSQL (el proyecto usa Neon)

### Instalación

```bash
git clone <url-del-repositorio>
cd servimap-backend
git checkout develop
npm install
cp .env.example .env     # completar los valores reales
npx prisma generate
npm run dev
```

El servidor queda en `http://localhost:3000`.

Si usás una base de datos nueva y vacía, aplicá las migraciones con `npx prisma migrate deploy`. Si compartís la base del equipo, ya tiene las tablas, pero después de traer cambios nuevos corré `npx prisma migrate deploy` y `npx prisma generate`.

> La migración que agrega el DNI falla si la tabla de usuarios ya tiene filas, porque la columna es obligatoria y no tiene valor por defecto. En una base con datos de prueba, vaciá los usuarios antes de aplicarla.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `NODE_ENV` | `development` o `production` |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens (obligatorio, mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | Duración del token (por defecto `1d`) |
| `CORS_ORIGIN` | URL(s) del frontend permitidas, separadas por coma |

## Documentación de la API (Swagger)

Con el servidor corriendo, abrí **`http://localhost:3000/api-docs`**.

Para probar endpoints protegidos:

1. Ejecutá `POST /api/auth/login` desde Swagger y copiá el `token` de la respuesta.
2. Hacé clic en el botón **Authorize** (arriba a la derecha).
3. Pegá el token (sin la palabra `Bearer`) y confirmá.
4. Desde ese momento, los endpoints con candado se prueban autenticados.

## Pruebas y calidad

```bash
npm test                  # corre todas las pruebas
npm test -- --coverage    # además muestra la cobertura
npm run test:unit         # solo los tests unitarios
npm run test:integration  # solo los de integración (necesitan DATABASE_URL_TEST)
npm run test:qase         # todo, reportando los resultados a Qase
```

Los casos de uso, los casos de prueba, la trazabilidad con los requerimientos y la integración con Qase están documentados en [docs/qa](docs/qa/README.md).

- Las pruebas automáticas usan **Jest** y cubren servicios, controladores y middlewares con la base de datos simulada.
- En cada Pull Request, **GitHub Actions** corre las pruebas con cobertura y envía el análisis a **SonarQube Cloud**.
- El Quality Gate exige como mínimo 80% de cobertura y no más de 3% de duplicación en el código nuevo.

## Flujo de trabajo con Git

- `main`: versión final y estable. Solo recibe el merge de `develop` al terminar el proyecto.
- `develop`: rama de integración. Todo el trabajo se junta acá.
- `feature/<tarea>`, `fix/<tarea>`, `docs/<tarea>`, `test/<tarea>`: una rama por tarea, **siempre creada desde `develop`** (nunca desde otra rama de trabajo).

Pasos para cada tarea:

1. `git checkout develop && git pull`
2. `git checkout -b feature/nombre-de-la-tarea`
3. Commits chicos y descriptivos (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
4. `git push -u origin feature/nombre-de-la-tarea`
5. Abrir un Pull Request con base `develop` y pedir