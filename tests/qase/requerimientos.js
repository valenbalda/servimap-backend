// Requerimientos funcionales de ServiMap (fuente: documento de requerimientos del grupo).
const REQUERIMIENTOS = {
  'RF-01': 'Registro de usuario',
  'RF-02': 'Inicio y cierre de sesión',
  'RF-03': 'Creación y edición del perfil de Prestador',
  'RF-04': 'Datos del perfil del Prestador (oficios, descripción, zona de cobertura, rango de precios, contacto)',
  'RF-05': 'Mapa de Prestadores',
  'RF-06': 'Filtros de Prestadores (oficio y distancia)',
  'RF-07': 'Búsqueda de Prestadores',
  'RF-08': 'Ficha detallada del Prestador',
  'RF-09': 'Generación de solicitud de servicio',
  'RF-10': 'Datos de la solicitud',
  'RF-11': 'Aceptación o rechazo de solicitud',
  'RF-12': 'Cancelación de solicitud',
  'RF-13': 'Finalización de solicitud',
  'RF-14': 'Listado de solicitudes del Cliente',
  'RF-15': 'Listado de solicitudes del Prestador',
  'RF-16': 'Registro de calificación',
  'RF-17': 'Validación de solicitud finalizada',
  'RF-18': 'Una calificación por solicitud',
  'RF-19': 'Promedio de calificaciones',
  'RF-20': 'Cantidad de servicios finalizados',
  'RF-21': 'Calificaciones y comentarios recibidos',
  'RF-22': 'Gestión de oficios por Administrador',
  'RF-23': 'Moderación de comentarios',
};

// Lo que el backend todavía no prueba de forma automática. No son casos: son huecos conocidos.
const PENDIENTES = [
  {
    rf: ['RF-02'],
    tema: 'Cierre de sesión',
    detalle:
      'El backend no tiene endpoint de logout: el frontend descarta el token y el JWT sigue siendo válido hasta que vence. Se prueba en los E2E del frontend.',
  },
  {
    rf: ['RF-05', 'RF-06', 'RF-07', 'RF-08'],
    tema: 'Mapa interactivo y pantallas de búsqueda',
    detalle:
      'El backend prueba los datos del mapa y la búsqueda; el dibujo del mapa, los marcadores y los filtros en pantalla se prueban con los E2E del frontend (repositorio aparte).',
  },
  {
    rf: [],
    tema: 'E2E de punta a punta',
    detalle: 'Los flujos completos desde el navegador (frontend + API) se automatizan en el repositorio del frontend.',
  },
  {
    rf: ['RF-06', 'RF-07'],
    tema: 'Filtros calificacionMin y limit contra base real',
    detalle: 'Están cubiertos con tests unitarios; falta un test de integración con base de datos real.',
  },
  {
    rf: ['RF-16', 'RF-23'],
    tema: 'Editar el comentario de una calificación moderada contra base real',
    detalle: 'La regla (409) está cubierta con un test unitario (TC-CAL-026); falta el test de integración.',
  },
  {
    rf: [],
    tema: 'Rate limiting, Helmet y CORS',
    detalle: 'Configurados en src/app.js pero sin tests automáticos (no funcionales).',
  },
  {
    rf: [],
    tema: 'Documentación Swagger (/api-docs)',
    detalle: 'Sin test automático.',
  },
];

module.exports = { REQUERIMIENTOS, PENDIENTES };
