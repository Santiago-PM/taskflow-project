// Punto de entrada del servidor HTTP y configuración global de middlewares/rutas.
const express = require('express'); // Importa el framework Express para crear el servidor.
const cors = require('cors'); // Importa el middleware CORS para permitir peticiones cruzadas.

// Crea la instancia principal de la aplicación Express.
const app = express(); // Inicializa la app que manejará peticiones y respuestas.

// Importa variables de entorno y el router principal de tareas.
const { port: PORT } = require('./config/env'); // Lee el puerto configurado desde el módulo de entorno.
const taskRoutes = require('./routes/task.routes'); // Carga las rutas relacionadas con tareas.

// Registra middlewares globales antes de las rutas.
app.use(cors()); // Habilita CORS para todos los endpoints.
app.use(express.json()); // Permite parsear cuerpos JSON en las peticiones entrantes.

const logger = (req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
  });

  next();
};

app.use(logger);

// Monta el router de tareas bajo el prefijo versionado de la API.
app.use('/api/v1/tasks', taskRoutes); // Conecta todas las rutas de tareas al prefijo indicado.

// Inicia el servidor en el puerto definido y muestra un mensaje en consola.
app.listen(PORT, () => { // Arranca el servidor y ejecuta un callback al quedar escuchando.
  console.log(`Servidor corriendo en puerto ${PORT}`); // Informa en consola el puerto activo.
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'Recurso no encontrado'
    });
  }

  return res.status(500).json({
    error: 'Error interno del servidor'
  });
});