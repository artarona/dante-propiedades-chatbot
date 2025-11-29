const propertyService = require('./propertyService');
const config = require('../../config'); // Assuming config.js is in the root

class ChatService {
    constructor() {
        this.config = config;
    }

    // This method simulates the conversation logic for a single user
    // In a real backend, you'd pass in the user's current state
    processMessage(message, currentState) {
        const responses = [];
        let nextState = currentState;

        switch (currentState) {
            case 'SELECCION_OPCION':
                const option = this.config.OPCIONES_PRINCIPALES[message];
                if (!option) {
                    // Fallback to free search
                    const results = propertyService.searchProperties('libre', message);
                    responses.push({ type: 'text', content: `Buscando "${message}"...` });
                    responses.push({ type: 'results', properties: results });
                    nextState = 'SELECCION_OPCION'; // Return to main menu
                } else {
                    const filter = option.filtro;
                    if (filter === 'libre') {
                        responses.push({ type: 'text', content: this.config.MENSAJES.INGRESO_VALOR });
                        nextState = 'INGRESO_VALOR';
                    } else if (filter === 'todas') {
                        const results = propertyService.searchProperties('todas', '');
                        responses.push({ type: 'results', properties: results });
                        nextState = 'SELECCION_OPCION';
                    } else if (filter === 'info') {
                        responses.push({ type: 'system_info', filterValues: propertyService.getFilterValues() });
                        nextState = 'SELECCION_OPCION';
                    } else {
                        const filterValues = propertyService.getFilterValues()[filter];
                        responses.push({ type: 'options', filter, values: filterValues });
                        nextState = 'SELECCION_VALOR';
                    }
                }
                break;

            case 'SELECCION_VALOR':
                // This state needs the filter type to be passed along with the state
                // For simplicity, we assume we know the filter type.
                // A real implementation would store this in a user session.
                // This is a placeholder for a more complex state management.
                responses.push({ type: 'text', content: `Selección de valor no implementada en este refactor simple.` });
                nextState = 'SELECCION_OPCION';
                break;
                
            case 'INGRESO_VALOR':
                const results = propertyService.searchProperties('libre', message);
                responses.push({ type: 'text', content: `Buscando "${message}"...` });
                responses.push({ type: 'results', properties: results });
                nextState = 'SELECCION_OPCION';
                break;

            default: // INICIO
                responses.push({ type: 'welcome', content: this.config.MENSAJES.BIENVENIDA });
                responses.push({ type: 'main_options', options: this.config.OPCIONES_PRINCIPALES });
                nextState = 'SELECCION_OPCION';
                break;
        }

        // Add a follow-up prompt
        if (nextState === 'SELECCION_OPCION' && currentState !== 'INICIO') {
             responses.push({ type: 'text', content: `¿Necesitas algo más?` });
        }

        return { responses, nextState };
    }
}

module.exports = new ChatService();
