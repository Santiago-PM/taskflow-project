## Comparativa entre asistentes de IA

---

### En este documento se analizarán y compararan el nivel de respuesta entre ChatGPT y Claude .

La primera prueba en esta comparativa fue ver la respuesta a una pregunta sobre algo técnico:

  Dame la explicación de estos tres conceptos técnicos.
    - Closures
    - Event loop
    - DOM

El claro ganador fue ChatGPT, dando una respuesta mas profunda, con ejemplos de código y como funcionan, explicaciones sencillas de que es, como se usa, para que se usa y también que son algunas cosas del código. La unica pega es que en ciertas partes usa vocabulario técnico y podria hacerse complicado de entender en caso de no tener idea sobre el tema.
Por el otro lado, Claude dió una buena respuesta explicando cada concepto, pero para nada tan profunda y detallada como ChatGPT.

A continuación un ejemplo de la respuesta de ambos sobre Closures:

### ChatGPT:

1. Closures (Clausuras)

Un closure ocurre cuando una función recuerda el entorno léxico donde fue creada, incluso después de que la función exterior haya terminado de ejecutarse.

Es decir:

una función puede seguir accediendo a variables de su scope exterior aunque ese scope ya no esté activo en la pila de ejecución.

Ejemplo
function crearContador() {
  let contador = 0;

  return function () {
    contador++;
    return contador;
  };
}

const incrementar = crearContador();

console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(incrementar()); // 3
Qué pasa aquí

crearContador() se ejecuta.

Dentro se crea contador.

Se devuelve una función interna.

Esa función mantiene una referencia al entorno donde existe contador.

Aunque crearContador() ya terminó, contador sigue existiendo dentro del closure.

Para qué se usan

Encapsulación de datos

Factory functions

Callbacks

Hooks y programación funcional

Ejemplo típico: mantener estado privado.

### Claude

Closures
Un closure es una función que "recuerda" el entorno léxico en el que fue creada, incluso cuando se ejecuta fuera de ese ámbito.
javascriptfunction contador() {
  let count = 0; // Variable en el ámbito externo
  return function() {
    count++;
    return count;
  };
}

const incrementar = contador();
incrementar(); // 1
incrementar(); // 2 — sigue accediendo a `count`
La función interna mantiene una referencia viva a count, aunque contador() ya terminó de ejecutarse. Esto es útil para encapsular estado, crear funciones de fábrica y módulos privados.

---

La segunda prueba en esta comparativa consistió en proporcionarles tres funciones JavaScript con errores y ver si eran capaces de detectarlos y explicarlos.

  Detecta y explica los errores de las siguientes tres funciones:

    let nombre = "Ana";
    console.log("El nombre es:" nombre);

    let numeroAleatorio = Math.random();
    console.log = numeroAleatorio ;

      if hora < 18 {
      saludo = "Buenos dias";
    } else {
      saludo = "Buenas noches";
    }

En esta ocasion ambos dieron respuestas muy similares, detectaron los errores principales y dieron la explicacion pertinente, Claude añadió al final un resumen de los fallos pero ChatGPT dió un poco mas de detalle sobre como funciona la sintaxis y en el ultimo error ambos detectaron el error en la sintaxis pero añadiron que también faltan las variables correspondientes a "hora" y "saludo".
Vuelve a ganar ChatGPT pero esta vez por poco.

A continuación un ejemplo de la respuesta de ambos de la tercera función:

### ChatGPT

Bloque 3
if hour < 18 {
  greeting = "Buenos dias";
} else {
  greeting = "Buenas noches";
}
Errores:

hour no está definido

Antes de usarlo, debes definir hour. Por ejemplo:

let hour = new Date().getHours();

Sintaxis del if

En JavaScript, siempre se requieren paréntesis alrededor de la condición:

if (hour < 18) { ... }

Variable greeting no declarada

Siempre es mejor declarar con let o const:

let greeting;
Corrección completa:
let hour = new Date().getHours();
let greeting;

if (hour < 18) {
  greeting = "Buenos días";
} else {
  greeting = "Buenas noches";
}

console.log(greeting);

✅ Esto imprimirá Buenos días o Buenas noches según la hora.

### Claude

Función 3 — Dos errores en el if
javascriptif hour < 18 {      // ❌
  greeting = "Buenos dias";
} else {
  greeting = "Buenas noches";
}
Problema 1: Faltan los paréntesis obligatorios alrededor de la condición.
Problema 2: La variable greeting se usa sin haber sido declarada previamente con let, const o var.
javascript// ✅ Correcto
let hour = new Date().getHours();
let greeting;

if (hour < 18) {
  greeting = "Buenos días";
} else {
  greeting = "Buenas noches";
}

Resumen
#ErrorTipo
1 Falta , en console.logSintaxis
2 = en vez de () sobreescribe el métodoLógico
3 Faltan () en el if y variable no declaradaSintaxis + Referencia

---

La tercera y última, describirles tres funciones y generen el codigo adecuado.

  Quiero que me crees tres funciones:
  - La primera quiero que crees una funcion en la que incrementes un numero hasta que coincida con el numero 18.
  - La segunda un formulario sencillo donde los usuarios puedan guardar un pequeño texto.
  - La tercera de la posibilidad de subir una imagen y se almacene.

En esta ultima prueba las respuesta eran acordes a lo solicitado, pero uno de ellos decidio hacerlo de otra forma.
ChatGPT respondió con codigo HTML y JS ya que las preguntas anteriores iban sobre ese contexto, respuestas de codigo perfectamente ejecutables, pero por el otro lado, Claude activo un modo programación y respondio con un archivo de codigo JSX y React abriendo una ventana al lateral del chat con el formato visual del codigo, la opción de poder verlo y el enlace del archivo.

Ambos ganan dependiendo de lo que busques, en el caso de quere seguir con el contexto anterior y usar como ayuda para ahorra tiempo, ChatGPT gana, pero si lo que buscamos es un codigo sencillo y ya funcional sin tener un lenguaje en mente, Claude gana.

Ejemplos de la respuesta al incremental de 18:

### ChatGPT

1️⃣ Función que incrementa un número hasta 18
function incrementarHasta18(inicio) {
  let numero = inicio;

  while (numero < 18) {
    console.log(numero);
    numero++;
  }

  console.log("¡Llegaste a 18!");
}

// Ejemplo de uso
incrementarHasta18(10);

### Claude

function ContadorHasta18() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const TARGET = 18;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          if (prev >= TARGET) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return TARGET;
          }
          return prev + 1;
        });
      }, 120);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => { setCount(0); setRunning(false); };

  const pct = (count / TARGET) * 100;
  const done = count === TARGET;

  return (
    <div className="card card-counter">
      <p className="card-label">Función 01</p>
      <h2>Contador hasta 18</h2>

      <div className={`counter-display ${done ? "done" : ""}`}>
        {String(count).padStart(2, "0")}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <p className="counter-status">
        {done ? "🎯 ¡Objetivo alcanzado!" : `${TARGET - count} pasos para llegar a ${TARGET}`}
      </p>

      <div className="btn-row">
        <button className="btn btn-purple" onClick={() => setRunning(true)} disabled={running || done}>
          ▶ Iniciar
        </button>
        <button className="btn btn-ghost" onClick={reset} disabled={count === 0 && !running}>
          ↺ Reiniciar
        </button>
      </div>
    </div>
  );
}