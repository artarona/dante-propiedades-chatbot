const express = require('express');
const propertyService = require('./services/propertyService');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount the WhatsApp routes
app.use('/api/whatsapp', whatsappRoutes);

// A simple test route
app.get('/api/properties', (req, res) => {
    const properties = propertyService.getProperties();
    res.json({
        count: properties.length,
        properties,
    });
});

async function startServer() {
    // Load data before starting the server
    const loaded = await propertyService.loadProperties();
    if (!loaded) {
        console.error("Halting server start due to error in loading properties.");
        return;
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`API de propiedades disponible en http://localhost:${PORT}/api/properties`);
        console.log(`Webhook de WhatsApp esperando en http://localhost:${PORT}/api/whatsapp/webhook`);
    });
}

startServer();
