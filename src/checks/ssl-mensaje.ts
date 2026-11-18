import type { ResultadoSsl } from "./ssl.js";

// Menos de estos días se considera "por vencer".
export const DIAS_AVISO = 30;

export type Estado = "ok" | "aviso" | "error";

// Traduce el resultado técnico a un mensaje para una persona sin conocimientos técnicos.
// No usa la red: se puede probar con datos inventados.
export function describirResultado(r: ResultadoSsl): { estado: Estado; mensaje: string } {
  const fecha = r.vence.toLocaleDateString("es-AR");

  if (r.diasRestantes < 0) {
    return {
      estado: "error",
      mensaje: `✖ El certificado de ${r.dominio} VENCIÓ hace ${Math.abs(r.diasRestantes)} días (${fecha}). Los navegadores muestran el sitio como inseguro.`,
    };
  }
  if (!r.valido) {
    return {
      estado: "error",
      mensaje: `✖ El certificado de ${r.dominio} no es confiable (${r.motivoInvalido}). Vence el ${fecha}.`,
    };
  }
  if (r.diasRestantes <= DIAS_AVISO) {
    return {
      estado: "aviso",
      mensaje: `⚠ El certificado de ${r.dominio} vence en ${r.diasRestantes} días (${fecha}). Conviene renovarlo pronto.`,
    };
  }
  return {
    estado: "ok",
    mensaje: `✔ Certificado válido. Vence en ${r.diasRestantes} días (${fecha}). Emitido por ${r.emisor}.`,
  };
}
