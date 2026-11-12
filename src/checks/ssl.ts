import tls from "node:tls";

// Lo que devuelve el chequeo, siempre con la misma forma,
// para que la CLI (y más adelante el informe) sepan qué esperar.
export interface ResultadoSsl {
  dominio: string;
  emisor: string; // quién firmó el certificado (por ejemplo, Let's Encrypt)
  vence: Date; // fecha de vencimiento
  diasRestantes: number; // negativo si ya venció
  valido: boolean; // si Node lo considera confiable
  motivoInvalido?: string; // por qué no es confiable, si no lo es
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Cálculo separado de la red: así se puede probar sin conectarse a nada.
export function calcularDiasRestantes(vence: Date, hoy: Date = new Date()): number {
  return Math.floor((vence.getTime() - hoy.getTime()) / MS_POR_DIA);
}

// En un certificado, un mismo campo puede venir como un texto o como una lista de textos.
function aTexto(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor.join(", ") : valor;
}

export function revisarCertificado(dominio: string, timeoutMs = 10_000): Promise<ResultadoSsl> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: dominio,
      port: 443, // puerto estándar de HTTPS
      servername: dominio, // SNI: le dice al servidor qué sitio queremos, porque uno puede alojar varios
      // No cortamos la conexión si el certificado es inválido:
      // queremos poder informar un certificado vencido, no solo fallar.
      rejectUnauthorized: false,
    });

    socket.setTimeout(timeoutMs, () => {
      socket.destroy();
      reject(new Error(`El servidor no respondió en ${timeoutMs / 1000} segundos.`));
    });

    socket.once("secureConnect", () => {
      const cert = socket.getPeerCertificate();
      socket.end(); // solo necesitábamos el certificado: cerramos

      if (!cert || !cert.valid_to) {
        reject(new Error("El servidor no envió un certificado."));
        return;
      }

      const vence = new Date(cert.valid_to);
      resolve({
        dominio,
        emisor: aTexto(cert.issuer?.O ?? cert.issuer?.CN) ?? "desconocido",
        vence,
        diasRestantes: calcularDiasRestantes(vence),
        valido: socket.authorized,
        motivoInvalido: socket.authorized ? undefined : String(socket.authorizationError),
      });
    });

    socket.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOTFOUND") {
        reject(new Error(`No existe el dominio "${dominio}".`));
      } else if (error.code === "ECONNREFUSED") {
        reject(new Error(`"${dominio}" no acepta conexiones HTTPS (puerto 443).`));
      } else {
        reject(new Error(`No se pudo conectar con "${dominio}": ${error.message}`));
      }
    });
  });
}
