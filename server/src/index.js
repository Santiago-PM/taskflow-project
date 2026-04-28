const express = require('express');
const cors = require('cors');

const app = express();

const taskRoutes = require('./routes/task.routes');

app.use(cors());
app.use(express.json());

const logger = (req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
  });

  next();
};

app.use(logger);

app.use('/api/v1/tasks', taskRoutes);

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

module.exports = app;


