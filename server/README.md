
## Documentación funcional del proyecto

## Reglas de validación en backend (API)

Además de frontend, el backend vuelve a validar:

- `texto` obligatorio y con mínimo 3 caracteres.
- `categoria` solo `Trabajo` o `Personal`.
- `prioridad` solo `Alta` o `Baja`.
- `completada` debe ser booleano en el endpoint de estado.

---

### ¿Qué hace cada parte?

- `app.js`: lógica de UI, eventos, validación en cliente y renderizado.
- `server/src/api/client.js`: capa de acceso HTTP desde frontend a backend.
- `server/src/routes/task.routes.js`: define los endpoints REST.
- `server/src/controllers/task.controller.js`: maneja request/response y validación del body.
- `server/services/task.service.js`: lógica de negocio y almacenamiento en memoria.
- `server/src/config/env.js`: carga variables de entorno (por ejemplo el puerto).

Esta separación ayuda a que el código sea más limpio: rutas -> controladores -> servicio.

---

## Middlewares

En `server/src/index.js` se usan estos middlewares:

### 1) `cors()`

- Habilita **Cross-Origin Resource Sharing**.
- Permite que el frontend pueda hacer peticiones al backend aunque estén en dominios/puertos distintos.

### 2) `express.json()`

- Middleware de parsing.
- Convierte automáticamente el body JSON de la request en `req.body`.
- Sin esto, no podríamos leer los datos de una tarea enviada por `POST`, `PUT` o `PATCH`.

### 3) `logger` personalizado

- Middleware propio que mide tiempo de respuesta.
- Usa `res.on('finish', ...)` para saber cuándo termina la respuesta.
- Muestra en consola: método HTTP, URL, código de estado y duración en ms.
- Sirve para trazabilidad básica y debugging.

### 4) Middleware global de errores

- Se ejecuta cuando algo falla y se llama a `next(error)`.
- Si llega error `NOT_FOUND`, responde `404`.
- Para errores no controlados, responde `500`.
- Evita que el servidor rompa y da respuestas consistentes.

---

## API REST de tareas

Base URL:

`/api/v1/tasks`

### Endpoints disponibles

- `GET /api/v1/tasks` -> Listar tareas.
- `POST /api/v1/tasks` -> Crear tarea.
- `PUT /api/v1/tasks/:id` -> Editar tarea completa.
- `PATCH /api/v1/tasks/:id/status` -> Cambiar solo `completada`.
- `DELETE /api/v1/tasks/:id` -> Eliminar tarea.

### Estructura de una tarea

```json
{
  "id": 1,
  "texto": "Preparar informe semanal",
  "categoria": "Trabajo",
  "prioridad": "Alta",
  "completada": false,
  "createdAt": 1746543000000
}
```

---

## Ejemplos prácticos para usar la API

> Los ejemplos están con `curl`, pero se puede hacer igual con Postman.

### 1) Obtener todas las tareas

```bash
curl -X GET "https://taskflow-project-tawny.vercel.app/api/v1/tasks"
```

### 2) Crear una tarea

```bash
curl -X POST "https://taskflow-project-tawny.vercel.app/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"texto\":\"Estudiar Express\",\"categoria\":\"Trabajo\",\"prioridad\":\"Alta\",\"completada\":false,\"createdAt\":1746543000000}"
```

### 3) Editar una tarea completa

```bash
curl -X PUT "https://taskflow-project-tawny.vercel.app/api/v1/tasks/1" \
  -H "Content-Type: application/json" \
  -d "{\"texto\":\"Estudiar Express y middlewares\",\"categoria\":\"Trabajo\",\"prioridad\":\"Alta\",\"completada\":false}"
```

### 4) Cambiar solo el estado de completada

```bash
curl -X PATCH "https://taskflow-project-tawny.vercel.app/api/v1/tasks/1/status" \
  -H "Content-Type: application/json" \
  -d "{\"completada\":true}"
```

### 5) Eliminar una tarea

```bash
curl -X DELETE "https://taskflow-project-tawny.vercel.app/api/v1/tasks/1"
```

*Desarrollado durante las prácticas en [Corner Estudios](https://www.corner-estudios.com) — Santiago — 2026*