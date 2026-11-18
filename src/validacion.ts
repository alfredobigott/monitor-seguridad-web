import { z } from "zod";

// Un dominio válido: letras, números y guiones, separados por puntos,
// con una terminación de al menos dos letras (por ejemplo, .com o .ar).
const formatoDominio = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i;

// Esquema de Zod: describe cómo tiene que ser un dato válido.
// .trim() y .toLowerCase() limpian el dato antes de validarlo,
// así "  Ejemplo.COM " se acepta como "ejemplo.com".
export const esquemaDominio = z
  .string()
  .trim()
  .toLowerCase()
  .max(253, "El dominio es demasiado largo.")
  .regex(formatoDominio, "No parece un dominio válido (ejemplo: ejemplo.com).");
