// Define los controladores HTTP para listar, crear y eliminar tareas.
const taskService = require('../../services/task.service'); // Importa la capa de servicio con la lógica de tareas.

// Controlador que devuelve todas las tareas almacenadas.
const getTasks = (req, res) => { // Declara el handler para el endpoint GET de tareas.
  const tasks = taskService.obtenerTodas(); // Obtiene todas las tareas desde el servicio.
  res.json(tasks); // Responde al cliente con la lista en formato JSON.
};

// Controlador que valida y crea una nueva tarea.
const createTask = (req, res) => { // Declara el handler para el endpoint POST de tareas.
  try { // Inicia un bloque de captura para manejar errores de ejecución.
    const { title } = req.body || {}; // Extrae el campo title del body o usa objeto vacío si no existe.

    // Valida que el título exista, sea texto y tenga longitud mínima.
    if (!title || typeof title !== 'string' || title.trim().length < 3) { // Comprueba reglas básicas de validación del título.
      return res.status(400).json({ // Devuelve estado 400 cuando la validación falla.
        error: 'El título debe tener al menos 3 caracteres' // Incluye mensaje descriptivo del error de validación.
      });
    }

    const nueva = taskService.crearTarea({ title }); // Crea la tarea en el servicio con el título recibido.
    res.status(201).json(nueva); // Responde con 201 y la tarea recién creada.
  } catch (error) { // Captura cualquier excepción inesperada durante la creación.
    console.error('Error en createTask:', error); // Registra en consola el error para diagnóstico.

    res.status(500).json({ // Devuelve estado 500 cuando ocurre un error interno.
      error: 'Error interno del servidor' // Envía mensaje genérico para no exponer detalles internos.
    });
  }
};

// Controlador que elimina una tarea por su identificador numérico.
function deleteTask(req, res) { // Declara el handler para el endpoint DELETE de tareas.
  const id = parseInt(req.params.id); // Convierte el parámetro id de la URL a número entero.

  if (isNaN(id)) { // Verifica si el id no es un número válido.
    return res.status(400).json({ error: 'ID inválido' }); // Responde 400 cuando el id recibido es incorrecto.
  }

  try { // Inicia bloque de captura para manejar errores al eliminar.
    taskService.eliminarTarea(id); // Solicita al servicio que elimine la tarea con ese id.
    res.status(204).send(); // Responde 204 sin contenido al eliminar correctamente.
  } catch (error) { // Captura errores lanzados por el servicio.
    if (error.message === 'NOT_FOUND') { // Comprueba si el error indica que la tarea no existe.
      return res.status(404).json({ error: 'Tarea no encontrada' }); // Responde 404 cuando no encuentra la tarea.
    } 

    res.status(500).json({ error: 'Error interno' }); // Responde 500 para cualquier otro error inesperado.
  }
} 

// Exporta los controladores para poder registrarlos en las rutas.
module.exports = { // Expone las funciones del controlador en un único objeto.
  getTasks,
  createTask,
  deleteTask
};

