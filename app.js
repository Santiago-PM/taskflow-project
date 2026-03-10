
console.log("JS cargado");

let tareas = JSON.parse(localStorage.getItem("tareas")) || []; // convierte las tareas guardadas (que están como texto) a un array de objetos y asegura que si no hay nada guardado empieza vacio

const formulario = document.getElementById("formularioTareas");
const input = document.getElementById("inputTarea");
const selectCategoria = document.getElementById("categoria");
const selectPrioridad = document.getElementById("prioridad");
const listaTareas = document.getElementById("listaTareas");

// Crear tarea
function mostrarTarea(tarea) {
    const divTarea = document.createElement("div");
    divTarea.className = "tarea flex flex-col md:flex-row md:items-center md:gap-16 gap-2 p-4 my-1 mr-1 bg-gray-300 hover:bg-white shadow-md rounded-xl hover:scale-[1.01] transition";
    // crear spans internos
    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea.texto;
    spanTexto.className = "flex-1";

    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = tarea.categoria;
    spanCategoria.className = "font-bold bg-gray-500 text-white px-2 py-1 rounded-full"

    const spanPrioridad = document.createElement("span");
    spanPrioridad.textContent = tarea.prioridad;
    spanPrioridad.className = "font-bold bg-gray-500 text-white px-2 py-1 rounded-full"

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "bg-red-700 text-white px-3 py-1 rounded-full hover:bg-red-500 transition-colors shadow-sm";

    botonEliminar.addEventListener("click", function() {
        divTarea.remove(); // eliminar del array y actualizar localStorage
        tareas = tareas.filter(t => t !== tarea);
        localStorage.setItem("tareas", JSON.stringify(tareas));
        console.log("Tarea eliminada de la interfaz");
    });


    // añadir spans al div
    divTarea.appendChild(spanTexto);
    divTarea.appendChild(spanCategoria);
    divTarea.appendChild(spanPrioridad);
    divTarea.appendChild(botonEliminar);

    listaTareas.appendChild(divTarea); // añadir el contenedor
}

// mostrar todas las tareas guardadas al cargar la página
tareas.forEach(tarea => mostrarTarea(tarea));

console.log("Formulario:", formulario);

formulario.addEventListener("submit", function(event) {
    console.log("Evento submit detectado");
    event.preventDefault();

    const texto = input.value.trim(); // captura texto
    const categoria = selectCategoria.value; // 
    const prioridad = selectPrioridad.value; // seleccionar filtros

    if (texto === "") return; // evita tareas vacias

    const tarea = {
        texto: texto,
        categoria: categoria,
        prioridad: prioridad
    };
    // añadir tarea al array, guardar en localStorage y mostrar en el DOM
    tareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTarea(tarea);
    aplicarFiltros();

    input.value = ""; // limpia el input para la siguiente tarea

});

// seleccionar checkboxes que conincida con lo seleccionado
const checkboxes = document.querySelectorAll(".filtros input[type='checkbox']");
const inputBusqueda = document.getElementById("busquedaTarea");

// crear funcion que filtra tareas
function aplicarFiltros() {
    const filtrosCategoria = [];
    const filtrosPrioridad = [];

    // recorre todos los checkboxes y agrega su valor a uno de los arrays si está marcado.
    checkboxes.forEach(cb => {
        if (cb.checked) { // si el checkbox está marcado
            if (cb.value === "Trabajo" || cb.value === "Personal") {
                filtrosCategoria.push(cb.value); // guarda la categoría activa
            } else if (cb.value === "Alta" || cb.value === "Baja") {
                filtrosPrioridad.push(cb.value); // guarda la prioridad activa
            }
        }
    });

    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

    // recorre las tareas que hayan
    const divsTareas = document.querySelectorAll("#listaTareas .tarea");
    divsTareas.forEach(div => {
        const spans = div.querySelectorAll("span");
        const categoria = spans[1].textContent;
        const prioridad = spans[2].textContent;
        const texto = spans[0].textContent.toLowerCase();

        // comprobar si cumple filtros
        const coincideCategoria = filtrosCategoria.length === 0 || filtrosCategoria.includes(categoria); // si no hay filtros considera todo correcto
        const coincidePrioridad = filtrosPrioridad.length === 0 || filtrosPrioridad.includes(prioridad);
        const coincideTexto = texto.includes(textoBusqueda);

        // mostrar si cumple ambos, ocultar si no
        div.style.display = (coincideCategoria && coincidePrioridad && coincideTexto) ? "flex" : "none";
    });
}
checkboxes.forEach(cb => cb.addEventListener("change", aplicarFiltros));
inputBusqueda.addEventListener("input", aplicarFiltros);
