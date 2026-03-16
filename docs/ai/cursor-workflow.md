## CURSOR

**Cursor** es un **editor de texto** prácticamente idéntico a Visual Studio Code; tanto el explorador de archivos, la interfaz y las herramientas son iguales, pero cuenta con un **asistente con Inteligencia Artificial**.

Su interfaz, si ya has utilizado Visual Studio Code, es la misma: simple y clara, con chat del asistente al lado derecho o izquierdo, a preferencia del usuario.

Lo importante, lo que cabe destacar en diferencia con Visual Studio Code, son sus funciones con el asistente con IA.

### EXPERIENCIA Y FUNCIONES

Para empezar, podemos hablar del autocompletado, una maravilla para ser rápido o para cuando no recuerdas alguna palabra o parte de la sintaxis.

Otra gran función son sus sugerencias de comentarios para un bloque o pequeñas partes del código, que ayudan a recordar, ver o buscar con más facilidad qué hace cada cosa.

Con el atajo de teclado CTRL + L o en el icono, podemos abrir el chat con el asistente para hacer preguntas más extensas, como pedir la explicación de cierta línea o líneas de código, palabra por palabra o por bloques.

Con el otro atajo de teclado CTRL + K podemos pedirle generar o editar código inline.

### COMPOSER

Pero lo mejor y más impresionante es el Composer.
Tiene la capacidad de generar cambios de código en varios archivos a la vez; por ejemplo, puedes pedirle que mejore el funcionamiento o la lectura de tu JavaScript.

A continuación, unos extractos de código mejorado que hizo sobre mi JavaScript:

Sustituyó el código del botón de eliminación de tareas →

    botonEliminar.addEventListener("click", function() { ... filter(t => t !== tarea) ... })

Comentando que, si tenías dos tareas “iguales” o por referencias, podía fallar o borrar la que no correspondiese. Además, cada tarea tenía su propio addEventListener (uno por botón).

Por esto →

Ahora se hace con id único y delegación de eventos; cada botón lleva el id de su tarea:

    const tarea = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    texto,
    categoria: selectCategoria.value,
    prioridad: selectPrioridad.value,
    createdAt: Date.now(),
    };

    listaTareas.addEventListener("click", (e) => {
    const boton = e.target?.closest?.("button[data-action='delete']");
    if (!boton) return;

    const id = boton.getAttribute("data-task-id");
    if (!id) return;

    tareas = tareas.filter((t) => t.id !== id);
    guardarTareas();
    renderLista();
    aplicarFiltros();
    });

Antes, para filtrar, tú “leías” la categoría, prioridad o texto desde los <span> por posición (span 0 texto, span 1 categoría, span 2 prioridad). Eso es frágil: si cambias el orden de los spans o añades otro span, los filtros se rompen.

En tu código antiguo era esta idea:

    const spans = div.querySelectorAll("span")
    categoria = spans[1].textContent
    prioridad = spans[2].textContent
    texto = spans[0]...

Ahora lo sustituí por esto:

Cuando creo el nodo de la tarea, guardo los datos en el propio <div> como data-*:

    divTarea.dataset.categoria = tarea.categoria;
    divTarea.dataset.prioridad = tarea.prioridad;
    divTarea.dataset.texto = tarea.texto.toLowerCase();

Cuando filtro, ya no miro spans: leo esos dataset (no depende del HTML interno):

    const divsTareas = document.querySelectorAll("#listaTareas .tarea");

    divsTareas.forEach((div) => {
    const categoria = div.dataset.categoria ?? "";
    const prioridad = div.dataset.prioridad ?? "";
    const texto = div.dataset.texto ?? "";
    });

---

### CONCLUSIÓN

Es un gran editor de texto, y su añadido de asistente con IA, el cual es fácil de usar y muy eficiente, lo hace muy recomendable para facilitar la velocidad de programación y el cuidado del código.