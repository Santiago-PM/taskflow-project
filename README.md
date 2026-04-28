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
- Eliminar tareas.
- Editar texto de tareas.
- Filtrar tareas por categoría.
- Filtrar tareas por prioridad.
- Filtrar tareas por estado de completado.
- Buscar tareas por texto.
- Guardar tareas en el navegador mediante `localStorage`.
- Interfaz adaptada a móvil (responsive).
- Modo oscuro.
- No es posible crear una tarea sin texto.
- Si una tarea tiene mucho texto, las palabras se dividen correctamente; en caso de una palabra muy larga, también se divide.

---

## Documentación funcional del proyecto

### Flujo principal de la aplicación

1. El usuario crea una tarea desde el formulario (`texto`, `categoría` y `prioridad`).
2. La tarea se valida antes de guardarse.
3. Si la validación es correcta, se añade a la lista y se guarda en `localStorage`.
4. La interfaz se vuelve a renderizar y se aplican filtros/búsqueda activos.
5. El usuario puede completar, editar o eliminar tareas en cualquier momento.

### Reglas de validación de tareas

La validación se aplica tanto al **crear** como al **editar** tareas:

- El texto no puede estar vacío.
- El texto no puede superar 100 caracteres.
- Solo se permiten caracteres alfanuméricos y signos básicos (`.,!?()-` y acentos).
- No se permiten tareas duplicadas (comparación por texto, ignorando mayúsculas/minúsculas).
- La categoría debe ser `Trabajo` o `Personal`.
- La prioridad debe ser `Alta` o `Baja`.

### Filtros y búsqueda

La lista de tareas puede combinar:

- Filtro por categoría.
- Filtro por prioridad.
- Filtro por estado (`Completado` / `No completado`).
- Búsqueda por texto en tiempo real.

Todos los filtros se aplican de forma conjunta sobre los datos visibles en pantalla.

### Ejemplos de uso

#### Ejemplo 1: Crear y completar una tarea

1. Escribe `Preparar informe semanal` en el campo **Nueva tarea**.
2. Selecciona categoría `Trabajo` y prioridad `Alta`.
3. Pulsa **Añadir**.
4. Marca el checkbox de la tarea para cambiarla a completada.

Resultado esperado: la tarea aparece en la lista y, al completarla, se muestra tachada.

#### Ejemplo 2: Buscar tareas por texto

1. Crea varias tareas con textos diferentes (por ejemplo: `Comprar pan`, `Comprar fruta`, `Llamar al banco`).
2. En el campo de búsqueda, escribe `comprar`.

Resultado esperado: solo se muestran las tareas que contienen el texto `comprar`.

#### Ejemplo 3: Filtrar por categoría y estado

1. Activa el filtro de categoría `Personal`.
2. Activa el filtro de estado `No completada`.

Resultado esperado: solo se ven tareas personales que aún no están completadas.

#### Ejemplo 4: Editar una tarea existente

1. Pulsa **Editar** sobre una tarea.
2. Cambia el texto, la categoría o la prioridad.
3. Pulsa **Guardar** o presiona `Enter`.

Resultado esperado: la tarea se actualiza en pantalla y queda guardada para próximas sesiones.

### Persistencia de datos

La aplicación guarda información en `localStorage` mediante dos claves:

- `tareas`: almacena todas las tareas creadas.
- `darkMode`: guarda la preferencia de tema (oscuro/claro).

Al recargar la página, la app recupera automáticamente ambos estados.

### Modo oscuro

- El botón de cabecera alterna entre modo claro y oscuro.
- La preferencia se conserva entre sesiones.
- También se actualiza el estado accesible del botón (`aria-pressed`).

### Edición y estados de tarea

- Cada tarea dispone de checkbox para marcar completado/no completado.
- El botón **Editar** permite modificar texto, categoría y prioridad en línea.
- El botón **Eliminar** borra la tarea y actualiza almacenamiento y filtros.
- Una tarea completada se muestra tachada y con menor opacidad.

### Funciones clave de `app.js`

- `cargarTareas()`: recupera tareas desde `localStorage` y sanea datos inválidos.
- `guardarTareas()`: persiste el estado actual de tareas.
- `validarTarea(...)`: centraliza todas las reglas de validación.
- `renderLista()`: reconstruye la lista de tareas en el DOM.
- `aplicarFiltros()`: decide qué tareas se muestran según filtros y búsqueda.
- `crearNodoTarea(tarea)`: construye el bloque visual completo de cada tarea.
- `crearCheckbox(...)`: maneja cambios de estado completado.
- `crearBotonEditar(...)`: implementa edición inline y guardado de cambios.
- `aplicarModoOscuro(esDark)`: aplica clases de tema y guarda preferencia.
- `sincronizarModoOscuroUI()`: restaura tema al iniciar la aplicación.

### Estructura base de una tarea

Cada tarea maneja internamente esta información:

- `id`: identificador único.
- `texto`: contenido de la tarea.
- `categoria`: `Trabajo` o `Personal`.
- `prioridad`: `Alta` o `Baja`.
- `completada`: estado booleano.
- `createdAt`: fecha de creación (timestamp).

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