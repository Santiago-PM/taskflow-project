const API_URL = 'http://localhost:3000/api/v1/tasks';

async function cargarTareas() {
  const res = await fetch('http://localhost:3000/api/v1/tasks');
  const tasks = await res.json();

  console.log("Tareas cargadas:", tasks);
}

async function crearTareaBackend(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  const data = await res.json();
  console.log("CREADA:", data);
}

async function borrarTareaBackend(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  console.log("BORRADA:", id);
}

(() => {
  // Claves de persistencia en localStorage
  const STORAGE_TASKS_KEY = "tareas";
  const STORAGE_DARKMODE_KEY = "darkMode";

  /**
   * @typedef {Object} Tarea
   * @property {string} id
   * @property {string} texto
   * @property {string} categoria
   * @property {string} prioridad
   * @property {boolean} completada
   * @property {number} createdAt
   */

  /** Estado en memoria de todas las tareas */
  /** @type {Tarea[]} */
  let tareas = cargarTareas();

  // Referencias a elementos del DOM
  const formulario = document.getElementById("formularioTareas");
  const inputTarea = document.getElementById("inputTarea");
  const selectCategoria = document.getElementById("categoria");
  const selectPrioridad = document.getElementById("prioridad");
  const listaTareas = document.getElementById("listaTareas");
  const botonModoOscuro = document.getElementById("botonModoOscuro");
  const errorFormulario = document.getElementById("errorFormulario");

  // Filtros de la UI
  const checkboxes = document.querySelectorAll(".filtros input[type='checkbox']");
  const inputBusqueda = document.getElementById("busquedaTarea");

  // Render inicial 
  renderLista();
  aplicarFiltros();
  sincronizarModoOscuroUI();

  /**
   * Maneja el alta de una nueva tarea desde el formulario principal
   */
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarError();

    const texto = inputTarea.value.trim();
    const categoria = selectCategoria.value;
    const prioridad = selectPrioridad.value;

    const validacion = validarTarea(texto, categoria, prioridad);
    if (!validacion.ok) {
      mostrarError(validacion.msg);
      return;
    }

    /** @type {Tarea} */
    const tarea = {
      id: generarId(),
      texto,
      categoria,
      prioridad,
      completada: false,
      createdAt: Date.now(),
    };

    tareas.push(tarea);
    guardarTareas();
    renderLista();
    aplicarFiltros();
    inputTarea.value = "";
    inputTarea.focus();
  });

  /**
   * Maneja la eliminación de tareas mediante delegación de eventos
   */
  listaTareas.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-action='delete']");
    if (!boton) return;

    const id = boton.dataset.taskId;
    tareas = tareas.filter(t => t.id !== id);

    guardarTareas();
    renderLista();
    aplicarFiltros();
  });

  /**
   * Recalcula visibilidad de tareas cuando cambian filtros/entrada de búsqueda
   */
  checkboxes.forEach(cb => cb.addEventListener("change", aplicarFiltros));
  inputBusqueda.addEventListener("input", aplicarFiltros);

  /**
   * Alterna el modo oscuro y persiste la preferencia del usuario
   */
  botonModoOscuro.addEventListener("click", () => {
    const esDark = document.body.classList.toggle("dark");
    aplicarModoOscuro(esDark);
  });

  // ---------------- FUNCIONES ----------------

  /**
   * Genera un ID único
   * @returns {string}
   */
  function generarId() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  /**
   * Carga tareas desde localStorage
   * @returns {Tarea[]}
   */
  function cargarTareas() {
    try {
      const raw = localStorage.getItem(STORAGE_TASKS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(t => t && typeof t === "object")
        .map(t => ({
          id: t.id || generarId(),
          texto: String(t.texto ?? ""),
          categoria: String(t.categoria ?? ""),
          prioridad: String(t.prioridad ?? ""),
          completada: Boolean(t.completada ?? false),
          createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
        }))
        .filter(t => t.texto.trim() !== "");
    } catch {
      return [];
    }
  }

  /**
   * Guarda tareas en localStorage
   * @returns {boolean} true si se guardó correctamente; false si ocurrió un error
   */
  function guardarTareas() {
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tareas));
      return true;
    } catch {
      mostrarError("No se pudieron guardar los cambios. Revisa el almacenamiento del navegador.");
      return false;
    }
  }

  /**
   * Aplica el modo oscuro
   * @param {boolean} esDark
   */
  function aplicarModoOscuro(esDark) {
    document.body.classList.toggle("bg-gray-800", esDark);
    document.body.classList.toggle("bg-amber-100", !esDark);

    botonModoOscuro.setAttribute("aria-pressed", esDark);
    botonModoOscuro.textContent = esDark ? "Modo Claro" : "Modo Oscuro";

    localStorage.setItem(STORAGE_DARKMODE_KEY, String(esDark));
  }

  /**
   * Renderiza la lista de tareas
   */
  function renderLista() {
    listaTareas.innerHTML = "";

    if (!tareas.length) {
      return listaTareas.appendChild(crearNodoInfo("No hay tareas todavía."));
    }

    tareas.forEach(t => listaTareas.appendChild(crearNodoTarea(t)));
  }

  /**
   * Nodo informativo (cuando no hay tareas)
   * @param {string} texto
   * @returns {HTMLElement}
   */
  function crearNodoInfo(texto) {
    const div = document.createElement("div");
    div.className = "p-4 my-1 bg-gray-200 text-gray-700 rounded-xl shadow-sm dark:bg-gray-600 dark:text-gray-200";
    div.textContent = texto;
    return div;
  }

  /**
   * Crea un nodo de tarea completo
   * @param {Tarea} tarea
   * @returns {HTMLElement}
   */
  function crearNodoTarea(tarea) {
    const div = crearElemento("div", ["tarea", "flex", "flex-col", "md:flex-row", "md:items-center", "md:justify-between", "gap-2", "p-4", "my-1", "mr-1", "bg-gray-300", "hover:bg-white", "shadow-md", "rounded-xl", "hover:scale-[1.01]", "transition", "dark:bg-gray-600", "dark:hover:bg-gray-400", "dark:text-white"]);

    div.dataset.completada = tarea.completada;
    div.dataset.categoria = tarea.categoria;
    div.dataset.prioridad = tarea.prioridad;
    div.dataset.texto = tarea.texto.toLowerCase();

    const spanTexto = crearSpan(tarea.texto, tarea.completada);
    const spanCategoria = crearEtiqueta(tarea.categoria);
    const spanPrioridad = crearEtiqueta(tarea.prioridad);
    const checkbox = crearCheckbox(tarea, div, spanTexto);

    const contenedor = crearElemento("div", ["flex", "items-center", "gap-2", "flex-1","mr-2"], [checkbox, spanTexto]);

    const botonEditar = crearBotonEditar(tarea, contenedor, spanTexto, div);
    const botonEliminar = crearBotonEliminar(tarea.id);

    div.append(contenedor, spanCategoria, spanPrioridad, botonEditar, botonEliminar);
    return div;
  }

  /**
   * Helper para crear elementos HTML
   * @param {string} tag
   * @param {string[]} clases
   * @param {HTMLElement[]} hijos
   * @param {string} texto
   * @returns {HTMLElement}
   */
  function crearElemento(tag, clases = [], hijos = [], texto = "") {
    const el = document.createElement(tag);
    el.classList.add(...clases);
    if (texto) el.textContent = texto;
    hijos.forEach(h => el.appendChild(h));
    return el;
  }

  /**
   * Crea el span del texto de la tarea
   * @param {string} texto
   * @param {boolean} completada
   * @returns {HTMLSpanElement}
   */
  function crearSpan(texto, completada = false) {
    const span = document.createElement("span");
    span.textContent = texto;
    span.className = "flex-1 max-w-full";
    span.classList.add(texto.length > 100 ? "break-all" : "break-words");
    if (completada) span.classList.add("line-through", "opacity-50");
    return span;
  }

  /**
   * Crea etiqueta visual (categoría/prioridad)
   * @param {string} texto
   * @returns {HTMLElement}
   */
  function crearEtiqueta(texto) {
    return crearElemento("span", ["font-bold", "flex", "items-center", "justify-center", "bg-gray-500", "text-white", "px-2", "py-1", "rounded-full", "ring-2", "ring-gray-800", "dark:ring-gray-950", "dark:bg-gray-300", "dark:text-gray-950"], [], texto);
  }

  /**
   * Crea checkbox de completado
   * @param {Tarea} tarea
   * @param {HTMLElement} div
   * @param {HTMLElement} span
   * @returns {HTMLInputElement}
   */
  function crearCheckbox(tarea, div, span) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;

    checkbox.addEventListener("change", () => {
      tarea.completada = checkbox.checked;
      div.dataset.completada = tarea.completada;

      span.classList.toggle("line-through", tarea.completada);
      span.classList.toggle("opacity-50", tarea.completada);

      guardarTareas();
      aplicarFiltros();
    });

    return checkbox;
  }

  /**
   * Crea botón eliminar
   * @param {string} id
   * @returns {HTMLButtonElement}
   */
  function crearBotonEliminar(id) {
    return crearBoton("Eliminar", "red", "delete", id);
  }

  /**
   * Crea el botón "Editar" y define el flujo de edición inline de la tarea
   * @param {Tarea} tarea
   * @param {HTMLElement} contenedor
   * @param {HTMLElement} spanTexto
   * @param {HTMLElement} divTarea
   * @returns {HTMLButtonElement}
   */
  function crearBotonEditar(tarea, contenedor, spanTexto, divTarea) {
    const boton = crearBoton("Editar", "blue");

    boton.addEventListener("click", () => {
      // Campo para editar el texto de la tarea
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = tarea.texto;
      inputEdit.className = "flex-1 px-2 py-1 rounded border border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

      // Selector para editar la categoría
      const selectCat = document.createElement("select");
      ["Trabajo", "Personal"].forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        if (op === tarea.categoria) option.selected = true;
        selectCat.appendChild(option);
      });
      selectCat.className = "px-4 py-1 rounded border border-gray-400 dark:border-gray-600 dark:bg-gray-700";

      // Selector para editar la prioridad
      const selectPri = document.createElement("select");
      ["Alta", "Baja"].forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        if (op === tarea.prioridad) option.selected = true;
        selectPri.appendChild(option);
      });
      selectPri.className = "px-4 py-1 rounded border border-gray-400 dark:border-gray-600 dark:bg-gray-700";

      // Botón para confirmar cambios
      const botonGuardar = crearBoton("Guardar", "green");

      // Se reemplazan los nodos visuales por controles de edición
      contenedor.replaceChild(inputEdit, spanTexto);
      divTarea.replaceChild(selectCat, divTarea.children[1]);
      divTarea.replaceChild(selectPri, divTarea.children[2]);
      divTarea.replaceChild(botonGuardar, boton);

      /**
       * Valida y persiste los cambios de una tarea editada
       */
      const guardarCambios = () => {
        limpiarError();
        const nuevoTexto = inputEdit.value.trim();
        const nuevaCategoria = selectCat.value;
        const nuevaPrioridad = selectPri.value;

        const validacion = validarTarea(nuevoTexto, nuevaCategoria, nuevaPrioridad, tarea.id);
        if (!validacion.ok) {
          mostrarError(validacion.msg);
          inputEdit.focus();
          return;
        }

        tarea.texto = nuevoTexto;
        tarea.categoria = nuevaCategoria;
        tarea.prioridad = nuevaPrioridad;

        // Se restaura la vista normal con los nuevos valores
        spanTexto.textContent = nuevoTexto;
        contenedor.replaceChild(spanTexto, inputEdit);
        divTarea.replaceChild(crearEtiqueta(nuevaCategoria), selectCat);
        divTarea.replaceChild(crearEtiqueta(nuevaPrioridad), selectPri);

        // Se sincronizan datasets para búsqueda y filtros
        divTarea.dataset.texto = nuevoTexto.toLowerCase();
        divTarea.dataset.categoria = nuevaCategoria;
        divTarea.dataset.prioridad = nuevaPrioridad;

        if (!guardarTareas()) return;
        aplicarFiltros();

        // Se restaura el botón de edición en su posición original
        divTarea.replaceChild(boton, botonGuardar);
      };

      botonGuardar.addEventListener("click", guardarCambios);

      // Enter confirma cambios
      inputEdit.addEventListener("keydown", e => {
        if (e.key === "Enter") guardarCambios();
      });

      // Escape cancela edición y restaura vista original
      inputEdit.addEventListener("keydown", e => {
        if (e.key === "Escape") {
          contenedor.replaceChild(spanTexto, inputEdit);
          divTarea.replaceChild(crearEtiqueta(tarea.categoria), selectCat);
          divTarea.replaceChild(crearEtiqueta(tarea.prioridad), selectPri);
          divTarea.replaceChild(boton, botonGuardar);
        }
      });

      inputEdit.focus();
    });

    return boton;
  }

  /**
   * Crea un botón reutilizable
   * @param {string} texto
   * @param {string} color
   * @param {string} [action]
   * @param {string} [taskId]
   * @returns {HTMLButtonElement}
   */
  function crearBoton(texto, color, action = "", taskId = "") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = texto;
    const baseClass = "text-white px-3 py-1 rounded-full focus:ring-2 hover:ring-2 hover:ring-gray-950 hover:scale-[1.05] transition shadow-sm";
    const colorClasses = {
      blue: "bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700",
      red: "bg-red-700 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700",
      green: "bg-green-700 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700",
    };

    btn.className = `${baseClass} ${colorClasses[color] ?? colorClasses.blue}`;

    if (action) btn.setAttribute("data-action", action);
    if (taskId) btn.setAttribute("data-task-id", taskId);

    return btn;
  }

  /**
   * Aplica filtros de búsqueda y checkboxes
   */
  function aplicarFiltros() {
    const filtrosCategoria = [];
    const filtrosPrioridad = [];
    const filtrosCompletada = [];

    checkboxes.forEach(cb => {
      if (!cb.checked) return;

      if (["Trabajo", "Personal"].includes(cb.value)) filtrosCategoria.push(cb.value);
      if (["Alta", "Baja"].includes(cb.value)) filtrosPrioridad.push(cb.value);
      if (["Completado", "NoCompletado"].includes(cb.value)) filtrosCompletada.push(cb.value);
    });

    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

    document.querySelectorAll("#listaTareas .tarea").forEach(div => {
      const categoria = div.dataset.categoria ?? "";
      const prioridad = div.dataset.prioridad ?? "";
      const texto = div.dataset.texto ?? "";
      const completada = div.dataset.completada === "true";

      const coincideEstado =
        filtrosCompletada.length === 0 ||
        (completada && filtrosCompletada.includes("Completado")) ||
        (!completada && filtrosCompletada.includes("NoCompletado"));

      div.style.display =
        (filtrosCategoria.includes(categoria) || filtrosCategoria.length === 0) &&
        (filtrosPrioridad.includes(prioridad) || filtrosPrioridad.length === 0) &&
        texto.includes(textoBusqueda) &&
        coincideEstado
          ? "flex"
          : "none";
    });
  }

  /**
   * Sincroniza el estado del modo oscuro al cargar la app
   */
  function sincronizarModoOscuroUI() {
    const esDark = localStorage.getItem(STORAGE_DARKMODE_KEY) === "true";
    if (esDark) document.body.classList.add("dark");
    aplicarModoOscuro(esDark);
  }

  /**
   * Muestra un error de validación/guardado sin usar alert
   * @param {string} mensaje
   */
  function mostrarError(mensaje) {
    if (!errorFormulario) return;
    errorFormulario.textContent = mensaje;
    errorFormulario.classList.remove("hidden");
    errorFormulario.setAttribute("role", "alert");
    errorFormulario.setAttribute("aria-live", "polite");
  }

  /**
   * Limpia el mensaje de error del formulario
   */
  function limpiarError() {
    if (!errorFormulario) return;
    errorFormulario.textContent = "";
    errorFormulario.classList.add("hidden");
  }

  /**
   * Valida los datos de una tarea antes de crearla
   * @param {string} texto
   * @param {string} categoria
   * @param {string} prioridad
   * @param {string} [idActual]
   * @returns {{ok:boolean, msg?:string}}
   */
  function validarTarea(texto, categoria, prioridad, idActual = "") {
    if (!texto) return { ok: false, msg: "El texto no puede estar vacío" };
    if (texto.length > 100) return { ok: false, msg: "El texto no puede superar 100 caracteres" };
    if (!/^[\w\sáéíóúüñ.,!?()-]+$/.test(texto)) return { ok: false, msg: "Texto contiene caracteres no permitidos" };
    if (tareas.some(t => t.id !== idActual && t.texto.toLowerCase() === texto.toLowerCase())) {
      return { ok: false, msg: "Ya existe una tarea con ese texto" };
    }
    if (!["Trabajo","Personal"].includes(categoria)) return { ok: false, msg: "Categoría inválida" };
    if (!["Alta","Baja"].includes(prioridad)) return { ok: false, msg: "Prioridad inválida" };
    return { ok: true };
  }
})();