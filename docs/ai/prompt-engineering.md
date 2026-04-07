# Prompt engineering aplicado al desarrollo

Este documento resume, los prompts que mejor funcionaron durante el trabajo sobre `app.js`.  
La idea es tener una guía práctica para repetir resultados: pedir análisis de calidad, refactorizaciones seguras, documentación clara y respuestas bien estructuradas.

1. Revisión senior de `app.js` para detectar mejoras.
2. Implementación de mejoras clave: limpieza de lógica muerta, validación unificada, errores inline y manejo robusto de `localStorage`.
3. Documentación completa del código con comentarios más claros.
4. Corrección de estilos de botones con clases explícitas para evitar pérdida de color.
5. Ajustes UX de edición para que `Guardar` aparezca en la posición de `Editar` sin mover `Eliminar`.
6. Generación de explicaciones puntuales de funciones (`cargarTareas`, `validarTarea`) con formato fijo.

---

## 10 prompts útiles

### 1) Prompt de rol: revisión técnica senior
**Prompt**
```text
Actúa como un desarrollador senior experto en JavaScript y revisa el código de app.js.
Prioriza: bugs, riesgos de mantenimiento, rendimiento y UX.
Devuélvelo en una lista por severidad (alto, medio, bajo) con mejoras concretas.
```

**Por qué funciona bien**
- Define un rol experto y un objetivo claro.
- Obliga a priorizar por severidad, evitando respuestas genéricas.
- Pide recomendaciones accionables, no solo teoría.

---

### 2) Prompt de implementación concreta con restricciones
**Prompt**
```text
Implementa en app.js estas mejoras exactas:
1) eliminar lógica muerta en renderLista()
2) unificar validación para crear/editar
3) reemplazar alert() por error inline
4) agregar manejo de errores en guardarTareas()

Restricciones:
- no cambies comportamiento fuera de esos puntos
- mantén los nombres actuales de funciones
- explica al final qué cambiaste
```

**Por qué funciona bien**
- Reduce ambigüedad: qué tocar y qué no tocar.
- Evita refactors innecesarios.
- Pide resumen final para validar alcance.

---

### 3) Prompt few-shot para documentar funciones con JSDoc
**Prompt**
```text
Documenta las funciones con este estilo.

Ejemplo:
Input:
function limpiarError() {
  if (!errorFormulario) return;
  errorFormulario.textContent = "";
  errorFormulario.classList.add("hidden");
}

Output:
/**
 * Limpia el mensaje de error del formulario
 */
function limpiarError() {
  if (!errorFormulario) return;
  errorFormulario.textContent = "";
  errorFormulario.classList.add("hidden");
}

Ahora aplica el mismo estilo a todo app.js.
```

**Por qué funciona bien**
- El ejemplo reduce interpretación del formato.
- “Input/Output” deja clara la transformación esperada.
- Aumenta consistencia de comentarios en todo el archivo.

---

### 4) Prompt few-shot para comentarios línea por línea
**Prompt**
```text
Explica el código línea por línea con comentarios al final de cada línea, como en el ejemplo.

Ejemplo:
Input:
if (!errorFormulario) return;

Output:
if (!errorFormulario) return; // Sale si no existe el contenedor de error

Hazlo para este bloque:
[pegar bloque]
```

**Por qué funciona bien**
- Few-shot enseña estilo exacto de anotación.
- Limitar a “este bloque” evita respuestas gigantes y difusas.

---

### 5) Prompt de razonamiento paso a paso (análisis profundo)
**Prompt**
```text
Analiza este código paso a paso como desarrollador senior:
1. Qué hace cada línea
2. Flujo de ejecución
3. Comportamiento ante interacción de usuario
4. Posibles mejoras

Código:
[pegar función]
```

**Por qué funciona bien**
- Divide el análisis en capas lógicas.
- Obliga a explicar comportamiento, no solo sintaxis.
- Facilita entender impacto real en UX.

---

### 6) Prompt de formato estricto de respuesta
**Prompt**
```text
Explícame validarTarea() con este formato exacto:
- Qué hace
- Entradas
- Salidas

No agregues secciones extra.
```

**Por qué funciona bien**
- Impone estructura fija y fácil de escanear.
- Reduce ruido y respuestas largas innecesarias.

---

### 7) Prompt para diagnosticar regresión visual/UI
**Prompt**
```text
Tengo una regresión UI: los botones Editar/Guardar/Eliminar perdieron color.
Busca la causa probable en app.js y propón fix mínimo.
Luego implementa solo el cambio necesario.
```

**Por qué funciona bien**
- Expone síntoma + contexto de archivo.
- Pide “fix mínimo”, lo que evita sobrecambios.
- Ideal para bugs rápidos de frontend.

---

### 8) Prompt para UX de interacción específica
**Prompt**
```text
Quiero este comportamiento exacto:
al pulsar Editar, Guardar debe aparecer en la misma posición de Editar
y Eliminar no debe desplazarse.
Implementa el ajuste en crearBotonEditar() sin reescribir toda la función.
```

**Por qué funciona bien**
- Describe el comportamiento observable esperado.
- Acota el punto de cambio (`crearBotonEditar`).
- Evita refactor total en una mejora puntual.

---

### 9) Prompt para revisión de calidad de prompt (meta-prompt)
**Prompt**
```text
Evalúa este prompt y mejóralo:
[pegar prompt]

Devuélveme:
1) versión optimizada
2) por qué mejora
3) una variante corta y una detallada
```

**Por qué funciona bien**
- Ayuda a iterar prompts de forma sistemática.
- Produce plantillas reutilizables para futuras tareas.

---

### 10) Prompt para cierre de tarea con criterios de aceptación
**Prompt**
```text
Después de implementar cambios, responde con:
1) qué se cambió
2) qué no se cambió
3) riesgos residuales
4) cómo verificar manualmente en 3 pasos

Sé breve y concreto.
```

**Por qué funciona bien**
- Fuerza un cierre profesional de la tarea.
- Incluye alcance, límites y plan de verificación.
- Reduce malentendidos antes de commit/push.

---

## Patrones que mejor funcionaron

- Definir **rol + objetivo + formato de salida** en el mismo prompt.
- Incluir **restricciones explícitas** (qué no tocar).
- Usar **few-shot** cuando quiero estilo exacto de respuesta.
- Pedir **paso a paso** para análisis profundo.
- Cerrar con **criterios de verificación** para validar resultados.

## Plantilla reutilizable (rápida)

```text
Actúa como [rol].
Objetivo: [resultado concreto].
Contexto: [archivo/módulo/problema].
Haz:
1) [tarea 1]
2) [tarea 2]
Restricciones:
- [límite 1]
- [límite 2]
Formato de salida:
- [estructura exacta]
```