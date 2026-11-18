import express from "express";
import { rutasSsl } from "./rutas/ssl.js";
import { manejadorDeErrores, rutaNoEncontrada } from "./errores.js";

// La app se arma en una función y se exporta sin "escuchar" ningún puerto:
// así los tests pueden usarla sin levantar un servidor real.
export function crearApp() {
  const app = express();

  // Seguridad: Express anuncia "X-Powered-By: Express" en cada respuesta.
  // Quitarlo no da información gratis sobre la tecnología del servidor.
  app.disable("x-powered-by");

  app.use(express.json()); // entiende cuerpos JSON (lo usaremos en POST /api/sitios)

  // Ruta simple para saber si la API está viva.
  app.get("/api/salud", (_req, res) => {
    res.json({ estado: "ok" });
  });

  // Todas las rutas de rutasSsl quedan bajo el prefijo /api/ssl.
  app.use("/api/ssl", rutasSsl);

  // El orden importa: estos dos van al final.
  app.use(rutaNoEncontrada);
  app.use(manejadorDeErrores);

  return app;
}
