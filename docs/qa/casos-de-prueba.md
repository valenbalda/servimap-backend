<!-- Archivo generado con "npm run docs:qa" a partir de tests/qase/casos. No editar a mano. -->

# Casos de prueba del backend

Total: **358 casos** (303 unitarios y 55 de integración), todos automatizados.
Cada caso corresponde a un test real que lo referencia con `caso('TC-...', nombre)`.
Un `it.each` es un solo caso con varios juegos de datos: cada uno se reporta como un resultado del mismo caso.

La columna **qaseId** se completa cuando los casos existen en Qase (ver [README](README.md#3-vincular-los-ids-de-qase)).

## Resumen

| ID | Título | Capa | Módulo | Rol | RF | Prioridad | Severidad | Tipo | Automatizado | qaseId |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [TC-SIS-001](#tc-sis-001) | Health check | Unitario | Sistema y errores | Todos | Transversal | alta | normal | funcional | Sí | 314 |
| [TC-SIS-002](#tc-sis-002) | Ruta inexistente responde 404 | Unitario | Sistema y errores | Todos | Transversal | media | normal | funcional | Sí | 315 |
| [TC-SIS-003](#tc-sis-003) | Error con respuesta ya enviada | Unitario | Sistema y errores | Todos | Transversal | baja | menor | funcional | Sí | 316 |
| [TC-SIS-004](#tc-sis-004) | Traducción de errores conocidos | Unitario | Sistema y errores | Todos | Transversal | alta | mayor | funcional | Sí | 317 |
| [TC-SIS-005](#tc-sis-005) | Error del negocio con status propio | Unitario | Sistema y errores | Todos | Transversal | media | normal | funcional | Sí | 318 |
| [TC-SIS-006](#tc-sis-006) | Error inesperado sin detalles | Unitario | Sistema y errores | Todos | Transversal | alta | mayor | seguridad | Sí | 319 |
| [TC-SEG-001](#tc-seg-001) | Sin header Authorization | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 320 |
| [TC-SEG-002](#tc-seg-002) | Tipo de autorización distinto de Bearer | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 321 |
| [TC-SEG-003](#tc-seg-003) | Bearer sin token | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 322 |
| [TC-SEG-004](#tc-seg-004) | Token mal formado | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 323 |
| [TC-SEG-005](#tc-seg-005) | Token firmado con otra clave | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 324 |
| [TC-SEG-006](#tc-seg-006) | Token vencido | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 325 |
| [TC-SEG-007](#tc-seg-007) | Algoritmo distinto de HS256 | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 326 |
| [TC-SEG-008](#tc-seg-008) | Token válido | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | mayor | seguridad | Sí | 327 |
| [TC-SEG-009](#tc-seg-009) | autorizar sin usuario autenticado | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 328 |
| [TC-SEG-010](#tc-seg-010) | Rol no permitido | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | critica | seguridad | Sí | 329 |
| [TC-SEG-011](#tc-seg-011) | Rol permitido | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | mayor | seguridad | Sí | 330 |
| [TC-SEG-012](#tc-seg-012) | Varios roles permitidos | Unitario | Seguridad: middlewares | Todos | RF-02 | alta | mayor | seguridad | Sí | 331 |
| [TC-SEG-013](#tc-seg-013) | Rutas protegidas sin token | Unitario | Seguridad: API HTTP y JWT | Todos | RF-02 | alta | critica | seguridad | Sí | 332 |
| [TC-SEG-014](#tc-seg-014) | Token inválido en rutas protegidas | Unitario | Seguridad: API HTTP y JWT | Todos | RF-02 | alta | critica | seguridad | Sí | 333 |
| [TC-SEG-015](#tc-seg-015) | Rol incorrecto | Unitario | Seguridad: API HTTP y JWT | Todos | RF-03, RF-09, RF-11, RF-12, RF-13, RF-14, RF-15, RF-21 | alta | critica | seguridad | Sí | 334 |
| [TC-SEG-016](#tc-seg-016) | Rol correcto y datos válidos | Unitario | Seguridad: API HTTP y JWT | Todos | RF-03, RF-04, RF-09, RF-11, RF-12, RF-13, RF-14, RF-15, RF-21 | alta | mayor | funcional | Sí | 335 |
| [TC-SEG-017](#tc-seg-017) | El id sale del token | Unitario | Seguridad: API HTTP y JWT | Todos | RF-03 | alta | critica | seguridad | Sí | 336 |
| [TC-SEG-018](#tc-seg-018) | Usuario y rol del token | Unitario | Seguridad: API HTTP y JWT | Todos | RF-14, RF-15 | alta | critica | seguridad | Sí | 337 |
| [TC-SEG-019](#tc-seg-019) | Datos inválidos con JWT válido | Unitario | Seguridad: API HTTP y JWT | Todos | RF-04, RF-09, RF-10, RF-14 | media | normal | funcional | Sí | 338 |
| [TC-SEG-020](#tc-seg-020) | JSON inválido | Unitario | Seguridad: API HTTP y JWT | Todos | Transversal | media | normal | funcional | Sí | 339 |
| [TC-SEG-021](#tc-seg-021) | Rutas públicas sin token | Unitario | Seguridad: API HTTP y JWT | Todos | RF-05, RF-07, RF-08 | alta | mayor | funcional | Sí | 340 |
| [TC-SEG-022](#tc-seg-022) | Rutas públicas con filtros inválidos | Unitario | Seguridad: API HTTP y JWT | Todos | RF-05, RF-06 | media | normal | funcional | Sí | 341 |
| [TC-SEG-023](#tc-seg-023) | Ruta inexistente | Unitario | Seguridad: API HTTP y JWT | Todos | Transversal | baja | menor | funcional | Sí | 342 |
| [TC-SEG-024](#tc-seg-024) | Errores del servicio a HTTP | Unitario | Seguridad: API HTTP y JWT | Todos | RF-11 | media | normal | funcional | Sí | 343 |
| [TC-SEG-025](#tc-seg-025) | 500 sin detalle interno | Unitario | Seguridad: API HTTP y JWT | Todos | Transversal | alta | mayor | seguridad | Sí | 344 |
| [TC-AUTH-001](#tc-auth-001) | Registro sin datos obligatorios | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 345 |
| [TC-AUTH-002](#tc-auth-002) | Registro sin DNI | Unitario | Autenticación: registro | Visitante | RF-01 | alta | mayor | funcional | Sí | 346 |
| [TC-AUTH-003](#tc-auth-003) | Dato que no es texto | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 347 |
| [TC-AUTH-004](#tc-auth-004) | DNI numérico | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 348 |
| [TC-AUTH-005](#tc-auth-005) | DNI con formato inválido | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 349 |
| [TC-AUTH-006](#tc-auth-006) | Email inválido | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 350 |
| [TC-AUTH-007](#tc-auth-007) | Contraseña corta | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | seguridad | Sí | 351 |
| [TC-AUTH-008](#tc-auth-008) | Registro exitoso con datos limpios | Unitario | Autenticación: registro | Visitante | RF-01 | alta | mayor | funcional | Sí | 352 |
| [TC-AUTH-009](#tc-auth-009) | DNI normalizado | Unitario | Autenticación: registro | Visitante | RF-01 | alta | mayor | funcional | Sí | 353 |
| [TC-AUTH-010](#tc-auth-010) | DNI que empieza con 9 | Unitario | Autenticación: registro | Visitante | RF-01 | media | normal | funcional | Sí | 354 |
| [TC-AUTH-011](#tc-auth-011) | Error del servicio en el registro | Unitario | Autenticación: registro | Visitante | RF-01 | baja | menor | funcional | Sí | 355 |
| [TC-AUTH-012](#tc-auth-012) | Login sin email o contraseña | Unitario | Autenticación: sesión | Visitante | RF-02 | media | normal | funcional | Sí | 356 |
| [TC-AUTH-013](#tc-auth-013) | Login con email en minúsculas | Unitario | Autenticación: sesión | Visitante | RF-02 | alta | mayor | funcional | Sí | 357 |
| [TC-AUTH-014](#tc-auth-014) | Login sin DNI | Unitario | Autenticación: sesión | Visitante | RF-02 | media | normal | funcional | Sí | 358 |
| [TC-AUTH-015](#tc-auth-015) | Error del servicio en el login | Unitario | Autenticación: sesión | Visitante | RF-02 | baja | menor | funcional | Sí | 359 |
| [TC-AUTH-016](#tc-auth-016) | Perfil del usuario autenticado | Unitario | Autenticación: sesión | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 360 |
| [TC-AUTH-017](#tc-auth-017) | Error del servicio en el perfil | Unitario | Autenticación: sesión | Cliente / Prestador | RF-01, RF-02 | baja | menor | funcional | Sí | 361 |
| [TC-AUTH-018](#tc-auth-018) | Rol no permitido en el registro | Unitario | Autenticación: servicio | Visitante | RF-01 | alta | critica | seguridad | Sí | 362 |
| [TC-AUTH-019](#tc-auth-019) | DNI ya registrado | Unitario | Autenticación: servicio | Visitante | RF-01 | alta | mayor | funcional | Sí | 363 |
| [TC-AUTH-020](#tc-auth-020) | Email ya registrado | Unitario | Autenticación: servicio | Visitante | RF-01 | alta | mayor | funcional | Sí | 364 |
| [TC-AUTH-021](#tc-auth-021) | Alta de cliente | Unitario | Autenticación: servicio | Visitante | RF-01 | alta | critica | seguridad | Sí | 365 |
| [TC-AUTH-022](#tc-auth-022) | Alta de prestador | Unitario | Autenticación: servicio | Visitante | RF-01, RF-03 | alta | mayor | funcional | Sí | 366 |
| [TC-AUTH-023](#tc-auth-023) | Búsqueda por email al iniciar sesión | Unitario | Autenticación: servicio | Visitante | RF-02 | media | normal | funcional | Sí | 367 |
| [TC-AUTH-024](#tc-auth-024) | Email inexistente | Unitario | Autenticación: servicio | Visitante | RF-02 | alta | critica | seguridad | Sí | 368 |
| [TC-AUTH-025](#tc-auth-025) | Contraseña incorrecta | Unitario | Autenticación: servicio | Visitante | RF-02 | alta | critica | seguridad | Sí | 369 |
| [TC-AUTH-026](#tc-auth-026) | Cuenta desactivada | Unitario | Autenticación: servicio | Visitante | RF-02 | alta | critica | seguridad | Sí | 370 |
| [TC-AUTH-027](#tc-auth-027) | Token de sesión | Unitario | Autenticación: servicio | Visitante | RF-02 | alta | critica | seguridad | Sí | 371 |
| [TC-AUTH-028](#tc-auth-028) | Perfil con DNI | Unitario | Autenticación: servicio | Cliente / Prestador | RF-01, RF-02 | alta | critica | seguridad | Sí | 372 |
| [TC-AUTH-029](#tc-auth-029) | Perfil de usuario inexistente | Unitario | Autenticación: servicio | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 373 |
| [TC-AUTH-030](#tc-auth-030) | Perfil de usuario desactivado | Unitario | Autenticación: servicio | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 374 |
| [TC-AUTH-031](#tc-auth-031) | Editar nombre sin nombre válido | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 375 |
| [TC-AUTH-032](#tc-auth-032) | Editar nombre demasiado largo | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 376 |
| [TC-AUTH-033](#tc-auth-033) | Editar solo el nombre | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | alta | critica | seguridad | Sí | 377 |
| [TC-AUTH-034](#tc-auth-034) | Error del servicio al editar el nombre | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | baja | menor | funcional | Sí | 378 |
| [TC-AUTH-035](#tc-auth-035) | Cambiar contraseña sin datos | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | media | normal | seguridad | Sí | 379 |
| [TC-AUTH-036](#tc-auth-036) | Contraseña nueva corta | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | media | normal | seguridad | Sí | 380 |
| [TC-AUTH-037](#tc-auth-037) | Contraseña nueva igual a la actual | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | media | normal | seguridad | Sí | 381 |
| [TC-AUTH-038](#tc-auth-038) | Cambio de contraseña correcto | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | alta | critica | seguridad | Sí | 382 |
| [TC-AUTH-039](#tc-auth-039) | Error del servicio al cambiar la contraseña | Unitario | Autenticación: edición de perfil y contraseña | Cliente / Prestador | RF-01, RF-02 | baja | menor | funcional | Sí | 383 |
| [TC-AUTH-040](#tc-auth-040) | Actualizar nombre | Unitario | Autenticación: edición de perfil y contraseña (servicio) | Cliente / Prestador | RF-01, RF-02 | alta | mayor | funcional | Sí | 384 |
| [TC-AUTH-041](#tc-auth-041) | Actualizar nombre de usuario inexistente o desactivado | Unitario | Autenticación: edición de perfil y contraseña (servicio) | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 385 |
| [TC-AUTH-042](#tc-auth-042) | Contraseña nueva hasheada | Unitario | Autenticación: edición de perfil y contraseña (servicio) | Cliente / Prestador | RF-01, RF-02 | alta | critica | seguridad | Sí | 386 |
| [TC-AUTH-043](#tc-auth-043) | Contraseña actual incorrecta | Unitario | Autenticación: edición de perfil y contraseña (servicio) | Cliente / Prestador | RF-01, RF-02 | alta | critica | seguridad | Sí | 387 |
| [TC-AUTH-044](#tc-auth-044) | Cambiar contraseña de usuario inexistente o desactivado | Unitario | Autenticación: edición de perfil y contraseña (servicio) | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 388 |
| [TC-AUTH-045](#tc-auth-045) | Número en el registro | Unitario | Autenticación: número identificador | Cliente / Prestador | RF-01, RF-02 | alta | mayor | funcional | Sí | 389 |
| [TC-AUTH-046](#tc-auth-046) | Número en el perfil | Unitario | Autenticación: número identificador | Cliente / Prestador | RF-01, RF-02 | media | normal | funcional | Sí | 390 |
| [TC-AUTH-047](#tc-auth-047) | Foto de perfil de un cliente | Unitario | Autenticación: foto de perfil | Cliente / Prestador | RF-01, RF-02 | alta | mayor | funcional | Sí | 391 |
| [TC-AUTH-048](#tc-auth-048) | Foto de perfil de un prestador | Unitario | Autenticación: foto de perfil | Cliente / Prestador | RF-01, RF-02 | alta | mayor | funcional | Sí | 392 |
| [TC-FOT-001](#tc-fot-001) | Subida sin imagen o con tipo no permitido | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 393 |
| [TC-FOT-002](#tc-fot-002) | Archivo que no es lo que dice ser | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | alta | critica | seguridad | Sí | 394 |
| [TC-FOT-003](#tc-fot-003) | Subida válida | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 395 |
| [TC-FOT-004](#tc-fot-004) | Error del servicio al subir la foto | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | baja | menor | funcional | Sí | 396 |
| [TC-FOT-005](#tc-fot-005) | Eliminar la foto propia | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 397 |
| [TC-FOT-006](#tc-fot-006) | Error del servicio al eliminar la foto | Unitario | Foto de perfil: controlador | Cliente / Prestador | RF-01, RF-03 | baja | menor | funcional | Sí | 398 |
| [TC-FOT-007](#tc-fot-007) | Subir la foto de un cliente | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 399 |
| [TC-FOT-008](#tc-fot-008) | Subir la foto de un prestador | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 400 |
| [TC-FOT-009](#tc-fot-009) | Reemplazar la foto | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 401 |
| [TC-FOT-010](#tc-fot-010) | No borrar fotos que no son del store | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 402 |
| [TC-FOT-011](#tc-fot-011) | Falla el borrado de la foto anterior | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | baja | menor | funcional | Sí | 403 |
| [TC-FOT-012](#tc-fot-012) | Falla el guardado en la base | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 404 |
| [TC-FOT-013](#tc-fot-013) | Falla la subida al store | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | baja | menor | funcional | Sí | 405 |
| [TC-FOT-014](#tc-fot-014) | Subir foto de un usuario inexistente o desactivado | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 406 |
| [TC-FOT-015](#tc-fot-015) | Eliminar la foto | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 407 |
| [TC-FOT-016](#tc-fot-016) | Eliminar una foto externa | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 408 |
| [TC-FOT-017](#tc-fot-017) | Eliminar sin tener foto | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 409 |
| [TC-FOT-018](#tc-fot-018) | Eliminar la foto de un usuario desactivado | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 410 |
| [TC-FOT-019](#tc-fot-019) | Reconocer las fotos del store | Unitario | Foto de perfil: servicio | Cliente / Prestador | RF-01, RF-03 | alta | critica | seguridad | Sí | 411 |
| [TC-FOT-020](#tc-fot-020) | Foto de perfil sin token | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | alta | critica | seguridad | Sí | 412 |
| [TC-FOT-021](#tc-fot-021) | Foto de perfil como administrador | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | alta | critica | seguridad | Sí | 413 |
| [TC-FOT-022](#tc-fot-022) | Subir la foto con el cuerpo crudo | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 414 |
| [TC-FOT-023](#tc-fot-023) | Imagen de más de 2 MB | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | alta | mayor | funcional | Sí | 415 |
| [TC-FOT-024](#tc-fot-024) | JSON en lugar de la imagen | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 416 |
| [TC-FOT-025](#tc-fot-025) | Eliminar la foto por HTTP | Unitario | Foto de perfil: API | Cliente / Prestador | RF-01, RF-03 | media | normal | funcional | Sí | 417 |
| [TC-OFI-001](#tc-ofi-001) | Listado público de oficios | Unitario | Oficios: controlador | Visitante | RF-22, RF-04 | media | normal | funcional | Sí | 418 |
| [TC-OFI-002](#tc-ofi-002) | Error en el listado público | Unitario | Oficios: controlador | Visitante | RF-22 | baja | menor | funcional | Sí | 419 |
| [TC-OFI-003](#tc-ofi-003) | Listado completo para el administrador | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 420 |
| [TC-OFI-004](#tc-ofi-004) | Error en el listado completo | Unitario | Oficios: controlador | Administrador | RF-22 | baja | menor | funcional | Sí | 421 |
| [TC-OFI-005](#tc-ofi-005) | Alta con nombre inválido | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 422 |
| [TC-OFI-006](#tc-ofi-006) | Alta con categoría inválida | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 423 |
| [TC-OFI-007](#tc-ofi-007) | Alta de oficio | Unitario | Oficios: controlador | Administrador | RF-22 | alta | mayor | funcional | Sí | 424 |
| [TC-OFI-008](#tc-ofi-008) | Alta sin categoría | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 425 |
| [TC-OFI-009](#tc-ofi-009) | Error en el alta | Unitario | Oficios: controlador | Administrador | RF-22 | baja | menor | funcional | Sí | 426 |
| [TC-OFI-010](#tc-ofi-010) | Edición con nombre inválido | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 427 |
| [TC-OFI-011](#tc-ofi-011) | Edición con categoría inválida | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 428 |
| [TC-OFI-012](#tc-ofi-012) | Edición sin datos | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 429 |
| [TC-OFI-013](#tc-ofi-013) | Edición de oficio | Unitario | Oficios: controlador | Administrador | RF-22 | alta | mayor | funcional | Sí | 430 |
| [TC-OFI-014](#tc-ofi-014) | Error en la edición | Unitario | Oficios: controlador | Administrador | RF-22 | baja | menor | funcional | Sí | 431 |
| [TC-OFI-015](#tc-ofi-015) | Cambio de estado con valor inválido | Unitario | Oficios: controlador | Administrador | RF-22 | media | normal | funcional | Sí | 432 |
| [TC-OFI-016](#tc-ofi-016) | Activar o desactivar oficio | Unitario | Oficios: controlador | Administrador | RF-22 | alta | mayor | funcional | Sí | 433 |
| [TC-OFI-017](#tc-ofi-017) | Error al cambiar el estado | Unitario | Oficios: controlador | Administrador | RF-22 | baja | menor | funcional | Sí | 434 |
| [TC-OFI-018](#tc-ofi-018) | Solo activos por defecto | Unitario | Oficios: servicio | Visitante | RF-22 | media | normal | funcional | Sí | 435 |
| [TC-OFI-019](#tc-ofi-019) | Incluir inactivos | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 436 |
| [TC-OFI-020](#tc-ofi-020) | Nombre duplicado en el alta | Unitario | Oficios: servicio | Administrador | RF-22 | alta | mayor | funcional | Sí | 437 |
| [TC-OFI-021](#tc-ofi-021) | Alta con nombre libre | Unitario | Oficios: servicio | Administrador | RF-22 | alta | mayor | funcional | Sí | 438 |
| [TC-OFI-022](#tc-ofi-022) | Editar oficio inexistente | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 439 |
| [TC-OFI-023](#tc-ofi-023) | Nombre duplicado en la edición | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 440 |
| [TC-OFI-024](#tc-ofi-024) | Mismo nombre sin buscar duplicados | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 441 |
| [TC-OFI-025](#tc-ofi-025) | Edición con nombre nuevo | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 442 |
| [TC-OFI-028](#tc-ofi-028) | Alta sin distinguir mayúsculas | Unitario | Oficios: servicio | Administrador | RF-22 | alta | mayor | funcional | Sí | 443 |
| [TC-OFI-029](#tc-ofi-029) | Edición sin distinguir mayúsculas | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 444 |
| [TC-OFI-030](#tc-ofi-030) | Cambiar solo mayúsculas del propio nombre | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 445 |
| [TC-OFI-026](#tc-ofi-026) | Cambiar estado de oficio inexistente | Unitario | Oficios: servicio | Administrador | RF-22 | media | normal | funcional | Sí | 446 |
| [TC-OFI-027](#tc-ofi-027) | Desactivar sin borrar | Unitario | Oficios: servicio | Administrador | RF-22 | alta | mayor | funcional | Sí | 447 |
| [TC-PRE-001](#tc-pre-001) | Consultar perfil propio | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03 | media | normal | funcional | Sí | 448 |
| [TC-PRE-002](#tc-pre-002) | Error al consultar el perfil | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03 | baja | menor | funcional | Sí | 449 |
| [TC-PRE-003](#tc-pre-003) | Campos de texto que no son texto | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | media | normal | funcional | Sí | 450 |
| [TC-PRE-004](#tc-pre-004) | Email de contacto sin arroba | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | media | normal | funcional | Sí | 451 |
| [TC-PRE-005](#tc-pre-005) | Ubicación, precios o disponibilidad inválidos | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | media | normal | funcional | Sí | 452 |
| [TC-PRE-006](#tc-pre-006) | Edición sin datos | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | media | normal | funcional | Sí | 453 |
| [TC-PRE-007](#tc-pre-007) | Edición con datos limpios | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | alta | critica | seguridad | Sí | 454 |
| [TC-PRE-008](#tc-pre-008) | Error al editar el perfil | Unitario | Prestadores: perfil (controlador) | Prestador | RF-03, RF-04 | baja | menor | funcional | Sí | 455 |
| [TC-PRE-009](#tc-pre-009) | Lista de oficios inválida | Unitario | Prestadores: perfil (controlador) | Prestador | RF-04 | media | normal | funcional | Sí | 456 |
| [TC-PRE-010](#tc-pre-010) | Asignar oficios | Unitario | Prestadores: perfil (controlador) | Prestador | RF-04 | alta | mayor | funcional | Sí | 457 |
| [TC-PRE-011](#tc-pre-011) | Error al asignar oficios | Unitario | Prestadores: perfil (controlador) | Prestador | RF-04 | baja | menor | funcional | Sí | 458 |
| [TC-PRE-012](#tc-pre-012) | Filtros de búsqueda inválidos | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | media | normal | funcional | Sí | 459 |
| [TC-PRE-013](#tc-pre-013) | Búsqueda sin filtros | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | media | normal | funcional | Sí | 460 |
| [TC-PRE-014](#tc-pre-014) | Filtros convertidos | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | alta | mayor | funcional | Sí | 461 |
| [TC-PRE-059](#tc-pre-059) | Página inválida o válida | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | media | normal | funcional | Sí | 462 |
| [TC-PRE-064](#tc-pre-064) | Zona o presupuesto inválidos | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | media | normal | funcional | Sí | 463 |
| [TC-PRE-065](#tc-pre-065) | Zona y presupuesto convertidos | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | media | normal | funcional | Sí | 464 |
| [TC-PRE-015](#tc-pre-015) | Error en la búsqueda | Unitario | Prestadores: búsqueda (controlador) | Visitante | RF-06, RF-07 | baja | menor | funcional | Sí | 465 |
| [TC-PRE-016](#tc-pre-016) | Descripción profesional vacía | Unitario | Prestadores: validaciones | Prestador | RF-04 | media | normal | funcional | Sí | 466 |
| [TC-PRE-017](#tc-pre-017) | Teléfono o WhatsApp inválido | Unitario | Prestadores: validaciones | Prestador | RF-04 | media | normal | funcional | Sí | 467 |
| [TC-PRE-018](#tc-pre-018) | Teléfonos válidos | Unitario | Prestadores: validaciones | Prestador | RF-04 | media | normal | funcional | Sí | 468 |
| [TC-PRE-019](#tc-pre-019) | Descripción con texto | Unitario | Prestadores: validaciones | Prestador | RF-04 | media | normal | funcional | Sí | 469 |
| [TC-PRE-020](#tc-pre-020) | Filtro disponible inválido | Unitario | Prestadores: validaciones | Visitante | RF-07 | media | normal | funcional | Sí | 470 |
| [TC-PRE-021](#tc-pre-021) | Filtro disponible válido | Unitario | Prestadores: validaciones | Visitante | RF-07 | media | normal | funcional | Sí | 471 |
| [TC-PRE-022](#tc-pre-022) | Sin filtro de disponibilidad | Unitario | Prestadores: validaciones | Visitante | RF-07 | media | normal | funcional | Sí | 472 |
| [TC-PRE-023](#tc-pre-023) | Perfil con nombre, email y oficios | Unitario | Prestadores: perfil (servicio) | Prestador | RF-03 | media | normal | funcional | Sí | 473 |
| [TC-PRE-024](#tc-pre-024) | Prestador inexistente | Unitario | Prestadores: perfil (servicio) | Prestador | RF-03 | media | normal | funcional | Sí | 474 |
| [TC-PRE-025](#tc-pre-025) | Prestador inactivo | Unitario | Prestadores: perfil (servicio) | Prestador | RF-03 | media | normal | funcional | Sí | 475 |
| [TC-PRE-026](#tc-pre-026) | Actualizar perfil | Unitario | Prestadores: perfil (servicio) | Prestador | RF-03, RF-04 | alta | mayor | funcional | Sí | 476 |
| [TC-PRE-027](#tc-pre-027) | Precio mínimo mayor al máximo guardado | Unitario | Prestadores: perfil (servicio) | Prestador | RF-04 | media | normal | funcional | Sí | 477 |
| [TC-PRE-028](#tc-pre-028) | Reemplazar oficios | Unitario | Prestadores: oficios (servicio) | Prestador | RF-04 | alta | mayor | funcional | Sí | 478 |
| [TC-PRE-029](#tc-pre-029) | Oficio inexistente o desactivado | Unitario | Prestadores: oficios (servicio) | Prestador | RF-04 | media | normal | funcional | Sí | 479 |
| [TC-PRE-030](#tc-pre-030) | Ids repetidos | Unitario | Prestadores: oficios (servicio) | Prestador | RF-04 | media | normal | funcional | Sí | 480 |
| [TC-PRE-031](#tc-pre-031) | Lista vacía | Unitario | Prestadores: oficios (servicio) | Prestador | RF-04 | media | normal | funcional | Sí | 481 |
| [TC-PRE-032](#tc-pre-032) | Prestador inexistente | Unitario | Prestadores: oficios (servicio) | Prestador | RF-04 | media | normal | funcional | Sí | 482 |
| [TC-PRE-033](#tc-pre-033) | Resumen público con reputación | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07, RF-19, RF-20 | alta | mayor | funcional | Sí | 483 |
| [TC-PRE-034](#tc-pre-034) | Filtro por oficio | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-06 | media | normal | funcional | Sí | 484 |
| [TC-PRE-035](#tc-pre-035) | Búsqueda por texto | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | alta | mayor | funcional | Sí | 485 |
| [TC-PRE-036](#tc-pre-036) | Filtro por distancia | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-06 | alta | mayor | funcional | Sí | 486 |
| [TC-PRE-037](#tc-pre-037) | Calificación mínima | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07, RF-19 | media | normal | funcional | Sí | 487 |
| [TC-PRE-038](#tc-pre-038) | Límite de resultados | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 488 |
| [TC-PRE-039](#tc-pre-039) | Promedio sin calificaciones | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-19 | media | normal | funcional | Sí | 489 |
| [TC-PRE-040](#tc-pre-040) | Sin filtro de disponibilidad | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 490 |
| [TC-PRE-041](#tc-pre-041) | Filtro de disponibilidad | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 491 |
| [TC-PRE-042](#tc-pre-042) | Coordenadas aproximadas en el listado | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | alta | critica | seguridad | Sí | 492 |
| [TC-PRE-043](#tc-pre-043) | Coordenadas aproximadas en la ficha | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-08 | alta | critica | seguridad | Sí | 493 |
| [TC-PRE-044](#tc-pre-044) | Coordenada exacta en el perfil propio | Unitario | Prestadores: búsqueda (servicio) | Prestador | RF-03 | media | normal | funcional | Sí | 494 |
| [TC-PRE-045](#tc-pre-045) | Prestador sin coordenadas | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 495 |
| [TC-PRE-046](#tc-pre-046) | Distancia con la coordenada aproximada | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-06 | alta | critica | seguridad | Sí | 496 |
| [TC-PRE-060](#tc-pre-060) | Respuesta paginada | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 497 |
| [TC-PRE-061](#tc-pre-061) | Paginación por defecto y página vacía | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 498 |
| [TC-PRE-062](#tc-pre-062) | Filtro de calificación antes de paginar | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07, RF-19 | media | normal | funcional | Sí | 499 |
| [TC-PRE-066](#tc-pre-066) | Filtro por zona | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-06 | media | normal | funcional | Sí | 500 |
| [TC-PRE-067](#tc-pre-067) | Filtro por presupuesto | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-06 | media | normal | funcional | Sí | 501 |
| [TC-PRE-063](#tc-pre-063) | Orden estable | Unitario | Prestadores: búsqueda (servicio) | Visitante | RF-07 | media | normal | funcional | Sí | 502 |
| [TC-PRE-047](#tc-pre-047) | Ficha completa | Unitario | Prestadores: ficha | Visitante | RF-08, RF-19, RF-20, RF-21 | alta | mayor | funcional | Sí | 503 |
| [TC-PRE-048](#tc-pre-048) | Sin datos internos | Unitario | Prestadores: ficha | Visitante | RF-08 | alta | critica | seguridad | Sí | 504 |
| [TC-PRE-049](#tc-pre-049) | Solo prestadores activos | Unitario | Prestadores: ficha | Visitante | RF-08 | media | normal | funcional | Sí | 505 |
| [TC-PRE-050](#tc-pre-050) | Ficha sin calificaciones | Unitario | Prestadores: ficha | Visitante | RF-08, RF-19 | media | normal | funcional | Sí | 506 |
| [TC-PRE-051](#tc-pre-051) | Ficha no disponible | Unitario | Prestadores: ficha | Visitante | RF-08 | media | normal | funcional | Sí | 507 |
| [TC-PRE-052](#tc-pre-052) | Controlador de la ficha | Unitario | Prestadores: ficha | Visitante | RF-08 | media | normal | funcional | Sí | 508 |
| [TC-PRE-053](#tc-pre-053) | Error en la ficha | Unitario | Prestadores: ficha | Visitante | RF-08 | baja | menor | funcional | Sí | 509 |
| [TC-PRE-054](#tc-pre-054) | Calificaciones del prestador del token | Unitario | Prestadores: calificaciones recibidas | Prestador | RF-21 | alta | mayor | funcional | Sí | 510 |
| [TC-PRE-055](#tc-pre-055) | Sin calificaciones recibidas | Unitario | Prestadores: calificaciones recibidas | Prestador | RF-21 | media | normal | funcional | Sí | 511 |
| [TC-PRE-056](#tc-pre-056) | Perfil inexistente o inactivo | Unitario | Prestadores: calificaciones recibidas | Prestador | RF-21 | media | normal | funcional | Sí | 512 |
| [TC-PRE-057](#tc-pre-057) | Controlador de calificaciones recibidas | Unitario | Prestadores: calificaciones recibidas | Prestador | RF-21 | media | normal | funcional | Sí | 513 |
| [TC-PRE-058](#tc-pre-058) | Error en calificaciones recibidas | Unitario | Prestadores: calificaciones recibidas | Prestador | RF-21 | baja | menor | funcional | Sí | 514 |
| [TC-MAPA-001](#tc-mapa-001) | oficioId inválido | Unitario | Mapa | Visitante | RF-05, RF-06 | media | normal | funcional | Sí | 515 |
| [TC-MAPA-002](#tc-mapa-002) | Mapa sin filtro | Unitario | Mapa | Visitante | RF-05 | media | normal | funcional | Sí | 516 |
| [TC-MAPA-003](#tc-mapa-003) | oficioId sin espacios | Unitario | Mapa | Visitante | RF-05, RF-06 | media | normal | funcional | Sí | 517 |
| [TC-MAPA-004](#tc-mapa-004) | Error en el mapa | Unitario | Mapa | Visitante | RF-05 | baja | menor | funcional | Sí | 518 |
| [TC-MAPA-005](#tc-mapa-005) | Marcadores del mapa | Unitario | Mapa | Visitante | RF-05, RF-19 | alta | critica | seguridad | Sí | 519 |
| [TC-MAPA-006](#tc-mapa-006) | Solo prestadores visibles | Unitario | Mapa | Visitante | RF-05 | alta | mayor | funcional | Sí | 520 |
| [TC-MAPA-007](#tc-mapa-007) | Filtro por oficio | Unitario | Mapa | Visitante | RF-05, RF-06 | media | normal | funcional | Sí | 521 |
| [TC-MAPA-008](#tc-mapa-008) | Promedio sin calificaciones | Unitario | Mapa | Visitante | RF-05, RF-19 | media | normal | funcional | Sí | 522 |
| [TC-MAPA-009](#tc-mapa-009) | Promedios solo de los encontrados | Unitario | Mapa | Visitante | RF-05 | media | normal | funcional | Sí | 523 |
| [TC-MAPA-011](#tc-mapa-011) | Promedio del mapa sin calificaciones moderadas | Unitario | Mapa | Visitante | RF-05, RF-19, RF-23 | alta | mayor | funcional | Sí | 524 |
| [TC-MAPA-010](#tc-mapa-010) | Mapa vacío | Unitario | Mapa | Visitante | RF-05 | media | normal | funcional | Sí | 525 |
| [TC-SOL-001](#tc-sol-001) | prestadorId inválido | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 526 |
| [TC-SOL-002](#tc-sol-002) | oficioId inválido | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 527 |
| [TC-SOL-003](#tc-sol-003) | Descripción inválida | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 528 |
| [TC-SOL-004](#tc-sol-004) | Descripción demasiado larga | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 529 |
| [TC-SOL-005](#tc-sol-005) | Dirección que no es texto | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 530 |
| [TC-SOL-006](#tc-sol-006) | Contacto preferido que no es texto | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 531 |
| [TC-SOL-007](#tc-sol-007) | Pedido sin body | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 532 |
| [TC-SOL-008](#tc-sol-008) | Alta de solicitud | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | alta | mayor | funcional | Sí | 533 |
| [TC-SOL-009](#tc-sol-009) | Alta sin datos opcionales | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | media | normal | funcional | Sí | 534 |
| [TC-SOL-010](#tc-sol-010) | Error en el alta | Unitario | Solicitudes: alta (controlador) | Cliente | RF-09, RF-10 | baja | menor | funcional | Sí | 535 |
| [TC-SOL-011](#tc-sol-011) | Cambios de estado delegan en el servicio | Unitario | Solicitudes: alta (controlador) | Cliente / Prestador | RF-11, RF-12, RF-13 | media | normal | funcional | Sí | 536 |
| [TC-SOL-012](#tc-sol-012) | Error en un cambio de estado | Unitario | Solicitudes: alta (controlador) | Cliente / Prestador | RF-11, RF-12, RF-13 | baja | menor | funcional | Sí | 537 |
| [TC-SOL-013](#tc-sol-013) | Estado inválido | Unitario | Solicitudes: listado (controlador) | Cliente / Prestador | RF-14, RF-15 | media | normal | funcional | Sí | 538 |
| [TC-SOL-014](#tc-sol-014) | Listado sin filtro | Unitario | Solicitudes: listado (controlador) | Cliente / Prestador | RF-14, RF-15 | media | normal | funcional | Sí | 539 |
| [TC-SOL-015](#tc-sol-015) | Estados válidos | Unitario | Solicitudes: listado (controlador) | Cliente / Prestador | RF-14, RF-15 | media | normal | funcional | Sí | 540 |
| [TC-SOL-016](#tc-sol-016) | Error en el listado | Unitario | Solicitudes: listado (controlador) | Cliente / Prestador | RF-14, RF-15 | baja | menor | funcional | Sí | 541 |
| [TC-SOL-017](#tc-sol-017) | Solicitud con el cliente logueado | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09, RF-10 | alta | mayor | funcional | Sí | 542 |
| [TC-SOL-018](#tc-sol-018) | Prestador inexistente | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | media | normal | funcional | Sí | 543 |
| [TC-SOL-019](#tc-sol-019) | Prestador inactivo | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | media | normal | funcional | Sí | 544 |
| [TC-SOL-020](#tc-sol-020) | Prestador no disponible | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | alta | mayor | funcional | Sí | 545 |
| [TC-SOL-021](#tc-sol-021) | Oficio inexistente | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | media | normal | funcional | Sí | 546 |
| [TC-SOL-022](#tc-sol-022) | Oficio desactivado | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | media | normal | funcional | Sí | 547 |
| [TC-SOL-023](#tc-sol-023) | Oficio no ofrecido | Unitario | Solicitudes: alta (servicio) | Cliente | RF-09 | alta | mayor | funcional | Sí | 548 |
| [TC-SOL-024](#tc-sol-024) | Listado del cliente | Unitario | Solicitudes: listado (servicio) | Cliente | RF-14 | alta | critica | seguridad | Sí | 549 |
| [TC-SOL-025](#tc-sol-025) | Listado del prestador | Unitario | Solicitudes: listado (servicio) | Prestador | RF-15 | alta | critica | seguridad | Sí | 550 |
| [TC-SOL-026](#tc-sol-026) | Filtro por estado | Unitario | Solicitudes: listado (servicio) | Cliente / Prestador | RF-14, RF-15 | media | normal | funcional | Sí | 551 |
| [TC-SOL-027](#tc-sol-027) | Marca de calificada | Unitario | Solicitudes: listado (servicio) | Cliente / Prestador | RF-14, RF-18 | media | normal | funcional | Sí | 552 |
| [TC-SOL-028](#tc-sol-028) | Sin datos sensibles | Unitario | Solicitudes: listado (servicio) | Cliente / Prestador | RF-14, RF-15 | alta | critica | seguridad | Sí | 553 |
| [TC-SOL-029](#tc-sol-029) | Prestador inexistente | Unitario | Solicitudes: listado (servicio) | Prestador | RF-15 | media | normal | funcional | Sí | 554 |
| [TC-SOL-030](#tc-sol-030) | Prestador inactivo | Unitario | Solicitudes: listado (servicio) | Prestador | RF-15 | media | normal | funcional | Sí | 555 |
| [TC-SOL-031](#tc-sol-031) | Rol sin solicitudes | Unitario | Solicitudes: listado (servicio) | Administrador | RF-14, RF-15 | alta | critica | seguridad | Sí | 556 |
| [TC-SOL-032](#tc-sol-032) | Aceptar solicitud pendiente | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | alta | mayor | funcional | Sí | 557 |
| [TC-SOL-033](#tc-sol-033) | Aceptar solicitud inexistente | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | media | normal | funcional | Sí | 558 |
| [TC-SOL-034](#tc-sol-034) | Aceptar solicitud ajena | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | alta | critica | seguridad | Sí | 559 |
| [TC-SOL-035](#tc-sol-035) | Usuario sin perfil de prestador | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | alta | critica | seguridad | Sí | 560 |
| [TC-SOL-036](#tc-sol-036) | Aceptar solicitud no pendiente | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | alta | mayor | funcional | Sí | 561 |
| [TC-SOL-037](#tc-sol-037) | Rechazar solicitud pendiente | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | alta | mayor | funcional | Sí | 562 |
| [TC-SOL-038](#tc-sol-038) | Rechazar solicitud aceptada | Unitario | Solicitudes: estados (servicio) | Prestador | RF-11 | media | normal | funcional | Sí | 563 |
| [TC-SOL-039](#tc-sol-039) | Cancelar solicitud pendiente | Unitario | Solicitudes: estados (servicio) | Cliente | RF-12 | alta | mayor | funcional | Sí | 564 |
| [TC-SOL-040](#tc-sol-040) | Cancelar solicitud aceptada | Unitario | Solicitudes: estados (servicio) | Cliente | RF-12 | media | normal | funcional | Sí | 565 |
| [TC-SOL-041](#tc-sol-041) | Cancelar solicitud inexistente | Unitario | Solicitudes: estados (servicio) | Cliente | RF-12 | media | normal | funcional | Sí | 566 |
| [TC-SOL-042](#tc-sol-042) | Cancelar solicitud ajena | Unitario | Solicitudes: estados (servicio) | Cliente | RF-12 | alta | critica | seguridad | Sí | 567 |
| [TC-SOL-043](#tc-sol-043) | Cancelar solicitud finalizada | Unitario | Solicitudes: estados (servicio) | Cliente | RF-12 | media | normal | funcional | Sí | 568 |
| [TC-SOL-044](#tc-sol-044) | Finalizar solicitud aceptada | Unitario | Solicitudes: estados (servicio) | Prestador | RF-13 | alta | mayor | funcional | Sí | 569 |
| [TC-SOL-045](#tc-sol-045) | Finalizar solicitud inexistente | Unitario | Solicitudes: estados (servicio) | Prestador | RF-13 | media | normal | funcional | Sí | 570 |
| [TC-SOL-046](#tc-sol-046) | Finalizar solicitud ajena | Unitario | Solicitudes: estados (servicio) | Prestador | RF-13 | alta | critica | seguridad | Sí | 571 |
| [TC-SOL-047](#tc-sol-047) | Finalizar sin perfil de prestador | Unitario | Solicitudes: estados (servicio) | Prestador | RF-13 | alta | critica | seguridad | Sí | 572 |
| [TC-SOL-048](#tc-sol-048) | Finalizar solicitud no aceptada | Unitario | Solicitudes: estados (servicio) | Prestador | RF-13 | alta | mayor | funcional | Sí | 573 |
| [TC-SOL-049](#tc-sol-049) | Solicitud nueva sin fechas | Unitario | Solicitudes: fechas de aceptación y finalización | Prestador | RF-11, RF-13 | media | normal | funcional | Sí | 574 |
| [TC-SOL-050](#tc-sol-050) | Fecha de aceptación | Unitario | Solicitudes: fechas de aceptación y finalización | Prestador | RF-11 | media | normal | funcional | Sí | 575 |
| [TC-SOL-051](#tc-sol-051) | Fecha de finalización | Unitario | Solicitudes: fechas de aceptación y finalización | Prestador | RF-13 | alta | mayor | funcional | Sí | 576 |
| [TC-SOL-052](#tc-sol-052) | Fechas en el listado | Unitario | Solicitudes: fechas de aceptación y finalización | Prestador | RF-11 | media | normal | funcional | Sí | 577 |
| [TC-SOL-053](#tc-sol-053) | Número en el listado | Unitario | Solicitudes: número identificador | Cliente / Prestador | RF-09, RF-14 | alta | mayor | funcional | Sí | 578 |
| [TC-CAL-001](#tc-cal-001) | Solicitud inválida | Unitario | Calificaciones: controlador | Cliente | RF-16 | media | normal | funcional | Sí | 579 |
| [TC-CAL-002](#tc-cal-002) | Puntaje inválido | Unitario | Calificaciones: controlador | Cliente | RF-16 | alta | mayor | funcional | Sí | 580 |
| [TC-CAL-003](#tc-cal-003) | Comentario inválido al calificar | Unitario | Calificaciones: controlador | Cliente | RF-16 | media | normal | funcional | Sí | 581 |
| [TC-CAL-004](#tc-cal-004) | Calificar con datos limpios | Unitario | Calificaciones: controlador | Cliente | RF-16 | alta | mayor | funcional | Sí | 582 |
| [TC-CAL-005](#tc-cal-005) | Calificar sin comentario | Unitario | Calificaciones: controlador | Cliente | RF-16 | media | normal | funcional | Sí | 583 |
| [TC-CAL-006](#tc-cal-006) | Error al calificar | Unitario | Calificaciones: controlador | Cliente | RF-16 | baja | menor | funcional | Sí | 584 |
| [TC-CAL-007](#tc-cal-007) | Comentario inválido al editar | Unitario | Calificaciones: controlador | Cliente | RF-16 | media | normal | funcional | Sí | 585 |
| [TC-CAL-008](#tc-cal-008) | Editar comentario | Unitario | Calificaciones: controlador | Cliente | RF-16 | media | normal | funcional | Sí | 586 |
| [TC-CAL-009](#tc-cal-009) | Error al editar el comentario | Unitario | Calificaciones: controlador | Cliente | RF-16 | baja | menor | funcional | Sí | 587 |
| [TC-CAL-010](#tc-cal-010) | Reputación del prestador | Unitario | Calificaciones: controlador | Visitante | RF-19, RF-20 | media | normal | funcional | Sí | 588 |
| [TC-CAL-011](#tc-cal-011) | Error en la reputación | Unitario | Calificaciones: controlador | Visitante | RF-19, RF-20 | baja | menor | funcional | Sí | 589 |
| [TC-CAL-012](#tc-cal-012) | Calificaciones públicas del prestador | Unitario | Calificaciones: controlador | Visitante | RF-08, RF-21 | media | normal | funcional | Sí | 590 |
| [TC-CAL-013](#tc-cal-013) | Error en las calificaciones públicas | Unitario | Calificaciones: controlador | Visitante | RF-08, RF-21 | baja | menor | funcional | Sí | 591 |
| [TC-CAL-014](#tc-cal-014) | Todas las calificaciones | Unitario | Calificaciones: controlador | Administrador | RF-23 | media | normal | funcional | Sí | 592 |
| [TC-CAL-015](#tc-cal-015) | Error en el listado completo | Unitario | Calificaciones: controlador | Administrador | RF-23 | baja | menor | funcional | Sí | 593 |
| [TC-CAL-016](#tc-cal-016) | Motivo de moderación inválido | Unitario | Calificaciones: controlador | Administrador | RF-23 | media | normal | funcional | Sí | 594 |
| [TC-CAL-017](#tc-cal-017) | Moderar calificación | Unitario | Calificaciones: controlador | Administrador | RF-23 | alta | mayor | funcional | Sí | 595 |
| [TC-CAL-018](#tc-cal-018) | Error al moderar | Unitario | Calificaciones: controlador | Administrador | RF-23 | baja | menor | funcional | Sí | 596 |
| [TC-CAL-019](#tc-cal-019) | Calificar solicitud inexistente | Unitario | Calificaciones: servicio | Cliente | RF-16 | media | normal | funcional | Sí | 597 |
| [TC-CAL-020](#tc-cal-020) | Calificar solicitud ajena | Unitario | Calificaciones: servicio | Cliente | RF-16 | alta | critica | seguridad | Sí | 598 |
| [TC-CAL-021](#tc-cal-021) | Calificar solicitud no finalizada | Unitario | Calificaciones: servicio | Cliente | RF-17 | alta | mayor | funcional | Sí | 599 |
| [TC-CAL-022](#tc-cal-022) | Solicitud ya calificada | Unitario | Calificaciones: servicio | Cliente | RF-18 | alta | mayor | funcional | Sí | 600 |
| [TC-CAL-023](#tc-cal-023) | Crear calificación | Unitario | Calificaciones: servicio | Cliente | RF-16 | alta | mayor | funcional | Sí | 601 |
| [TC-CAL-024](#tc-cal-024) | Editar calificación inexistente | Unitario | Calificaciones: servicio | Cliente | RF-16 | media | normal | funcional | Sí | 602 |
| [TC-CAL-025](#tc-cal-025) | Editar calificación ajena | Unitario | Calificaciones: servicio | Cliente | RF-16 | alta | critica | seguridad | Sí | 603 |
| [TC-CAL-026](#tc-cal-026) | Editar calificación moderada | Unitario | Calificaciones: servicio | Cliente | RF-16, RF-23 | media | normal | funcional | Sí | 604 |
| [TC-CAL-027](#tc-cal-027) | Editar comentario propio | Unitario | Calificaciones: servicio | Cliente | RF-16 | media | normal | funcional | Sí | 605 |
| [TC-CAL-028](#tc-cal-028) | Reputación de prestador inexistente | Unitario | Calificaciones: servicio | Visitante | RF-19, RF-20 | media | normal | funcional | Sí | 606 |
| [TC-CAL-029](#tc-cal-029) | Promedio y servicios finalizados | Unitario | Calificaciones: servicio | Visitante | RF-19, RF-20 | alta | mayor | funcional | Sí | 607 |
| [TC-CAL-030](#tc-cal-030) | Reputación sin calificaciones | Unitario | Calificaciones: servicio | Visitante | RF-19 | media | normal | funcional | Sí | 608 |
| [TC-CAL-037](#tc-cal-037) | Reputación sin calificaciones moderadas | Unitario | Calificaciones: servicio | Visitante | RF-19, RF-23 | alta | mayor | funcional | Sí | 609 |
| [TC-CAL-038](#tc-cal-038) | Reputación con todas las calificaciones moderadas | Unitario | Calificaciones: servicio | Visitante | RF-19, RF-20, RF-23 | media | normal | funcional | Sí | 610 |
| [TC-CAL-031](#tc-cal-031) | Calificaciones de prestador inexistente | Unitario | Calificaciones: servicio | Visitante | RF-21 | media | normal | funcional | Sí | 611 |
| [TC-CAL-032](#tc-cal-032) | Calificaciones públicas sin moderadas | Unitario | Calificaciones: servicio | Visitante | RF-21, RF-23 | alta | mayor | funcional | Sí | 612 |
| [TC-CAL-033](#tc-cal-033) | Todas las calificaciones con moderadas | Unitario | Calificaciones: servicio | Administrador | RF-23 | media | normal | funcional | Sí | 613 |
| [TC-CAL-034](#tc-cal-034) | Moderar calificación inexistente | Unitario | Calificaciones: servicio | Administrador | RF-23 | media | normal | funcional | Sí | 614 |
| [TC-CAL-035](#tc-cal-035) | Moderar dos veces | Unitario | Calificaciones: servicio | Administrador | RF-23 | media | normal | funcional | Sí | 615 |
| [TC-CAL-036](#tc-cal-036) | Registro de la moderación | Unitario | Calificaciones: servicio | Administrador | RF-23 | alta | mayor | funcional | Sí | 616 |
| [TC-INT-AUTH-001](#tc-int-auth-001) | Registro de cliente con DNI guardado en la base | Integración | Autenticación | Visitante | RF-01 | alta | critica | integracion | Sí | 617 |
| [TC-INT-AUTH-002](#tc-int-auth-002) | Registro de prestador con perfil creado | Integración | Autenticación | Visitante | RF-01, RF-03 | alta | mayor | integracion | Sí | 618 |
| [TC-INT-AUTH-003](#tc-int-auth-003) | Inicio de sesión con token válido | Integración | Autenticación | Visitante | RF-02 | alta | critica | integracion | Sí | 619 |
| [TC-INT-AUTH-004](#tc-int-auth-004) | Credenciales incorrectas con mensaje único | Integración | Autenticación | Visitante | RF-02 | alta | critica | seguridad | Sí | 620 |
| [TC-INT-AUTH-005](#tc-int-auth-005) | Perfil propio con DNI | Integración | Autenticación | Cliente | RF-01, RF-02 | alta | mayor | integracion | Sí | 621 |
| [TC-INT-AUTH-006](#tc-int-auth-006) | Email duplicado | Integración | Autenticación | Visitante | RF-01 | alta | mayor | integracion | Sí | 622 |
| [TC-INT-AUTH-007](#tc-int-auth-007) | DNI duplicado con otro formato | Integración | Autenticación | Visitante | RF-01 | alta | mayor | integracion | Sí | 623 |
| [TC-INT-AUTH-008](#tc-int-auth-008) | Registro con datos inválidos no guarda nada | Integración | Autenticación | Visitante | RF-01 | media | normal | integracion | Sí | 624 |
| [TC-INT-AUTH-009](#tc-int-auth-009) | Cuenta desactivada no puede iniciar sesión | Integración | Autenticación | Visitante | RF-02 | alta | mayor | seguridad | Sí | 625 |
| [TC-INT-AUTH-013](#tc-int-auth-013) | Número identificador del usuario | Integración | Autenticación | Cliente / Prestador | RF-01, RF-02 | alta | mayor | integracion | Sí | 626 |
| [TC-INT-AUTH-010](#tc-int-auth-010) | Editar el nombre sin poder cambiar DNI, email ni rol | Integración | Autenticación | Cliente / Prestador | RF-01, RF-02 | alta | mayor | seguridad | Sí | 627 |
| [TC-INT-AUTH-011](#tc-int-auth-011) | Cambiar la contraseña | Integración | Autenticación | Cliente / Prestador | RF-02 | alta | mayor | seguridad | Sí | 628 |
| [TC-INT-AUTH-012](#tc-int-auth-012) | Cambio de contraseña rechazado | Integración | Autenticación | Cliente / Prestador | RF-02 | alta | mayor | seguridad | Sí | 629 |
| [TC-INT-CLI-001](#tc-int-cli-001) | Búsqueda de prestadores por texto y oficio | Integración | Flujo del cliente | Visitante | RF-06, RF-07 | alta | mayor | integracion | Sí | 630 |
| [TC-INT-CLI-002](#tc-int-cli-002) | Filtro por distancia | Integración | Flujo del cliente | Visitante | RF-06 | alta | mayor | integracion | Sí | 631 |
| [TC-INT-CLI-003](#tc-int-cli-003) | Mapa con ubicación aproximada | Integración | Flujo del cliente | Visitante | RF-05 | alta | mayor | integracion | Sí | 632 |
| [TC-INT-CLI-004](#tc-int-cli-004) | Ficha detallada del prestador | Integración | Flujo del cliente | Visitante | RF-08, RF-19, RF-20 | alta | mayor | integracion | Sí | 633 |
| [TC-INT-CLI-005](#tc-int-cli-005) | Crear solicitud de servicio | Integración | Flujo del cliente | Cliente | RF-09, RF-10 | alta | critica | integracion | Sí | 634 |
| [TC-INT-CLI-006](#tc-int-cli-006) | Listado de solicitudes propias | Integración | Flujo del cliente | Cliente | RF-14 | alta | mayor | seguridad | Sí | 635 |
| [TC-INT-CLI-007](#tc-int-cli-007) | Cancelar solicitud pendiente | Integración | Flujo del cliente | Cliente | RF-12 | alta | mayor | integracion | Sí | 636 |
| [TC-INT-CLI-008](#tc-int-cli-008) | No cancelar solicitudes ajenas | Integración | Flujo del cliente | Cliente | RF-12 | alta | critica | seguridad | Sí | 637 |
| [TC-INT-CLI-009](#tc-int-cli-009) | Calificar solicitud finalizada | Integración | Flujo del cliente | Cliente | RF-16, RF-17, RF-19, RF-20 | alta | critica | integracion | Sí | 638 |
| [TC-INT-CLI-010](#tc-int-cli-010) | Una sola calificación por solicitud | Integración | Flujo del cliente | Cliente | RF-18 | alta | critica | integracion | Sí | 639 |
| [TC-INT-CLI-011](#tc-int-cli-011) | No calificar solicitudes no finalizadas | Integración | Flujo del cliente | Cliente | RF-17 | alta | mayor | integracion | Sí | 640 |
| [TC-INT-CLI-012](#tc-int-cli-012) | Editar comentario de una calificación propia | Integración | Flujo del cliente | Cliente | RF-16 | media | normal | integracion | Sí | 641 |
| [TC-INT-CLI-014](#tc-int-cli-014) | Número identificador de la solicitud | Integración | Flujo del cliente | Cliente | RF-09, RF-14 | alta | mayor | integracion | Sí | 642 |
| [TC-INT-CLI-013](#tc-int-cli-013) | No pedir servicio a un prestador no disponible | Integración | Flujo del cliente | Cliente | RF-09 | alta | mayor | integracion | Sí | 643 |
| [TC-INT-PRE-001](#tc-int-pre-001) | Consultar perfil propio | Integración | Flujo del prestador | Prestador | RF-03 | media | mayor | integracion | Sí | 644 |
| [TC-INT-PRE-002](#tc-int-pre-002) | Editar perfil | Integración | Flujo del prestador | Prestador | RF-03, RF-04 | alta | critica | integracion | Sí | 645 |
| [TC-INT-PRE-003](#tc-int-pre-003) | Perfil con datos inválidos | Integración | Flujo del prestador | Prestador | RF-04 | media | normal | integracion | Sí | 646 |
| [TC-INT-PRE-004](#tc-int-pre-004) | Reemplazar oficios | Integración | Flujo del prestador | Prestador | RF-04 | alta | mayor | integracion | Sí | 647 |
| [TC-INT-PRE-005](#tc-int-pre-005) | Oficios desactivados o inexistentes | Integración | Flujo del prestador | Prestador | RF-04 | media | normal | integracion | Sí | 648 |
| [TC-INT-PRE-006](#tc-int-pre-006) | Aceptar solicitud | Integración | Flujo del prestador | Prestador | RF-11 | alta | critica | integracion | Sí | 649 |
| [TC-INT-PRE-007](#tc-int-pre-007) | Rechazar solicitud | Integración | Flujo del prestador | Prestador | RF-11 | alta | mayor | integracion | Sí | 650 |
| [TC-INT-PRE-008](#tc-int-pre-008) | Finalizar solicitud | Integración | Flujo del prestador | Prestador | RF-13, RF-20 | alta | critica | integracion | Sí | 651 |
| [TC-INT-PRE-009](#tc-int-pre-009) | Transición de estado inválida | Integración | Flujo del prestador | Prestador | RF-11, RF-13 | alta | mayor | integracion | Sí | 652 |
| [TC-INT-PRE-010](#tc-int-pre-010) | No operar sobre solicitudes de otro prestador | Integración | Flujo del prestador | Prestador | RF-11, RF-13 | alta | critica | seguridad | Sí | 653 |
| [TC-INT-PRE-011](#tc-int-pre-011) | Listado de solicitudes recibidas | Integración | Flujo del prestador | Prestador | RF-15 | alta | mayor | integracion | Sí | 654 |
| [TC-INT-PRE-012](#tc-int-pre-012) | Calificaciones recibidas sin las moderadas | Integración | Flujo del prestador | Prestador | RF-21, RF-23 | alta | mayor | integracion | Sí | 655 |
| [TC-INT-PRE-013](#tc-int-pre-013) | Solicitud inexistente | Integración | Flujo del prestador | Prestador | RF-11 | baja | menor | integracion | Sí | 656 |
| [TC-INT-ADM-001](#tc-int-adm-001) | Crear oficio | Integración | Flujo del administrador | Administrador | RF-22 | alta | mayor | integracion | Sí | 657 |
| [TC-INT-ADM-002](#tc-int-adm-002) | Oficio con nombre duplicado | Integración | Flujo del administrador | Administrador | RF-22 | media | normal | integracion | Sí | 658 |
| [TC-INT-ADM-009](#tc-int-adm-009) | Oficio con nombre duplicado en minúsculas | Integración | Flujo del administrador | Administrador | RF-22 | media | normal | integracion | Sí | 659 |
| [TC-INT-ADM-003](#tc-int-adm-003) | Editar oficio | Integración | Flujo del administrador | Administrador | RF-22 | alta | mayor | integracion | Sí | 660 |
| [TC-INT-ADM-004](#tc-int-adm-004) | Desactivar y activar oficio | Integración | Flujo del administrador | Administrador | RF-22 | alta | mayor | integracion | Sí | 661 |
| [TC-INT-ADM-005](#tc-int-adm-005) | Oficio desactivado saca al prestador de la búsqueda | Integración | Flujo del administrador | Administrador | RF-22, RF-05, RF-07 | alta | mayor | integracion | Sí | 662 |
| [TC-INT-ADM-006](#tc-int-adm-006) | Listar todas las calificaciones | Integración | Flujo del administrador | Administrador | RF-23 | media | mayor | integracion | Sí | 663 |
| [TC-INT-ADM-007](#tc-int-adm-007) | Moderar comentario | Integración | Flujo del administrador | Administrador | RF-23 | alta | critica | integracion | Sí | 664 |
| [TC-INT-ADM-008](#tc-int-adm-008) | Rutas de administrador prohibidas para otros roles | Integración | Flujo del administrador | Cliente / Prestador | RF-22, RF-23 | alta | critica | seguridad | Sí | 665 |
| [TC-INT-SEG-001](#tc-int-seg-001) | Rutas protegidas sin token | Integración | Seguridad y errores | Todos | RF-02 | alta | critica | seguridad | Sí | 666 |
| [TC-INT-SEG-002](#tc-int-seg-002) | Token inválido, vencido o firmado con otra clave | Integración | Seguridad y errores | Todos | RF-02 | alta | critica | seguridad | Sí | 667 |
| [TC-INT-SEG-003](#tc-int-seg-003) | Rol sin permiso | Integración | Seguridad y errores | Todos | RF-03, RF-09, RF-11, RF-12, RF-16 | alta | critica | seguridad | Sí | 668 |
| [TC-INT-SEG-004](#tc-int-seg-004) | Recursos y rutas inexistentes | Integración | Seguridad y errores | Todos | RF-08, RF-12, RF-16, RF-19 | media | normal | integracion | Sí | 669 |
| [TC-INT-SEG-005](#tc-int-seg-005) | JSON mal formado | Integración | Seguridad y errores | Todos | RF-02 | media | normal | integracion | Sí | 670 |
| [TC-INT-SEG-006](#tc-int-seg-006) | Token de una cuenta desactivada | Integración | Seguridad y errores | Todos | RF-02 | alta | mayor | seguridad | Sí | 671 |

## Detalle

### TC-SIS-001

**Health check**

| Campo | Valor |
| --- | --- |
| Descripción | GET /health indica que el servidor está funcionando. |
| Precondiciones | App Express cargada (sin base de datos). |
| Pasos | 1. GET /health con Supertest sobre la app real |
| Resultado esperado | 200 con { status: "ok" }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/health.test.js` › responde con status ok |
| Automatizado | Sí |
| qaseId | 314 |

### TC-SIS-002

**Ruta inexistente responde 404**

| Campo | Valor |
| --- | --- |
| Descripción | El middleware notFound responde 404 con un mensaje claro. |
| Precondiciones | Middleware importado directamente; request, response y next simulados. |
| Pasos | 1. Invocar notFound |
| Resultado esperado | 404 con { error: "Recurso no encontrado" }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/middlewares.test.js` › responde 404 con un mensaje claro |
| Automatizado | Sí |
| qaseId | 315 |

### TC-SIS-003

**Error con respuesta ya enviada**

| Campo | Valor |
| --- | --- |
| Descripción | Si la respuesta ya empezó a enviarse, errorHandler delega el error en Express. |
| Precondiciones | Middleware importado directamente; request, response y next simulados. |
| Pasos | 1. Simular headersSent = true<br>2. Invocar errorHandler |
| Resultado esperado | Llama a next(error) y no escribe la respuesta. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/middlewares.test.js` › le deja el error a Express si la respuesta ya empezó a enviarse |
| Automatizado | Sí |
| qaseId | 316 |

### TC-SIS-004

**Traducción de errores conocidos**

| Campo | Valor |
| --- | --- |
| Descripción | JSON mal escrito, pedido demasiado grande y errores de Prisma (P2002, P2025, P2003) se traducen a 400, 413, 409 y 404. |
| Precondiciones | Middleware importado directamente; request, response y next simulados. |
| Pasos | 1. Invocar errorHandler con cada error conocido |
| Resultado esperado | Responde el código y el mensaje correspondientes a cada error. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/middlewares.test.js` › traduce el error: %s |
| Automatizado | Sí |
| qaseId | 317 |

### TC-SIS-005

**Error del negocio con status propio**

| Campo | Valor |
| --- | --- |
| Descripción | Un error con status y mensaje del negocio se responde tal cual. |
| Precondiciones | Middleware importado directamente; request, response y next simulados. |
| Pasos | 1. Invocar errorHandler con un error { status: 409, message } |
| Resultado esperado | Responde ese status y ese mensaje. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/middlewares.test.js` › usa el status y el mensaje de un error conocido del negocio |
| Automatizado | Sí |
| qaseId | 318 |

### TC-SIS-006

**Error inesperado sin detalles**

| Campo | Valor |
| --- | --- |
| Descripción | Un error sin status responde 500 sin exponer el detalle y lo registra en consola. |
| Precondiciones | Middleware importado directamente; request, response y next simulados. |
| Pasos | 1. Invocar errorHandler con un Error común |
| Resultado esperado | 500 con "Error interno del servidor" y console.error con el error original. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Sistema y errores |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/middlewares.test.js` › oculta el detalle de un error inesperado y lo registra en consola |
| Automatizado | Sí |
| qaseId | 319 |

### TC-SEG-001

**Sin header Authorization**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza un pedido sin header de autorización. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autenticar sin header |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si no hay header de autorización |
| Automatizado | Sí |
| qaseId | 320 |

### TC-SEG-002

**Tipo de autorización distinto de Bearer**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza un header que no es Bearer. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autenticar con "Basic <token>" |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el tipo no es Bearer |
| Automatizado | Sí |
| qaseId | 321 |

### TC-SEG-003

**Bearer sin token**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza "Bearer" sin token. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autenticar con "Bearer " |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el header es Bearer pero no trae token |
| Automatizado | Sí |
| qaseId | 322 |

### TC-SEG-004

**Token mal formado**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza un token que no se puede verificar. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autenticar con un token inválido |
| Resultado esperado | 401 "Token inválido o vencido". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el token no es válido |
| Automatizado | Sí |
| qaseId | 323 |

### TC-SEG-005

**Token firmado con otra clave**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza un token firmado con una clave distinta. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Firmar un token con otra clave<br>2. Invocar autenticar |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el token está firmado con otra clave |
| Automatizado | Sí |
| qaseId | 324 |

### TC-SEG-006

**Token vencido**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar rechaza un token expirado. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Firmar un token ya vencido<br>2. Invocar autenticar |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el token está vencido |
| Automatizado | Sí |
| qaseId | 325 |

### TC-SEG-007

**Algoritmo distinto de HS256**

| Campo | Valor |
| --- | --- |
| Descripción | autenticar solo acepta tokens HS256. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Firmar un token con HS512<br>2. Invocar autenticar |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si el token usa un algoritmo distinto de HS256 |
| Automatizado | Sí |
| qaseId | 326 |

### TC-SEG-008

**Token válido**

| Campo | Valor |
| --- | --- |
| Descripción | Con un token válido se carga el usuario en la request y se continúa. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Firmar un token válido<br>2. Invocar autenticar |
| Resultado esperado | req.usuario = { id, rol } y se llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › carga el usuario en la request y sigue si el token es válido |
| Automatizado | Sí |
| qaseId | 327 |

### TC-SEG-009

**autorizar sin usuario autenticado**

| Campo | Valor |
| --- | --- |
| Descripción | autorizar responde 401 si no hay usuario en la request. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autorizar sin req.usuario |
| Resultado esperado | 401 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 401 si no hay usuario autenticado |
| Automatizado | Sí |
| qaseId | 328 |

### TC-SEG-010

**Rol no permitido**

| Campo | Valor |
| --- | --- |
| Descripción | autorizar responde 403 si el rol no está entre los permitidos. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autorizar("ADMINISTRADOR") con un CLIENTE |
| Resultado esperado | 403 y no llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › responde 403 si el rol no está permitido |
| Automatizado | Sí |
| qaseId | 329 |

### TC-SEG-011

**Rol permitido**

| Campo | Valor |
| --- | --- |
| Descripción | autorizar deja pasar un rol permitido. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autorizar con el rol correcto |
| Resultado esperado | Llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › sigue si el rol está permitido |
| Automatizado | Sí |
| qaseId | 330 |

### TC-SEG-012

**Varios roles permitidos**

| Campo | Valor |
| --- | --- |
| Descripción | autorizar acepta cualquiera de los roles indicados. |
| Precondiciones | Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test. |
| Pasos | 1. Invocar autorizar("CLIENTE", "PRESTADOR") con un PRESTADOR |
| Resultado esperado | Llama a next. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: middlewares |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/middlewares.test.js` › acepta cualquiera de varios roles permitidos |
| Automatizado | Sí |
| qaseId | 331 |

### TC-SEG-013

**Rutas protegidas sin token**

| Campo | Valor |
| --- | --- |
| Descripción | Cada ruta protegida responde 401 si no se manda token. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Pedir cada ruta protegida sin Authorization |
| Resultado esperado | 401 y no se llama a ningún servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/apiHttpJwt.test.js` › %s %s responde 401 |
| Automatizado | Sí |
| qaseId | 332 |

### TC-SEG-014

**Token inválido en rutas protegidas**

| Campo | Valor |
| --- | --- |
| Descripción | Un token mal formado, firmado con otra clave, vencido o sin "Bearer" responde 401 en todas las rutas protegidas. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Pedir cada ruta protegida con el token inválido del caso |
| Resultado esperado | 401 en todas. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/apiHttpJwt.test.js` › un token %s responde 401 en todas las rutas protegidas |
| Automatizado | Sí |
| qaseId | 333 |

### TC-SEG-015

**Rol incorrecto**

| Campo | Valor |
| --- | --- |
| Descripción | Cada ruta con rol responde 403 a los roles que no tienen permiso. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Pedir cada ruta con un token válido de un rol no permitido |
| Resultado esperado | 403 y no se llama a ningún servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-03, RF-09, RF-11, RF-12, RF-13, RF-14, RF-15, RF-21 |
| Archivo y test | `tests/apiHttpJwt.test.js` › %s %s con el rol %s responde 403 |
| Automatizado | Sí |
| qaseId | 334 |

### TC-SEG-016

**Rol correcto y datos válidos**

| Campo | Valor |
| --- | --- |
| Descripción | Con el rol correcto y datos válidos cada ruta protegida responde 200 o 201. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Pedir cada ruta con token del rol permitido y un cuerpo válido |
| Resultado esperado | Responde el código esperado (200/201). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-03, RF-04, RF-09, RF-11, RF-12, RF-13, RF-14, RF-15, RF-21 |
| Archivo y test | `tests/apiHttpJwt.test.js` › %s %s como %s responde %i |
| Automatizado | Sí |
| qaseId | 335 |

### TC-SEG-017

**El id sale del token**

| Campo | Valor |
| --- | --- |
| Descripción | El servicio recibe el id del token aunque el cuerpo traiga otro usuarioId. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. PUT /api/prestadores/me con usuarioId "otro" en el cuerpo |
| Resultado esperado | El servicio se llama con el id del token y sin el campo usuarioId. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-03 |
| Archivo y test | `tests/apiHttpJwt.test.js` › usa el id del token y no uno que venga en el pedido |
| Automatizado | Sí |
| qaseId | 336 |

### TC-SEG-018

**Usuario y rol del token**

| Campo | Valor |
| --- | --- |
| Descripción | El listado de solicitudes recibe el usuario y el rol del token. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. GET /api/solicitudes con token de CLIENTE |
| Resultado esperado | El servicio recibe { id, rol } del token. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/apiHttpJwt.test.js` › le pasa al servicio el usuario y el rol que vienen en el token |
| Automatizado | Sí |
| qaseId | 337 |

### TC-SEG-019

**Datos inválidos con JWT válido**

| Campo | Valor |
| --- | --- |
| Descripción | Con token válido pero cuerpo o filtros inválidos se responde 400 sin llegar al servicio. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Pedir cada ruta con token válido y el dato inválido del caso |
| Resultado esperado | 400 con un mensaje de error y sin llamadas a servicios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-04, RF-09, RF-10, RF-14 |
| Archivo y test | `tests/apiHttpJwt.test.js` › %s %s como %s con el cuerpo %j responde 400 |
| Automatizado | Sí |
| qaseId | 338 |

### TC-SEG-020

**JSON inválido**

| Campo | Valor |
| --- | --- |
| Descripción | Un cuerpo que no es JSON válido responde 400. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. POST /api/solicitudes como CLIENTE con un JSON roto |
| Resultado esperado | 400 con un mensaje que menciona JSON. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/apiHttpJwt.test.js` › responde 400 si el cuerpo no es un JSON válido |
| Automatizado | Sí |
| qaseId | 339 |

### TC-SEG-021

**Rutas públicas sin token**

| Campo | Valor |
| --- | --- |
| Descripción | Health, búsqueda, mapa y ficha no piden token. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. GET de cada ruta pública sin Authorization |
| Resultado esperado | 200. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-05, RF-07, RF-08 |
| Archivo y test | `tests/apiHttpJwt.test.js` › GET %s no pide token y responde 200 |
| Automatizado | Sí |
| qaseId | 340 |

### TC-SEG-022

**Rutas públicas con filtros inválidos**

| Campo | Valor |
| --- | --- |
| Descripción | La búsqueda y el mapa validan sus filtros. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. GET /api/prestadores?lat=-34.6<br>2. GET /api/prestadores/mapa?oficioId=%20 |
| Resultado esperado | 400. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-05, RF-06 |
| Archivo y test | `tests/apiHttpJwt.test.js` › GET %s con filtros inválidos responde 400 |
| Automatizado | Sí |
| qaseId | 341 |

### TC-SEG-023

**Ruta inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Una ruta que no existe responde 404. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. GET /api/no-existe |
| Resultado esperado | 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/apiHttpJwt.test.js` › responde 404 en una ruta que no existe |
| Automatizado | Sí |
| qaseId | 342 |

### TC-SEG-024

**Errores del servicio a HTTP**

| Campo | Valor |
| --- | --- |
| Descripción | Los errores 403, 404 y 409 del servicio se traducen al código y mensaje HTTP. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Hacer fallar aceptarSolicitud con el status del caso<br>2. PATCH /api/solicitudes/s1/aceptar |
| Resultado esperado | Responde ese status con el mensaje del servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | RF-11 |
| Archivo y test | `tests/apiHttpJwt.test.js` › traduce un error %i del servicio al código HTTP y a su mensaje |
| Automatizado | Sí |
| qaseId | 343 |

### TC-SEG-025

**500 sin detalle interno**

| Campo | Valor |
| --- | --- |
| Descripción | Un error inesperado del servicio responde 500 sin exponer el detalle. |
| Precondiciones | App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test. |
| Pasos | 1. Hacer fallar un servicio con un error común<br>2. Pedir la ruta |
| Resultado esperado | 500 con "Error interno del servidor". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Seguridad: API HTTP y JWT |
| Rol | Todos |
| Requerimiento | Transversal |
| Archivo y test | `tests/apiHttpJwt.test.js` › responde 500 sin mostrar el detalle interno |
| Automatizado | Sí |
| qaseId | 344 |

### TC-AUTH-001

**Registro sin datos obligatorios**

| Campo | Valor |
| --- | --- |
| Descripción | El registro exige nombre, DNI, email, contraseña y rol. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register sin alguno de los datos |
| Resultado esperado | 400 "Faltan datos obligatorios" sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 si falta algún dato |
| Automatizado | Sí |
| qaseId | 345 |

### TC-AUTH-002

**Registro sin DNI**

| Campo | Valor |
| --- | --- |
| Descripción | El DNI es obligatorio para crear una cuenta. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register sin dni |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 si falta el DNI |
| Automatizado | Sí |
| qaseId | 346 |

### TC-AUTH-003

**Dato que no es texto**

| Campo | Valor |
| --- | --- |
| Descripción | Todos los datos del registro tienen que ser texto. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con un dato numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 si un dato no es texto |
| Automatizado | Sí |
| qaseId | 347 |

### TC-AUTH-004

**DNI numérico**

| Campo | Valor |
| --- | --- |
| Descripción | El DNI tiene que llegar como texto, no como número. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con dni numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 si el DNI llega como número y no como texto |
| Automatizado | Sí |
| qaseId | 348 |

### TC-AUTH-005

**DNI con formato inválido**

| Campo | Valor |
| --- | --- |
| Descripción | Se rechazan DNI con letras, guiones o con menos de 7 o más de 8 dígitos. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con cada DNI inválido |
| Resultado esperado | 400 "El DNI debe tener 7 u 8 números". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 con el DNI inválido "%s" |
| Automatizado | Sí |
| qaseId | 349 |

### TC-AUTH-006

**Email inválido**

| Campo | Valor |
| --- | --- |
| Descripción | Se rechazan emails sin arroba, sin dominio o con espacios. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con cada email inválido |
| Resultado esperado | 400 "Email inválido". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 con el email inválido "%s" |
| Automatizado | Sí |
| qaseId | 350 |

### TC-AUTH-007

**Contraseña corta**

| Campo | Valor |
| --- | --- |
| Descripción | La contraseña tiene que tener al menos 8 caracteres. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con una contraseña de 7 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › responde 400 si la contraseña tiene menos de 8 caracteres |
| Automatizado | Sí |
| qaseId | 351 |

### TC-AUTH-008

**Registro exitoso con datos limpios**

| Campo | Valor |
| --- | --- |
| Descripción | El controlador limpia los datos (trim, email en minúsculas) y responde 201. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con datos válidos con espacios y mayúsculas |
| Resultado esperado | El servicio recibe los datos normalizados y se responde 201. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › registra con los datos limpios y responde 201 |
| Automatizado | Sí |
| qaseId | 352 |

### TC-AUTH-009

**DNI normalizado**

| Campo | Valor |
| --- | --- |
| Descripción | El DNI se guarda siempre igual aunque se escriba con puntos o espacios. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con el DNI en cada formato |
| Resultado esperado | El servicio recibe el DNI solo con números. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › guarda siempre el mismo DNI aunque se escriba como "%s" |
| Automatizado | Sí |
| qaseId | 353 |

### TC-AUTH-010

**DNI que empieza con 9**

| Campo | Valor |
| --- | --- |
| Descripción | Se aceptan DNI de 8 dígitos que empiezan con 9. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar register con un DNI que empieza con 9 |
| Resultado esperado | 201. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › acepta un DNI que empieza con 9 |
| Automatizado | Sí |
| qaseId | 354 |

### TC-AUTH-011

**Error del servicio en el registro**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar registrarUsuario<br>2. Invocar register |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: registro |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 355 |

### TC-AUTH-012

**Login sin email o contraseña**

| Campo | Valor |
| --- | --- |
| Descripción | El login exige email y contraseña. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar login sin alguno de los dos |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 si falta el email o la contraseña |
| Automatizado | Sí |
| qaseId | 356 |

### TC-AUTH-013

**Login con email en minúsculas**

| Campo | Valor |
| --- | --- |
| Descripción | El email se normaliza a minúsculas antes de iniciar sesión. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar login con el email en mayúsculas |
| Resultado esperado | El servicio recibe el email en minúsculas y se devuelve su resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authController.test.js` › inicia sesión con el email en minúsculas y devuelve el resultado |
| Automatizado | Sí |
| qaseId | 357 |

### TC-AUTH-014

**Login sin DNI**

| Campo | Valor |
| --- | --- |
| Descripción | El inicio de sesión no pide el DNI. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar login solo con email y contraseña |
| Resultado esperado | Se inicia sesión normalmente. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authController.test.js` › no pide el DNI para iniciar sesión |
| Automatizado | Sí |
| qaseId | 358 |

### TC-AUTH-015

**Error del servicio en el login**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar iniciarSesion<br>2. Invocar login |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 359 |

### TC-AUTH-016

**Perfil del usuario autenticado**

| Campo | Valor |
| --- | --- |
| Descripción | GET /me devuelve el perfil del usuario del token. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar me con req.usuario |
| Resultado esperado | Responde el perfil devuelto por el servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › devuelve el perfil del usuario autenticado |
| Automatizado | Sí |
| qaseId | 360 |

### TC-AUTH-017

**Error del servicio en el perfil**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar obtenerPerfil<br>2. Invocar me |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: sesión |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 361 |

### TC-AUTH-018

**Rol no permitido en el registro**

| Campo | Valor |
| --- | --- |
| Descripción | El registro público solo permite CLIENTE o PRESTADOR. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Llamar a registrarUsuario con rol ADMINISTRADOR |
| Resultado esperado | Lanza 400 y no crea el usuario. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authService.test.js` › rechaza un rol que no es CLIENTE ni PRESTADOR |
| Automatizado | Sí |
| qaseId | 362 |

### TC-AUTH-019

**DNI ya registrado**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede crear otra cuenta con un DNI existente. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario con ese DNI<br>2. Llamar a registrarUsuario |
| Resultado esperado | Lanza 409 y no crea el usuario. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authService.test.js` › rechaza un DNI ya registrado |
| Automatizado | Sí |
| qaseId | 363 |

### TC-AUTH-020

**Email ya registrado**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede crear otra cuenta con un email existente. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario con ese email<br>2. Llamar a registrarUsuario |
| Resultado esperado | Lanza 409 y no crea el usuario. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authService.test.js` › rechaza un email ya registrado |
| Automatizado | Sí |
| qaseId | 364 |

### TC-AUTH-021

**Alta de cliente**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente se crea con la contraseña hasheada y sin perfil de prestador. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Llamar a registrarUsuario con rol CLIENTE |
| Resultado esperado | prisma.usuario.create recibe un hash bcrypt (no la contraseña) y sin perfil de prestador. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/authService.test.js` › crea un cliente con la contraseña hasheada y sin perfil de prestador |
| Automatizado | Sí |
| qaseId | 365 |

### TC-AUTH-022

**Alta de prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Registrar un PRESTADOR crea su perfil de prestador vacío. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Llamar a registrarUsuario con rol PRESTADOR |
| Resultado esperado | prisma.usuario.create incluye prestador: { create: {} }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/authService.test.js` › crea el perfil de prestador vacío al registrar un PRESTADOR |
| Automatizado | Sí |
| qaseId | 366 |

### TC-AUTH-023

**Búsqueda por email al iniciar sesión**

| Campo | Valor |
| --- | --- |
| Descripción | iniciarSesion busca al usuario por su email. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Llamar a iniciarSesion |
| Resultado esperado | Se consulta prisma.usuario.findUnique por email. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authService.test.js` › busca al usuario por email |
| Automatizado | Sí |
| qaseId | 367 |

### TC-AUTH-024

**Email inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Un email que no existe se rechaza con 401. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular que no hay usuario<br>2. Llamar a iniciarSesion |
| Resultado esperado | Lanza 401 "Email o contraseña incorrectos". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authService.test.js` › rechaza un email que no existe con 401 |
| Automatizado | Sí |
| qaseId | 368 |

### TC-AUTH-025

**Contraseña incorrecta**

| Campo | Valor |
| --- | --- |
| Descripción | Una contraseña incorrecta responde con el mismo mensaje que un email inexistente. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario<br>2. Llamar a iniciarSesion con otra contraseña |
| Resultado esperado | Lanza 401 con el mismo mensaje. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authService.test.js` › rechaza una contraseña incorrecta con el mismo mensaje |
| Automatizado | Sí |
| qaseId | 369 |

### TC-AUTH-026

**Cuenta desactivada**

| Campo | Valor |
| --- | --- |
| Descripción | Un usuario desactivado no puede iniciar sesión. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario con activo = false<br>2. Llamar a iniciarSesion |
| Resultado esperado | Lanza 403. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authService.test.js` › rechaza una cuenta desactivada con 403 |
| Automatizado | Sí |
| qaseId | 370 |

### TC-AUTH-027

**Token de sesión**

| Campo | Valor |
| --- | --- |
| Descripción | El login devuelve un JWT con el id y el rol, sin contraseña ni DNI. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Llamar a iniciarSesion con credenciales correctas<br>2. Verificar el token con la clave de test |
| Resultado esperado | El token tiene sub = id del usuario y su rol; la respuesta no incluye passwordHash ni dni. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/authService.test.js` › devuelve un token válido con el id y el rol, sin la contraseña ni el DNI |
| Automatizado | Sí |
| qaseId | 371 |

### TC-AUTH-028

**Perfil con DNI**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerPerfil devuelve el DNI y no la contraseña. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular el usuario<br>2. Llamar a obtenerPerfil |
| Resultado esperado | Incluye dni y no incluye passwordHash. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › devuelve el perfil con el DNI y sin la contraseña |
| Automatizado | Sí |
| qaseId | 372 |

### TC-AUTH-029

**Perfil de usuario inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerPerfil lanza 404 si el usuario no existe. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular que no hay usuario<br>2. Llamar a obtenerPerfil |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › lanza 404 si el usuario no existe |
| Automatizado | Sí |
| qaseId | 373 |

### TC-AUTH-030

**Perfil de usuario desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerPerfil lanza 404 si el usuario está desactivado. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario con activo = false<br>2. Llamar a obtenerPerfil |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › lanza 404 si el usuario está desactivado |
| Automatizado | Sí |
| qaseId | 374 |

### TC-AUTH-031

**Editar nombre sin nombre válido**

| Campo | Valor |
| --- | --- |
| Descripción | PATCH /me exige un nombre de texto que no esté vacío. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMe sin nombre, con espacios o con un número |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 si el nombre %s |
| Automatizado | Sí |
| qaseId | 375 |

### TC-AUTH-032

**Editar nombre demasiado largo**

| Campo | Valor |
| --- | --- |
| Descripción | El nombre no puede superar los 100 caracteres. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMe con un nombre de 101 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 si el nombre supera los 100 caracteres |
| Automatizado | Sí |
| qaseId | 376 |

### TC-AUTH-033

**Editar solo el nombre**

| Campo | Valor |
| --- | --- |
| Descripción | El controlador limpia el nombre y usa el id del token; ignora dni, email y rol. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMe con nombre, dni, email y rol |
| Resultado esperado | El servicio recibe solo el id del token y el nombre limpio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › edita solo el nombre del usuario del token e ignora dni, email y rol |
| Automatizado | Sí |
| qaseId | 377 |

### TC-AUTH-034

**Error del servicio al editar el nombre**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar actualizarNombre<br>2. Invocar actualizarMe |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 378 |

### TC-AUTH-035

**Cambiar contraseña sin datos**

| Campo | Valor |
| --- | --- |
| Descripción | Hacen falta la contraseña actual y la nueva, ambas de texto. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarPassword sin alguna de las dos o con números |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 %s |
| Automatizado | Sí |
| qaseId | 379 |

### TC-AUTH-036

**Contraseña nueva corta**

| Campo | Valor |
| --- | --- |
| Descripción | La contraseña nueva tiene que tener al menos 8 caracteres. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarPassword con una nueva de 7 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 si la contraseña nueva tiene menos de 8 caracteres |
| Automatizado | Sí |
| qaseId | 380 |

### TC-AUTH-037

**Contraseña nueva igual a la actual**

| Campo | Valor |
| --- | --- |
| Descripción | No se acepta repetir la contraseña actual. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarPassword con la misma contraseña en los dos campos |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › responde 400 si la contraseña nueva es igual a la actual |
| Automatizado | Sí |
| qaseId | 381 |

### TC-AUTH-038

**Cambio de contraseña correcto**

| Campo | Valor |
| --- | --- |
| Descripción | Usa el id del token y responde sin ningún dato de la clave. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarPassword con datos válidos |
| Resultado esperado | Responde { mensaje: "Contraseña actualizada" }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › cambia la contraseña del usuario del token y no devuelve datos de la clave |
| Automatizado | Sí |
| qaseId | 382 |

### TC-AUTH-039

**Error del servicio al cambiar la contraseña**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de autenticación con authService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar cambiarPassword<br>2. Invocar cambiarPassword |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 383 |

### TC-AUTH-040

**Actualizar nombre**

| Campo | Valor |
| --- | --- |
| Descripción | actualizarNombre cambia solo el nombre y devuelve el perfil sin la contraseña. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular el usuario<br>2. Llamar a actualizarNombre |
| Resultado esperado | prisma.usuario.update recibe solo el nombre y el perfil no incluye passwordHash. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › actualiza solo el nombre y devuelve el perfil sin la contraseña |
| Automatizado | Sí |
| qaseId | 384 |

### TC-AUTH-041

**Actualizar nombre de usuario inexistente o desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | No se edita a un usuario que no existe o está desactivado. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular que no hay usuario o que está desactivado<br>2. Llamar a actualizarNombre |
| Resultado esperado | Lanza 404 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › lanza 404 si el usuario %s |
| Automatizado | Sí |
| qaseId | 385 |

### TC-AUTH-042

**Contraseña nueva hasheada**

| Campo | Valor |
| --- | --- |
| Descripción | cambiarPassword guarda la nueva contraseña con hash bcrypt y no devuelve nada. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario con su contraseña actual<br>2. Llamar a cambiarPassword |
| Resultado esperado | prisma.usuario.update recibe solo passwordHash, que valida contra la nueva y no es el texto plano. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › guarda la contraseña nueva hasheada y no devuelve nada |
| Automatizado | Sí |
| qaseId | 386 |

### TC-AUTH-043

**Contraseña actual incorrecta**

| Campo | Valor |
| --- | --- |
| Descripción | No se cambia la contraseña si la actual no coincide. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario<br>2. Llamar a cambiarPassword con otra contraseña actual |
| Resultado esperado | Lanza 400 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › lanza 400 si la contraseña actual es incorrecta y no cambia nada |
| Automatizado | Sí |
| qaseId | 387 |

### TC-AUTH-044

**Cambiar contraseña de usuario inexistente o desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | No se cambia la contraseña de un usuario que no existe o está desactivado. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular que no hay usuario o que está desactivado<br>2. Llamar a cambiarPassword |
| Resultado esperado | Lanza 404 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: edición de perfil y contraseña (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › lanza 404 si el usuario %s |
| Automatizado | Sí |
| qaseId | 388 |

### TC-AUTH-045

**Número en el registro**

| Campo | Valor |
| --- | --- |
| Descripción | El registro devuelve el número autogenerado del usuario y no acepta uno elegido por quien se registra. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular el alta con un número en los datos<br>2. Llamar a registrarUsuario |
| Resultado esperado | prisma.usuario.create no recibe número y la respuesta incluye id y numero. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: número identificador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › el registro devuelve el número autogenerado y no lo deja elegir |
| Automatizado | Sí |
| qaseId | 389 |

### TC-AUTH-046

**Número en el perfil**

| Campo | Valor |
| --- | --- |
| Descripción | El perfil del usuario incluye su número además del id. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular el usuario con número<br>2. Llamar a obtenerPerfil |
| Resultado esperado | La respuesta incluye id y numero. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: número identificador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › el perfil incluye el número además del id |
| Automatizado | Sí |
| qaseId | 390 |

### TC-AUTH-047

**Foto de perfil de un cliente**

| Campo | Valor |
| --- | --- |
| Descripción | El perfil de un cliente incluye su foto, o null si no tiene. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un cliente con foto y otro sin foto<br>2. Llamar a obtenerPerfil |
| Resultado esperado | La respuesta incluye fotoPerfil con la URL o null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: foto de perfil |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › el perfil de un cliente %s incluye fotoPerfil |
| Automatizado | Sí |
| qaseId | 391 |

### TC-AUTH-048

**Foto de perfil de un prestador**

| Campo | Valor |
| --- | --- |
| Descripción | El perfil de un prestador toma la foto del campo fotoPerfil de su perfil de prestador. |
| Precondiciones | authService con Prisma simulado (sin base de datos real) y una clave JWT de test. |
| Pasos | 1. Simular un usuario prestador y su perfil con foto<br>2. Llamar a obtenerPerfil y actualizarNombre |
| Resultado esperado | La respuesta incluye la foto del prestador (o null si no hay perfil) tanto al consultar como al editar el nombre. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Autenticación: foto de perfil |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/authService.test.js` › el perfil de un prestador toma la foto de su perfil de prestador |
| Automatizado | Sí |
| qaseId | 392 |

### TC-FOT-001

**Subida sin imagen o con tipo no permitido**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se acepta una imagen JPG, PNG o WebP en el cuerpo del pedido. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Invocar subir sin Content-Type, con un tipo que no es imagen, con gif, sin cuerpo, con cuerpo vacío o con un cuerpo que no es una imagen cruda |
| Resultado esperado | 400 "Enviá la imagen como JPG, PNG o WebP en el cuerpo del pedido" sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › responde 400 %s |
| Automatizado | Sí |
| qaseId | 393 |

### TC-FOT-002

**Archivo que no es lo que dice ser**

| Campo | Valor |
| --- | --- |
| Descripción | Se comprueban los primeros bytes del archivo: un texto con la etiqueta image/png, o un formato distinto al declarado, se rechaza. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Invocar subir con un texto como image/png<br>2. Invocar subir con un PNG como image/jpeg, un JPG como image/webp y un RIFF que no es WebP |
| Resultado esperado | 400 "El archivo no es una imagen válida o no coincide con su tipo" sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › responde 400 con %s |
| Automatizado | Sí |
| qaseId | 394 |

### TC-FOT-003

**Subida válida**

| Campo | Valor |
| --- | --- |
| Descripción | Una imagen JPG, PNG o WebP válida llega al servicio con el usuario y el rol del token. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Invocar subir con cada formato válido, incluso con parámetros en el Content-Type |
| Resultado esperado | El servicio recibe el id y el rol del token, la imagen y su tipo, y se responde con la URL. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › acepta una imagen %s y usa el usuario del token |
| Automatizado | Sí |
| qaseId | 395 |

### TC-FOT-004

**Error del servicio al subir la foto**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar subirFoto<br>2. Invocar subir |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 396 |

### TC-FOT-005

**Eliminar la foto propia**

| Campo | Valor |
| --- | --- |
| Descripción | Se elimina la foto del usuario del token. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Invocar eliminar con req.usuario |
| Resultado esperado | El servicio recibe el id y el rol del token y se responde { fotoPerfil: null }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › elimina la foto del usuario del token |
| Automatizado | Sí |
| qaseId | 397 |

### TC-FOT-006

**Error del servicio al eliminar la foto**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de fotos con fotosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar eliminarFoto<br>2. Invocar eliminar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: controlador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 398 |

### TC-FOT-007

**Subir la foto de un cliente**

| Campo | Valor |
| --- | --- |
| Descripción | La imagen se sube al store público con una URL única y la URL se guarda en el usuario. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Llamar a subirFoto con rol CLIENTE |
| Resultado esperado | put recibe access público, el tipo de la imagen y addRandomSuffix; el usuario guarda la URL y se devuelve. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › sube la imagen al store y guarda la URL en el usuario cliente |
| Automatizado | Sí |
| qaseId | 399 |

### TC-FOT-008

**Subir la foto de un prestador**

| Campo | Valor |
| --- | --- |
| Descripción | La URL se guarda en el campo fotoPerfil del prestador, el mismo que usan los listados y la ficha. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Llamar a subirFoto con rol PRESTADOR |
| Resultado esperado | El prestador guarda la URL y no se modifica la tabla de usuarios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › guarda la URL en el perfil cuando es un prestador |
| Automatizado | Sí |
| qaseId | 400 |

### TC-FOT-009

**Reemplazar la foto**

| Campo | Valor |
| --- | --- |
| Descripción | Al subir una foto nueva se borra la anterior del store. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un usuario con una foto del store<br>2. Llamar a subirFoto |
| Resultado esperado | del recibe la URL de la foto anterior. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › al reemplazar la foto borra la anterior del store |
| Automatizado | Sí |
| qaseId | 401 |

### TC-FOT-010

**No borrar fotos que no son del store**

| Campo | Valor |
| --- | --- |
| Descripción | Si no había foto, o era una URL externa cargada a mano, no se intenta borrar nada. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un usuario sin foto y otro con una URL externa<br>2. Llamar a subirFoto |
| Resultado esperado | del no se llama y la foto nueva se guarda igual. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › no borra nada del store si %s |
| Automatizado | Sí |
| qaseId | 402 |

### TC-FOT-011

**Falla el borrado de la foto anterior**

| Campo | Valor |
| --- | --- |
| Descripción | Si el store no puede borrar la foto vieja, el usuario igual conserva su foto nueva. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular que del falla<br>2. Llamar a subirFoto |
| Resultado esperado | Se devuelve la URL nueva sin error. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › responde bien aunque falle el borrado de la foto anterior |
| Automatizado | Sí |
| qaseId | 403 |

### TC-FOT-012

**Falla el guardado en la base**

| Campo | Valor |
| --- | --- |
| Descripción | Si no se puede guardar la URL, la foto recién subida se borra para no dejarla huérfana. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular que update falla<br>2. Llamar a subirFoto |
| Resultado esperado | Lanza el error y del recibe la URL de la foto nueva. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › si falla el guardado en la base, borra la foto recién subida |
| Automatizado | Sí |
| qaseId | 404 |

### TC-FOT-013

**Falla la subida al store**

| Campo | Valor |
| --- | --- |
| Descripción | Si el store falla, no se modifica la base. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular que put falla<br>2. Llamar a subirFoto |
| Resultado esperado | Lanza el error sin actualizar la base ni borrar nada. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › si falla la subida al store, no toca la base |
| Automatizado | Sí |
| qaseId | 405 |

### TC-FOT-014

**Subir foto de un usuario inexistente o desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | No se sube nada para un usuario o prestador que no existe o está desactivado. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular que no hay usuario, que está desactivado, o lo mismo para el perfil de prestador<br>2. Llamar a subirFoto |
| Resultado esperado | Lanza 404 y no sube nada. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › lanza 404 con %s y no sube nada |
| Automatizado | Sí |
| qaseId | 406 |

### TC-FOT-015

**Eliminar la foto**

| Campo | Valor |
| --- | --- |
| Descripción | Se quita la foto del perfil y se borra del store. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un usuario con una foto del store<br>2. Llamar a eliminarFoto |
| Resultado esperado | El usuario queda con fotoPerfil null, del recibe la URL y se devuelve { fotoPerfil: null }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › quita la foto del perfil y la borra del store |
| Automatizado | Sí |
| qaseId | 407 |

### TC-FOT-016

**Eliminar una foto externa**

| Campo | Valor |
| --- | --- |
| Descripción | Si la foto era una URL externa, solo se quita del perfil. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un prestador con una URL externa<br>2. Llamar a eliminarFoto |
| Resultado esperado | El prestador queda con fotoPerfil null y del no se llama. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › si la foto era una URL externa, solo la quita del perfil |
| Automatizado | Sí |
| qaseId | 408 |

### TC-FOT-017

**Eliminar sin tener foto**

| Campo | Valor |
| --- | --- |
| Descripción | No hay nada que eliminar. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un usuario sin foto<br>2. Llamar a eliminarFoto |
| Resultado esperado | Lanza 404 "No tenés una foto de perfil" sin modificar nada. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › lanza 404 si no tiene foto de perfil |
| Automatizado | Sí |
| qaseId | 409 |

### TC-FOT-018

**Eliminar la foto de un usuario desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | No se modifica a un usuario desactivado. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Simular un usuario desactivado<br>2. Llamar a eliminarFoto |
| Resultado esperado | Lanza 404 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › lanza 404 si el usuario no existe o está desactivado |
| Automatizado | Sí |
| qaseId | 410 |

### TC-FOT-019

**Reconocer las fotos del store**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se consideran propias las URL del dominio de Vercel Blob; no se confunden dominios parecidos ni textos que no son URL. |
| Precondiciones | fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales. |
| Pasos | 1. Llamar a esFotoDelStore con URL del store, URL externas, un dominio parecido, un texto y null |
| Resultado esperado | Devuelve true solo para las URL del store. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Foto de perfil: servicio |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosService.test.js` › reconoce si %s es una foto del store |
| Automatizado | Sí |
| qaseId | 411 |

### TC-FOT-020

**Foto de perfil sin token**

| Campo | Valor |
| --- | --- |
| Descripción | Subir y eliminar la foto exigen estar logueado. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a PUT y DELETE /api/auth/me/foto sin token |
| Resultado esperado | 401 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › %s /api/auth/me/foto sin token responde 401 |
| Automatizado | Sí |
| qaseId | 412 |

### TC-FOT-021

**Foto de perfil como administrador**

| Campo | Valor |
| --- | --- |
| Descripción | Solo clientes y prestadores tienen foto de perfil. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a PUT y DELETE /api/auth/me/foto con un token de administrador |
| Resultado esperado | 403 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › %s /api/auth/me/foto como administrador responde 403 |
| Automatizado | Sí |
| qaseId | 413 |

### TC-FOT-022

**Subir la foto con el cuerpo crudo**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente y un prestador pueden subir su foto enviando la imagen como cuerpo del pedido. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a PUT /api/auth/me/foto con un PNG y el Content-Type image/png |
| Resultado esperado | 200 con la URL; el servicio recibe el id y el rol del token y la imagen completa. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › un %s sube su foto con el cuerpo crudo y recibe la URL |
| Automatizado | Sí |
| qaseId | 414 |

### TC-FOT-023

**Imagen de más de 2 MB**

| Campo | Valor |
| --- | --- |
| Descripción | Se rechaza una imagen que supera los 2 MB antes de procesarla. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a PUT /api/auth/me/foto con una imagen de más de 2 MB |
| Resultado esperado | 413 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › responde 413 si la imagen pesa más de 2 MB |
| Automatizado | Sí |
| qaseId | 415 |

### TC-FOT-024

**JSON en lugar de la imagen**

| Campo | Valor |
| --- | --- |
| Descripción | Si el cuerpo es JSON y no una imagen, se rechaza. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a PUT /api/auth/me/foto con un cuerpo JSON |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › responde 400 si se envía JSON en lugar de la imagen |
| Automatizado | Sí |
| qaseId | 416 |

### TC-FOT-025

**Eliminar la foto por HTTP**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente elimina su foto con DELETE /api/auth/me/foto. |
| Precondiciones | API completa con supertest y fotosService simulado; token JWT firmado con la clave de test. |
| Pasos | 1. Llamar a DELETE /api/auth/me/foto con un token de cliente |
| Resultado esperado | 200 { fotoPerfil: null }; el servicio recibe el id y el rol del token. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Foto de perfil: API |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/fotosHttp.test.js` › un cliente elimina su foto |
| Automatizado | Sí |
| qaseId | 417 |

### TC-OFI-001

**Listado público de oficios**

| Campo | Valor |
| --- | --- |
| Descripción | El listado público devuelve los oficios activos. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar listar |
| Resultado esperado | Se pide el listado sin inactivos y se devuelve el resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Visitante |
| Requerimiento | RF-22, RF-04 |
| Archivo y test | `tests/oficiosController.test.js` › devuelve los oficios activos |
| Automatizado | Sí |
| qaseId | 418 |

### TC-OFI-002

**Error en el listado público**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarOficios<br>2. Invocar listar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Visitante |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › pasa el error al manejador de errores |
| Automatizado | Sí |
| qaseId | 419 |

### TC-OFI-003

**Listado completo para el administrador**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador ve también los oficios inactivos. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar listarTodos |
| Resultado esperado | Se pide el listado con inactivos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › devuelve también los oficios inactivos |
| Automatizado | Sí |
| qaseId | 420 |

### TC-OFI-004

**Error en el listado completo**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarOficios<br>2. Invocar listarTodos |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › pasa el error al manejador de errores |
| Automatizado | Sí |
| qaseId | 421 |

### TC-OFI-005

**Alta con nombre inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El nombre es obligatorio y tiene que ser texto no vacío. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con nombre ausente, vacío o numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si el nombre es %p |
| Automatizado | Sí |
| qaseId | 422 |

### TC-OFI-006

**Alta con categoría inválida**

| Campo | Valor |
| --- | --- |
| Descripción | La categoría, si se manda, tiene que ser texto. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con categoría numérica |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si la categoría no es texto |
| Automatizado | Sí |
| qaseId | 423 |

### TC-OFI-007

**Alta de oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Se crea el oficio con nombre y categoría sin espacios sobrantes. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con datos válidos con espacios |
| Resultado esperado | El servicio recibe los datos limpios y se responde 201. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › crea el oficio con los datos limpios y responde 201 |
| Automatizado | Sí |
| qaseId | 424 |

### TC-OFI-008

**Alta sin categoría**

| Campo | Valor |
| --- | --- |
| Descripción | La categoría es opcional. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar crear solo con nombre |
| Resultado esperado | 201 con categoría undefined. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › permite crear un oficio sin categoría |
| Automatizado | Sí |
| qaseId | 425 |

### TC-OFI-009

**Error en el alta**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar crearOficio<br>2. Invocar crear |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 426 |

### TC-OFI-010

**Edición con nombre inválido**

| Campo | Valor |
| --- | --- |
| Descripción | Si se manda nombre, tiene que ser texto no vacío. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizar con nombre vacío, espacios o numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si el nombre es %p |
| Automatizado | Sí |
| qaseId | 427 |

### TC-OFI-011

**Edición con categoría inválida**

| Campo | Valor |
| --- | --- |
| Descripción | Si se manda categoría, tiene que ser texto. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizar con categoría numérica |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si la categoría no es texto |
| Automatizado | Sí |
| qaseId | 428 |

### TC-OFI-012

**Edición sin datos**

| Campo | Valor |
| --- | --- |
| Descripción | Hay que mandar al menos nombre o categoría. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizar con cuerpo vacío |
| Resultado esperado | 400 "No hay datos para actualizar". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si no hay nada para actualizar |
| Automatizado | Sí |
| qaseId | 429 |

### TC-OFI-013

**Edición de oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Se actualiza el oficio con los datos limpios. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizar con datos válidos |
| Resultado esperado | El servicio recibe el id y los datos limpios; se devuelve el oficio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › actualiza con los datos limpios y devuelve el oficio |
| Automatizado | Sí |
| qaseId | 430 |

### TC-OFI-014

**Error en la edición**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar actualizarOficio<br>2. Invocar actualizar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 431 |

### TC-OFI-015

**Cambio de estado con valor inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El campo activo tiene que ser booleano. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarEstado con "true", 1 o sin valor |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › responde 400 si activo es %p |
| Automatizado | Sí |
| qaseId | 432 |

### TC-OFI-016

**Activar o desactivar oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Se cambia el estado del oficio. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Invocar cambiarEstado con activo booleano |
| Resultado esperado | El servicio recibe el id y el estado; se devuelve el oficio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › cambia el estado y devuelve el oficio |
| Automatizado | Sí |
| qaseId | 433 |

### TC-OFI-017

**Error al cambiar el estado**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de oficios con oficiosService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar cambiarEstadoOficio<br>2. Invocar cambiarEstado |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: controlador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 434 |

### TC-OFI-018

**Solo activos por defecto**

| Campo | Valor |
| --- | --- |
| Descripción | listarOficios devuelve solo los activos si no se pide lo contrario. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarOficios() |
| Resultado esperado | Consulta con where { activo: true } ordenado por nombre. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Visitante |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › lista solo los oficios activos por defecto |
| Automatizado | Sí |
| qaseId | 435 |

### TC-OFI-019

**Incluir inactivos**

| Campo | Valor |
| --- | --- |
| Descripción | Con incluirInactivos se devuelven todos. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarOficios({ incluirInactivos: true }) |
| Resultado esperado | Consulta sin filtro de activo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › incluye los inactivos cuando se pide |
| Automatizado | Sí |
| qaseId | 436 |

### TC-OFI-020

**Nombre duplicado en el alta**

| Campo | Valor |
| --- | --- |
| Descripción | No se crea un oficio con un nombre existente. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular un oficio con ese nombre<br>2. Llamar a crearOficio |
| Resultado esperado | Lanza 409 y no crea. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › rechaza un nombre que ya existe con 409 |
| Automatizado | Sí |
| qaseId | 437 |

### TC-OFI-021

**Alta con nombre libre**

| Campo | Valor |
| --- | --- |
| Descripción | Se crea el oficio si el nombre está libre. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a crearOficio con un nombre nuevo |
| Resultado esperado | Se llama a prisma.oficio.create con los datos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › crea el oficio si el nombre está libre |
| Automatizado | Sí |
| qaseId | 438 |

### TC-OFI-022

**Editar oficio inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | actualizarOficio lanza 404 si el oficio no existe. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a actualizarOficio |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › lanza 404 si el oficio no existe |
| Automatizado | Sí |
| qaseId | 439 |

### TC-OFI-023

**Nombre duplicado en la edición**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede usar el nombre de otro oficio. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular otro oficio con el nombre nuevo<br>2. Llamar a actualizarOficio |
| Resultado esperado | Lanza 409 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › rechaza un nombre que ya usa otro oficio con 409 |
| Automatizado | Sí |
| qaseId | 440 |

### TC-OFI-024

**Mismo nombre sin buscar duplicados**

| Campo | Valor |
| --- | --- |
| Descripción | Si el nombre no cambia, no se buscan duplicados. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a actualizarOficio con el mismo nombre |
| Resultado esperado | Solo se busca el oficio por id (una consulta) y se actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › no busca duplicados si el nombre no cambia |
| Automatizado | Sí |
| qaseId | 441 |

### TC-OFI-025

**Edición con nombre nuevo**

| Campo | Valor |
| --- | --- |
| Descripción | Se actualiza el oficio con un nombre disponible. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a actualizarOficio con un nombre libre |
| Resultado esperado | Se llama a prisma.oficio.update. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › actualiza el oficio con un nombre nuevo disponible |
| Automatizado | Sí |
| qaseId | 442 |

### TC-OFI-028

**Alta sin distinguir mayúsculas**

| Campo | Valor |
| --- | --- |
| Descripción | No se crea un oficio cuyo nombre solo se diferencia en mayúsculas o minúsculas de uno existente (Plomería / PLOMERÍA). |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular un oficio existente<br>2. Llamar a crearOficio con el mismo nombre en mayúsculas |
| Resultado esperado | Lanza 409, la búsqueda es insensible a mayúsculas y no crea. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › rechaza con 409 un nombre que solo cambia en mayúsculas o minúsculas |
| Automatizado | Sí |
| qaseId | 443 |

### TC-OFI-029

**Edición sin distinguir mayúsculas**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede renombrar un oficio con un nombre que solo se diferencia en mayúsculas del de otro. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular otro oficio con ese nombre<br>2. Llamar a actualizarOficio con el nombre en mayúsculas |
| Resultado esperado | Lanza 409, la búsqueda excluye al propio oficio y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › rechaza con 409 un nombre que solo cambia en mayúsculas respecto de otro oficio |
| Automatizado | Sí |
| qaseId | 444 |

### TC-OFI-030

**Cambiar solo mayúsculas del propio nombre**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador puede corregir las mayúsculas del nombre de un oficio sin chocar consigo mismo. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no hay otro oficio con ese nombre<br>2. Llamar a actualizarOficio con el nombre en mayúsculas |
| Resultado esperado | Se actualiza el oficio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › permite cambiar solo las mayúsculas del nombre del propio oficio |
| Automatizado | Sí |
| qaseId | 445 |

### TC-OFI-026

**Cambiar estado de oficio inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | cambiarEstadoOficio lanza 404 si no existe. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a cambiarEstadoOficio |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › lanza 404 si el oficio no existe |
| Automatizado | Sí |
| qaseId | 446 |

### TC-OFI-027

**Desactivar sin borrar**

| Campo | Valor |
| --- | --- |
| Descripción | Desactivar un oficio actualiza activo = false y no lo borra. |
| Precondiciones | oficiosService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a cambiarEstadoOficio(id, false) |
| Resultado esperado | Se llama a update con { activo: false } (no hay borrado) y se devuelve el oficio inactivo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Oficios: servicio |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/oficiosService.test.js` › desactiva el oficio sin borrarlo |
| Automatizado | Sí |
| qaseId | 447 |

### TC-PRE-001

**Consultar perfil propio**

| Campo | Valor |
| --- | --- |
| Descripción | Devuelve el perfil del prestador autenticado. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar obtenerMiPerfil con req.usuario |
| Resultado esperado | El servicio recibe el id del token y se devuelve el perfil. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresController.test.js` › devuelve el perfil del prestador autenticado |
| Automatizado | Sí |
| qaseId | 448 |

### TC-PRE-002

**Error al consultar el perfil**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar obtenerMiPerfil<br>2. Invocar obtenerMiPerfil |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 449 |

### TC-PRE-003

**Campos de texto que no son texto**

| Campo | Valor |
| --- | --- |
| Descripción | Descripción, foto, zona, teléfono, WhatsApp y email de contacto tienen que ser texto. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con cada campo numérico |
| Resultado esperado | 400 "El campo <campo> debe ser texto" sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 si %s no es texto |
| Automatizado | Sí |
| qaseId | 450 |

### TC-PRE-004

**Email de contacto sin arroba**

| Campo | Valor |
| --- | --- |
| Descripción | El email de contacto tiene que tener arroba. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con emailContacto "sin-arroba" |
| Resultado esperado | 400 "El email de contacto es inválido". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 si el email de contacto no tiene arroba |
| Automatizado | Sí |
| qaseId | 451 |

### TC-PRE-005

**Ubicación, precios o disponibilidad inválidos**

| Campo | Valor |
| --- | --- |
| Descripción | Latitud, longitud, precios y disponible se validan por tipo y rango. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con cada dato fuera de rango o de otro tipo |
| Resultado esperado | 400 con el mensaje de cada validación, sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 con los datos %j |
| Automatizado | Sí |
| qaseId | 452 |

### TC-PRE-006

**Edición sin datos**

| Campo | Valor |
| --- | --- |
| Descripción | Hay que mandar al menos un campo editable. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil sin cuerpo o con cuerpo vacío |
| Resultado esperado | 400 "No hay datos para actualizar". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 si no hay datos para actualizar (%p) |
| Automatizado | Sí |
| qaseId | 453 |

### TC-PRE-007

**Edición con datos limpios**

| Campo | Valor |
| --- | --- |
| Descripción | Se actualiza con los datos sin espacios y se ignoran los campos no editables. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con campos válidos y otros no permitidos |
| Resultado esperado | El servicio recibe solo los campos permitidos y limpios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › actualiza con los datos limpios e ignora los campos que no se pueden editar |
| Automatizado | Sí |
| qaseId | 454 |

### TC-PRE-008

**Error al editar el perfil**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar actualizarMiPerfil<br>2. Invocar actualizarMiPerfil |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 455 |

### TC-PRE-009

**Lista de oficios inválida**

| Campo | Valor |
| --- | --- |
| Descripción | oficioIds tiene que ser una lista de identificadores de texto. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar asignarMisOficios sin cuerpo, sin oficioIds, con un texto o con números |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 con el cuerpo %j |
| Automatizado | Sí |
| qaseId | 456 |

### TC-PRE-010

**Asignar oficios**

| Campo | Valor |
| --- | --- |
| Descripción | Se asignan los oficios con los identificadores sin espacios. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar asignarMisOficios con ids con espacios |
| Resultado esperado | El servicio recibe el id del token y los ids limpios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › asigna los oficios con los identificadores limpios |
| Automatizado | Sí |
| qaseId | 457 |

### TC-PRE-011

**Error al asignar oficios**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar asignarMisOficios<br>2. Invocar asignarMisOficios |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (controlador) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 458 |

### TC-PRE-012

**Filtros de búsqueda inválidos**

| Campo | Valor |
| --- | --- |
| Descripción | Se validan oficioId, q, lat/lng, radioKm, calificacionMin y limit. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con cada consulta inválida |
| Resultado esperado | 400 con el mensaje de cada filtro, sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 con la consulta %j |
| Automatizado | Sí |
| qaseId | 459 |

### TC-PRE-013

**Búsqueda sin filtros**

| Campo | Valor |
| --- | --- |
| Descripción | Sin filtros se busca con la consulta vacía. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar sin query |
| Resultado esperado | El servicio recibe {} y se devuelve su resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › sin filtros, busca con la consulta vacía y devuelve el resultado |
| Automatizado | Sí |
| qaseId | 460 |

### TC-PRE-014

**Filtros convertidos**

| Campo | Valor |
| --- | --- |
| Descripción | Los filtros llegan al servicio convertidos a número y sin espacios. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con todos los filtros como texto |
| Resultado esperado | El servicio recibe números y textos limpios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa los filtros ya convertidos a número y sin espacios |
| Automatizado | Sí |
| qaseId | 461 |

### TC-PRE-059

**Página inválida o válida**

| Campo | Valor |
| --- | --- |
| Descripción | page tiene que ser un entero mayor o igual a 1 y llega al servicio convertido a número. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con page 0, -1, 1.5 y abc<br>2. Invocar listar con page "2" |
| Resultado esperado | 400 "page debe ser un entero mayor o igual a 1" sin llamar al servicio; con page válida el servicio recibe page: 2. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › rechaza la página inválida %j y acepta una válida |
| Automatizado | Sí |
| qaseId | 462 |

### TC-PRE-064

**Zona o presupuesto inválidos**

| Campo | Valor |
| --- | --- |
| Descripción | La zona tiene que ser texto de hasta 100 caracteres y el presupuesto un número mayor o igual a 0. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con zona vacía o muy larga<br>2. Invocar listar con presupuesto negativo, texto o vacío |
| Resultado esperado | 400 con el mensaje de cada filtro, sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › responde 400 con el filtro inválido %j |
| Automatizado | Sí |
| qaseId | 463 |

### TC-PRE-065

**Zona y presupuesto convertidos**

| Campo | Valor |
| --- | --- |
| Descripción | La zona llega al servicio sin espacios y el presupuesto convertido a número. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con zona " Palermo " y presupuesto "15000" |
| Resultado esperado | El servicio recibe zona "Palermo" y presupuesto 15000. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa la zona sin espacios y el presupuesto convertido a número |
| Automatizado | Sí |
| qaseId | 464 |

### TC-PRE-015

**Error en la búsqueda**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarPrestadores<br>2. Invocar listar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (controlador) |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/prestadoresController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 465 |

### TC-PRE-016

**Descripción profesional vacía**

| Campo | Valor |
| --- | --- |
| Descripción | La descripción profesional no puede quedar vacía. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con descripción vacía o solo espacios |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › responde 400 si la descripción profesional está vacía (%j) |
| Automatizado | Sí |
| qaseId | 466 |

### TC-PRE-017

**Teléfono o WhatsApp inválido**

| Campo | Valor |
| --- | --- |
| Descripción | Teléfono y WhatsApp tienen que tener formato telefónico. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con cada valor inválido |
| Resultado esperado | 400 "El teléfono es inválido" / "El WhatsApp es inválido". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › responde 400 si %s es %j |
| Automatizado | Sí |
| qaseId | 467 |

### TC-PRE-018

**Teléfonos válidos**

| Campo | Valor |
| --- | --- |
| Descripción | Se aceptan teléfonos con +, espacios y guiones. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con cada teléfono válido |
| Resultado esperado | Se llama al servicio con el teléfono. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › acepta el teléfono %s |
| Automatizado | Sí |
| qaseId | 468 |

### TC-PRE-019

**Descripción con texto**

| Campo | Valor |
| --- | --- |
| Descripción | Una descripción válida se guarda sin espacios sobrantes. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar actualizarMiPerfil con descripción con espacios |
| Resultado esperado | El servicio recibe la descripción limpia. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › acepta una descripción con texto y la guarda sin espacios sobrantes |
| Automatizado | Sí |
| qaseId | 469 |

### TC-PRE-020

**Filtro disponible inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El filtro disponible solo acepta "true" o "false". |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con disponible "si", "1", "TRUE" o vacío |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › responde 400 con disponible=%j |
| Automatizado | Sí |
| qaseId | 470 |

### TC-PRE-021

**Filtro disponible válido**

| Campo | Valor |
| --- | --- |
| Descripción | "true" y "false" se convierten a booleano. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con disponible "true" o "false" |
| Resultado esperado | El servicio recibe { disponible: true/false }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › pasa disponible=%s como %s |
| Automatizado | Sí |
| qaseId | 471 |

### TC-PRE-022

**Sin filtro de disponibilidad**

| Campo | Valor |
| --- | --- |
| Descripción | Sin el parámetro no se manda filtro de disponibilidad. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar listar sin disponible |
| Resultado esperado | El servicio recibe {}. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: validaciones |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresValidaciones.test.js` › sin el parámetro, no manda ningún filtro de disponibilidad |
| Automatizado | Sí |
| qaseId | 472 |

### TC-PRE-023

**Perfil con nombre, email y oficios**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerMiPerfil arma el perfil con los datos del usuario y sus oficios. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular el prestador con usuario y oficios<br>2. Llamar a obtenerMiPerfil |
| Resultado esperado | Devuelve nombre, email y oficios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (servicio) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresService.test.js` › devuelve el perfil con nombre, email y oficios |
| Automatizado | Sí |
| qaseId | 473 |

### TC-PRE-024

**Prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerMiPerfil lanza 404 si no hay perfil. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular que no existe<br>2. Llamar a obtenerMiPerfil |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (servicio) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresService.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 474 |

### TC-PRE-025

**Prestador inactivo**

| Campo | Valor |
| --- | --- |
| Descripción | obtenerMiPerfil lanza 404 si el perfil está inactivo. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular un prestador con activo = false<br>2. Llamar a obtenerMiPerfil |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (servicio) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresService.test.js` › lanza 404 si el prestador está inactivo |
| Automatizado | Sí |
| qaseId | 475 |

### TC-PRE-026

**Actualizar perfil**

| Campo | Valor |
| --- | --- |
| Descripción | actualizarMiPerfil guarda los datos y devuelve el perfil nuevo. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a actualizarMiPerfil con datos válidos |
| Resultado esperado | Se llama a prisma.prestador.update y se devuelve el perfil formateado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (servicio) |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/prestadoresService.test.js` › actualiza los datos y devuelve el perfil nuevo |
| Automatizado | Sí |
| qaseId | 476 |

### TC-PRE-027

**Precio mínimo mayor al máximo guardado**

| Campo | Valor |
| --- | --- |
| Descripción | Si solo llega el mínimo, se compara con el máximo ya guardado. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular precioMax guardado<br>2. Llamar a actualizarMiPerfil con un precioMin mayor |
| Resultado esperado | Lanza 400 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: perfil (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresService.test.js` › rechaza si el precio mínimo supera al máximo guardado |
| Automatizado | Sí |
| qaseId | 477 |

### TC-PRE-028

**Reemplazar oficios**

| Campo | Valor |
| --- | --- |
| Descripción | Se borran los oficios anteriores y se crean los nuevos en una transacción. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a asignarMisOficios con oficios activos |
| Resultado esperado | Se ejecuta la transacción deleteMany + createMany y se devuelve el perfil. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: oficios (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresOficios.test.js` › reemplaza los oficios y devuelve el perfil actualizado |
| Automatizado | Sí |
| qaseId | 478 |

### TC-PRE-029

**Oficio inexistente o desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | No se asignan oficios que no existen o están desactivados. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular que falta algún oficio activo<br>2. Llamar a asignarMisOficios |
| Resultado esperado | Lanza 400 y no ejecuta la transacción. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: oficios (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresOficios.test.js` › rechaza con 400 si algún oficio no existe o está desactivado |
| Automatizado | Sí |
| qaseId | 479 |

### TC-PRE-030

**Ids repetidos**

| Campo | Valor |
| --- | --- |
| Descripción | Un id repetido cuenta una sola vez. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a asignarMisOficios con un id repetido |
| Resultado esperado | Se valida y se crea una sola relación por oficio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: oficios (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresOficios.test.js` › ignora los ids repetidos |
| Automatizado | Sí |
| qaseId | 480 |

### TC-PRE-031

**Lista vacía**

| Campo | Valor |
| --- | --- |
| Descripción | Con una lista vacía el prestador queda sin oficios. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a asignarMisOficios con [] |
| Resultado esperado | Se borran los oficios anteriores y el perfil devuelto no tiene oficios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: oficios (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresOficios.test.js` › permite dejar al prestador sin oficios con una lista vacía |
| Automatizado | Sí |
| qaseId | 481 |

### TC-PRE-032

**Prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | asignarMisOficios lanza 404 si no hay perfil. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular que no existe<br>2. Llamar a asignarMisOficios |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: oficios (servicio) |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/prestadoresOficios.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 482 |

### TC-PRE-033

**Resumen público con reputación**

| Campo | Valor |
| --- | --- |
| Descripción | El listado devuelve el resumen público con reputación, sin contacto ni oficios desactivados. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular prestadores y reputación<br>2. Llamar a listarPrestadores |
| Resultado esperado | Sin teléfono/email, sin oficios inactivos y con { promedio, totalCalificaciones, serviciosFinalizados }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07, RF-19, RF-20 |
| Archivo y test | `tests/prestadoresListar.test.js` › devuelve el resumen público con la reputación, sin datos de contacto ni oficios desactivados |
| Automatizado | Sí |
| qaseId | 483 |

### TC-PRE-034

**Filtro por oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Se filtra por el oficio pedido. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores({ oficioId }) |
| Resultado esperado | La consulta filtra por ese oficio activo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por oficio |
| Automatizado | Sí |
| qaseId | 484 |

### TC-PRE-035

**Búsqueda por texto**

| Campo | Valor |
| --- | --- |
| Descripción | Se busca por nombre, zona u oficio sin distinguir mayúsculas. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores({ q }) |
| Resultado esperado | La consulta usa OR con contains insensitive. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresListar.test.js` › busca por nombre, zona u oficio sin distinguir mayúsculas |
| Automatizado | Sí |
| qaseId | 485 |

### TC-PRE-036

**Filtro por distancia**

| Campo | Valor |
| --- | --- |
| Descripción | Con lat/lng se filtra por radio y se ordena del más cerca al más lejos. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular prestadores a distintas distancias<br>2. Llamar a listarPrestadores con lat, lng y radioKm |
| Resultado esperado | Solo los que están dentro del radio, ordenados por distanciaKm. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por distancia y ordena del más cerca al más lejos |
| Automatizado | Sí |
| qaseId | 486 |

### TC-PRE-037

**Calificación mínima**

| Campo | Valor |
| --- | --- |
| Descripción | Se filtra por promedio mínimo y se excluye a quienes no tienen calificaciones. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores({ calificacionMin }) |
| Resultado esperado | Solo los que tienen promedio ≥ al mínimo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07, RF-19 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por calificación mínima y deja afuera a los que no tienen calificaciones |
| Automatizado | Sí |
| qaseId | 487 |

### TC-PRE-038

**Límite de resultados**

| Campo | Valor |
| --- | --- |
| Descripción | Se respeta limit y la reputación se calcula solo de los devueltos. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores({ limit }) |
| Resultado esperado | Devuelve como máximo limit y consulta la reputación solo de esos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresListar.test.js` › respeta el limit y calcula la reputación solo de los devueltos |
| Automatizado | Sí |
| qaseId | 488 |

### TC-PRE-039

**Promedio sin calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador sin calificaciones tiene promedio null. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular reputación sin calificaciones<br>2. Llamar a listarPrestadores |
| Resultado esperado | reputacion.promedio es null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-19 |
| Archivo y test | `tests/prestadoresListar.test.js` › devuelve promedio null si el prestador todavía no tiene calificaciones |
| Automatizado | Sí |
| qaseId | 489 |

### TC-PRE-040

**Sin filtro de disponibilidad**

| Campo | Valor |
| --- | --- |
| Descripción | Si no se pide, no se filtra por disponibilidad. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores sin disponible |
| Resultado esperado | La consulta no incluye disponible. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresDisponibleService.test.js` › no filtra por disponibilidad si no se pide |
| Automatizado | Sí |
| qaseId | 490 |

### TC-PRE-041

**Filtro de disponibilidad**

| Campo | Valor |
| --- | --- |
| Descripción | Con disponible true/false se filtra por ese valor. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores con disponible |
| Resultado esperado | La consulta incluye { disponible }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresDisponibleService.test.js` › filtra por disponible=%s cuando se pide |
| Automatizado | Sí |
| qaseId | 491 |

### TC-PRE-042

**Coordenadas aproximadas en el listado**

| Campo | Valor |
| --- | --- |
| Descripción | El listado devuelve la ubicación redondeada a 2 decimales. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular un prestador con coordenadas exactas<br>2. Llamar a listarPrestadores |
| Resultado esperado | Latitud y longitud con 2 decimales. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresCoordenadas.test.js` › el listado devuelve las coordenadas redondeadas a 2 decimales |
| Automatizado | Sí |
| qaseId | 492 |

### TC-PRE-043

**Coordenadas aproximadas en la ficha**

| Campo | Valor |
| --- | --- |
| Descripción | La ficha pública devuelve la ubicación redondeada a 2 decimales. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a obtenerDetallePrestador |
| Resultado esperado | Latitud y longitud con 2 decimales. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresCoordenadas.test.js` › la ficha devuelve las coordenadas redondeadas a 2 decimales |
| Automatizado | Sí |
| qaseId | 493 |

### TC-PRE-044

**Coordenada exacta en el perfil propio**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador sigue viendo su coordenada exacta. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a obtenerMiPerfil |
| Resultado esperado | Latitud y longitud sin redondear. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/prestadoresCoordenadas.test.js` › el perfil propio sigue devolviendo la coordenada exacta |
| Automatizado | Sí |
| qaseId | 494 |

### TC-PRE-045

**Prestador sin coordenadas**

| Campo | Valor |
| --- | --- |
| Descripción | Sin coordenadas se devuelven como null. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular un prestador sin ubicación<br>2. Llamar a listarPrestadores |
| Resultado esperado | latitud y longitud null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresCoordenadas.test.js` › un prestador sin coordenadas las sigue devolviendo como null |
| Automatizado | Sí |
| qaseId | 495 |

### TC-PRE-046

**Distancia con la coordenada aproximada**

| Campo | Valor |
| --- | --- |
| Descripción | La distancia se calcula con la ubicación pública y no con la exacta. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores con lat y lng |
| Resultado esperado | Dos prestadores a ~500 m que se redondean al mismo punto tienen la misma distanciaKm. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/prestadoresCoordenadas.test.js` › la distancia se calcula con la coordenada aproximada y no con la exacta |
| Automatizado | Sí |
| qaseId | 496 |

### TC-PRE-060

**Respuesta paginada**

| Campo | Valor |
| --- | --- |
| Descripción | El listado devuelve la página pedida con el total de registros y de páginas. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular 5 prestadores<br>2. Llamar a listarPrestadores({ page: 2, limit: 2 }) |
| Resultado esperado | registros con el 3.º y el 4.º prestador, totalRegistros 5, pagina 2, limite 2 y totalPaginas 3. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresListar.test.js` › devuelve la página pedida con el total de registros y de páginas |
| Automatizado | Sí |
| qaseId | 497 |

### TC-PRE-061

**Paginación por defecto y página vacía**

| Campo | Valor |
| --- | --- |
| Descripción | Sin page ni limit se devuelve la primera página de 50; una página fuera de rango devuelve registros vacíos. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores() con 3 prestadores<br>2. Llamar a listarPrestadores({ page: 9 }) |
| Resultado esperado | pagina 1, limite 50 y totalPaginas 1; con page 9, registros [] pero con los totales correctos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresListar.test.js` › por defecto devuelve la primera página de 50 y una página fuera de rango queda vacía |
| Automatizado | Sí |
| qaseId | 498 |

### TC-PRE-062

**Filtro de calificación antes de paginar**

| Campo | Valor |
| --- | --- |
| Descripción | El total y las páginas se calculan después de filtrar por calificación mínima. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular 4 prestadores, 3 con promedio ≥ 4<br>2. Llamar a listarPrestadores({ calificacionMin: 4, limit: 2, page: 2 }) |
| Resultado esperado | registros con 1 prestador, totalRegistros 3 y totalPaginas 2. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07, RF-19 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por calificación mínima antes de paginar |
| Automatizado | Sí |
| qaseId | 499 |

### TC-PRE-066

**Filtro por zona**

| Campo | Valor |
| --- | --- |
| Descripción | Se filtra por zona exacta sin distinguir mayúsculas, antes de paginar. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores({ zona }) |
| Resultado esperado | La consulta filtra zonaCobertura con igualdad insensible a mayúsculas. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por zona exacta sin distinguir mayúsculas |
| Automatizado | Sí |
| qaseId | 500 |

### TC-PRE-067

**Filtro por presupuesto**

| Campo | Valor |
| --- | --- |
| Descripción | Con presupuesto se devuelven los prestadores cuyo precio mínimo no lo supera; sin presupuesto no se filtra. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores con presupuesto 15000, con 0 y sin presupuesto |
| Resultado esperado | La consulta incluye precioMin <= presupuesto solo cuando se pide (también con 0). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/prestadoresListar.test.js` › filtra por presupuesto y no filtra si no se pide |
| Automatizado | Sí |
| qaseId | 501 |

### TC-PRE-063

**Orden estable**

| Campo | Valor |
| --- | --- |
| Descripción | Los prestadores se ordenan por nombre y, si hay nombres iguales, por id. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarPrestadores |
| Resultado esperado | La consulta ordena por usuario.nombre y luego por id. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: búsqueda (servicio) |
| Rol | Visitante |
| Requerimiento | RF-07 |
| Archivo y test | `tests/prestadoresListar.test.js` › ordena por nombre y desempata por id para que las páginas sean estables |
| Automatizado | Sí |
| qaseId | 502 |

### TC-PRE-047

**Ficha completa**

| Campo | Valor |
| --- | --- |
| Descripción | La ficha incluye contacto, reputación y comentarios. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular prestador, reputación y comentarios<br>2. Llamar a obtenerDetallePrestador |
| Resultado esperado | Devuelve teléfono, WhatsApp, email de contacto, reputación y comentarios. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08, RF-19, RF-20, RF-21 |
| Archivo y test | `tests/prestadoresDetalle.test.js` › devuelve la ficha con contacto, reputación y comentarios |
| Automatizado | Sí |
| qaseId | 503 |

### TC-PRE-048

**Sin datos internos**

| Campo | Valor |
| --- | --- |
| Descripción | La ficha no expone datos internos ni el email de la cuenta. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a obtenerDetallePrestador |
| Resultado esperado | No incluye email, usuarioId ni activo, y la reputación no repite prestadorId. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresDetalle.test.js` › no devuelve datos internos ni el email de la cuenta |
| Automatizado | Sí |
| qaseId | 504 |

### TC-PRE-049

**Solo prestadores activos**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se busca un prestador activo con usuario activo. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a obtenerDetallePrestador |
| Resultado esperado | La consulta filtra activo y usuario.activo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresDetalle.test.js` › busca solo prestadores activos y con usuario activo |
| Automatizado | Sí |
| qaseId | 505 |

### TC-PRE-050

**Ficha sin calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | Sin calificaciones: promedio null y sin comentarios. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular reputación vacía<br>2. Llamar a obtenerDetallePrestador |
| Resultado esperado | promedio null y comentarios []. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08, RF-19 |
| Archivo y test | `tests/prestadoresDetalle.test.js` › devuelve promedio null y sin comentarios si todavía no tiene calificaciones |
| Automatizado | Sí |
| qaseId | 506 |

### TC-PRE-051

**Ficha no disponible**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el prestador no existe, está inactivo o su usuario está desactivado. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular que la consulta no encuentra al prestador<br>2. Llamar a obtenerDetallePrestador |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresDetalle.test.js` › lanza 404 si el prestador no existe, está inactivo o su usuario está desactivado |
| Automatizado | Sí |
| qaseId | 507 |

### TC-PRE-052

**Controlador de la ficha**

| Campo | Valor |
| --- | --- |
| Descripción | El controlador delega en el servicio con el id de la URL. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar detalle con req.params.id |
| Resultado esperado | Se devuelve la ficha del servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresDetalleController.test.js` › delega en el servicio con el id de la dirección y devuelve la ficha |
| Automatizado | Sí |
| qaseId | 508 |

### TC-PRE-053

**Error en la ficha**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar obtenerDetallePrestador<br>2. Invocar detalle |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: ficha |
| Rol | Visitante |
| Requerimiento | RF-08 |
| Archivo y test | `tests/prestadoresDetalleController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 509 |

### TC-PRE-054

**Calificaciones del prestador del token**

| Campo | Valor |
| --- | --- |
| Descripción | Se busca al prestador por el usuario del token y se devuelven sus calificaciones. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Llamar a listarMisCalificaciones(usuarioId) |
| Resultado esperado | Se consulta por usuarioId y se devuelven las calificaciones públicas. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: calificaciones recibidas |
| Rol | Prestador |
| Requerimiento | RF-21 |
| Archivo y test | `tests/prestadoresMisCalificaciones.test.js` › busca al prestador por el usuario del token y devuelve sus calificaciones |
| Automatizado | Sí |
| qaseId | 510 |

### TC-PRE-055

**Sin calificaciones recibidas**

| Campo | Valor |
| --- | --- |
| Descripción | Si no recibió calificaciones se devuelve una lista vacía. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular listado vacío<br>2. Llamar a listarMisCalificaciones |
| Resultado esperado | Devuelve []. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: calificaciones recibidas |
| Rol | Prestador |
| Requerimiento | RF-21 |
| Archivo y test | `tests/prestadoresMisCalificaciones.test.js` › devuelve una lista vacía si todavía no recibió calificaciones |
| Automatizado | Sí |
| qaseId | 511 |

### TC-PRE-056

**Perfil inexistente o inactivo**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el perfil no existe o está inactivo. |
| Precondiciones | prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real. |
| Pasos | 1. Simular perfil null o inactivo<br>2. Llamar a listarMisCalificaciones |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: calificaciones recibidas |
| Rol | Prestador |
| Requerimiento | RF-21 |
| Archivo y test | `tests/prestadoresMisCalificaciones.test.js` › lanza 404 si el perfil de prestador es %j |
| Automatizado | Sí |
| qaseId | 512 |

### TC-PRE-057

**Controlador de calificaciones recibidas**

| Campo | Valor |
| --- | --- |
| Descripción | Devuelve las calificaciones del prestador autenticado. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Invocar misCalificaciones con req.usuario |
| Resultado esperado | El servicio recibe el id del token y se devuelve su resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: calificaciones recibidas |
| Rol | Prestador |
| Requerimiento | RF-21 |
| Archivo y test | `tests/prestadoresMisCalificacionesController.test.js` › devuelve las calificaciones del prestador autenticado |
| Automatizado | Sí |
| qaseId | 513 |

### TC-PRE-058

**Error en calificaciones recibidas**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de prestadores con prestadoresService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarMisCalificaciones<br>2. Invocar misCalificaciones |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Prestadores: calificaciones recibidas |
| Rol | Prestador |
| Requerimiento | RF-21 |
| Archivo y test | `tests/prestadoresMisCalificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 514 |

### TC-MAPA-001

**oficioId inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El filtro oficioId tiene que ser un texto no vacío. |
| Precondiciones | Controlador del mapa con mapaService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con oficioId vacío, espacios o una lista |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-06 |
| Archivo y test | `tests/mapaController.test.js` › responde 400 con el oficioId %j |
| Automatizado | Sí |
| qaseId | 515 |

### TC-MAPA-002

**Mapa sin filtro**

| Campo | Valor |
| --- | --- |
| Descripción | Sin filtro se piden todos los marcadores. |
| Precondiciones | Controlador del mapa con mapaService simulado; request y response simulados. |
| Pasos | 1. Invocar listar sin query |
| Resultado esperado | El servicio recibe { oficioId: undefined } y se devuelve su resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/mapaController.test.js` › sin filtro, pide todos los marcadores y devuelve el resultado |
| Automatizado | Sí |
| qaseId | 516 |

### TC-MAPA-003

**oficioId sin espacios**

| Campo | Valor |
| --- | --- |
| Descripción | El oficioId llega al servicio sin espacios. |
| Precondiciones | Controlador del mapa con mapaService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con oficioId " o1 " |
| Resultado esperado | El servicio recibe { oficioId: "o1" }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-06 |
| Archivo y test | `tests/mapaController.test.js` › pasa el oficioId sin espacios |
| Automatizado | Sí |
| qaseId | 517 |

### TC-MAPA-004

**Error en el mapa**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador del mapa con mapaService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarMarcadores<br>2. Invocar listar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/mapaController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 518 |

### TC-MAPA-005

**Marcadores del mapa**

| Campo | Valor |
| --- | --- |
| Descripción | Cada marcador tiene ubicación aproximada, oficio principal y promedio. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular prestadores y promedios<br>2. Llamar a listarMarcadores |
| Resultado esperado | Devuelve id, nombre, latitud/longitud con 2 decimales, oficioPrincipal y promedio redondeado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-19 |
| Archivo y test | `tests/mapaService.test.js` › devuelve los marcadores con ubicación aproximada, oficio principal y promedio |
| Automatizado | Sí |
| qaseId | 519 |

### TC-MAPA-006

**Solo prestadores visibles**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se muestran prestadores activos, disponibles, con usuario activo y coordenadas. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMarcadores |
| Resultado esperado | La consulta filtra activo, disponible, usuario.activo y coordenadas no nulas. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/mapaService.test.js` › busca solo prestadores activos, disponibles y con coordenadas |
| Automatizado | Sí |
| qaseId | 520 |

### TC-MAPA-007

**Filtro por oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Con oficioId solo se muestran los que ofrecen ese oficio. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMarcadores({ oficioId }) |
| Resultado esperado | La consulta filtra por ese oficio activo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-06 |
| Archivo y test | `tests/mapaService.test.js` › filtra por oficio cuando se pide |
| Automatizado | Sí |
| qaseId | 521 |

### TC-MAPA-008

**Promedio sin calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador sin calificaciones tiene promedio null. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular promedios vacíos<br>2. Llamar a listarMarcadores |
| Resultado esperado | promedio null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-19 |
| Archivo y test | `tests/mapaService.test.js` › devuelve promedio null si el prestador todavía no tiene calificaciones |
| Automatizado | Sí |
| qaseId | 522 |

### TC-MAPA-009

**Promedios solo de los encontrados**

| Campo | Valor |
| --- | --- |
| Descripción | Los promedios se piden en una sola consulta para los prestadores encontrados. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMarcadores |
| Resultado esperado | groupBy se llama con los ids de los prestadores devueltos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/mapaService.test.js` › pide los promedios solo de los prestadores encontrados |
| Automatizado | Sí |
| qaseId | 523 |

### TC-MAPA-011

**Promedio del mapa sin calificaciones moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | El promedio del marcador no cuenta las calificaciones que el administrador ocultó. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMarcadores |
| Resultado esperado | groupBy filtra moderada = false. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05, RF-19, RF-23 |
| Archivo y test | `tests/mapaService.test.js` › no cuenta las calificaciones moderadas en el promedio del marcador |
| Automatizado | Sí |
| qaseId | 524 |

### TC-MAPA-010

**Mapa vacío**

| Campo | Valor |
| --- | --- |
| Descripción | Sin prestadores no se consultan los promedios. |
| Precondiciones | mapaService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no hay prestadores<br>2. Llamar a listarMarcadores |
| Resultado esperado | Devuelve [] y no llama a groupBy. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Mapa |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/mapaService.test.js` › devuelve una lista vacía sin consultar los promedios si no hay prestadores |
| Automatizado | Sí |
| qaseId | 525 |

### TC-SOL-001

**prestadorId inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador es obligatorio y tiene que ser texto. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con prestadorId ausente, espacios o numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si el prestadorId es %p |
| Automatizado | Sí |
| qaseId | 526 |

### TC-SOL-002

**oficioId inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El oficio es obligatorio y tiene que ser texto. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con oficioId ausente, espacios o numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si el oficioId es %p |
| Automatizado | Sí |
| qaseId | 527 |

### TC-SOL-003

**Descripción inválida**

| Campo | Valor |
| --- | --- |
| Descripción | La descripción es obligatoria y tiene que ser texto. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con descripción ausente, espacios o numérica |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si la descripción es %p |
| Automatizado | Sí |
| qaseId | 528 |

### TC-SOL-004

**Descripción demasiado larga**

| Campo | Valor |
| --- | --- |
| Descripción | La descripción puede tener hasta 1000 caracteres. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con 1001 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si la descripción supera los 1000 caracteres |
| Automatizado | Sí |
| qaseId | 529 |

### TC-SOL-005

**Dirección que no es texto**

| Campo | Valor |
| --- | --- |
| Descripción | La dirección, si se manda, tiene que ser texto. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con dirección numérica |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si la dirección no es texto |
| Automatizado | Sí |
| qaseId | 530 |

### TC-SOL-006

**Contacto preferido que no es texto**

| Campo | Valor |
| --- | --- |
| Descripción | El contacto preferido, si se manda, tiene que ser texto. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con contactoPreferido numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si el contacto preferido no es texto |
| Automatizado | Sí |
| qaseId | 531 |

### TC-SOL-007

**Pedido sin body**

| Campo | Valor |
| --- | --- |
| Descripción | Un pedido sin cuerpo responde 400. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear sin body |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › responde 400 si el pedido no trae body |
| Automatizado | Sí |
| qaseId | 532 |

### TC-SOL-008

**Alta de solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | Se crea la solicitud con los datos limpios y el cliente del token. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con datos válidos con espacios |
| Resultado esperado | El servicio recibe el id del token y los datos limpios; se responde 201. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › crea la solicitud con los datos limpios y responde 201 |
| Automatizado | Sí |
| qaseId | 533 |

### TC-SOL-009

**Alta sin datos opcionales**

| Campo | Valor |
| --- | --- |
| Descripción | Dirección y contacto preferido son opcionales. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear sin dirección ni contacto |
| Resultado esperado | 201 con esos campos undefined. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › permite crear la solicitud sin dirección ni contacto preferido |
| Automatizado | Sí |
| qaseId | 534 |

### TC-SOL-010

**Error en el alta**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar crearSolicitud<br>2. Invocar crear |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 535 |

### TC-SOL-011

**Cambios de estado delegan en el servicio**

| Campo | Valor |
| --- | --- |
| Descripción | Aceptar, rechazar, finalizar y cancelar delegan en el servicio con el usuario del token y el id. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar cada acción con req.usuario y req.params.id |
| Resultado esperado | El servicio correspondiente recibe (usuarioId, solicitudId) y se devuelve su resultado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-11, RF-12, RF-13 |
| Archivo y test | `tests/solicitudesController.test.js` › delega en el servicio con el usuario y la solicitud |
| Automatizado | Sí |
| qaseId | 536 |

### TC-SOL-012

**Error en un cambio de estado**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio en cada acción se pasa al manejador de errores. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar el servicio de la acción<br>2. Invocar la acción |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-11, RF-12, RF-13 |
| Archivo y test | `tests/solicitudesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 537 |

### TC-SOL-013

**Estado inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El filtro estado solo acepta los estados exactos en mayúsculas. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con "pendiente", "CUALQUIERA", vacío o varios estados |
| Resultado esperado | 400 "El estado es inválido". |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListarController.test.js` › responde 400 con el estado inválido "%s" |
| Automatizado | Sí |
| qaseId | 538 |

### TC-SOL-014

**Listado sin filtro**

| Campo | Valor |
| --- | --- |
| Descripción | Sin filtro se delega con el usuario del token. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar listar sin query |
| Resultado esperado | El servicio recibe el usuario y { estado: undefined }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListarController.test.js` › sin filtro, delega en el servicio con el usuario del token |
| Automatizado | Sí |
| qaseId | 539 |

### TC-SOL-015

**Estados válidos**

| Campo | Valor |
| --- | --- |
| Descripción | Cada estado válido se pasa al servicio. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Invocar listar con cada estado |
| Resultado esperado | El servicio recibe { estado }. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListarController.test.js` › acepta el estado %s y se lo pasa al servicio |
| Automatizado | Sí |
| qaseId | 540 |

### TC-SOL-016

**Error en el listado**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de solicitudes con solicitudesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarMisSolicitudes<br>2. Invocar listar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (controlador) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListarController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 541 |

### TC-SOL-017

**Solicitud con el cliente logueado**

| Campo | Valor |
| --- | --- |
| Descripción | La solicitud se crea con el cliente que la pide. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular prestador disponible con el oficio<br>2. Llamar a crearSolicitud |
| Resultado esperado | prisma.solicitud.create recibe el clienteId y los datos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/solicitudesService.test.js` › crea la solicitud con el cliente logueado |
| Automatizado | Sí |
| qaseId | 542 |

### TC-SOL-018

**Prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede pedir a un prestador que no existe. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 543 |

### TC-SOL-019

**Prestador inactivo**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede pedir a un prestador inactivo. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular activo = false<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 404 si el prestador está inactivo |
| Automatizado | Sí |
| qaseId | 544 |

### TC-SOL-020

**Prestador no disponible**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede pedir a un prestador no disponible. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular disponible = false<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 409 si el prestador no está disponible |
| Automatizado | Sí |
| qaseId | 545 |

### TC-SOL-021

**Oficio inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | El oficio tiene que existir. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que el oficio no existe<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 400. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 400 si el oficio no existe |
| Automatizado | Sí |
| qaseId | 546 |

### TC-SOL-022

**Oficio desactivado**

| Campo | Valor |
| --- | --- |
| Descripción | El oficio tiene que estar activo. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular un oficio inactivo<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 400. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 400 si el oficio está desactivado |
| Automatizado | Sí |
| qaseId | 547 |

### TC-SOL-023

**Oficio no ofrecido**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador tiene que ofrecer el oficio pedido. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular un prestador sin ese oficio<br>2. Llamar a crearSolicitud |
| Resultado esperado | Lanza 400. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: alta (servicio) |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/solicitudesService.test.js` › lanza 400 si el prestador no ofrece ese oficio |
| Automatizado | Sí |
| qaseId | 548 |

### TC-SOL-024

**Listado del cliente**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente ve solo sus solicitudes, de la más nueva a la más vieja. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMisSolicitudes como CLIENTE |
| Resultado esperado | La consulta filtra por clienteId y ordena por fecha descendente. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Cliente |
| Requerimiento | RF-14 |
| Archivo y test | `tests/solicitudesListar.test.js` › el cliente ve solo las suyas, de la más nueva a la más vieja |
| Automatizado | Sí |
| qaseId | 549 |

### TC-SOL-025

**Listado del prestador**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador ve las que le llegaron, buscando su perfil por usuarioId. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMisSolicitudes como PRESTADOR |
| Resultado esperado | Se busca el perfil por usuarioId y se filtra por prestadorId. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Prestador |
| Requerimiento | RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › el prestador ve las que le llegaron, buscando su perfil por usuarioId |
| Automatizado | Sí |
| qaseId | 550 |

### TC-SOL-026

**Filtro por estado**

| Campo | Valor |
| --- | --- |
| Descripción | Se filtra por estado cuando se pide. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMisSolicitudes con { estado } |
| Resultado esperado | La consulta incluye el estado. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › filtra por estado cuando se pide |
| Automatizado | Sí |
| qaseId | 551 |

### TC-SOL-027

**Marca de calificada**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se marca como calificada la que tiene calificación. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular una solicitud con calificación y otra sin<br>2. Llamar a listarMisSolicitudes |
| Resultado esperado | calificada true solo en la que tiene calificación. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-18 |
| Archivo y test | `tests/solicitudesListar.test.js` › marca como calificada solo la que ya tiene calificación |
| Automatizado | Sí |
| qaseId | 552 |

### TC-SOL-028

**Sin datos sensibles**

| Campo | Valor |
| --- | --- |
| Descripción | El listado no devuelve datos sensibles de las personas. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMisSolicitudes |
| Resultado esperado | Cliente y prestador solo con id y nombre (sin email, DNI ni contraseña). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Cliente / Prestador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › no devuelve datos sensibles de las personas |
| Automatizado | Sí |
| qaseId | 553 |

### TC-SOL-029

**Prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el perfil de prestador no existe. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a listarMisSolicitudes como PRESTADOR |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Prestador |
| Requerimiento | RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 554 |

### TC-SOL-030

**Prestador inactivo**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el perfil de prestador está inactivo. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular activo = false<br>2. Llamar a listarMisSolicitudes como PRESTADOR |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Prestador |
| Requerimiento | RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › lanza 404 si el prestador está inactivo |
| Automatizado | Sí |
| qaseId | 555 |

### TC-SOL-031

**Rol sin solicitudes**

| Campo | Valor |
| --- | --- |
| Descripción | Un rol que no es cliente ni prestador recibe 403. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarMisSolicitudes como ADMINISTRADOR |
| Resultado esperado | Lanza 403. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: listado (servicio) |
| Rol | Administrador |
| Requerimiento | RF-14, RF-15 |
| Archivo y test | `tests/solicitudesListar.test.js` › lanza 403 si el rol no es cliente ni prestador |
| Automatizado | Sí |
| qaseId | 556 |

### TC-SOL-032

**Aceptar solicitud pendiente**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador dueño pasa la solicitud de PENDIENTE a ACEPTADA. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud PENDIENTE del prestador<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Se actualiza a ACEPTADA. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › pasa la solicitud pendiente a ACEPTADA |
| Automatizado | Sí |
| qaseId | 557 |

### TC-SOL-033

**Aceptar solicitud inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la solicitud no existe. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 404 si la solicitud no existe |
| Automatizado | Sí |
| qaseId | 558 |

### TC-SOL-034

**Aceptar solicitud ajena**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador no puede aceptar solicitudes de otro. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud de otro prestador<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Lanza 403 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 403 si la solicitud es de otro prestador |
| Automatizado | Sí |
| qaseId | 559 |

### TC-SOL-035

**Usuario sin perfil de prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Sin perfil de prestador no se puede aceptar. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no hay perfil<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Lanza 403. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 403 si el usuario no tiene perfil de prestador |
| Automatizado | Sí |
| qaseId | 560 |

### TC-SOL-036

**Aceptar solicitud no pendiente**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se puede responder una solicitud pendiente. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 409 si la solicitud no está pendiente |
| Automatizado | Sí |
| qaseId | 561 |

### TC-SOL-037

**Rechazar solicitud pendiente**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador dueño pasa la solicitud de PENDIENTE a RECHAZADA. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud PENDIENTE del prestador<br>2. Llamar a rechazarSolicitud |
| Resultado esperado | Se actualiza a RECHAZADA. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › pasa la solicitud pendiente a RECHAZADA |
| Automatizado | Sí |
| qaseId | 562 |

### TC-SOL-038

**Rechazar solicitud aceptada**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede rechazar una solicitud ya aceptada. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA<br>2. Llamar a rechazarSolicitud |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 409 si la solicitud ya fue aceptada |
| Automatizado | Sí |
| qaseId | 563 |

### TC-SOL-039

**Cancelar solicitud pendiente**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente dueño cancela una solicitud pendiente. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud PENDIENTE del cliente<br>2. Llamar a cancelarSolicitud |
| Resultado esperado | Se actualiza a CANCELADA. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/solicitudesEstados.test.js` › cancela una solicitud pendiente del cliente dueño |
| Automatizado | Sí |
| qaseId | 564 |

### TC-SOL-040

**Cancelar solicitud aceptada**

| Campo | Valor |
| --- | --- |
| Descripción | También se puede cancelar una solicitud aceptada. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA del cliente<br>2. Llamar a cancelarSolicitud |
| Resultado esperado | Se actualiza a CANCELADA. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/solicitudesEstados.test.js` › también permite cancelar una solicitud aceptada |
| Automatizado | Sí |
| qaseId | 565 |

### TC-SOL-041

**Cancelar solicitud inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la solicitud no existe. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a cancelarSolicitud |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 404 si la solicitud no existe |
| Automatizado | Sí |
| qaseId | 566 |

### TC-SOL-042

**Cancelar solicitud ajena**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente no puede cancelar solicitudes de otro. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud de otro cliente<br>2. Llamar a cancelarSolicitud |
| Resultado esperado | Lanza 403 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 403 si la solicitud es de otro cliente |
| Automatizado | Sí |
| qaseId | 567 |

### TC-SOL-043

**Cancelar solicitud finalizada**

| Campo | Valor |
| --- | --- |
| Descripción | Una solicitud finalizada ya no se puede cancelar. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud FINALIZADA<br>2. Llamar a cancelarSolicitud |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/solicitudesEstados.test.js` › lanza 409 si la solicitud ya está finalizada |
| Automatizado | Sí |
| qaseId | 568 |

### TC-SOL-044

**Finalizar solicitud aceptada**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador dueño pasa la solicitud de ACEPTADA a FINALIZADA. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA del prestador<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Se actualiza a FINALIZADA. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › pasa la solicitud aceptada a FINALIZADA |
| Automatizado | Sí |
| qaseId | 569 |

### TC-SOL-045

**Finalizar solicitud inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la solicitud no existe. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › lanza 404 si la solicitud no existe |
| Automatizado | Sí |
| qaseId | 570 |

### TC-SOL-046

**Finalizar solicitud ajena**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador no puede finalizar solicitudes de otro. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud de otro prestador<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Lanza 403. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › lanza 403 si la solicitud es de otro prestador |
| Automatizado | Sí |
| qaseId | 571 |

### TC-SOL-047

**Finalizar sin perfil de prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Sin perfil de prestador no se puede finalizar. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no hay perfil<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Lanza 403. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › lanza 403 si el usuario no tiene perfil de prestador |
| Automatizado | Sí |
| qaseId | 572 |

### TC-SOL-048

**Finalizar solicitud no aceptada**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se puede finalizar una solicitud ACEPTADA. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud PENDIENTE, RECHAZADA, CANCELADA o FINALIZADA<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: estados (servicio) |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › lanza 409 si la solicitud está %s y no aceptada |
| Automatizado | Sí |
| qaseId | 573 |

### TC-SOL-049

**Solicitud nueva sin fechas**

| Campo | Valor |
| --- | --- |
| Descripción | Una solicitud recién creada devuelve fechaAceptacion y fechaFinalizacion en null. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular la creación de una solicitud<br>2. Llamar a crearSolicitud |
| Resultado esperado | fechaAceptacion y fechaFinalizacion son null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: fechas de aceptación y finalización |
| Rol | Prestador |
| Requerimiento | RF-11, RF-13 |
| Archivo y test | `tests/solicitudesService.test.js` › una solicitud nueva devuelve las fechas de aceptación y finalización en null |
| Automatizado | Sí |
| qaseId | 574 |

### TC-SOL-050

**Fecha de aceptación**

| Campo | Valor |
| --- | --- |
| Descripción | Al aceptar se guarda y devuelve la fecha de aceptación; la de finalización sigue en null. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud PENDIENTE del prestador<br>2. Llamar a aceptarSolicitud |
| Resultado esperado | Se guarda fechaAceptacion (Date), no se toca fechaFinalizacion y la respuesta las incluye. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: fechas de aceptación y finalización |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesEstados.test.js` › al aceptar guarda y devuelve la fecha de aceptación, y la de finalización sigue en null |
| Automatizado | Sí |
| qaseId | 575 |

### TC-SOL-051

**Fecha de finalización**

| Campo | Valor |
| --- | --- |
| Descripción | Al finalizar se guarda y devuelve la fecha de finalización sin modificar la de aceptación. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA con fecha de aceptación<br>2. Llamar a finalizarSolicitud |
| Resultado esperado | Se guarda fechaFinalizacion (Date), no se toca fechaAceptacion y la respuesta incluye las dos. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: fechas de aceptación y finalización |
| Rol | Prestador |
| Requerimiento | RF-13 |
| Archivo y test | `tests/solicitudesFinalizar.test.js` › al finalizar guarda y devuelve la fecha de finalización sin tocar la de aceptación |
| Automatizado | Sí |
| qaseId | 576 |

### TC-SOL-052

**Fechas en el listado**

| Campo | Valor |
| --- | --- |
| Descripción | El listado de solicitudes incluye las dos fechas, en null mientras no ocurra el evento. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular una solicitud aceptada y una pendiente<br>2. Llamar a listarMisSolicitudes |
| Resultado esperado | Cada solicitud trae fechaAceptacion y fechaFinalizacion (null si corresponde). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: fechas de aceptación y finalización |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/solicitudesListar.test.js` › el listado incluye las fechas de aceptación y finalización |
| Automatizado | Sí |
| qaseId | 577 |

### TC-SOL-053

**Número en el listado**

| Campo | Valor |
| --- | --- |
| Descripción | El listado devuelve el número de la solicitud y el número del cliente, y los pide a la base. |
| Precondiciones | solicitudesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular una solicitud con numero y un cliente con numero<br>2. Llamar a listarMisSolicitudes |
| Resultado esperado | La respuesta incluye numero en la solicitud y en cliente, y la consulta selecciona el numero del cliente. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Solicitudes: número identificador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-09, RF-14 |
| Archivo y test | `tests/solicitudesListar.test.js` › devuelve el número de la solicitud y el del cliente, y los pide a la base |
| Automatizado | Sí |
| qaseId | 578 |

### TC-CAL-001

**Solicitud inválida**

| Campo | Valor |
| --- | --- |
| Descripción | La solicitud a calificar es obligatoria y tiene que ser texto. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con solicitudId ausente, espacios o numérico |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › responde 400 si la solicitud es %p |
| Automatizado | Sí |
| qaseId | 579 |

### TC-CAL-002

**Puntaje inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El puntaje tiene que ser un entero entre 1 y 5. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con 0, 6, 3.5, "4" o sin puntaje |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › responde 400 con el puntaje %p |
| Automatizado | Sí |
| qaseId | 580 |

### TC-CAL-003

**Comentario inválido al calificar**

| Campo | Valor |
| --- | --- |
| Descripción | El comentario, si se manda, tiene que ser texto de hasta 500 caracteres. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con un comentario numérico o de 501 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › responde 400 si el comentario %s |
| Automatizado | Sí |
| qaseId | 581 |

### TC-CAL-004

**Calificar con datos limpios**

| Campo | Valor |
| --- | --- |
| Descripción | Se crea la calificación con el cliente del token y el comentario sin espacios. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear con datos válidos |
| Resultado esperado | El servicio recibe clienteId, solicitudId, puntaje y comentario limpio; se responde 201. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › crea la calificación con los datos limpios y responde 201 |
| Automatizado | Sí |
| qaseId | 582 |

### TC-CAL-005

**Calificar sin comentario**

| Campo | Valor |
| --- | --- |
| Descripción | El comentario es opcional. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar crear sin comentario |
| Resultado esperado | 201 con comentario undefined. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › permite calificar sin comentario |
| Automatizado | Sí |
| qaseId | 583 |

### TC-CAL-006

**Error al calificar**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar crearCalificacion<br>2. Invocar crear |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 584 |

### TC-CAL-007

**Comentario inválido al editar**

| Campo | Valor |
| --- | --- |
| Descripción | Al editar, el comentario es obligatorio, no vacío y de hasta 500 caracteres. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar editarComentario sin comentario, con espacios o con 501 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › responde 400 si el comentario %s |
| Automatizado | Sí |
| qaseId | 585 |

### TC-CAL-008

**Editar comentario**

| Campo | Valor |
| --- | --- |
| Descripción | Se edita el comentario con el texto limpio. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar editarComentario con un comentario válido |
| Resultado esperado | El servicio recibe clienteId, calificacionId y el comentario limpio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › edita el comentario con los datos limpios |
| Automatizado | Sí |
| qaseId | 586 |

### TC-CAL-009

**Error al editar el comentario**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar editarComentario<br>2. Invocar editarComentario |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 587 |

### TC-CAL-010

**Reputación del prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Devuelve la reputación del prestador pedido. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar reputacion con req.params.prestadorId |
| Resultado esperado | Se devuelve el resultado del servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Visitante |
| Requerimiento | RF-19, RF-20 |
| Archivo y test | `tests/calificacionesController.test.js` › devuelve la reputación del prestador |
| Automatizado | Sí |
| qaseId | 588 |

### TC-CAL-011

**Error en la reputación**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar obtenerReputacion<br>2. Invocar reputacion |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Visitante |
| Requerimiento | RF-19, RF-20 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 589 |

### TC-CAL-012

**Calificaciones públicas del prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Devuelve las calificaciones públicas de un prestador. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar listarPorPrestador |
| Resultado esperado | Se devuelve el resultado del servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Visitante |
| Requerimiento | RF-08, RF-21 |
| Archivo y test | `tests/calificacionesController.test.js` › devuelve las calificaciones públicas del prestador |
| Automatizado | Sí |
| qaseId | 590 |

### TC-CAL-013

**Error en las calificaciones públicas**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarCalificacionesPrestador<br>2. Invocar listarPorPrestador |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Visitante |
| Requerimiento | RF-08, RF-21 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 591 |

### TC-CAL-014

**Todas las calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador obtiene todas las calificaciones. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar listarTodas |
| Resultado esperado | Se devuelve el resultado del servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesController.test.js` › devuelve todas las calificaciones |
| Automatizado | Sí |
| qaseId | 592 |

### TC-CAL-015

**Error en el listado completo**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar listarTodasLasCalificaciones<br>2. Invocar listarTodas |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 593 |

### TC-CAL-016

**Motivo de moderación inválido**

| Campo | Valor |
| --- | --- |
| Descripción | El motivo es obligatorio, no vacío y de hasta 200 caracteres. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar moderar sin motivo, con espacios o con 201 caracteres |
| Resultado esperado | 400 sin llamar al servicio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesController.test.js` › responde 400 si el motivo %s |
| Automatizado | Sí |
| qaseId | 594 |

### TC-CAL-017

**Moderar calificación**

| Campo | Valor |
| --- | --- |
| Descripción | Se modera la calificación con el motivo limpio. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Invocar moderar con un motivo válido |
| Resultado esperado | El servicio recibe el id y el motivo limpio. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesController.test.js` › modera la calificación con el motivo limpio |
| Automatizado | Sí |
| qaseId | 595 |

### TC-CAL-018

**Error al moderar**

| Campo | Valor |
| --- | --- |
| Descripción | Un error del servicio se pasa al manejador de errores. |
| Precondiciones | Controlador de calificaciones con calificacionesService simulado; request y response simulados. |
| Pasos | 1. Hacer fallar moderarCalificacion<br>2. Invocar moderar |
| Resultado esperado | Se llama a next(error). |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: controlador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesController.test.js` › pasa el error del servicio al manejador de errores |
| Automatizado | Sí |
| qaseId | 596 |

### TC-CAL-019

**Calificar solicitud inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la solicitud no existe. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a crearCalificacion |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 404 si la solicitud no existe |
| Automatizado | Sí |
| qaseId | 597 |

### TC-CAL-020

**Calificar solicitud ajena**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente solo califica sus propias solicitudes. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud de otro cliente<br>2. Llamar a crearCalificacion |
| Resultado esperado | Lanza 403 y no crea. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 403 si la solicitud es de otro cliente |
| Automatizado | Sí |
| qaseId | 598 |

### TC-CAL-021

**Calificar solicitud no finalizada**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se califica una solicitud FINALIZADA. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud ACEPTADA<br>2. Llamar a crearCalificacion |
| Resultado esperado | Lanza 409 y no crea. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-17 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 409 si la solicitud no está finalizada |
| Automatizado | Sí |
| qaseId | 599 |

### TC-CAL-022

**Solicitud ya calificada**

| Campo | Valor |
| --- | --- |
| Descripción | Una solicitud se califica una sola vez. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud con calificación<br>2. Llamar a crearCalificacion |
| Resultado esperado | Lanza 409 y no crea. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-18 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 409 si la solicitud ya fue calificada |
| Automatizado | Sí |
| qaseId | 600 |

### TC-CAL-023

**Crear calificación**

| Campo | Valor |
| --- | --- |
| Descripción | La calificación se guarda con el prestador de la solicitud. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular solicitud FINALIZADA sin calificación<br>2. Llamar a crearCalificacion |
| Resultado esperado | prisma.calificacion.create recibe el prestadorId de la solicitud. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › crea la calificación con el prestador de la solicitud |
| Automatizado | Sí |
| qaseId | 601 |

### TC-CAL-024

**Editar calificación inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la calificación no existe. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a editarComentario |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 404 si la calificación no existe |
| Automatizado | Sí |
| qaseId | 602 |

### TC-CAL-025

**Editar calificación ajena**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente solo edita sus propias calificaciones. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular calificación de otro cliente<br>2. Llamar a editarComentario |
| Resultado esperado | Lanza 403 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 403 si la calificación es de otro cliente |
| Automatizado | Sí |
| qaseId | 603 |

### TC-CAL-026

**Editar calificación moderada**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede editar una calificación moderada. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular calificación moderada<br>2. Llamar a editarComentario |
| Resultado esperado | Lanza 409 y no actualiza. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16, RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 409 si la calificación está moderada |
| Automatizado | Sí |
| qaseId | 604 |

### TC-CAL-027

**Editar comentario propio**

| Campo | Valor |
| --- | --- |
| Descripción | Se actualiza el comentario de la propia calificación. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular calificación propia no moderada<br>2. Llamar a editarComentario |
| Resultado esperado | Se llama a update con el comentario nuevo. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/calificacionesService.test.js` › actualiza el comentario de la propia calificación |
| Automatizado | Sí |
| qaseId | 605 |

### TC-CAL-028

**Reputación de prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el prestador no existe. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a obtenerReputacion |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-19, RF-20 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 606 |

### TC-CAL-029

**Promedio y servicios finalizados**

| Campo | Valor |
| --- | --- |
| Descripción | El promedio se redondea a un decimal y se cuentan los servicios finalizados. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular promedio, cantidad y solicitudes finalizadas<br>2. Llamar a obtenerReputacion |
| Resultado esperado | Devuelve promedio con un decimal, totalCalificaciones y serviciosFinalizados. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-19, RF-20 |
| Archivo y test | `tests/calificacionesService.test.js` › calcula el promedio redondeado a un decimal y los servicios finalizados |
| Automatizado | Sí |
| qaseId | 607 |

### TC-CAL-030

**Reputación sin calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | Sin calificaciones el promedio es null. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular promedio null<br>2. Llamar a obtenerReputacion |
| Resultado esperado | promedio null. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-19 |
| Archivo y test | `tests/calificacionesService.test.js` › devuelve promedio null si todavía no tiene calificaciones |
| Automatizado | Sí |
| qaseId | 608 |

### TC-CAL-037

**Reputación sin calificaciones moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | El promedio y el total de calificaciones no cuentan las que el administrador ocultó. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular un prestador existente<br>2. Llamar a obtenerReputacion |
| Resultado esperado | La consulta de agregados filtra moderada = false. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-19, RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › no cuenta las calificaciones moderadas en el promedio ni en el total |
| Automatizado | Sí |
| qaseId | 609 |

### TC-CAL-038

**Reputación con todas las calificaciones moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | Si todas las calificaciones del prestador están ocultas, el promedio es null y el total 0, pero se siguen contando los servicios finalizados. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular agregados vacíos y solicitudes finalizadas<br>2. Llamar a obtenerReputacion |
| Resultado esperado | Devuelve promedio null, totalCalificaciones 0 y los serviciosFinalizados. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-19, RF-20, RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › devuelve promedio null y total 0 si todas sus calificaciones están moderadas |
| Automatizado | Sí |
| qaseId | 610 |

### TC-CAL-031

**Calificaciones de prestador inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si el prestador no existe. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a listarCalificacionesPrestador |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-21 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 404 si el prestador no existe |
| Automatizado | Sí |
| qaseId | 611 |

### TC-CAL-032

**Calificaciones públicas sin moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | Solo se listan las no moderadas, las más nuevas primero. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarCalificacionesPrestador |
| Resultado esperado | La consulta filtra moderada = false y ordena por fecha descendente. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Visitante |
| Requerimiento | RF-21, RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › lista solo las calificaciones no moderadas, las más nuevas primero |
| Automatizado | Sí |
| qaseId | 612 |

### TC-CAL-033

**Todas las calificaciones con moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | El listado completo incluye las moderadas. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a listarTodasLasCalificaciones |
| Resultado esperado | La consulta no filtra por moderada. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › lista todas, incluidas las moderadas |
| Automatizado | Sí |
| qaseId | 613 |

### TC-CAL-034

**Moderar calificación inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Lanza 404 si la calificación no existe. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular que no existe<br>2. Llamar a moderarCalificacion |
| Resultado esperado | Lanza 404. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 404 si la calificación no existe |
| Automatizado | Sí |
| qaseId | 614 |

### TC-CAL-035

**Moderar dos veces**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede moderar una calificación ya moderada. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Simular calificación moderada<br>2. Llamar a moderarCalificacion |
| Resultado esperado | Lanza 409. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | media |
| Severidad | normal |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › lanza 409 si ya fue moderada |
| Automatizado | Sí |
| qaseId | 615 |

### TC-CAL-036

**Registro de la moderación**

| Campo | Valor |
| --- | --- |
| Descripción | Se marca como moderada con fecha y motivo, sin borrar el comentario. |
| Precondiciones | calificacionesService con Prisma simulado (sin base de datos real). |
| Pasos | 1. Llamar a moderarCalificacion con un motivo |
| Resultado esperado | update recibe moderada true, fechaModeracion y motivoModeracion. |
| Postcondiciones | Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | funcional |
| Capa | Unitario |
| Módulo | Calificaciones: servicio |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/calificacionesService.test.js` › marca la calificación como moderada con fecha y motivo |
| Automatizado | Sí |
| qaseId | 616 |

### TC-INT-AUTH-001

**Registro de cliente con DNI guardado en la base**

| Campo | Valor |
| --- | --- |
| Descripción | El registro por la API persiste al usuario con el DNI normalizado y la contraseña hasheada. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. |
| Pasos | 1. POST /api/auth/register con rol CLIENTE y el DNI escrito con puntos<br>2. Consultar el usuario creado con Prisma |
| Resultado esperado | 201 sin DNI ni hash en la respuesta; en la base el DNI queda solo con números y el hash valida la contraseña. |
| Postcondiciones | Queda un usuario CLIENTE activo en la base. Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/integration/auth.integration.test.js` › registra un cliente con DNI y lo guarda con la contraseña hasheada |
| Automatizado | Sí |
| qaseId | 617 |

### TC-INT-AUTH-002

**Registro de prestador con perfil creado**

| Campo | Valor |
| --- | --- |
| Descripción | Registrar un PRESTADOR crea también su perfil de prestador vacío, activo y disponible. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. |
| Pasos | 1. Registrar un PRESTADOR por la API<br>2. Buscar su perfil en la tabla Prestador |
| Resultado esperado | Existe el perfil vinculado al usuario, activo, disponible y sin descripción. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-01, RF-03 |
| Archivo y test | `tests/integration/auth.integration.test.js` › registra un prestador y crea su perfil de prestador en la base |
| Automatizado | Sí |
| qaseId | 618 |

### TC-INT-AUTH-003

**Inicio de sesión con token válido**

| Campo | Valor |
| --- | --- |
| Descripción | El login devuelve un JWT con el id y el rol del usuario, sin importar mayúsculas en el email. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado. |
| Pasos | 1. POST /api/auth/login con el email en mayúsculas<br>2. Decodificar el token |
| Resultado esperado | 200 con usuario sin DNI; el token tiene sub = id del usuario y rol CLIENTE. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › inicia sesión y devuelve un token con el id y el rol del usuario |
| Automatizado | Sí |
| qaseId | 619 |

### TC-INT-AUTH-004

**Credenciales incorrectas con mensaje único**

| Campo | Valor |
| --- | --- |
| Descripción | Una contraseña incorrecta y un email inexistente responden igual para no revelar qué emails existen. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado. |
| Pasos | 1. Login con contraseña incorrecta<br>2. Login con un email que no existe |
| Resultado esperado | Ambos responden 401 con el mismo mensaje. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › rechaza credenciales incorrectas con 401 y el mismo mensaje |
| Automatizado | Sí |
| qaseId | 620 |

### TC-INT-AUTH-005

**Perfil propio con DNI**

| Campo | Valor |
| --- | --- |
| Descripción | GET /api/auth/me devuelve el perfil del dueño del token, incluido el DNI. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado y con sesión iniciada. |
| Pasos | 1. GET /api/auth/me con el token del cliente |
| Resultado esperado | 200 con id, email y DNI; sin el hash de la contraseña. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Cliente |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › GET /me devuelve el perfil con el DNI solo a su dueño |
| Automatizado | Sí |
| qaseId | 621 |

### TC-INT-AUTH-006

**Email duplicado**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede registrar dos cuentas con el mismo email. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado. |
| Pasos | 1. Registrar otra cuenta con el mismo email y otro DNI<br>2. Contar usuarios con ese email y ese DNI |
| Resultado esperado | 409; sigue habiendo un solo usuario con ese email y ninguno con el DNI nuevo. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/integration/auth.integration.test.js` › responde 409 si el email ya está registrado y no crea otra cuenta |
| Automatizado | Sí |
| qaseId | 622 |

### TC-INT-AUTH-007

**DNI duplicado con otro formato**

| Campo | Valor |
| --- | --- |
| Descripción | El DNI es único aunque se escriba con espacios o puntos. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado. |
| Pasos | 1. Registrar otra cuenta con el mismo DNI escrito con espacios<br>2. Contar usuarios con ese DNI |
| Resultado esperado | 409; sigue habiendo un solo usuario con ese DNI. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/integration/auth.integration.test.js` › responde 409 si el DNI ya está registrado, aunque venga con otro formato |
| Automatizado | Sí |
| qaseId | 623 |

### TC-INT-AUTH-008

**Registro con datos inválidos no guarda nada**

| Campo | Valor |
| --- | --- |
| Descripción | DNI corto, email inválido, contraseña corta o rol ADMINISTRADOR se rechazan sin crear el usuario. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. |
| Pasos | 1. POST /api/auth/register con el dato inválido<br>2. Buscar el email en la base |
| Resultado esperado | 400 y no existe ningún usuario con ese email. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-01 |
| Archivo y test | `tests/integration/auth.integration.test.js` › responde 400 con %s y no guarda nada |
| Automatizado | Sí |
| qaseId | 624 |

### TC-INT-AUTH-009

**Cuenta desactivada no puede iniciar sesión**

| Campo | Valor |
| --- | --- |
| Descripción | Un usuario con activo = false recibe 403 al iniciar sesión. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado y desactivado en la base. |
| Pasos | 1. Desactivar el usuario con Prisma<br>2. POST /api/auth/login con sus credenciales |
| Resultado esperado | 403 y sin token. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Visitante |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › rechaza el inicio de sesión de una cuenta desactivada con 403 |
| Automatizado | Sí |
| qaseId | 625 |

### TC-INT-AUTH-013

**Número identificador del usuario**

| Campo | Valor |
| --- | --- |
| Descripción | Cada usuario recibe un número autogenerado y único, distinto del id, que se ve en GET /api/auth/me. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Dos clientes registrados. |
| Pasos | 1. Registrar dos clientes<br>2. GET /api/auth/me del primero |
| Resultado esperado | Los dos números son enteros y distintos, y el perfil devuelve el id y el número. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › cada usuario recibe un número único y distinto del id, y GET /me lo devuelve |
| Automatizado | Sí |
| qaseId | 626 |

### TC-INT-AUTH-010

**Editar el nombre sin poder cambiar DNI, email ni rol**

| Campo | Valor |
| --- | --- |
| Descripción | PATCH /api/auth/me cambia el nombre del usuario autenticado y descarta dni, email y rol si se envían. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Prestador registrado con sesión iniciada. |
| Pasos | 1. PATCH /api/auth/me con nombre nuevo, dni, email y rol<br>2. Buscar el usuario en la base |
| Resultado esperado | 200, el nombre cambia y el DNI, el email y el rol quedan como estaban. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Cliente / Prestador |
| Requerimiento | RF-01, RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › PATCH /me cambia el nombre y no deja editar el DNI, el email ni el rol |
| Automatizado | Sí |
| qaseId | 627 |

### TC-INT-AUTH-011

**Cambiar la contraseña**

| Campo | Valor |
| --- | --- |
| Descripción | PATCH /api/auth/me/password guarda la contraseña nueva hasheada; con la anterior ya no se puede iniciar sesión. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado con sesión iniciada. |
| Pasos | 1. PATCH /api/auth/me/password con la actual y una nueva<br>2. Revisar el hash guardado<br>3. Iniciar sesión con la nueva y con la anterior |
| Resultado esperado | 200 sin datos de la clave; login 200 con la nueva y 401 con la anterior. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Cliente / Prestador |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › PATCH /me/password cambia la contraseña y la anterior deja de servir |
| Automatizado | Sí |
| qaseId | 628 |

### TC-INT-AUTH-012

**Cambio de contraseña rechazado**

| Campo | Valor |
| --- | --- |
| Descripción | Con la contraseña actual incorrecta o sin sesión no se cambia la contraseña. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Cliente registrado con sesión iniciada. |
| Pasos | 1. PATCH /api/auth/me/password con la actual incorrecta<br>2. PATCH /api/auth/me/password sin token<br>3. Comprobar el hash guardado |
| Resultado esperado | 400 con la actual incorrecta, 401 sin sesión, y la contraseña original sigue funcionando. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Autenticación |
| Rol | Cliente / Prestador |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/auth.integration.test.js` › rechaza el cambio de contraseña con la actual incorrecta o sin sesión |
| Automatizado | Sí |
| qaseId | 629 |

### TC-INT-CLI-001

**Búsqueda de prestadores por texto y oficio**

| Campo | Valor |
| --- | --- |
| Descripción | La búsqueda pública encuentra al prestador por texto (nombre/zona) y por oficio, sin datos de contacto. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. GET /api/prestadores?q=<prefijo><br>2. GET /api/prestadores?oficioId=<oficio> |
| Resultado esperado | El prestador aparece en ambas búsquedas con su oficio y reputación vacía, sin teléfono. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Visitante |
| Requerimiento | RF-06, RF-07 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › busca prestadores por texto y por oficio |
| Automatizado | Sí |
| qaseId | 630 |

### TC-INT-CLI-002

**Filtro por distancia**

| Campo | Valor |
| --- | --- |
| Descripción | Con lat/lng/radioKm solo aparecen los prestadores dentro del radio. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Buscar cerca de la ubicación del prestador con radio 5 km<br>2. Buscar desde Córdoba con radio 10 km |
| Resultado esperado | Cerca: aparece con distanciaKm ≤ 5. Lejos: lista vacía. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Visitante |
| Requerimiento | RF-06 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › filtra prestadores por distancia a una ubicación |
| Automatizado | Sí |
| qaseId | 631 |

### TC-INT-CLI-003

**Mapa con ubicación aproximada**

| Campo | Valor |
| --- | --- |
| Descripción | El mapa muestra al prestador disponible con coordenadas redondeadas a 2 decimales. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. GET /api/prestadores/mapa?oficioId=<oficio> |
| Resultado esperado | Un marcador con latitud -34.6, longitud -58.38, oficio principal y promedio null. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Visitante |
| Requerimiento | RF-05 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › el mapa muestra al prestador disponible con ubicación aproximada |
| Automatizado | Sí |
| qaseId | 632 |

### TC-INT-CLI-004

**Ficha detallada del prestador**

| Campo | Valor |
| --- | --- |
| Descripción | La ficha pública incluye datos de contacto, reputación y comentarios, sin el email de la cuenta. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. GET /api/prestadores/:id |
| Resultado esperado | 200 con teléfono, email de contacto y comentarios; sin el campo email. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Visitante |
| Requerimiento | RF-08, RF-19, RF-20 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › la ficha del prestador muestra contacto, reputación y comentarios |
| Automatizado | Sí |
| qaseId | 633 |

### TC-INT-CLI-005

**Crear solicitud de servicio**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente crea una solicitud y queda guardada como PENDIENTE con los datos limpios. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. POST /api/solicitudes con prestador, oficio, descripción y dirección<br>2. Consultar la solicitud con Prisma |
| Resultado esperado | 201; en la base queda PENDIENTE, con el cliente del token y la descripción sin espacios sobrantes. |
| Postcondiciones | Queda una solicitud PENDIENTE. Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-09, RF-10 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › crea una solicitud y queda guardada como PENDIENTE |
| Automatizado | Sí |
| qaseId | 634 |

### TC-INT-CLI-006

**Listado de solicitudes propias**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente solo ve sus propias solicitudes. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear una solicitud del cliente y otra de otro cliente<br>2. GET /api/solicitudes con el token del cliente |
| Resultado esperado | Aparece la propia y no la ajena. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-14 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › lista solo sus propias solicitudes |
| Automatizado | Sí |
| qaseId | 635 |

### TC-INT-CLI-007

**Cancelar solicitud pendiente**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente dueño cancela su solicitud pendiente. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear una solicitud<br>2. PATCH /api/solicitudes/:id/cancelar<br>3. Consultar el estado en la base |
| Resultado esperado | 200 y la solicitud queda CANCELADA en la base. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › cancela su solicitud pendiente y queda CANCELADA en la base |
| Automatizado | Sí |
| qaseId | 636 |

### TC-INT-CLI-008

**No cancelar solicitudes ajenas**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente no puede cancelar la solicitud de otro cliente. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear una solicitud de otro cliente<br>2. Intentar cancelarla con el token del cliente |
| Resultado esperado | 403 y la solicitud sigue PENDIENTE. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-12 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › no puede cancelar la solicitud de otro cliente |
| Automatizado | Sí |
| qaseId | 637 |

### TC-INT-CLI-009

**Calificar solicitud finalizada**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente califica una solicitud finalizada y la reputación del prestador se actualiza. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear una solicitud y llevarla a FINALIZADA<br>2. POST /api/calificaciones con puntaje y comentario<br>3. Consultar la calificación y la reputación |
| Resultado esperado | 201; la calificación queda guardada con el comentario limpio y la reputación suma la calificación y el servicio. |
| Postcondiciones | Queda una calificación no moderada. Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-16, RF-17, RF-19, RF-20 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › califica una solicitud finalizada y se actualiza la reputación |
| Automatizado | Sí |
| qaseId | 638 |

### TC-INT-CLI-010

**Una sola calificación por solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | Una solicitud no se puede calificar dos veces. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Calificar una solicitud finalizada<br>2. Volver a calificarla |
| Resultado esperado | La segunda responde 409 y en la base hay una sola calificación. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-18 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › permite una sola calificación por solicitud |
| Automatizado | Sí |
| qaseId | 639 |

### TC-INT-CLI-011

**No calificar solicitudes no finalizadas**

| Campo | Valor |
| --- | --- |
| Descripción | Una solicitud ACEPTADA no se puede calificar. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear una solicitud y aceptarla<br>2. Intentar calificarla |
| Resultado esperado | 409 y no se guarda ninguna calificación. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-17 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › no puede calificar una solicitud que no está finalizada |
| Automatizado | Sí |
| qaseId | 640 |

### TC-INT-CLI-012

**Editar comentario de una calificación propia**

| Campo | Valor |
| --- | --- |
| Descripción | El cliente puede cambiar el comentario de su calificación. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Calificar una solicitud finalizada<br>2. PATCH /api/calificaciones/:id/comentario |
| Resultado esperado | 200 y el comentario nuevo queda guardado. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-16 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › edita el comentario de su calificación |
| Automatizado | Sí |
| qaseId | 641 |

### TC-INT-CLI-014

**Número identificador de la solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | Cada solicitud recibe un número autogenerado y único, distinto del id, que aparece en el listado junto al número del cliente. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear dos solicitudes<br>2. GET /api/solicitudes del cliente |
| Resultado esperado | Los números son enteros crecientes, el listado los devuelve y el id (UUID) sigue siendo el mismo. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-09, RF-14 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › cada solicitud recibe un número único y distinto del id, visible en el listado |
| Automatizado | Sí |
| qaseId | 642 |

### TC-INT-CLI-013

**No pedir servicio a un prestador no disponible**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede crear una solicitud para un prestador con disponible = false. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, prestador completo (ubicación, precios, contacto) y dos clientes con sesión iniciada. |
| Pasos | 1. Crear un prestador no disponible<br>2. POST /api/solicitudes hacia ese prestador |
| Resultado esperado | 409 y no se guarda ninguna solicitud. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del cliente |
| Rol | Cliente |
| Requerimiento | RF-09 |
| Archivo y test | `tests/integration/cliente.integration.test.js` › no puede pedir un servicio a un prestador no disponible |
| Automatizado | Sí |
| qaseId | 643 |

### TC-INT-PRE-001

**Consultar perfil propio**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador recién registrado ve su perfil vacío. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Registrar un prestador<br>2. GET /api/prestadores/me |
| Resultado esperado | 200 con su email, sin descripción, disponible y sin oficios. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-03 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › consulta su perfil recién registrado |
| Automatizado | Sí |
| qaseId | 644 |

### TC-INT-PRE-002

**Editar perfil**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador edita su perfil y los cambios quedan guardados; los campos no editables se ignoran. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. PUT /api/prestadores/me con descripción, zona, precios, teléfono, ubicación, disponible y activo<br>2. Consultar el prestador con Prisma |
| Resultado esperado | 200; se guardan los datos limpios y "activo" no cambia. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-03, RF-04 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › edita su perfil y los cambios quedan guardados |
| Automatizado | Sí |
| qaseId | 645 |

### TC-INT-PRE-003

**Perfil con datos inválidos**

| Campo | Valor |
| --- | --- |
| Descripción | Precio mínimo mayor al máximo, teléfono inválido o descripción vacía se rechazan. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Leer el prestador de la base<br>2. PUT /api/prestadores/me con el dato inválido<br>3. Volver a leerlo |
| Resultado esperado | 400 y el prestador queda igual que antes. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › rechaza %s con 400 sin modificar la base |
| Automatizado | Sí |
| qaseId | 646 |

### TC-INT-PRE-004

**Reemplazar oficios**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador reemplaza sus oficios; los ids repetidos cuentan una vez. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. PUT /api/prestadores/me/oficios con dos oficios (uno repetido)<br>2. Consultar PrestadorOficio |
| Resultado esperado | 200 y en la base quedan exactamente los dos oficios. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › reemplaza sus oficios y quedan guardados |
| Automatizado | Sí |
| qaseId | 647 |

### TC-INT-PRE-005

**Oficios desactivados o inexistentes**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede asignar un oficio desactivado o que no existe. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Asignar un oficio desactivado<br>2. Asignar un id que no existe<br>3. Consultar PrestadorOficio |
| Resultado esperado | Ambos 400 y el prestador conserva su oficio original. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-04 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › rechaza asignar un oficio desactivado o inexistente |
| Automatizado | Sí |
| qaseId | 648 |

### TC-INT-PRE-006

**Aceptar solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador dueño acepta una solicitud pendiente. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear una solicitud hacia el prestador<br>2. PATCH /api/solicitudes/:id/aceptar |
| Resultado esperado | 200 y la solicitud queda ACEPTADA en la base. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › acepta una solicitud pendiente |
| Automatizado | Sí |
| qaseId | 649 |

### TC-INT-PRE-007

**Rechazar solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador dueño rechaza una solicitud pendiente. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear una solicitud hacia el prestador<br>2. PATCH /api/solicitudes/:id/rechazar |
| Resultado esperado | 200 y la solicitud queda RECHAZADA en la base. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › rechaza una solicitud pendiente |
| Automatizado | Sí |
| qaseId | 650 |

### TC-INT-PRE-008

**Finalizar solicitud**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador finaliza una solicitud aceptada y suma un servicio finalizado. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear una solicitud y aceptarla<br>2. Leer la reputación<br>3. PATCH /api/solicitudes/:id/finalizar<br>4. Volver a leer la reputación |
| Resultado esperado | 200, la solicitud queda FINALIZADA y serviciosFinalizados aumenta en 1. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-13, RF-20 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › finaliza una solicitud aceptada y suma un servicio finalizado |
| Automatizado | Sí |
| qaseId | 651 |

### TC-INT-PRE-009

**Transición de estado inválida**

| Campo | Valor |
| --- | --- |
| Descripción | No se puede finalizar una pendiente ni responder una ya aceptada. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Llevar la solicitud al estado inicial del caso<br>2. Intentar la acción no permitida |
| Resultado esperado | 409 y el estado guardado no cambia. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-11, RF-13 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › responde 409 al intentar %s una solicitud %s |
| Automatizado | Sí |
| qaseId | 652 |

### TC-INT-PRE-010

**No operar sobre solicitudes de otro prestador**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador no puede aceptar, rechazar ni finalizar solicitudes de otro. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear una solicitud hacia otro prestador<br>2. Intentar la acción con el token del prestador |
| Resultado esperado | 403 y la solicitud sigue PENDIENTE. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-11, RF-13 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › no puede %s una solicitud de otro prestador |
| Automatizado | Sí |
| qaseId | 653 |

### TC-INT-PRE-011

**Listado de solicitudes recibidas**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador ve solo las solicitudes que recibió y puede filtrar por estado. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear una solicitud aceptada propia y otra de otro prestador<br>2. GET /api/solicitudes?estado=ACEPTADA |
| Resultado esperado | Aparece la propia, no la ajena, y todas están ACEPTADA. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-15 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › lista solo las solicitudes que recibió, con filtro por estado |
| Automatizado | Sí |
| qaseId | 654 |

### TC-INT-PRE-012

**Calificaciones recibidas sin las moderadas**

| Campo | Valor |
| --- | --- |
| Descripción | El prestador ve sus calificaciones y comentarios, sin los moderados. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. Crear dos calificaciones y moderar una<br>2. GET /api/prestadores/me/calificaciones |
| Resultado esperado | Aparece la calificación visible y no la moderada. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-21, RF-23 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › ve las calificaciones recibidas sin las moderadas |
| Automatizado | Sí |
| qaseId | 655 |

### TC-INT-PRE-013

**Solicitud inexistente**

| Campo | Valor |
| --- | --- |
| Descripción | Operar sobre una solicitud que no existe responde 404. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Oficio activo, dos prestadores completos y un cliente, todos con sesión iniciada. |
| Pasos | 1. PATCH /api/solicitudes/<uuid al azar>/aceptar |
| Resultado esperado | 404. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | baja |
| Severidad | menor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del prestador |
| Rol | Prestador |
| Requerimiento | RF-11 |
| Archivo y test | `tests/integration/prestador.integration.test.js` › responde 404 al operar sobre una solicitud que no existe |
| Automatizado | Sí |
| qaseId | 656 |

### TC-INT-ADM-001

**Crear oficio**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador crea un oficio y queda guardado activo con el nombre limpio. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. POST /api/oficios con nombre y categoría<br>2. Consultar el oficio con Prisma |
| Resultado esperado | 201 y el oficio queda activo con el nombre sin espacios sobrantes. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › crea un oficio y queda guardado activo |
| Automatizado | Sí |
| qaseId | 657 |

### TC-INT-ADM-002

**Oficio con nombre duplicado**

| Campo | Valor |
| --- | --- |
| Descripción | No se pueden crear dos oficios con el mismo nombre. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. POST /api/oficios con el nombre de un oficio existente |
| Resultado esperado | 409 y sigue habiendo un solo oficio con ese nombre. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › responde 409 si ya existe un oficio con ese nombre |
| Automatizado | Sí |
| qaseId | 658 |

### TC-INT-ADM-009

**Oficio con nombre duplicado en minúsculas**

| Campo | Valor |
| --- | --- |
| Descripción | No se pueden crear dos oficios que solo se diferencian en mayúsculas o minúsculas. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. POST /api/oficios con el nombre de un oficio existente escrito en minúsculas<br>2. Contar los oficios con ese nombre |
| Resultado esperado | 409 y sigue habiendo un solo oficio con ese nombre, sin importar las mayúsculas. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › responde 409 si el nombre solo cambia en mayúsculas o minúsculas |
| Automatizado | Sí |
| qaseId | 659 |

### TC-INT-ADM-003

**Editar oficio**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador cambia el nombre y la categoría de un oficio. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. PUT /api/oficios/:id con nombre y categoría nuevos<br>2. Consultar el oficio |
| Resultado esperado | 200 y los datos nuevos quedan guardados. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › edita el nombre y la categoría de un oficio |
| Automatizado | Sí |
| qaseId | 660 |

### TC-INT-ADM-004

**Desactivar y activar oficio**

| Campo | Valor |
| --- | --- |
| Descripción | Desactivar un oficio no lo borra: sale del listado público y sigue en el del administrador. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. PATCH /api/oficios/:id/estado con activo false<br>2. Comparar GET /api/oficios y GET /api/oficios/todos<br>3. Volver a activarlo |
| Resultado esperado | El oficio queda inactivo en la base, solo aparece en /todos y después vuelve a activo. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › desactiva un oficio sin borrarlo y lo vuelve a activar |
| Automatizado | Sí |
| qaseId | 661 |

### TC-INT-ADM-005

**Oficio desactivado saca al prestador de la búsqueda**

| Campo | Valor |
| --- | --- |
| Descripción | Un prestador cuyo único oficio se desactiva no aparece en la búsqueda ni en el mapa. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Crear un prestador con un solo oficio<br>2. Desactivar ese oficio<br>3. Buscar en /api/prestadores y /api/prestadores/mapa |
| Resultado esperado | El prestador no aparece en ninguno de los dos. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-22, RF-05, RF-07 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › al desactivar el único oficio de un prestador, deja de aparecer en la búsqueda |
| Automatizado | Sí |
| qaseId | 662 |

### TC-INT-ADM-006

**Listar todas las calificaciones**

| Campo | Valor |
| --- | --- |
| Descripción | El administrador ve todas las calificaciones, incluidas las moderadas. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Crear una calificación normal y otra moderada<br>2. GET /api/calificaciones |
| Resultado esperado | Aparecen las dos. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | mayor |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › lista todas las calificaciones, incluidas las moderadas |
| Automatizado | Sí |
| qaseId | 663 |

### TC-INT-ADM-007

**Moderar comentario**

| Campo | Valor |
| --- | --- |
| Descripción | Moderar conserva el comentario, registra motivo y fecha, y lo saca del listado público. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Crear una calificación<br>2. PATCH /api/calificaciones/:id/moderacion con un motivo<br>3. Consultar la base y el listado público<br>4. Moderarla otra vez |
| Resultado esperado | 200; queda moderada con motivo y fecha, el comentario se conserva, no aparece en el listado público y la segunda moderación da 409. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Administrador |
| Requerimiento | RF-23 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › modera un comentario: queda registrado y sale del listado público |
| Automatizado | Sí |
| qaseId | 664 |

### TC-INT-ADM-008

**Rutas de administrador prohibidas para otros roles**

| Campo | Valor |
| --- | --- |
| Descripción | Cliente y prestador reciben 403 en la gestión de oficios y la moderación, sin cambios en la base. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Administrador creado con Prisma (la API no permite registrarlo), un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Pedir cada ruta de administrador con token de CLIENTE y de PRESTADOR<br>2. Revisar oficios y calificaciones en la base |
| Resultado esperado | 403 y nada cambia. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Flujo del administrador |
| Rol | Cliente / Prestador |
| Requerimiento | RF-22, RF-23 |
| Archivo y test | `tests/integration/administrador.integration.test.js` › un %s recibe 403 en %s %s y no cambia nada |
| Automatizado | Sí |
| qaseId | 665 |

### TC-INT-SEG-001

**Rutas protegidas sin token**

| Campo | Valor |
| --- | --- |
| Descripción | Toda ruta que requiere sesión responde 401 si no se manda token. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Pedir cada ruta protegida sin el header Authorization |
| Resultado esperado | 401. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › %s %s responde 401 sin token |
| Automatizado | Sí |
| qaseId | 666 |

### TC-INT-SEG-002

**Token inválido, vencido o firmado con otra clave**

| Campo | Valor |
| --- | --- |
| Descripción | Un token que no se puede verificar responde 401. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. GET /api/auth/me con el token del caso |
| Resultado esperado | 401 con "Token inválido o vencido". |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › responde 401 con un token %s |
| Automatizado | Sí |
| qaseId | 667 |

### TC-INT-SEG-003

**Rol sin permiso**

| Campo | Valor |
| --- | --- |
| Descripción | Un cliente no puede usar rutas de prestador y viceversa. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Pedir la ruta con el token del rol sin permiso |
| Resultado esperado | 403. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | critica |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-03, RF-09, RF-11, RF-12, RF-16 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › un %s recibe 403 en %s %s |
| Automatizado | Sí |
| qaseId | 668 |

### TC-INT-SEG-004

**Recursos y rutas inexistentes**

| Campo | Valor |
| --- | --- |
| Descripción | Rutas y recursos que no existen responden 404. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Pedir la ruta o el recurso con un id al azar |
| Resultado esperado | 404. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-08, RF-12, RF-16, RF-19 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › responde 404 para %s |
| Automatizado | Sí |
| qaseId | 669 |

### TC-INT-SEG-005

**JSON mal formado**

| Campo | Valor |
| --- | --- |
| Descripción | Un cuerpo que no es JSON válido responde 400 con un mensaje claro. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. POST /api/auth/login con un JSON roto |
| Resultado esperado | 400 con "El cuerpo del pedido no es un JSON válido". |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | media |
| Severidad | normal |
| Tipo | integracion |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › responde 400 si el cuerpo no es un JSON válido |
| Automatizado | Sí |
| qaseId | 670 |

### TC-INT-SEG-006

**Token de una cuenta desactivada**

| Campo | Valor |
| --- | --- |
| Descripción | Si la cuenta se desactiva, su token ya no permite ver el perfil. |
| Precondiciones | Base de datos de test (DATABASE_URL_TEST) con las migraciones aplicadas. La suite crea sus propios datos con un prefijo único. Un cliente y un prestador con sesión iniciada. |
| Pasos | 1. Registrar un cliente e iniciar sesión<br>2. Desactivarlo en la base<br>3. GET /api/auth/me con su token |
| Resultado esperado | 404. |
| Postcondiciones | Al terminar la suite se borran todos los datos que creó. |
| Prioridad | alta |
| Severidad | mayor |
| Tipo | seguridad |
| Capa | Integración |
| Módulo | Seguridad y errores |
| Rol | Todos |
| Requerimiento | RF-02 |
| Archivo y test | `tests/integration/seguridad.integration.test.js` › el token de una cuenta desactivada ya no permite ver el perfil |
| Automatizado | Sí |
| qaseId | 671 |
