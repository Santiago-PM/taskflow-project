(() => {
  const STORAGE_TASKS_KEY = "tareas";
  const STORAGE_DARKMODE_KEY = "darkMode";

  /** @type {Array<{id:string,texto:string,categoria:string,prioridad:string,createdAt:number}>} */
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

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const texto = input.value.trim();
    if (texto === "") return;

    const tarea = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      texto,
      categoria: selectCategoria.value,
      prioridad: selectPrioridad.value,
      createdAt: Date.now(),
    };

    tareas.push(tarea);
    guardarTareas();
    renderLista();
    aplicarFiltros();
    input.value = "";
  });

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

  checkboxes.forEach((cb) => cb.addEventListener("change", aplicarFiltros));
  inputBusqueda.addEventListener("input", aplicarFiltros);

  toggleDark.addEventListener("click", () => {
    const esDark = document.body.classList.toggle("dark");

    if (esDark) {
      document.body.classList.remove("bg-amber-100");
      document.body.classList.add("bg-gray-950");
    } else {
      document.body.classList.remove("bg-gray-950");
      document.body.classList.add("bg-amber-100");
    }

    localStorage.setItem(STORAGE_DARKMODE_KEY, String(esDark));
    toggleDark.setAttribute("aria-pressed", String(esDark));
    toggleDark.textContent = esDark ? "Modo Claro" : "Modo Oscuro";
  });

  function cargarTareas() {
    const raw = localStorage.getItem(STORAGE_TASKS_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((t) => t && typeof t === "object")
        .map((t) => ({
          id:
            typeof t.id === "string" && t.id
              ? t.id
              : crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          texto: String(t.texto ?? ""),
          categoria: String(t.categoria ?? ""),
          prioridad: String(t.prioridad ?? ""),
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
      empty.className =
        "p-4 my-1 mr-1 bg-gray-200 text-gray-700 rounded-xl shadow-sm dark:bg-gray-900 dark:text-gray-200";
      empty.textContent = "No hay tareas todavía. Añade una arriba.";
      listaTareas.appendChild(empty);
      return;
    }

    tareas.forEach((t) => listaTareas.appendChild(crearNodoTarea(t)));
  }

  function crearNodoTarea(tarea) {
    const divTarea = document.createElement("div");
    divTarea.className =
      "tarea flex flex-col md:flex-row md:items-center md:gap-16 gap-2 p-4 my-1 mr-1 bg-gray-300 hover:bg-white shadow-md rounded-xl hover:scale-[1.01] transition dark:bg-gray-800 dark:hover:bg-gray-500 dark:text-white";

    divTarea.dataset.categoria = tarea.categoria;
    divTarea.dataset.prioridad = tarea.prioridad;
    divTarea.dataset.texto = tarea.texto.toLowerCase();

    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea.texto;
    spanTexto.className = "flex-1 max-w-full";
    spanTexto.classList.add(tarea.texto.length > 100 ? "break-all" : "break-words");

    const spanCategoria = document.createElement("span");
    spanCategoria.textContent = tarea.categoria;
    spanCategoria.className =
      "font-bold bg-gray-500 text-white px-2 py-1 rounded-full dark:bg-gray-300 dark:text-gray-950";

    const spanPrioridad = document.createElement("span");
    spanPrioridad.textContent = tarea.prioridad;
    spanPrioridad.className =
      "font-bold bg-gray-500 text-white px-2 py-1 rounded-full dark:bg-gray-300 dark:text-gray-950";

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className =
      "bg-red-700 text-white px-3 py-1 rounded-full hover:bg-red-500 transition-colors shadow-sm dark:bg-red-600 dark:hover:bg-red-700";
    botonEliminar.setAttribute("aria-label", `Eliminar tarea: ${tarea.texto}`);
    botonEliminar.setAttribute("data-action", "delete");
    botonEliminar.setAttribute("data-task-id", tarea.id);

    divTarea.appendChild(spanTexto);
    divTarea.appendChild(spanCategoria);
    divTarea.appendChild(spanPrioridad);
    divTarea.appendChild(botonEliminar);

    return divTarea;
  }

  function aplicarFiltros() {
    const filtrosCategoria = [];
    const filtrosPrioridad = [];

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      if (cb.value === "Trabajo" || cb.value === "Personal") filtrosCategoria.push(cb.value);
      if (cb.value === "Alta" || cb.value === "Baja") filtrosPrioridad.push(cb.value);
    });

    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

    const divsTareas = document.querySelectorAll("#listaTareas .tarea");
    divsTareas.forEach((div) => {
      const categoria = div.dataset.categoria ?? "";
      const prioridad = div.dataset.prioridad ?? "";
      const texto = div.dataset.texto ?? "";

      const coincideCategoria = filtrosCategoria.length === 0 || filtrosCategoria.includes(categoria);
      const coincidePrioridad = filtrosPrioridad.length === 0 || filtrosPrioridad.includes(prioridad);
      const coincideTexto = texto.includes(textoBusqueda);

      div.style.display = coincideCategoria && coincidePrioridad && coincideTexto ? "flex" : "none";
    });
  }

  function sincronizarModoOscuroUI() {
    const esDark = localStorage.getItem(STORAGE_DARKMODE_KEY) === "true";

    if (esDark) {
      document.body.classList.add("dark");
      document.body.classList.remove("bg-amber-100");
      document.body.classList.add("bg-gray-950");
    }

    toggleDark.setAttribute("aria-pressed", String(esDark));
    toggleDark.textContent = esDark ? "Modo Claro" : "Modo Oscuro";
  }
})();