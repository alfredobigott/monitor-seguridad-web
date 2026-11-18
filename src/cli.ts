// Punto de entrada de la herramienta desde la terminal.
// Uso: npm run dev -- <dominio>

import { revisarCertificado } from "./checks/ssl.js";
import { describirResultado } from "./checks/ssl-mensaje.js";

// Un dominio válido: letras, números y guiones, separados por puntos,
// con una terminación de al menos dos letras (por ejemplo, .com o .ar).
const formatoDominio = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i;

async function main(): Promise<void> {
  const dominio = process.argv[2]?.trim().toLowerCase();

  if (!dominio) {
    console.error("Uso: npm run dev -- <dominio>   (ejemplo: npm run dev -- ejemplo.com)");
    process.exitCode = 1;
    return;
  }
  if (!formatoDominio.test(dominio)) {
    console.error(`"${dominio}" no parece un dominio válido.`);
    process.exitCode = 1;
    return;
  }

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
