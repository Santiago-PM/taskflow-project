// Define las rutas HTTP para operar sobre el recurso de tareas.
const express = require('express'); // Importa Express para construir un router modular.
const router = express.Router(); // Crea una instancia de router para agrupar endpoints.
const taskController = require('../controllers/task.controller'); // Importa el controlador con handlers de tareas.

// Registra la ruta para listar todas las tareas.
router.get('/', taskController.getTasks); // Atiende GET / devolviendo la colección de tareas.
// Registra la ruta para crear una tarea nueva.
router.post('/', taskController.createTask); // Atiende POST / validando y guardando una nueva tarea.
router.put('/:id', taskController.updateTask); // Atiende PUT /:id para editar una tarea existente.
router.patch('/:id/status', taskController.patchTaskStatus); // Atiende PATCH /:id/status para actualizar solo completada.
// Registra la ruta para eliminar una tarea existente por id.
router.delete('/:id', taskController.deleteTask); // Atiende DELETE /:id borrando la tarea indicada.

// Exporta el router para montarlo en la app principal.
module.exports = router; // Expone el conjunto de rutas de tareas.