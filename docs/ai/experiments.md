# Experimentos con IA en programación

## Experimento: Problemas de programación

## Problemas resueltos sin IA

### Problema 1: Palíndromo

Objetivo: Comprobar si un texto es palíndromo (se lee igual al revés).

    let textoUsuario = prompt("Introduce un texto:");

    function esPalindromo(texto) {
    let limpio = texto.toLowerCase().replaceAll(" ", "");
    let invertido = limpio.split("").reverse().join("");
    if (limpio === invertido) {
        return true;
    } else {
        return false;
    }
    }

    let resultado = esPalindromo(textoUsuario);
    alert("¿Es palíndromo? " + resultado);


### Problema 2: Contar palabras en un texto

Objetivo: Contar cuántas veces aparece cada palabra en un texto.

    let texto = "Hola mundo hola";
    let limpio = texto.toLowerCase();
    let palabras = limpio.split(" ");
    let contador = {};

    for (let palabra of palabras) {
    if (contador[palabra]) {
        contador[palabra] += 1;
    } else {
        contador[palabra] = 1;
    }
    }

    console.log(contador); // { hola: 2, mundo: 1 }


### Problema 3: Clase Usuario

Objetivo: Crear una clase Usuario con nombre y email, y un método para validar el email.

class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }

  validarEmail() {
    return this.email.includes("@");
  }
}

// Prueba
let u = new Usuario("Juan", "juan@email.com");
console.log(u.validarEmail()); // true

Tiempo invertido en total: 15 minutos.


## Problemas resueltos con IA


### Problema 1: Palíndromo

    function esPalindromo(texto) {
    // Normaliza: minúsculas, sin espacios, sin tildes, sin signos
    const limpio = texto
        .toLowerCase()
        .normalize("NFD")                    // separa tildes
        .replace(/[\u0300-\u036f]/g, "")     // elimina tildes
        .replace(/[^a-z0-9]/g, "");          // deja solo letras y números
    const invertido = limpio.split("").reverse().join("");
    return limpio.length > 0 && limpio === invertido;
    }
    // Ejemplos
    console.log(esPalindromo("Anita lava la tina")); // true
    console.log(esPalindromo("Reconocer")); // true
    console.log(esPalindromo("Hola mundo")); // false


### Problema 2: Contar palabras

    function contarPalabras(texto) {
    const palabras = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")   // elimina puntuación (soporta unicode)
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    const conteo = {};
    for (const palabra of palabras) {
        conteo[palabra] = (conteo[palabra] || 0) + 1;
    }
    return conteo;
    }
    // Ejemplo
    const texto = "Hola hola, ¿cómo estás? Hola mundo. Mundo!";
    console.log(contarPalabras(texto));
    // { hola: 3, como: 1, estas: 1, mundo: 2 }


## Problema 3: Clase Usuario

    class Usuario {
    constructor(nombre, email) {
        this.nombre = nombre;
        this.email = email;
    }
    validarEmail() {
        // Validación básica y útil para la mayoría de casos
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(this.email);
    }
    toString() {
        return `${this.nombre} <${this.email}>`;
    }
    }
    // Ejemplos
    const u1 = new Usuario("Santi", "santi@email.com");
    const u2 = new Usuario("Ana", "ana@@mail");
    console.log(u1.toString(), "-> email válido:", u1.validarEmail()); // true
    console.log(u2.toString(), "-> email válido:", u2.validarEmail()); // false

Tiempo invertido en total: 2 minutos.

## Comparativa de resultados

Hay claras diferencia, las mas clara es el tiempo invertido, con la velocidad de la IA se soluciona en un momento.
La densidad de las respuestas también, mas detalladas en el caso de la IA con ademas pequeños comentarios.

