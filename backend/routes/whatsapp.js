const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// estado de la conversacion, esto deberia estar en una base de datos o un sistema de cache
const userStates = {};

// Endpoint for WhatsApp Webhook verification
router.get('/webhook', (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === verify_token) {
            console.log('✅ WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Endpoint for receiving messages
router.post('/webhook', (req, res) => {
    const body = req.body;
    console.log('Incoming webhook:', JSON.stringify(body, null, 2));

    // Basic validation
    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const webhook_event = entry.changes[0];
            
            // Check for message
            if (webhook_event.value.messages) {
                const message = webhook_event.value.messages[0];
                const from = message.from;

                // Initialize state if not present
                if (!userStates[from]) {
                    userStates[from] = 'INICIO';
                }
                
                // For now, we only handle text messages
                if (message.type === 'text') {
                    const currentState = userStates[from];
                    const { responses, nextState } = chatService.processMessage(message.text.body, currentState);
                    
                    userStates[from] = nextState;

                    console.log(`User: ${from}, State: ${currentState} -> ${nextState}`);
                    console.log('Responses to send:', responses);
                    
                    // Here you would integrate with a service to send the `responses` back to the user via WhatsApp API
                }
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
