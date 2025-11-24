// app.js - Inicialización y funciones globales
let chatbot;

document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar chatbot
    chatbot = new ChatbotPropiedades();
    const cargado = await chatbot.inicializar();
    
    if (cargado) {
        chatbot.mostrarBienvenida();
    }

    // Configurar fecha actual
    document.getElementById('fechaActual').textContent = new Date().toLocaleDateString();

    // Configurar eventos
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    // Focus en el input
    document.getElementById('userInput').focus();

    console.log('✅ Dante Propiedades Chatbot - Inicializado correctamente');
    console.log(`🏠 Propiedades cargadas: ${chatbot.propiedades.length}`);
    console.log('🌐 Sitio activo: https://artarona.github.io/dante-propiedades-chatbot/');
});

function enviarMensaje() {
    const input = document.getElementById('userInput');
    const mensaje = input.value.trim();
    
    if (!mensaje) return;

    chatbot.procesarMensaje(mensaje);
    input.value = '';
    input.focus();
}

function seleccionarOpcion(numero) {
    document.getElementById('userInput').value = numero;
    enviarMensaje();
}

function resetChat() {
    if (confirm('¿Estás seguro de que quieres reiniciar la conversación?')) {
        chatbot.reiniciarChat();
    }
}

function mostrarInfo() {
    const panel = document.getElementById('infoPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

// Función global para manejar errores de imágenes
window.handleImageError = function(img) {
    img.style.display = 'none';
};

// Ocultar panel info al hacer click fuera
document.addEventListener('click', function(event) {
    const panel = document.getElementById('infoPanel');
    const infoButton = document.querySelector('[onclick="mostrarInfo()"]');
    
    if (panel && panel.style.display === 'block' && 
        !panel.contains(event.target) && 
        event.target !== infoButton) {
        panel.style.display = 'none';
    }
});