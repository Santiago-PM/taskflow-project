const taskService = require('../../services/task.service');

const getTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
};

const createTask = (req, res) => {
  try {
    const { title } = req.body || {};

    // validación mejorada
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        error: 'El título debe tener al menos 3 caracteres'
      });
    }

    const nueva = taskService.crearTarea({ title });

    res.status(201).json(nueva);

  } catch (error) {
    console.error('Error en createTask:', error);

    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask
};