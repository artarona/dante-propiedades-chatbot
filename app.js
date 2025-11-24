// app.js - Inicialización y funciones globales
let chatbot;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar chatbot
    chatbot = new ChatbotPropiedades();
    chatbot.inicializar();

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

    // Cargar propiedades count
    setTimeout(() => {
        if (document.getElementById('propiedadesCount')) {
            document.getElementById('propiedadesCount').textContent = chatbot.propiedades.length;
        }
    }, 1000);
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