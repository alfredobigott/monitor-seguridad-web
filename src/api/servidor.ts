import { crearApp } from "./app.js";

// El puerto sale de una variable de entorno; si no hay, usa 3000.
const PUERTO = Number(process.env.PORT ?? 3000);

crearApp().listen(PUERTO, () => {
  console.log(`API escuchando en http://localhost:${PUERTO}`);
});
