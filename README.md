# ServiMap - Backend

API REST de **ServiMap**, una plataforma web que combina un mapa interactivo con un directorio de prestadores de servicios del hogar (plomería, electricidad, pintura, gas y carpintería).

Los clientes ubican prestadores cercanos, comparan rangos de precio y reputación, y envían una solicitud de servicio. El prestador la acepta o la rechaza, y si la acepta puede finalizarla. Al terminar, el cliente califica y comenta. Un administrador gestiona los oficios y modera los comentarios.

> El frontend (React + Vite) vive en un repositorio aparte y consume esta API.

## Roles

| Rol | Qué puede hacer |
|---|---|
| **Cliente** | Buscar prestadores, crear y cancelar solicitudes, calificar trabajos finalizados |
| **Prestador** | Gestionar su perfil y oficios, aceptar, rechazar y finalizar solicitudes, ver sus calificaciones |
| **Administrador** | Gestionar oficios y moderar comentarios |

## Tecnologías

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 o superior |
| Framework | Express |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Autenticación | JWT (JSON Web Tokens) y bcrypt |
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
│   └── schema.prisma        # modelos de la base de datos
├── src/
│   ├── config/              # variables de entorno y Swagger
│   ├── controllers/         # capa HTTP
│   ├── middlewares/         # auth, roles, validación, manejo de errores
│   ├── routes/              # definición de endpoints
│   ├── services/            # lógica de negocio
│   ├── app.js               # configuración de Express
│   └── server.js            # arranque del servidor
├── .env.example
└── package.json
```

## Servicios y endpoints

Propuesta inicial. El detalle definitivo de cada servicio (parámetros, validaciones y códigos de respuesta) está en la hoja **Servicios** del Plan de desarrollo y en la documentación Swagger.

| Área | Endpoint | Acceso | Requerimiento |
|---|---|---|---|
| Auth | `POST /api/auth/register` | Público | RF-01 |
| Auth | `POST /api/auth/login` | Público | RF-02 |
| Prestadores | `GET /api/prestadores` (filtros: oficio y distancia; búsqueda por nombre, oficio o zona) | Público | RF-06, RF-07 |
| Prestadores | `GET /api/prestadores/mapa` | Público | RF-05 |
| Prestadores | `GET /api/prestadores/:id` | Público | RF-08, RF-19, RF-20 |
| Prestadores | `GET /api/prestadores/me` y `PUT /api/prestadores/me` | Prestador | RF-03, RF-04 |
| Prestadores | `GET /api/prestadores/me/calificaciones` | Prestador | RF-21 |
| Oficios | `GET /api/oficios` | Público | RF-04 |
| Oficios | `POST /api/oficios`, `PUT /api/oficios/:id`, `PATCH /api/oficios/:id/desactivar` | Administrador | RF-22 |
| Solicitudes | `POST /api/solicitudes` | Cliente | RF-09, RF-10 |
| Solicitudes | `GET /api/solicitudes` (según el rol) | Cliente o Prestador | RF-14, RF-15 |
| Solicitudes | `PATCH /api/solicitudes/:id/aceptar` y `/rechazar` | Prestador | RF-11 |
| Solicitudes | `PATCH /api/solicitudes/:id/cancelar` | Cliente | RF-12 |
| Solicitudes | `PATCH /api/solicitudes/:id/finalizar` | Prestador | RF-13 |
| Calificaciones | `POST /api/solicitudes/:id/calificacion` | Cliente | RF-16, RF-17, RF-18 |
| Moderación | `GET /api/admin/comentarios` y `PATCH /api/admin/comentarios/:id/ocultar` | Administrador | RF-23 |

### Reglas de negocio

- Estados de una solicitud: `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CANCELADA` y `FINALIZADA`.
- Solo el prestador destinatario puede aceptar o rechazar una solicitud `PENDIENTE`.
- El cliente dueño de la solicitud puede cancelarla mientras el estado lo permita. La cancelación es irreversible.
- Solo el prestador puede finalizar una solicitud que está `ACEPTADA`.
- Solo se puede calificar una solicitud `FINALIZADA`, con un puntaje entero de 1 a 5, y una sola vez por solicitud.
- El promedio de calificaciones y la cantidad de servicios finalizados se calculan automáticamente.
- Los oficios no pueden tener nombres duplicados y, al desactivarlos, se conserva la información histórica.
- Los comentarios moderados se ocultan, pero se conserva el registro, la fecha y el motivo.
- Cada usuario solo accede a sus propios datos.

## Seguridad

- Contraseñas hasheadas con **bcrypt** (nunca se guardan en texto plano).
- Autenticación con **JWT** y control de acceso por rol (Cliente, Prestador o Administrador).
- **Helmet** para los headers HTTP de seguridad.
- **CORS** restringido a los orígenes definidos en `CORS_ORIGIN`.
- **Rate limiting** para frenar abusos y fuerza bruta en el login.
- Validación de todas las entradas antes de llegar a los servicios.
- Prisma usa consultas parametrizadas, lo que previene inyección SQL.
- Secretos y credenciales solo por variables de entorno. El `.env` no se sube al repositorio.

## Puesta en marcha

### Requisitos

- Node.js 20 o superior
- Una base de datos PostgreSQL (local o en la nube, por ejemplo Neon o Supabase)

### Instalación

```bash
git clone https://github.com/valenbalda/servimap-backend.git
cd servimap-backend
npm install
cp .env.example .env     # completar los valores reales
npx prisma migrate dev   # crea las tablas en la base
npm run dev
```

El servidor queda en `http://localhost:3000`.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `NODE_ENV` | `development` o `production` |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | Duración del token (por ejemplo `1d`) |
| `CORS_ORIGIN` | URL(s) del frontend permitidas, separadas por coma |

## Documentación de la API (Swagger)

Con el servidor corriendo, abrí **`http://localhost:3000/api-docs`**.

Para probar endpoints protegidos:

1. Ejecutá `POST /api/auth/login` desde Swagger y copiá el `token` de la respuesta.
2. Hacé clic en el botón **Authorize** (arriba a la derecha).
3. Pegá el token y confirmá.
4. Desde ese momento, los endpoints con candado se prueban autenticados.

## Flujo de trabajo con Git

- `main`: versión final y estable. Solo recibe el merge de `develop` al terminar el proyecto.
- `develop`: rama de integración. Todo el trabajo se junta acá.
- `feature/<tarea>`: una rama por tarea, **siempre creada desde `develop`** (nunca desde otra rama de trabajo). Los nombres salen de la columna "Branch sugerida" del Plan de desarrollo.

Pasos para cada tarea:

1. `git checkout develop && git pull`
2. `git checkout -b feature/nombre-de-la-tarea`
3. Commits chicos y descriptivos (`feat:`, `fix:`, `docs:`, `chore:`).
4. `git push -u origin feature/nombre-de-la-tarea`
5. Abrir un Pull Request hacia `develop` y pedir revisión.
6. Tras el merge, borrar la rama y volver a empezar desde `develop` actualizado.

Los PR son chicos y se mergean seguido para que nadie quede esperando a otra persona.

## Despliegue

El backend se despliega en **Vercel**. Las variables de entorno (incluida `DATABASE_URL`) se cargan desde el panel del proyecto en Vercel, nunca en el código.
