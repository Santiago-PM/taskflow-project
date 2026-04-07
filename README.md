# TASKFLOW by Santiago-PM

## Mini gestor de tareas desarrollado como practica de desarrollo web.

Este repositorio es de un **Proyecto de Practicas** donde subo mis archivos y documentos.

---

Web de Tareas

[URL: Taskflow - Project](https://taskflow-project-santiago.vercel.app/)

---

### Funcionalidades

- Añadir tareas
- Asignar categoría (Trabajo / Personal)
- Asignar prioridad (Alta / Baja)
- Marcar tareas completadas
- Eliminar tareas
- Editar texto
- Filtrar tareas por categoría
- Filtrar tareas por prioridad
- Filtrar tares por completado
- Buscar tareas por texto
- Guardar tareas en el navegador mediante LocalStorage
- Interfaz adaptada a móvil (responsive)
- Modo Oscuro
- No es posible crear tarea sin texto
- Si se crea una tarea con mucho texto se dividen las palabras. En caso de ser una palabra muy larga también la divide

---

## Documentación sobre uso y pruebas con IA.

### Model context Protocol (MCP)

### Proceso de Instalación

## Configuración de MCP en Cursor

Para configurar MCP en Cursor, se creó el archivo `.cursor/mcp.json` en la raíz del proyecto.

Se añadió el siguiente contenido:

```
```json
{
"mcpServers": {
    "filesystem": {  <-- Nombre del servidor
    "command": "npx",  <-- Cómo se ejecutara
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]  <-- Paquete MCP que instalas y carpeta del proyecto
    }
}
}
```

El servidor se ejecuta automáticamente mediante npx, pero también se puede lanzar manualmente con:

```
npx -y @modelcontextprotocol/server-filesystem .
```

Después de esto reiniciamos Cursor para asegurarnos que la configuracion del MCP se carga correctamente.
Se comprobó que el servidor MCP funcionaba correctamente realizando consultas como:

- Listar archivos del proyecto
- Leer contenido de archivos
- Analizar código

El modelo respondió utilizando datos reales del proyecto, confirmando que MCP estaba activo.