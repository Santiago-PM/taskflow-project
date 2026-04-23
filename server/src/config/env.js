// Carga y valida variables de entorno necesarias para ejecutar el servidor.
require('dotenv').config(); // Lee el archivo .env y vuelca sus variables en process.env.

// Verifica que exista la variable PORT antes de continuar.
if (!process.env.PORT) { // Comprueba si el puerto fue definido en el entorno.
  throw new Error('El puerto no está definido'); // Lanza un error para evitar iniciar sin puerto.
}

// Expone la configuración validada para el resto de módulos.
module.exports = { // Exporta un objeto con los valores de configuración.
  port: process.env.PORT // Publica el puerto obtenido desde las variables de entorno.
};