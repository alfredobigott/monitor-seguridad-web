// Punto de entrada de la herramienta.
// Por ahora solo recibe un dominio y lo valida;
// los chequeos se suman a partir del próximo sprint.

const dominio = process.argv[2];

if (!dominio) {
  console.error("Uso: npm run dev -- <dominio>   (ejemplo: npm run dev -- ejemplo.com)");
  process.exit(1);
}

// Un dominio válido: letras, números y guiones, separados por puntos,
// con una terminación de al menos dos letras (por ejemplo, .com o .ar).
const formatoDominio = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i;

if (!formatoDominio.test(dominio)) {
  console.error(`"${dominio}" no parece un dominio válido.`);
  process.exit(1);
}

console.log(`Dominio recibido: ${dominio}`);
console.log("Los chequeos todavía no están implementados.");
