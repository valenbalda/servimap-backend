const fotosService = require('../services/fotosService');

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = '2mb';

// Cada formato de imagen empieza con unos bytes fijos ("firma"). Así
// comprobamos que el archivo es de verdad lo que dice ser, y no un texto
// con la etiqueta image/png.
function detectarTipo(buffer) {
  const empieza = (...bytes) => bytes.every((byte, i) => buffer[i] === byte);

  if (empieza(0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (empieza(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

async function subir(req, res, next) {
  try {
    const tipo = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    const buffer = req.body;

    if (!TIPOS_PERMITIDOS.includes(tipo) || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      return res.status(400).json({
        error: 'Enviá la imagen como JPG, PNG o WebP en el cuerpo del pedido',
      });
    }

    if (detectarTipo(buffer) !== tipo) {
      return res.status(400).json({
        error: 'El archivo no es una imagen válida o no coincide con su tipo',
      });
    }

    const resultado = await fotosService.subirFoto(req.usuario.id, req.usuario.rol, {
      buffer,
      tipo,
    });
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const resultado = await fotosService.eliminarFoto(req.usuario.id, req.usuario.rol);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = { subir, eliminar, TIPOS_PERMITIDOS, TAMANIO_MAXIMO };