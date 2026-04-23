// Gestiona el almacenamiento en memoria y operaciones CRUD básicas de tareas.
let tasks = []; // Mantiene la lista de tareas en memoria durante la ejecución del servidor.
let idCounter = 1; // Lleva un contador incremental para asignar ids únicos.

// Devuelve todas las tareas actualmente almacenadas.
const obtenerTodas = () => { // Define la función de lectura completa de tareas.
  return tasks; // Retorna el array de tareas tal como está en memoria.
};

// Crea una tarea nueva, le asigna id y la guarda en memoria.
const crearTarea = (data) => { // Define la función para crear una tarea a partir de datos recibidos.
  const nuevaTarea = { // Construye el objeto final de la nueva tarea.
    id: idCounter++, // Asigna el id actual y luego incrementa el contador.
    ...data // Copia el resto de campos enviados en data dentro de la tarea.
  };

  tasks.push(nuevaTarea); // Agrega la nueva tarea al array en memoria.
  return nuevaTarea; // Retorna la tarea creada para usarla en la respuesta HTTP.
};

// Elimina una tarea existente identificándola por su id.
const eliminarTarea = (id) => { // Define la función de borrado de tarea.
  const index = tasks.findIndex(t => t.id === id); // Busca la posición de la tarea con el id indicado.

  if (index === -1) { // Verifica si no se encontró ninguna tarea con ese id.
    throw new Error('NOT_FOUND'); // Lanza un error de dominio para que el controlador responda 404.
  }

  tasks.splice(index, 1); // Elimina del array la tarea encontrada en la posición calculada.
};

// Exporta las funciones del servicio para su uso desde los controladores.
module.exports = { // Expone la API pública del servicio de tareas.
  obtenerTodas,
  crearTarea,
  eliminarTarea
};