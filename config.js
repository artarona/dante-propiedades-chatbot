// config.js - Configuración centralizada del sistema unificado
const CONFIG = {
    // Clave secreta para el panel de administración
    // IMPORTANTE: Cambia esto por una cadena de texto larga y aleatoria
    ADMIN_SECRET_KEY: "artarona",

    // Información del proyecto
    PROYECTO: {
        nombre: "Dante Propiedades Chatbot",
        version: "2.0",
        url: "https://artarona.github.io/dante-propiedades-chatbot/",
        repositorio: "https://github.com/artarona/dante-propiedades-chatbot"
    },
    // ... (resto de la configuración sin cambios)
};

// Asegúrate de que CONFIG esté disponible para otros módulos de Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}