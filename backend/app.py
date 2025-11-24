from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Datos de ejemplo para propiedades
PROPERTIES = [
    {
        "id_temporal": "PROP001",
        "titulo": "Departamento 2 Ambientes - Microcentro",
        "barrio": "Microcentro",
        "tipo": "departamento",
        "precio": 150000,
        "moneda_precio": "USD",
        "ambientes": 2,
        "direccion": "Av. Corrientes 1234",
        "descripcion": "Departamento luminoso en el corazón de Buenos Aires"
    },
    {
        "id_temporal": "PROP002", 
        "titulo": "Casa 3 Ambientes - Palermo",
        "barrio": "Palermo",
        "tipo": "casa",
        "precio": 200000,
        "moneda_precio": "USD", 
        "ambientes": 3,
        "direccion": "Av. Santa Fe 2500",
        "descripcion": "Casa con jardín en barrio residencial"
    }
]

# Ruta principal
@app.route('/')
def home():
    return jsonify({"message": "🚀 Dante Chatbot Backend Running", "status": "active"})

# Ruta de health check
@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "dante-chatbot", "timestamp": datetime.now().isoformat()})

# Ruta para mensajes del chatbot
@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        message = data.get('message', '').strip()
        
        # Respuesta básica del chatbot
        if message.lower() in ['hola', 'hi', 'hello']:
            response = {
                'type': 'menu',
                'content': """🏠 ¡Hola! Soy tu asistente inmobiliario de Dante Propiedades.

📋 **MENÚ PRINCIPAL:**

1️⃣ Buscar propiedad
2️⃣ Ver todas las propiedades  
3️⃣ Ayuda
4️⃣ Salir

Escribe el número de tu opción:""",
                'quick_replies': ['1', '2', '3', '4']
            }
        elif message == '1':
            response = {
                'type': 'menu', 
                'content': """🔍 **BÚSQUEDA DE PROPIEDADES**

1️⃣ Por tipo de propiedad
2️⃣ Por barrio  
3️⃣ Ver todas
4️⃣ Volver

Escribe el número:""",
                'quick_replies': ['1', '2', '3', '4']
            }
        elif message == '2':
            # Mostrar todas las propiedades
            content = f"🏠 **TODAS LAS PROPIEDADES ({len(PROPERTIES)}):**\n\n"
            for i, prop in enumerate(PROPERTIES, 1):
                precio = f"${prop['precio']:,} {prop['moneda_precio']}"
                content += f"**{i}.** {prop['titulo']}\n"
                content += f"   📍 {prop['barrio']} • {precio}\n"
                content += f"   🏠 {prop['tipo']} • {prop['ambientes']} amb.\n\n"
            
            response = {
                'type': 'properties',
                'content': content,
                'quick_replies': ['1', '2', '3', 'menu']
            }
        else:
            response = {
                'type': 'menu',
                'content': f"🤖 No entendí: '{message}'\n\nEscribe 'Hola' para comenzar:",
                'quick_replies': ['Hola']
            }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener propiedades
@app.route('/api/properties', methods=['GET'])
def get_properties():
    tipo = request.args.get('tipo')
    barrio = request.args.get('barrio')
    
    filtered_properties = PROPERTIES
    
    if tipo:
        filtered_properties = [p for p in filtered_properties if p['tipo'] == tipo]
    if barrio:
        filtered_properties = [p for p in filtered_properties if p['barrio'] == barrio]
    
    return jsonify(filtered_properties)

# Ruta para estadísticas
@app.route('/api/estadisticas', methods=['GET'])
def get_estadisticas():
    stats = {
        'total_propiedades': len(PROPERTIES),
        'barrios': list(set(p['barrio'] for p in PROPERTIES)),
        'tipos': list(set(p['tipo'] for p in PROPERTIES)),
        'ultima_actualizacion': datetime.now().isoformat()
    }
    return jsonify(stats)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)