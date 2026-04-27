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
    const { texto, categoria, prioridad, completada, createdAt } = req.body || {}; // Extrae todos los campos de tarea enviados por el frontend.

    // Valida que el título exista, sea texto y tenga longitud mínima.
    if (!texto || typeof texto !== 'string' || texto.trim().length < 3) { // Comprueba reglas básicas de validación del título.
      return res.status(400).json({ // Devuelve estado 400 cuando la validación falla.
        error: 'El título debe tener al menos 3 caracteres' // Incluye mensaje descriptivo del error de validación.
      });
    }

    if (!['Trabajo', 'Personal'].includes(categoria)) { // Valida que la categoría sea una opción permitida.
      return res.status(400).json({ error: 'Categoría inválida' }); // Responde con error si categoría no es válida.
    }

    if (!['Alta', 'Baja'].includes(prioridad)) { // Valida que la prioridad sea una opción permitida.
      return res.status(400).json({ error: 'Prioridad inválida' }); // Responde con error si prioridad no es válida.
    }

    const nueva = taskService.crearTarea({ // Crea la tarea manteniendo todos los campos esperados por la UI.
      texto,
      categoria,
      prioridad,
      completada: Boolean(completada),
      createdAt: typeof createdAt === 'number' ? createdAt : Date.now()
    });
    res.status(201).json(nueva); // Responde con 201 y la tarea recién creada.
  } catch (error) { // Captura cualquier excepción inesperada durante la creación.
    console.error('Error en createTask:', error); // Registra en consola el error para diagnóstico.

    res.status(500).json({ // Devuelve estado 500 cuando ocurre un error interno.
      error: 'Error interno del servidor' // Envía mensaje genérico para no exponer detalles internos.
    });
  }
};

function deleteTask(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
} 

// Actualiza una tarea existente desde el body del request.
function updateTask(req, res) { // Declara el handler para PUT /:id.
  const id = parseInt(req.params.id, 10); // Convierte el id de la URL a número entero.

  if (isNaN(id)) { // Valida que el id sea válido.
    return res.status(400).json({ error: 'ID inválido' }); // Corta la ejecución si el id no es numérico.
  }

  const { texto, categoria, prioridad, completada } = req.body || {}; // Lee campos actualizables enviados por frontend.

  if (!texto || typeof texto !== 'string' || texto.trim().length < 3) { // Reutiliza validación mínima del texto.
    return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' }); // Informa error de validación.
  }

  if (!['Trabajo', 'Personal'].includes(categoria)) { // Valida categoría.
    return res.status(400).json({ error: 'Categoría inválida' }); // Respuesta de categoría inválida.
  }

  if (!['Alta', 'Baja'].includes(prioridad)) { // Valida prioridad.
    return res.status(400).json({ error: 'Prioridad inválida' }); // Respuesta de prioridad inválida.
  }

  try { // Intenta actualizar la tarea en el servicio.
    const actualizada = taskService.actualizarTarea(id, { // Ejecuta actualización con campos enviados.
      texto: texto.trim(),
      categoria,
      prioridad,
      completada: Boolean(completada)
    });

    return res.json(actualizada); // Devuelve la tarea actualizada en JSON.
  } catch (error) { // Gestiona errores de servicio.
    if (error.message === 'NOT_FOUND') { // Caso: id no existe.
      return res.status(404).json({ error: 'Tarea no encontrada' }); // Responde 404 al cliente.
    }

    return res.status(500).json({ error: 'Error interno del servidor' }); // Responde error genérico para el resto.
  }
}

// Actualiza solo el estado completada de una tarea.
function patchTaskStatus(req, res) { // Declara el handler para PATCH /:id/status.
  const id = parseInt(req.params.id, 10); // Convierte el id de la URL a número.

  if (isNaN(id)) { // Verifica que el id sea válido.
    return res.status(400).json({ error: 'ID inválido' }); // Responde error de validación.
  }

  const { completada } = req.body || {}; // Lee el campo completada del body.

  if (typeof completada !== 'boolean') { // Exige booleano para evitar valores ambiguos.
    return res.status(400).json({ error: 'El campo completada debe ser booleano' }); // Respuesta de validación.
  }

  try { // Intenta aplicar el cambio en el servicio.
    const actualizada = taskService.actualizarEstadoTarea(id, completada); // Cambia solo el estado completada.
    return res.json(actualizada); // Devuelve la tarea actualizada.
  } catch (error) { // Maneja errores del servicio.
    if (error.message === 'NOT_FOUND') { // Caso tarea inexistente.
      return res.status(404).json({ error: 'Tarea no encontrada' }); // Respuesta 404.
    }

    return res.status(500).json({ error: 'Error interno del servidor' }); // Respuesta genérica.
  }
}

// Exporta los controladores para poder registrarlos en las rutas.
module.exports = { // Expone las funciones del controlador en un único objeto.
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  patchTaskStatus
};

