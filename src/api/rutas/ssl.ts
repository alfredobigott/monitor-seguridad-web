import { Router } from "express";
import { revisarCertificado } from "../../checks/ssl.js";
import { describirResultado } from "../../checks/ssl-mensaje.js";
import { esquemaDominio } from "../../validacion.js";
import { ErrorHttp } from "../errores.js";

export const rutasSsl = Router();

// GET /api/ssl/:dominio  →  ":dominio" es un parámetro: llega en req.params.dominio
rutasSsl.get("/:dominio", async (req, res) => {
  // 1. Validar la entrada antes de usarla. safeParse no lanza: devuelve éxito o los problemas.
  const validacion = esquemaDominio.safeParse(req.params.dominio);
  if (!validacion.success) {
    // 400 Bad Request: el cliente mandó un dato mal formado.
    throw new ErrorHttp(400, "DOMINIO_INVALIDO", validacion.error.issues[0].message);
  }
  const dominio = validacion.data;

  // 2. Hacer el trabajo. Si falla, Express 5 manda el error al middleware de errores solo.
  const resultado = await revisarCertificado(dominio);
  const { estado, mensaje } = describirResultado(resultado);

  // 3. Responder. 200 OK: el chequeo se hizo, aunque el certificado esté vencido.
  //    Un certificado vencido es un resultado del análisis, no un error de la API.
  res.json({
    dominio,
    estado,
    mensaje,
    certificado: {
      emisor: resultado.emisor,
      vence: resultado.vence.toISOString(), // formato estándar de fechas en JSON
      diasRestantes: resultado.diasRestantes,
      valido: resultado.valido,
      motivoInvalido: resultado.motivoInvalido ?? null,
    },
  });
});
