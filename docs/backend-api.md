# Información sobre Axios, Postman, Sentry y Swagger

## ¿Qué son y para qué se usan?

Este documento resume qué es Axios, Postman, Sentry y Swagger, y por qué se utilizan en proyectos web.

---

## Axios

Axios es una librería de JavaScript para realizar peticiones HTTP desde frontend o backend. Funciona como alternativa a `fetch()` y simplifica la comunicación con APIs REST.

Permite realizar peticiones como:

- GET
- POST
- PUT
- DELETE

Además, incluye características útiles como:

- Conversión automática de JSON
- Manejo más sencillo de errores
- Interceptores de peticiones y respuestas
- Configuración global de URLs y cabeceras
- Compatibilidad con navegadores y Node.js

### ¿Para qué se usa?

Se utiliza para facilitar la comunicación entre aplicaciones y servidores, con un código más limpio y mantenible que usar `fetch()` directamente en proyectos grandes.

Ejemplo:

```js
const response = await axios.get('/api/tasks');
console.log(response.data);
```

---

## Postman

Postman es una herramienta para probar APIs REST sin necesidad de usar el frontend de la aplicación.

Permite enviar peticiones HTTP manualmente a un servidor y ver:

- Respuestas JSON
- Códigos HTTP
- Headers
- Tiempos de respuesta
- Errores del backend

### ¿Para qué se usa?

Se utiliza para:

- Probar endpoints antes de conectar el frontend
- Verificar errores HTTP
- Probar APIs rápidamente
- Documentar colecciones de peticiones
- Trabajar con variables de entorno y tests básicos de endpoints
- Simular clientes reales

Por ejemplo, permite comprobar si un endpoint `POST /tasks` devuelve correctamente un `201 Created` o un `400 Bad Request`.

---

## Sentry

Sentry es una plataforma de monitorización y seguimiento de errores para aplicaciones frontend y backend.

Captura automáticamente excepciones y errores que ocurren en producción, y los muestra en un panel de control.

Puede detectar:

- Errores JavaScript
- Fallos en APIs
- Excepciones de Node.js
- Problemas de rendimiento
- Errores de React, Express, Vue, etc.

### ¿Para qué se usa?

Se utiliza para detectar errores reales de usuarios sin depender solo de `console.log()`.

Por ejemplo, permite:

- Saber que un usuario sufrió un error
- Ver la línea exacta donde ocurrió
- Analizar trazas completas (stack traces)
- Revisar contexto del error (ruta, request, usuario)
- Detectar errores frecuentes en producción

Esto facilita el mantenimiento y la depuración de aplicaciones en producción.

---

## Swagger

Swagger es un conjunto de herramientas para documentar y probar APIs REST de forma visual e interactiva.

Actualmente, Swagger se basa en el estándar OpenAPI.
OpenAPI define la especificación, y Swagger UI permite visualizarla y probar endpoints desde una interfaz web.

Permite generar documentación navegable de una API de forma automática.

Incluye:

- Lista de endpoints
- Métodos HTTP
- Parámetros esperados
- Ejemplos JSON
- Respuestas posibles
- Códigos HTTP

### ¿Para qué se usa?

- Documentar APIs profesionalmente
- Facilitar el trabajo entre frontend y backend
- Permitir pruebas rápidas desde navegador
- Estandarizar contratos de API

Con Swagger, cualquier desarrollador puede entender y probar una API sin leer directamente el código del servidor.

---

En conjunto: Axios se usa para consumir APIs, Postman para probarlas, Swagger para documentarlas y Sentry para monitorear errores en producción.
