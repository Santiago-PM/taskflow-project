
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-639?style=for-the-badge&logo=css&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

# TASKFLOW by Santiago-PM

## Mini gestor de tareas desarrollado como práctica de desarrollo web

Este repositorio corresponde a un **proyecto de prácticas**, donde subo archivos y documentación.

---

## Web de tareas

[Taskflow - Project](https://taskflow-project-q6po.vercel.app/)

---

### Tecnologías utilizadas

  Frontend
  - HTML
  - JavaScript
  - TailwindCSS

  Backend
  - JSON
  - Node.js
  - 

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

### Reglas de validación de tareas (frontend)

La validación se aplica al crear y editar:

- El texto no puede estar vacío.
- El texto no puede superar 100 caracteres.
- Solo se permiten caracteres alfanuméricos y signos básicos (`.,!?()-` y acentos).
- No se permiten tareas duplicadas (comparando texto en minúsculas).
- La categoría debe ser `Trabajo` o `Personal`.
- La prioridad debe ser `Alta` o `Baja`.

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