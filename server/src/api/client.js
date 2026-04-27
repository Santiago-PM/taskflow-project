const API_URL = 'http://localhost:3000/api/v1/tasks';

export async function cargarTareas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('No se pudieron cargar tareas');
  return await res.json();
}

export async function crearTareaBackend(tarea) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tarea)
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

async function editarTareaBackend(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

export async function actualizarTareaBackend(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function actualizarEstadoTareaBackend(id, completada) {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completada })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function borrarTareaBackend(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}