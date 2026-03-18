(() => {
  const STORAGE_TASKS_KEY = "tareas";
  const STORAGE_DARKMODE_KEY = "darkMode";

  /** @type {Array<{id:string,texto:string,categoria:string,prioridad:string,completada:boolean,createdAt:number}>} */
  let tareas = cargarTareas();

  const formulario = document.getElementById("formularioTareas");
  const input = document.getElementById("inputTarea");
  const selectCategoria = document.getElementById("categoria");
  const selectPrioridad = document.getElementById("prioridad");
  const listaTareas = document.getElementById("listaTareas");
  const toggleDark = document.getElementById("toggleDark");

  const checkboxes = document.querySelectorAll(".filtros input[type='checkbox']");
  const inputBusqueda = document.getElementById("busquedaTarea");

  renderLista();
  aplicarFiltros();
  sincronizarModoOscuroUI();

  // --- Añadir tarea ---
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const texto = input.value.trim();
    if (texto === "") return;

    const tarea = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      texto,
      categoria: selectCategoria.value,
      prioridad: selectPrioridad.value,
      completada: false,
      createdAt: Date.now(),
    };

    tareas.push(tarea);
    guardarTareas();
    renderLista();
    aplicarFiltros();
    input.value = "";
  });

  // --- Eliminar tarea ---
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

  // --- Filtros ---
  checkboxes.forEach((cb) => cb.addEventListener("change", aplicarFiltros));
  inputBusqueda.addEventListener("input", aplicarFiltros);

  // Modo oscuro
  toggleDark.addEventListener("click", () => {
    const esDark = document.body.classList.toggle("dark");

    if (esDark) {
      document.body.classList.remove("bg-amber-100");
      document.body.classList.add("bg-gray-800");
    } else {
      document.body.classList.remove("bg-gray-800");
      document.body.classList.add("bg-amber-100");
    }

    localStorage.setItem(STORAGE_DARKMODE_KEY, String(esDark));
    toggleDark.setAttribute("aria-pressed", String(esDark));
    toggleDark.textContent = esDark ? "Modo Claro" : "Modo Oscuro";
  });


  // --- Funciones ---
  function cargarTareas() {
    const raw = localStorage.getItem(STORAGE_TASKS_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((t) => t && typeof t === "object")
        .map((t) => ({
          id: typeof t.id === "string" && t.id ? t.id : crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          texto: String(t.texto ?? ""),
          categoria: String(t.categoria ?? ""),
          prioridad: String(t.prioridad ?? ""),
          completada: Boolean(t.completada ?? false),
          createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
        }))
        .filter((t) => t.texto.trim() !== "");
    } catch {
      return [];
    }
  }

  function guardarTareas() {
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tareas));
  }

  function renderLista() {
    listaTareas.innerHTML = "";

    if (tareas.length === 0) {
      const empty = document.createElement("div");
      empty.className = "p-4 my-1 bg-gray-200 text-gray-700 rounded-xl shadow-sm dark:bg-gray-600 dark:text-gray-200";
      empty.textContent = "No hay tareas todavía.";
      listaTareas.appendChild(empty);
      return;
    }

    tareas.forEach((t) => listaTareas.appendChild(crearNodoTarea(t)));
  }

  function crearNodoTarea(tarea) {
    const divTarea = document.createElement("div");
    divTarea.className = "tarea flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 my-1 mr-1 bg-gray-300 hover:bg-white shadow-md rounded-xl hover:scale-[1.01] transition dark:bg-gray-600 dark:hover:bg-gray-400 dark:text-white";

    divTarea.dataset.completada = tarea.completada;
    divTarea.dataset.categoria = tarea.categoria;
    divTarea.dataset.prioridad = tarea.prioridad;
    divTarea.dataset.texto = tarea.texto.toLowerCase();

    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea.texto;
    spanTexto.className = "flex-1 max-w-full";
    spanTexto.classList.add(tarea.texto.length > 100 ? "break-all" : "break-words");
    if (tarea.completada) spanTexto.classList.add("line-through", "opacity-50");

    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = tarea.categoria;
    spanCategoria.className ="font-bold flex items-center justify-center bg-gray-500 text-white px-2 py-1 rounded-full ring-2 ring-gray-800 dark:ring-gray-950 dark:bg-gray-300 dark:text-gray-950";

    const spanPrioridad = document.createElement("span");
    spanPrioridad.textContent = tarea.prioridad;
    spanPrioridad.className ="font-bold flex items-center justify-center bg-gray-500 text-white px-2 py-1 rounded-full ring-2 ring-gray-800 dark:ring-gray-950 dark:bg-gray-300 dark:text-gray-950";

      
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className ="bg-red-700 text-white px-3 py-1 rounded-full hover:bg-red-500 focus:ring-2 hover:ring-2 hover:ring-gray-950 hover:scale-[1.05] transition shadow-sm dark:bg-red-600 dark:hover:bg-red-700";
    botonEliminar.setAttribute("aria-label", `Eliminar tarea: ${tarea.texto}`);
    botonEliminar.setAttribute("data-action", "delete");
    botonEliminar.setAttribute("data-task-id", tarea.id);

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.className = "bg-blue-700 text-white px-3 py-1 rounded-full hover:bg-blue-500 focus:ring-2 hover:ring-2 hover:ring-gray-950 hover:scale-[1.05] transition shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700";

    // --- Función de edición ---
    botonEditar.addEventListener("click", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = tarea.texto;
      inputEdit.className = "flex-1 px-2 py-1 rounded border border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
    
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar";
    botonGuardar.className = "bg-green-700 text-white px-3 py-1 rounded-full hover:bg-green-500 transition shadow-sm dark:bg-green-600 dark:hover:bg-green-700";

    // Reemplaza el spanTexto por el input
    contenedor.replaceChild(inputEdit, spanTexto);
    divTarea.appendChild(botonGuardar);

    botonGuardar.addEventListener("click", () => {
      const nuevoTexto = inputEdit.value.trim();
      if (nuevoTexto === "") return;
      tarea.texto = nuevoTexto;
      spanTexto.textContent = nuevoTexto;
      contenedor.replaceChild(spanTexto, inputEdit);
      divTarea.removeChild(botonGuardar);
      divTarea.dataset.texto = nuevoTexto.toLowerCase();
      guardarTareas();
      aplicarFiltros();
    });
  });

    // --- Checkbox completada ---
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;
    checkbox.addEventListener("change", () => {
      tarea.completada = checkbox.checked;
      divTarea.dataset.completada = tarea.completada;
      spanTexto.classList.toggle("line-through", tarea.completada);
      spanTexto.classList.toggle("opacity-50", tarea.completada);
      guardarTareas();
      aplicarFiltros();
    });

    const contenedor = document.createElement("div");
    contenedor.className = "flex items-center gap-2 flex-1";
    contenedor.appendChild(checkbox);
    contenedor.appendChild(spanTexto);

    divTarea.appendChild(contenedor);
    divTarea.appendChild(spanCategoria);
    divTarea.appendChild(spanPrioridad);
    divTarea.appendChild(botonEditar)    
    divTarea.appendChild(botonEliminar);

    return divTarea;
  }

  function aplicarFiltros() {
    const filtrosCategoria = [];
    const filtrosPrioridad = [];
    const filtrosCompletada = [];

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      if (cb.value === "Trabajo" || cb.value === "Personal") filtrosCategoria.push(cb.value);
      if (cb.value === "Alta" || cb.value === "Baja") filtrosPrioridad.push(cb.value);
      if (cb.value === "Completado" || cb.value === "NoCompletado") filtrosCompletada.push(cb.value);
    });

    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();
    const divsTareas = document.querySelectorAll("#listaTareas .tarea");

    divsTareas.forEach((div) => {
      const categoria = div.dataset.categoria ?? "";
      const prioridad = div.dataset.prioridad ?? "";
      const texto = div.dataset.texto ?? "";
      const completada = div.dataset.completada === "true";

      let coincideEstado = true;
      if (filtrosCompletada.length > 0) {
        if (completada && !filtrosCompletada.includes("Completado")) coincideEstado = false;
        if (!completada && !filtrosCompletada.includes("NoCompletado")) coincideEstado = false;
      }

      const coincideCategoria = filtrosCategoria.length === 0 || filtrosCategoria.includes(categoria);
      const coincidePrioridad = filtrosPrioridad.length === 0 || filtrosPrioridad.includes(prioridad);
      const coincideTexto = texto.includes(textoBusqueda);

      div.style.display = coincideCategoria && coincidePrioridad && coincideTexto && coincideEstado ? "flex" : "none";
    });
  }

  function sincronizarModoOscuroUI() {
    const esDark = localStorage.getItem(STORAGE_DARKMODE_KEY) === "true";

    if (esDark) {
      document.body.classList.add("dark");
      document.body.classList.remove("bg-amber-100");
      document.body.classList.add("bg-gray-800");
    }

    toggleDark.setAttribute("aria-pressed", String(esDark));
    toggleDark.textContent = esDark ? "Modo Claro" : "Modo Oscuro";
  }
})();