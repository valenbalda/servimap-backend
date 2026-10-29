# Casos de uso

Casos de uso de ServiMap por actor, según el comportamiento de la API del backend. Cada uno indica los requerimientos (RF) que cubre y los casos de prueba automatizados que lo verifican (detalle en [casos-de-prueba.md](casos-de-prueba.md)).

| Actor | Descripción |
|---|---|
| Visitante | Persona sin sesión. Puede registrarse, iniciar sesión, buscar prestadores, ver el mapa y las fichas. |
| Cliente | Usuario con rol `CLIENTE`. Pide servicios, los cancela, los califica y comenta. |
| Prestador | Usuario con rol `PRESTADOR`. Gestiona su perfil y sus oficios, y responde las solicitudes que recibe. |
| Administrador | Usuario con rol `ADMINISTRADOR` (se crea directo en la base). Gestiona los oficios y modera comentarios. |

| CU | Nombre | Actor | RF |
|---|---|---|---|
| [CU-01](#cu-01-registrarse) | Registrarse | Visitante | RF-01 |
| [CU-02](#cu-02-iniciar-y-cerrar-sesión) | Iniciar y cerrar sesión | Visitante, Cliente, Prestador, Administrador | RF-02 |
| [CU-03](#cu-03-buscar-y-filtrar-prestadores) | Buscar y filtrar prestadores | Visitante, Cliente | RF-06, RF-07 |
| [CU-04](#cu-04-ver-el-mapa-de-prestadores) | Ver el mapa de prestadores | Visitante, Cliente | RF-05 |
| [CU-05](#cu-05-ver-la-ficha-de-un-prestador) | Ver la ficha de un prestador | Visitante, Cliente | RF-08, RF-19, RF-20 |
| [CU-06](#cu-06-solicitar-un-servicio) | Solicitar un servicio | Cliente | RF-09, RF-10 |
| [CU-07](#cu-07-consultar-mis-solicitudes) | Consultar mis solicitudes | Cliente | RF-14 |
| [CU-08](#cu-08-cancelar-una-solicitud) | Cancelar una solicitud | Cliente | RF-12 |
| [CU-09](#cu-09-calificar-un-servicio-finalizado) | Calificar un servicio finalizado | Cliente | RF-16, RF-17, RF-18, RF-19 |
| [CU-10](#cu-10-editar-el-comentario-de-una-calificación) | Editar el comentario de una calificación | Cliente | RF-16 |
| [CU-11](#cu-11-completar-y-editar-el-perfil-de-prestador) | Completar y editar el perfil de prestador | Prestador | RF-03, RF-04 |
| [CU-12](#cu-12-gestionar-mis-oficios) | Gestionar mis oficios | Prestador | RF-04 |
| [CU-13](#cu-13-consultar-las-solicitudes-recibidas) | Consultar las solicitudes recibidas | Prestador | RF-15 |
| [CU-14](#cu-14-aceptar-o-rechazar-una-solicitud) | Aceptar o rechazar una solicitud | Prestador | RF-11 |
| [CU-15](#cu-15-finalizar-una-solicitud) | Finalizar una solicitud | Prestador | RF-13, RF-20 |
| [CU-16](#cu-16-ver-las-calificaciones-recibidas) | Ver las calificaciones recibidas | Prestador | RF-21 |
| [CU-17](#cu-17-gestionar-el-catálogo-de-oficios) | Gestionar el catálogo de oficios | Administrador | RF-22 |
| [CU-18](#cu-18-moderar-comentarios) | Moderar comentarios | Administrador | RF-23 |

---

## Visitante y acceso

### CU-01 Registrarse

- **Actor:** Visitante.
- **Requerimiento:** RF-01.
- **Precondiciones:** No tiene cuenta con ese email ni con ese DNI.
- **Flujo principal:**
  1. El visitante envía nombre, DNI, email, contraseña y rol (`CLIENTE` o `PRESTADOR`) a `POST /api/auth/register`.
  2. El sistema valida los datos y normaliza el DNI (sin puntos ni espacios) y el email (minúsculas).
  3. El sistema guarda la cuenta con la contraseña hasheada (bcrypt). Si el rol es `PRESTADOR`, crea también su perfil de prestador vacío.
  4. El sistema responde 201 con los datos de la cuenta, sin DNI ni contraseña.
- **Flujos alternativos:**
  - 2a. Falta un dato, no es texto, el DNI no tiene 7 u 8 números, el email es inválido o la contraseña tiene menos de 8 caracteres: 400 y no se guarda nada.
  - 2b. El rol es `ADMINISTRADOR` u otro: 400 "Rol inválido".
  - 3a. El DNI ya está registrado (aunque se escriba con otro formato): 409.
  - 3b. El email ya está registrado: 409.
- **Postcondiciones:** Existe un usuario activo con el rol elegido (y su perfil de prestador, si corresponde).
- **Casos de prueba:** TC-AUTH-001..011, TC-AUTH-018..022, TC-INT-AUTH-001, 002, 006, 007, 008.

### CU-02 Iniciar y cerrar sesión

- **Actor:** Visitante (al iniciar); Cliente, Prestador o Administrador (al cerrar).
- **Requerimiento:** RF-02.
- **Precondiciones:** La cuenta existe y está activa.
- **Flujo principal:**
  1. El usuario envía email y contraseña a `POST /api/auth/login`.
  2. El sistema verifica las credenciales y devuelve un JWT (HS256) con su id y su rol.
  3. El usuario manda el token en `Authorization: Bearer <token>` en las rutas protegidas; `GET /api/auth/me` devuelve su perfil, con el DNI.
  4. Para cerrar sesión, el frontend descarta el token.
- **Flujos alternativos:**
  - 1a. Falta el email o la contraseña: 400.
  - 2a. Email inexistente o contraseña incorrecta: 401 con el mismo mensaje en los dos casos.
  - 2b. Cuenta desactivada: 403.
  - 3a. Sin token, token mal formado, vencido o firmado con otra clave: 401.
  - 3b. Rol sin permiso para la ruta: 403.
  - 3c. La cuenta se desactivó después del login: `GET /api/auth/me` responde 404.
- **Postcondiciones:** El usuario tiene un token válido hasta que vence (`JWT_EXPIRES_IN`). El backend no tiene endpoint de logout (ver Pendientes en [trazabilidad.md](trazabilidad.md#pendientes)).
- **Casos de prueba:** TC-AUTH-012..017, TC-AUTH-023..030, TC-SEG-001..014, TC-INT-AUTH-003, 004, 005, 009, TC-INT-SEG-001, 002, 006.

### CU-03 Buscar y filtrar prestadores

- **Actor:** Visitante o Cliente.
- **Requerimiento:** RF-06, RF-07.
- **Precondiciones:** Ninguna (ruta pública).
- **Flujo principal:**
  1. El actor pide `GET /api/prestadores` con filtros opcionales: `q` (texto), `oficioId`, `lat`/`lng`/`radioKm`, `calificacionMin`, `disponible` y `limit`.
  2. El sistema devuelve los prestadores activos, con usuario activo y al menos un oficio activo, con su resumen público (sin datos de contacto), ubicación aproximada y reputación.
  3. Si se mandó ubicación, solo devuelve los que están dentro del radio (10 km por defecto), ordenados del más cerca al más lejos, con `distanciaKm`.
- **Flujos alternativos:**
  - 1a. Un filtro es inválido (lat sin lng, radio fuera de 0–100, calificación fuera de 1–5, limit fuera de 1–50, texto de más de 100 caracteres, `disponible` distinto de `true`/`false`): 400.
  - 2a. Ningún prestador cumple los filtros: lista vacía.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-PRE-012..015, TC-PRE-020..022, TC-PRE-033..042, 045, 046, TC-SEG-021, 022, TC-INT-CLI-001, 002, TC-INT-ADM-005.

### CU-04 Ver el mapa de prestadores

- **Actor:** Visitante o Cliente.
- **Requerimiento:** RF-05.
- **Precondiciones:** Ninguna (ruta pública).
- **Flujo principal:**
  1. El actor pide `GET /api/prestadores/mapa`, opcionalmente con `oficioId`.
  2. El sistema devuelve un marcador por prestador activo, disponible, con usuario activo, ubicación cargada y algún oficio activo: nombre, ubicación aproximada (2 decimales), oficio principal y promedio de calificaciones.
- **Flujos alternativos:**
  - 1a. `oficioId` vacío o que no es texto: 400.
  - 2a. No hay prestadores visibles: lista vacía.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-MAPA-001..010, TC-INT-CLI-003, TC-INT-ADM-005.

### CU-05 Ver la ficha de un prestador

- **Actor:** Visitante o Cliente.
- **Requerimiento:** RF-08, RF-19, RF-20.
- **Precondiciones:** El prestador existe y está activo, con usuario activo.
- **Flujo principal:**
  1. El actor pide `GET /api/prestadores/:id`.
  2. El sistema devuelve el resumen público, los datos de contacto (teléfono, WhatsApp, email de contacto), la reputación (promedio, total de calificaciones y servicios finalizados) y los comentarios no moderados.
- **Flujos alternativos:**
  - 1a. El prestador no existe, está inactivo o su usuario está desactivado: 404.
  - 2a. Todavía no tiene calificaciones: promedio `null` y sin comentarios.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-PRE-043, TC-PRE-047..053, TC-CAL-010..013, TC-CAL-028..032, TC-INT-CLI-004, TC-INT-SEG-004.

---

## Cliente

### CU-06 Solicitar un servicio

- **Actor:** Cliente.
- **Requerimiento:** RF-09, RF-10.
- **Precondiciones:** Sesión iniciada como Cliente. El prestador está activo y disponible y ofrece el oficio, que está activo.
- **Flujo principal:**
  1. El cliente envía prestador, oficio, descripción y, opcionalmente, dirección y contacto preferido a `POST /api/solicitudes`.
  2. El sistema valida los datos y las reglas del prestador y del oficio.
  3. El sistema guarda la solicitud en estado `PENDIENTE`, con el cliente del token, y responde 201.
- **Flujos alternativos:**
  - 1a. Falta prestador, oficio o descripción, la descripción supera 1000 caracteres o algún dato no es texto: 400.
  - 2a. El prestador no existe o está inactivo: 404.
  - 2b. El prestador no está disponible: 409.
  - 2c. El oficio no existe, está desactivado o el prestador no lo ofrece: 400.
  - 2d. El usuario no es Cliente: 403.
- **Postcondiciones:** Existe una solicitud `PENDIENTE` del cliente hacia el prestador.
- **Casos de prueba:** TC-SOL-001..010, TC-SOL-017..023, TC-SEG-016, 019, TC-INT-CLI-005, 013, TC-INT-SEG-003.

### CU-07 Consultar mis solicitudes

- **Actor:** Cliente.
- **Requerimiento:** RF-14.
- **Precondiciones:** Sesión iniciada como Cliente.
- **Flujo principal:**
  1. El cliente pide `GET /api/solicitudes`, opcionalmente con `estado`.
  2. El sistema devuelve solo sus solicitudes, de la más nueva a la más vieja, con el oficio, el prestador, el estado y si ya fue calificada. No incluye datos sensibles de las personas.
- **Flujos alternativos:**
  - 1a. `estado` no es uno de `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CANCELADA` o `FINALIZADA`: 400.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-SOL-013..016, TC-SOL-024, 026, 027, 028, TC-SEG-018, TC-INT-CLI-006.

### CU-08 Cancelar una solicitud

- **Actor:** Cliente.
- **Requerimiento:** RF-12.
- **Precondiciones:** Sesión iniciada como el cliente dueño de la solicitud, que está `PENDIENTE` o `ACEPTADA`.
- **Flujo principal:**
  1. El cliente pide `PATCH /api/solicitudes/:id/cancelar`.
  2. El sistema pasa la solicitud a `CANCELADA` y la devuelve.
- **Flujos alternativos:**
  - 1a. La solicitud no existe: 404.
  - 1b. La solicitud es de otro cliente: 403 y no cambia.
  - 1c. La solicitud ya está finalizada, rechazada o cancelada: 409.
- **Postcondiciones:** La solicitud queda `CANCELADA`.
- **Casos de prueba:** TC-SOL-011, 012, TC-SOL-039..043, TC-INT-CLI-007, 008, TC-INT-SEG-004.

### CU-09 Calificar un servicio finalizado

- **Actor:** Cliente.
- **Requerimiento:** RF-16, RF-17, RF-18, RF-19.
- **Precondiciones:** Sesión iniciada como el cliente dueño de una solicitud `FINALIZADA` que todavía no fue calificada.
- **Flujo principal:**
  1. El cliente envía la solicitud, un puntaje entero de 1 a 5 y, opcionalmente, un comentario a `POST /api/calificaciones`.
  2. El sistema guarda la calificación asociada al prestador de la solicitud.
  3. La reputación del prestador (promedio y total) se actualiza.
- **Flujos alternativos:**
  - 1a. Falta la solicitud, el puntaje no es un entero de 1 a 5 o el comentario supera 500 caracteres: 400.
  - 2a. La solicitud no existe: 404.
  - 2b. La solicitud es de otro cliente: 403.
  - 2c. La solicitud no está finalizada: 409.
  - 2d. La solicitud ya fue calificada: 409.
- **Postcondiciones:** Existe una calificación no moderada para la solicitud.
- **Casos de prueba:** TC-CAL-001..006, TC-CAL-019..023, TC-CAL-029, TC-INT-CLI-009, 010, 011.

### CU-10 Editar el comentario de una calificación

- **Actor:** Cliente.
- **Requerimiento:** RF-16.
- **Precondiciones:** Sesión iniciada como el cliente autor de la calificación, que no está moderada.
- **Flujo principal:**
  1. El cliente envía el comentario nuevo a `PATCH /api/calificaciones/:id/comentario`.
  2. El sistema guarda el comentario sin espacios sobrantes.
- **Flujos alternativos:**
  - 1a. Falta el comentario, son solo espacios o supera 500 caracteres: 400.
  - 2a. La calificación no existe: 404.
  - 2b. La calificación es de otro cliente: 403.
  - 2c. La calificación está moderada: 409.
- **Postcondiciones:** La calificación tiene el comentario nuevo.
- **Casos de prueba:** TC-CAL-007..009, TC-CAL-024..027, TC-INT-CLI-012.

---

## Prestador

### CU-11 Completar y editar el perfil de prestador

- **Actor:** Prestador.
- **Requerimiento:** RF-03, RF-04.
- **Precondiciones:** Sesión iniciada como Prestador con perfil activo.
- **Flujo principal:**
  1. El prestador consulta su perfil con `GET /api/prestadores/me` (incluye su ubicación exacta).
  2. Envía los campos a cambiar a `PUT /api/prestadores/me`: descripción, foto, zona de cobertura, ubicación, rango de precios, teléfono, WhatsApp, email de contacto y disponibilidad.
  3. El sistema valida, guarda solo los campos editables (sin espacios sobrantes) y devuelve el perfil actualizado.
- **Flujos alternativos:**
  - 2a. Un campo de texto no es texto, la descripción queda vacía, el email de contacto no tiene arroba o el teléfono/WhatsApp no tiene formato válido: 400.
  - 2b. Latitud, longitud o precios fuera de rango, o `disponible` no booleano: 400.
  - 2c. No se manda ningún campo editable: 400.
  - 3a. El precio mínimo queda mayor al máximo (comparando con el guardado si solo se manda uno): 400.
  - 3b. El perfil no existe o está inactivo: 404.
  - 3c. Campos no editables (por ejemplo, `activo` o `usuarioId`) se ignoran.
- **Postcondiciones:** El perfil queda actualizado.
- **Casos de prueba:** TC-PRE-001..008, TC-PRE-016..019, TC-PRE-023..027, TC-PRE-044, TC-SEG-017, TC-INT-PRE-001, 002, 003.

### CU-12 Gestionar mis oficios

- **Actor:** Prestador.
- **Requerimiento:** RF-04.
- **Precondiciones:** Sesión iniciada como Prestador con perfil activo.
- **Flujo principal:**
  1. El prestador envía la lista completa de oficios a `PUT /api/prestadores/me/oficios`.
  2. El sistema reemplaza sus oficios por los de la lista (los repetidos cuentan una vez), en una transacción, y devuelve el perfil.
- **Flujos alternativos:**
  - 1a. `oficioIds` no es una lista de textos: 400.
  - 2a. Algún oficio no existe o está desactivado: 400 y no cambia nada.
  - 2b. Lista vacía: el prestador queda sin oficios (y deja de aparecer en la búsqueda y el mapa).
- **Postcondiciones:** El prestador ofrece exactamente los oficios de la lista.
- **Casos de prueba:** TC-PRE-009..011, TC-PRE-028..032, TC-INT-PRE-004, 005.

### CU-13 Consultar las solicitudes recibidas

- **Actor:** Prestador.
- **Requerimiento:** RF-15.
- **Precondiciones:** Sesión iniciada como Prestador con perfil activo.
- **Flujo principal:**
  1. El prestador pide `GET /api/solicitudes`, opcionalmente con `estado`.
  2. El sistema busca su perfil por el usuario del token y devuelve solo las solicitudes que recibió, de la más nueva a la más vieja.
- **Flujos alternativos:**
  - 1a. `estado` inválido: 400.
  - 2a. El perfil no existe o está inactivo: 404.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-SOL-013..016, TC-SOL-025, 029, 030, TC-INT-PRE-011.

### CU-14 Aceptar o rechazar una solicitud

- **Actor:** Prestador.
- **Requerimiento:** RF-11.
- **Precondiciones:** Sesión iniciada como el prestador dueño de una solicitud `PENDIENTE`.
- **Flujo principal:**
  1. El prestador pide `PATCH /api/solicitudes/:id/aceptar` o `PATCH /api/solicitudes/:id/rechazar`.
  2. El sistema pasa la solicitud a `ACEPTADA` o `RECHAZADA` y la devuelve.
- **Flujos alternativos:**
  - 1a. La solicitud no existe: 404.
  - 1b. La solicitud es de otro prestador, o el usuario no tiene perfil de prestador: 403 y no cambia.
  - 1c. La solicitud no está pendiente: 409 y no cambia.
- **Postcondiciones:** La solicitud queda `ACEPTADA` o `RECHAZADA`.
- **Casos de prueba:** TC-SOL-011, 012, TC-SOL-032..038, TC-SEG-024, TC-INT-PRE-006, 007, 009, 010, 013.

### CU-15 Finalizar una solicitud

- **Actor:** Prestador.
- **Requerimiento:** RF-13, RF-20.
- **Precondiciones:** Sesión iniciada como el prestador dueño de una solicitud `ACEPTADA`.
- **Flujo principal:**
  1. El prestador pide `PATCH /api/solicitudes/:id/finalizar`.
  2. El sistema pasa la solicitud a `FINALIZADA`.
  3. La cantidad de servicios finalizados del prestador aumenta en 1 y el cliente ya puede calificar.
- **Flujos alternativos:**
  - 1a. La solicitud no existe: 404.
  - 1b. La solicitud es de otro prestador, o el usuario no tiene perfil de prestador: 403.
  - 1c. La solicitud no está aceptada: 409.
- **Postcondiciones:** La solicitud queda `FINALIZADA`.
- **Casos de prueba:** TC-SOL-011, 012, TC-SOL-044..048, TC-INT-PRE-008, 009, 010.

### CU-16 Ver las calificaciones recibidas

- **Actor:** Prestador.
- **Requerimiento:** RF-21.
- **Precondiciones:** Sesión iniciada como Prestador con perfil activo.
- **Flujo principal:**
  1. El prestador pide `GET /api/prestadores/me/calificaciones`.
  2. El sistema devuelve sus calificaciones y comentarios no moderados, los más nuevos primero.
- **Flujos alternativos:**
  - 2a. Todavía no recibió calificaciones: lista vacía.
  - 2b. El perfil no existe o está inactivo: 404.
- **Postcondiciones:** Ninguna (solo lectura).
- **Casos de prueba:** TC-PRE-054..058, TC-CAL-031, 032, TC-INT-PRE-012.

---

## Administrador

### CU-17 Gestionar el catálogo de oficios

- **Actor:** Administrador.
- **Requerimiento:** RF-22.
- **Precondiciones:** Sesión iniciada como Administrador.
- **Flujo principal:**
  1. El administrador consulta todos los oficios, incluidos los inactivos, con `GET /api/oficios/todos`.
  2. Crea un oficio con `POST /api/oficios` (nombre y categoría opcional).
  3. Edita nombre o categoría con `PUT /api/oficios/:id`.
  4. Activa o desactiva un oficio con `PATCH /api/oficios/:id/estado`. Los oficios no se borran.
- **Flujos alternativos:**
  - 2a/3a. Nombre vacío o que no es texto, categoría que no es texto, o edición sin datos: 400.
  - 2b/3b. Ya existe otro oficio con ese nombre: 409.
  - 3c/4a. El oficio no existe: 404.
  - 4b. `activo` no es booleano: 400.
  - 4c. Al desactivar un oficio, deja de verse en `GET /api/oficios`, y los prestadores que no tengan otro oficio activo dejan de aparecer en la búsqueda y el mapa.
  - *. Un Cliente o Prestador intenta estas acciones: 403 y no cambia nada.
- **Postcondiciones:** El catálogo refleja los cambios; el historial de solicitudes se conserva.
- **Casos de prueba:** TC-OFI-001..027, TC-INT-ADM-001..005, TC-INT-ADM-008.

### CU-18 Moderar comentarios

- **Actor:** Administrador.
- **Requerimiento:** RF-23.
- **Precondiciones:** Sesión iniciada como Administrador. La calificación existe y no está moderada.
- **Flujo principal:**
  1. El administrador consulta todas las calificaciones, incluidas las moderadas, con `GET /api/calificaciones`.
  2. Modera una con `PATCH /api/calificaciones/:id/moderacion` indicando el motivo.
  3. El sistema la marca como moderada con fecha y motivo, conserva el comentario original y deja de mostrarla en los listados públicos y del prestador.
- **Flujos alternativos:**
  - 2a. Falta el motivo, son solo espacios o supera 200 caracteres: 400.
  - 2b. La calificación no existe: 404.
  - 2c. Ya estaba moderada: 409.
  - *. Un Cliente o Prestador intenta estas acciones: 403.
- **Postcondiciones:** La calificación queda moderada, con registro de la moderación. Su autor ya no puede editar el comentario.
- **Casos de prueba:** TC-CAL-014..018, TC-CAL-026, TC-CAL-033..036, TC-INT-ADM-006, 007, 008, TC-INT-PRE-012.
