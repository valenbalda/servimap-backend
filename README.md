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
├── .env.example
└── package.json
```

Los archivos van en camelCase (por ejemplo `authService.js`, `oficiosRouter.js`), según las convenciones del grupo.

## Roles

| Rol | Qué puede hacer |
|---|---|
| `CLIENTE` | Buscar prestadores, crear solicitudes y calificar servicios finalizados |
| `PRESTADOR` | Gestionar su perfil y sus oficios, y aceptar, rechazar o finalizar solicitudes |
| `ADMINISTRADOR` | Gestionar el catálogo de oficios y moderar comentarios |

Por seguridad, el registro público solo permite crear cuentas de `CLIENTE` o `PRESTADOR`. Las cuentas de administrador se crean directamente en la base de datos.

## Endpoints

### Disponibles

| Servicio | Endpoint | Acceso |
|---|---|---|
| Sistema | `GET /health` | Público |
| Auth | `POST /api/auth/register` | Público |
| Auth | `POST /api/auth/login` | Público |
| Auth | `GET /api/auth/me` | Autenticado |
| Oficios | `GET /api/oficios` (solo activos) | Público |
| Oficios | `GET /api/oficios/todos` | Administrador |
| Oficios | `POST /api/oficios` | Administrador |
| Oficios | `PUT /api/oficios/:id` (nombre y categoría) | Administrador |
| Oficios | `PATCH /api/oficios/:id/estado` (activa o desactiva, no borra) | Administrador |
| Calificaciones | `POST /api/calificaciones` | Cliente |
| Calificaciones | `GET /api/calificaciones` (incluye las moderadas) | Administrador |
| Calificaciones | `PATCH /api/calificaciones/:id/comentario` | Cliente |
| Calificaciones | `PATCH /api/calificaciones/:id/moderacion` | Administrador |
| Calificaciones | `GET /api/calificaciones/prestador/:prestadorId` (sin las moderadas) | Público |
| Calificaciones | `GET /api/calificaciones/prestador/:prestadorId/reputacion` | Público |
| Prestadores | `GET /api/prestadores/me` | Prestador |
| Prestadores | `PUT /api/prestadores/me` | Prestador |

### En desarrollo

- Prestadores: oficios del prestador, consulta con filtros y ubicación en el mapa.
- Solicitudes: crear, consultar, cambiar de estado, cancelar y finalizar.

El detalle de cada endpoint (parámetros, respuestas y códigos de error) está en la documentación Swagger.

### Reglas de negocio

- El estado de una solicitud sigue el orden `PENDIENTE` → `ACEPTADA` → `FINALIZADA` (o `RECHAZADA` / `CANCELADA`).
- Solo el prestador dueño de una solicitud puede cambiar su estado.
- Solo se puede calificar una solicitud `FINALIZADA`, y una sola vez.
- Cada usuario solo accede a sus propias solicitudes.
- Los oficios no se borran: se desactivan, para conservar el historial.
- Los comentarios moderados se conservan con registro de la moderación.

## Seguridad

- Contraseñas hasheadas con **bcryptjs** (nunca se guardan en texto plano).
- Autenticación con **JWT** (firmado con HS256) y control de acceso por rol.
- Mensaje único para email o contraseña incorrectos, para no revelar qué emails existen.
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

Si usás una base de datos nueva y vacía, aplicá las migraciones con `npx prisma migrate deploy`. Si compartís la base del equipo, las tablas ya existen y no hace falta.

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

## Flujo de trabajo con Git

- `main`: versión final y estable. Solo recibe el merge de `develop` al terminar el proyecto.
- `develop`: rama de integración. Todo el trabajo se junta acá.
- `feature/<tarea>`, `fix/<tarea>`, `docs/<tarea>`: una rama por tarea, **siempre creada desde `develop`** (nunca desde otra rama de trabajo).

Pasos para cada tarea:

1. `git checkout develop && git pull`
2. `git checkout -b feature/nombre-de-la-tarea`
3. Commits chicos y descriptivos (`feat:`, `fix:`, `docs:`, `chore:`).
4. `git push -u origin feature/nombre-de-la-tarea`
5. Abrir un Pull Request con base `develop` y pedir revisión.
6. Tras el merge, borrar la rama y volver a empezar desde `develop` actualizado.

Los PR son chicos y se mergean seguido para que nadie quede esperando a otra persona.

## Despliegue

El backend se despliega en **Vercel**. Las variables de entorno (incluida `DATABASE_URL`) se cargan desde el panel del proyecto en Vercel, nunca en el código.