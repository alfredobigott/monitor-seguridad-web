// Punto de entrada de la herramienta desde la terminal.
// Uso: npm run dev -- <dominio>

import { revisarCertificado } from "./checks/ssl.js";
import { describirResultado } from "./checks/ssl-mensaje.js";
import { esquemaDominio } from "./validacion.js";

async function main(): Promise<void> {
  const entrada = process.argv[2];

  if (!entrada) {
    console.error("Uso: npm run dev -- <dominio>   (ejemplo: npm run dev -- ejemplo.com)");
    process.exitCode = 1;
    return;
  }
  // La misma validación que usa la API: una sola regla para toda la herramienta.
  const validacion = esquemaDominio.safeParse(entrada);
  if (!validacion.success) {
    console.error(`"${entrada}": ${validacion.error.issues[0].message}`);
    process.exitCode = 1;
    return;
  }
  const dominio = validacion.data;

  console.log(`Revisando el certificado de ${dominio}...`);

  try {
    const resultado = await revisarCertificado(dominio);
    const { estado, mensaje } = describirResultado(resultado);
    console.log(mensaje);
    // Código de salida: 0 si está bien o solo hay aviso, 1 si hay un problema.
    // Sirve para usar la herramienta en scripts o tareas automáticas.
    process.exitCode = estado === "error" ? 1 : 0;
  } catch (error) {
    console.error(`✖ ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

main();
