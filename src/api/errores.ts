import type { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorSsl, type CodigoErrorSsl } from "../checks/ssl.js";

// Error con código HTTP: lo lanzamos desde las rutas cuando sabemos qué salió mal.
export class ErrorHttp extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorHttp";
  }
}

// Cada falla del chequeo SSL se traduce a un código HTTP.
// 4xx = el problema está en lo que pidió el cliente.
// 5xx = el problema está del lado del servidor o de un servidor externo.
const statusPorCodigoSsl: Record<CodigoErrorSsl, number> = {
  DOMINIO_INEXISTENTE: 404, // Not Found: ese dominio no existe
  SIN_HTTPS: 502, // Bad Gateway: el sitio existe pero no habla HTTPS
  SIN_CERTIFICADO: 502,
  ERROR_CONEXION: 502,
  TIEMPO_AGOTADO: 504, // Gateway Timeout: el sitio no respondió a tiempo
};

// Middleware para rutas que no existen. Va después de todas las rutas.
export const rutaNoEncontrada: RequestHandler = (req, _res, next) => {
  next(new ErrorHttp(404, "RUTA_INEXISTENTE", `No existe la ruta ${req.method} ${req.path}.`));
};

// Middleware de errores: Express lo reconoce porque recibe 4 parámetros (err, req, res, next).
// Todos los errores de la API terminan acá y salen con el mismo formato JSON.
export const manejadorDeErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ErrorHttp) {
    res.status(err.status).json({ error: { codigo: err.codigo, mensaje: err.message } });
    return;
  }
  if (err instanceof ErrorSsl) {
    res.status(statusPorCodigoSsl[err.codigo]).json({ error: { codigo: err.codigo, mensaje: err.message } });
    return;
  }
  // Un error que no esperábamos: lo registramos para nosotros,
  // pero al cliente no le mostramos detalles internos (eso podría dar pistas a un atacante).
  console.error(err);
  res.status(500).json({ error: { codigo: "ERROR_INTERNO", mensaje: "Ocurrió un error inesperado." } });
};
