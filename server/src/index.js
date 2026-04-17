const express = require('express');
const cors = require('cors');

// Importar configuración (MUY IMPORTANTE)
require('./config/env');

const app = express();

app.use(express.json());

app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Levantar servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

const taskRoutes = require('./routes/task.routes');

app.use('/api/v1/tasks', taskRoutes);



const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);