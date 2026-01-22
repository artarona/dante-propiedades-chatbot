const axios = require('axios');

class WhatsAppService {
    constructor() {
        this.token = process.env.WHATSAPP_TOKEN;
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.apiUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
    }

    async sendMessage(to, text) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "text",
                    text: { body: text }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    async sendOptions(to, text, options) {
        // En WhatsApp, las opciones se pueden enviar como botones o listas.
        // Por simplicidad inicial, las enviamos como texto formateado.
        // Si hay menos de 3 opciones, podríamos usar botones.
        let formattedText = text + "\n\n";
        Object.entries(options).forEach(([key, value]) => {
            formattedText += `${key}. ${value.icon} ${value.texto}\n`;
        });

        return this.sendMessage(to, formattedText);
    }

    async sendPropertyList(to, text, properties) {
        let formattedText = text + "\n\n";
        properties.slice(0, 5).forEach((prop, index) => {
            formattedText += `🏠 *${prop.titulo}*\n`;
            formattedText += `💰 ${prop.precio}\n`;
            formattedText += `📍 ${prop.barrio}\n`;
            formattedText += `🔗 Ver más: ${prop.url || 'Contactanos'}\n\n`;
        });

        if (properties.length > 5) {
            formattedText += `...y ${properties.length - 5} más. Visita nuestra web para ver todas.`;
        }

        return this.sendMessage(to, formattedText);
    }
}

module.exports = new WhatsAppService();
