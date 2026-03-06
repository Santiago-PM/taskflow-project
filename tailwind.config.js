
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // activa modo oscuro con clase 'dark'
  content: [
    "./taskflow-proyect/*.html",       // todos tus HTML
    "./taskflow-proyect/*.js"    // tus JS
  ],
  theme: {
    extend: {},       // aquí puedes añadir colores/fuentes si quieres
  },
  plugins: [],
}