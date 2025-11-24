// config.js - Configuración centralizada del sistema unificado
const CONFIG = {
    // Información del proyecto
    PROYECTO: {
        nombre: "Dante Propiedades Chatbot",
        version: "2.0",
        url: "https://artarona.github.io/dante-propiedades-chatbot/",
        repositorio: "https://github.com/artarona/dante-propiedades-chatbot"
    },

    // Opciones principales numeradas
    OPCIONES_PRINCIPALES: {
        1: { texto: "🔍 Buscar por tipo de propiedad", filtro: "tipo", icon: "🏠" },
        2: { texto: "📍 Buscar por barrio", filtro: "barrio", icon: "📍" },
        3: { texto: "💵 Buscar por operación (venta/alquiler)", filtro: "operacion", icon: "💵" },
        4: { texto: "🛏️ Buscar por cantidad de ambientes", filtro: "ambientes", icon: "🛏️" },
        5: { texto: "💰 Buscar por precio máximo", filtro: "precio", icon: "💰" },
        6: { texto: "🔎 Búsqueda libre por palabras clave", filtro: "libre", icon: "🔎" },
        7: { texto: "📊 Ver todas las propiedades", filtro: "todas", icon: "📊" },
        8: { texto: "ℹ️ Información del sistema", filtro: "info", icon: "ℹ️" }
    },

    // Mensajes del sistema
    MENSAJES: {
        BIENVENIDA: "¡Hola! Soy tu asistente virtual de <strong>Dante Propiedades</strong>. Te ayudo a encontrar la propiedad ideal.",
        INSTRUCCIONES: "Selecciona una opción escribiendo el número correspondiente:",
        SELECCION_FILTRO: "Selecciona el criterio de búsqueda:",
        INGRESO_VALOR: "Ingresa el valor para buscar:",
        SIN_RESULTADOS: "🔍 No encontré propiedades con esos criterios. Intenta con otros parámetros.",
        ERROR_CARGA: "⚠️ Error cargando las propiedades. Intenta recargar la página.",
        RESULTADOS: "✅ Encontré <strong>{count}</strong> propiedad(es) para tu búsqueda:",
        REINICIAR: "🔄 Chat reiniciado. ¿En qué más puedo ayudarte?"
    },

    // Estilos y temas
    UI: {
        colores: {
            primary: "#25D366",
            secondary: "#128C7E",
            background: "#f0f0f0",
            userMessage: "#DCF8C6",
            botMessage: "#FFFFFF"
        },
        timing: {
            delayMensaje: 300,
            animacionEntrada: 0.3
        }
    }
};