
console.log("JS cargado");

const formulario = document.getElementById("formularioTareas");
const input = document.getElementById("inputTarea");
const selectCategoria = document.getElementById("categoria");
const selectPrioridad = document.getElementById("prioridad");
const listaTareas = document.getElementById("listaTareas");

console.log("Formulario:", formulario);

formulario.addEventListener("submit", function(event) {
    console.log("Evento submit detectado");
    event.preventDefault();

    const texto = input.value.trim(); // captura texto
    const categoria = selectCategoria.value; // 
    const prioridad = selectPrioridad.value; // seleccionar filtros

    if (texto === "") return; // evita tareas vacias

    // Crear tarea
    const divTarea = document.createElement("div");
    divTarea.classList.add("tarea");

    // crear spans internos
    const spanTexto = document.createElement("span");
    spanTexto.textContent = texto;

    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = categoria;

    const spanPrioridad = document.createElement("span");
    spanPrioridad.textContent = prioridad;

    // añadir spans al div
    divTarea.appendChild(spanTexto);
    divTarea.appendChild(spanCategoria);
    divTarea.appendChild(spanPrioridad);

    listaTareas.appendChild(divTarea); // añadir el contenedor

    input.value = ""; // limpia el input para la siguiente tarea

});