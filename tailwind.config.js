
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // activa modo oscuro con clase 'dark'
  content: [
    "./*.html",       // todos tus HTML
    "./js/**/*.js"    // tus JS
  ],
  theme: {
    extend: {},       // aquí puedes añadir colores/fuentes si quieres
  },
  plugins: [],
}