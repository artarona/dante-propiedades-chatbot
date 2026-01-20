// config.js - Configuración centralizada del sistema unificado
const CONFIG = {
    // Clave secreta para el panel de administración
    ADMIN_SECRET_KEY: "artarona",

    // Información del proyecto
    PROYECTO: {
        nombre: "Dante Propiedades Chatbot",
        version: "2.0",
        url: "https://artarona.github.io/dante-propiedades-chatbot/",
        repositorio: "https://github.com/artarona/dante-propiedades-chatbot"
    },

    // Mensajes del sistema
    MENSAJES: {
        BIENVENIDA: "¡Hola! Soy el asistente inmobiliario de Dante Propiedades. 😊",
        INSTRUCCIONES: "Decime qué operación necesitás:\nEscribí el número de tu opción",
        ERROR_CARGA: "Error cargando las propiedades. Por favor, recarga la página.",
        INGRESO_VALOR: "Escribí lo que buscás:",
        SIN_RESULTADOS: "No se encontraron propiedades que coincidan con tu búsqueda.",
        RESULTADOS: "Encontré {count} propiedades para vos:",
        TIPO_PROPIEDAD: "🏠 ¿Qué tipo de propiedad te interesa?",
        AMBIENTES: "🛏️ ¿Cuántos ambientes necesitás?",
        BARRIO: "📍 ¿En qué zona buscás?",
        PRECIO: "💰 ¿Qué rango de precio tenés en mente?",
        CONTACTO: "📞 Dejanos tus datos (Nombre - Teléfono - Email) para contactarte:"
    },

    // Opciones del menú principal
    OPCIONES_PRINCIPALES: {
        "1": { texto: "Venta", icon: "💰", filtro: "operacion" },
        "2": { texto: "Alquiler", icon: "🔑", filtro: "operacion" },
        "3": { texto: "Búsqueda por zona", icon: "📍", filtro: "barrio" },
        "4": { texto: "Búsqueda libre", icon: "🔍", filtro: "libre" },
        "5": { texto: "Ver todas", icon: "📋", filtro: "todas" },
        "6": { texto: "Información", icon: "ℹ️", filtro: "info" }
    },

    // Configuración de la interfaz
    UI: {
        timing: {
            delayMensaje: 500,
            animacionEntrada: 0.3
        }
    }
};

// Asegúrate de que CONFIG esté disponible para otros módulos de Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}