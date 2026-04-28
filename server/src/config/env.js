// Carga y valida variables de entorno necesarias para ejecutar el servidor.
require('dotenv').config(); // Lee el archivo .env y vuelca sus variables en process.env.

// Expone la configuración validada para el resto de módulos.
module.exports = { // Exporta un objeto con los valores de configuración.
  port: process.env.PORT || 3000 // Publica el puerto obtenido desde las variables de entorno o usa 3000 por defecto.
};