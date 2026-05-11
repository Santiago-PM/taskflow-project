# TASKFLOW by Santiago-PM

## Mini gestor de tareas desarrollado como práctica de desarrollo web

Este repositorio corresponde a un **proyecto de prácticas**, donde subo archivos y documentación.

---

## Web de tareas

[Taskflow - Project](https://taskflow-project-q6po.vercel.app/)

---

### Funcionalidades

- Añadir tareas.
- Asignar categoría (Trabajo / Personal).
- Asignar prioridad (Alta / Baja).
- Marcar tareas como completadas.
- Editar tareas.
- Eliminar tareas.
- Filtrar por categoría, prioridad y estado.
- Buscar tareas por texto.
- Interfaz responsive.
- Modo oscuro.
- Las tareas ahora se gestionan en backend (API REST con Express).
- `localStorage` se usa solo para guardar preferencia de tema claro/oscuro.

---

## Documentación funcional del proyecto

### Flujo principal de la aplicación (Frontend + Backend)

1. El usuario crea/edita/elimina una tarea desde la interfaz.
2. `app.js` valida datos en frontend para dar feedback rápido.
3. El frontend llama a la API REST (`fetch`) usando `server/src/api/client.js`.
4. El backend (Express) vuelve a validar y procesa la petición.
5. El backend responde en JSON y el frontend vuelve a renderizar la lista.
6. Los filtros y la búsqueda se aplican sobre lo que hay en pantalla.

### Persistencia actual de datos

- **Tareas:** se guardan en backend, en memoria del servidor (`server/services/task.service.js`).
- **Tema oscuro/claro:** se guarda en `localStorage` con la clave `darkMode`.

> Nota: al estar en memoria, si se reinicia el servidor las tareas se pierden. Es normal en esta versión.

### Reglas de validación de tareas (frontend)

La validación se aplica al crear y editar:

- El texto no puede estar vacío.
- El texto no puede superar 100 caracteres.
- Solo se permiten caracteres alfanuméricos y signos básicos (`.,!?()-` y acentos).
- No se permiten tareas duplicadas (comparando texto en minúsculas).
- La categoría debe ser `Trabajo` o `Personal`.
- La prioridad debe ser `Alta` o `Baja`.

### Reglas de validación en backend (API)

Además de frontend, el backend vuelve a validar:

- `texto` obligatorio y con mínimo 3 caracteres.
- `categoria` solo `Trabajo` o `Personal`.
- `prioridad` solo `Alta` o `Baja`.
- `completada` debe ser booleano en el endpoint de estado.

---

## Arquitectura de carpetas

Esta es la estructura principal elegida:

```text
taskflow-project/
├─ app.js
├─ index.html
├─ style.css
├─ docs/
└─ server/
   ├─ src/
   │  ├─ index.js
   │  ├─ api/
   │  │  └─ client.js
   │  ├─ config/
   │  │  └─ env.js
   │  ├─ controllers/
   │  │  └─ task.controller.js
   │  └─ routes/
   │     └─ task.routes.js
   └─ services/
      └─ task.service.js
```

### ¿Qué hace cada parte?

- `app.js`: lógica de UI, eventos, validación en cliente y renderizado.
- `server/src/api/client.js`: capa de acceso HTTP desde frontend a backend.
- `server/src/routes/task.routes.js`: define los endpoints REST.
- `server/src/controllers/task.controller.js`: maneja request/response y validación del body.
- `server/services/task.service.js`: lógica de negocio y almacenamiento en memoria.
- `server/src/config/env.js`: carga variables de entorno (por ejemplo el puerto).

Esta separación ayuda a que el código sea más limpio: rutas -> controladores -> servicio.

---

## Middlewares (explicado simple pero técnico)

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

> Los ejemplos están con `curl`, pero se puede hacer igual con Postman/Insomnia.

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

---

## Ejemplos de uso de la app (usuario final)

### Ejemplo 1: Crear y completar una tarea

1. Escribe `Preparar informe semanal` en el campo de nueva tarea.
2. Selecciona categoría `Trabajo` y prioridad `Alta`.
3. Pulsa **Añadir**.
4. Marca el checkbox de la tarea.

Resultado esperado: la tarea aparece y al completarla se muestra tachada.

### Ejemplo 2: Buscar tareas por texto

1. Crea varias tareas.
2. En la búsqueda escribe `comprar`.

Resultado esperado: solo aparecen tareas que contengan ese texto.

### Ejemplo 3: Filtrar por categoría y estado

1. Activa categoría `Personal`.
2. Activa estado `No completado`.

Resultado esperado: solo se ven tareas personales pendientes.

### Ejemplo 4: Editar una tarea existente

1. Pulsa **Editar** en una tarea.
2. Cambia texto/categoría/prioridad.
3. Pulsa **Guardar** o `Enter`.

Resultado esperado: la tarea se actualiza en pantalla y en backend.

---

## Modo oscuro

- El botón alterna entre tema claro y oscuro.
- Se guarda preferencia en `localStorage` (`darkMode`).
- También se actualiza `aria-pressed` para accesibilidad.

---

## Despliegue de la web en Vercel

Se despliega separando el frontend y el backend en dos proyectos distintos de Vercel, ambos conectados al mismo repositorio de Github con ligeros cambios en el despliegue.

- El **backend** se despliega en otro proyecto de Vercel aparte como función **serverless**.
  Configuramos la raíz del despliegue en la carpeta /server, detectando automáticamente Node.js.
  Con el archivo /server/vercel.json definimos el archivo que ejecutar Vercel como serverless.

    (Extracto del archivo):

    ```json
    {
      "version": 2,
      "builds": [
        {
          "src": "src/index.js",
          "use": "@vercel/node"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "src/index.js"
        }
      ]
    }
    ```

- El **frontend** se despliega como una web estética.

  El despliegue se hace desde la raíz principal del proyecto **/taskflow-project**, detectando automáticamente los archivos **index.html**, **app.js** y **style.css**.

  Y en el archivo /server/src/api/client.js configuramos la comunicación red del frontend con el backend, centralizando las peticiones HTTP usando fetch(), ademas del enlace URL al backend desplegado en Vercel para consumir la API REST.

---

## Documentación sobre uso y pruebas con IA

### Model Context Protocol (MCP)

### Proceso de instalación

## Configuración de MCP en Cursor

Para configurar MCP en Cursor, se creó el archivo `.cursor/mcp.json` en la raíz del proyecto.

Se añadió el siguiente contenido:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

El servidor se ejecuta automáticamente mediante `npx`, pero también se puede lanzar manualmente con:

```bash
npx -y @modelcontextprotocol/server-filesystem .
```

Después de esto, se reinició Cursor para asegurar que la configuración de MCP se cargara correctamente.

Se comprobó que el servidor MCP funcionaba correctamente realizando consultas como:

- Listar archivos del proyecto.
- Leer contenido de archivos.
- Analizar código.

El modelo respondió utilizando datos reales del proyecto, confirmando que MCP estaba activo.