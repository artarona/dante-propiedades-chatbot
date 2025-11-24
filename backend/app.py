from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Datos de ejemplo (luego reemplazar con base de datos)
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
        "descripcion": "Departamento luminoso en el corazón de Buenos Aires",
        "imagenes": []
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
        "descripcion": "Casa con jardín en barrio residencial",
        "imagenes": []
    }
]

CONSULTAS = []
USER_SESSIONS = {}

class ChatbotService:
    def process_message(self, user_id, message):
        if user_id not in USER_SESSIONS:
            USER_SESSIONS[user_id] = {
                'current_menu': 'principal',
                'search_filters': {},
                'step': None
            }
        
        session = USER_SESSIONS[user_id]
        message_lower = message.lower().strip()
        
        # Comandos especiales
        if message_lower in ['hola', 'hi', 'hello', 'menu', '/start']:
            return self.show_welcome_menu(session)
        
        # Procesar según menú actual
        if session['current_menu'] == 'principal':
            return self.process_principal_menu(session, message)
        elif session['current_menu'] == 'busqueda':
            return self.process_search_menu(session, message)
        elif session['current_menu'] == 'propiedades':
            return self.process_properties_menu(session, message)
            
        return self.show_welcome_menu(session)
    
    def show_welcome_menu(self, session):
        session['current_menu'] = 'principal'
        session['step'] = None
        
        content = """🏠 ¡Hola! Soy tu asistente inmobiliario de Dante Propiedades.

📋 **MENÚ PRINCIPAL:**

1️⃣ Buscar propiedad
2️⃣ Ver todas las propiedades  
3️⃣ Ayuda
4️⃣ 📊 Estadísticas
5️⃣ Salir

💡 **Usa SOLO números para navegar**

Escribe el número de tu opción:"""
        
        return {
            'type': 'menu', 
            'content': content,
            'quick_replies': ['1', '2', '3', '4', '5']
        }
    
    def process_principal_menu(self, session, message):
        if message == '1':
            session['current_menu'] = 'busqueda'
            content = """🔍 **BÚSQUEDA DE PROPIEDADES**

1️⃣ Por tipo de propiedad
2️⃣ Por barrio  
3️⃣ Ver todas
4️⃣ Volver

Escribe el número:"""
            
            return {
                'type': 'menu',
                'content': content,
                'quick_replies': ['1', '2', '3', '4']
            }
            
        elif message == '2':
            return self.show_all_properties(session)
            
        elif message == '3':
            content = """❓ **AYUDA**

🔢 **NAVEGACIÓN:**
• Usa números para navegar (1, 2, 3...)
• 'Hola' reinicia la conversación
• 'Menu' vuelve al inicio

🏠 **PROPIEDADES DISPONIBLES:**
• Departamentos en Microcentro
• Casas en Palermo
• Y más...

Escribe 'menu' para volver:"""
            
            return {
                'type': 'menu',
                'content': content,
                'quick_replies': ['menu']
            }
            
        elif message == '4':
            stats = self.get_statistics()
            return {
                'type': 'menu',
                'content': stats
            }
            
        elif message == '5':
            content = "👋 ¡Gracias por usar Dante Propiedades! Escribe 'Hola' para empezar de nuevo."
            return {
                'type': 'menu',
                'content': content,
                'quick_replies': ['Hola']
            }
        
        else:
            content = f"❌ Opción no válida: '{message}'\n\nPor favor, elige una opción del 1 al 5:"
            return {
                'type': 'menu',
                'content': content,
                'quick_replies': ['1', '2', '3', '4', '5']
            }
    
    def show_all_properties(self, session):
        session['current_menu'] = 'propiedades'
        
        if not PROPERTIES:
            content = "❌ No hay propiedades disponibles en este momento."
            return {'type': 'menu', 'content': content}
        
        content = f"🏠 **TODAS LAS PROPIEDADES ({len(PROPERTIES)}):**\n\n"
        
        for i, prop in enumerate(PROPERTIES, 1):
            precio = f"${prop['precio']:,.0f} {prop['moneda_precio']}" if prop['precio'] else "Consultar precio"
            content += f"**{i}.** {prop['titulo']}\n"
            content += f"   📍 {prop['barrio']} • {precio}\n"
            content += f"   🏠 {prop['tipo']} • {prop['ambientes']} amb.\n\n"
        
        content += "**Escribe el número de la propiedad que te interesa o 'menu' para volver:**"
        
        quick_replies = [str(i+1) for i in range(len(PROPERTIES))] + ['menu']
        
        return {
            'type': 'properties',
            'content': content,
            'properties': PROPERTIES,
            'quick_replies': quick_replies
        }
    
    def get_statistics(self):
        total_consultas = len(CONSULTAS)
        consultas_con_contacto = len([c for c in CONSULTAS if c.get('telefono')])
        
        content = f"""📊 **ESTADÍSTICAS EN TIEMPO REAL**

🏠 **Propiedades disponibles:** {len(PROPERTIES)}
📈 **Total consultas:** {total_consultas}
👥 **Consultas con contacto:** {consultas_con_contacto}
🕒 **Última actualización:** {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Barrios disponibles:**
{', '.join(set(p['barrio'] for p in PROPERTIES))}

**Tipos disponibles:**
{', '.join(set(p['tipo'] for p in PROPERTIES))}

Escribe 'menu' para volver:"""
        
        return content
    
    def process_search_menu(self, session, message):
        if message == '3':
            return self.show_all_properties(session)
        elif message == '4':
            return self.show_welcome_menu(session)
        else:
            content = "❌ Opción no válida. Por favor elige 1, 2, 3 o 4:"
            return {
                'type': 'menu',
                'content': content,
                'quick_replies': ['1', '2', '3', '4']
            }
    
    def process_properties_menu(self, session, message):
        if message.lower() in ['menu', 'volver']:
            return self.show_welcome_menu(session)
        
        try:
            prop_index = int(message) - 1
            if 0 <= prop_index < len(PROPERTIES):
                prop = PROPERTIES[prop_index]
                return self.show_property_detail(prop, session)
        except ValueError:
            pass
        
        content = "❌ Opción no válida. Escribe el número de la propiedad o 'menu':"
        return {'type': 'menu', 'content': content}

chatbot_service = ChatbotService()

# Rutas de la API
@app.route('/api/chat/message', methods=['POST'])
def process_chat_message():
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'web_user')
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Mensaje vacío'}), 400
        
        response = chatbot_service.process_message(user_id, message)
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/api/exportar-excel', methods=['GET'])
def export_excel():
    # Simular exportación (en producción, generar archivo Excel real)
    return jsonify({
        'message': 'Función de exportación a Excel',
        'consultas_count': len(CONSULTAS),
        'download_url': '/api/descargar-excel'
    })

@app.route('/api/estadisticas', methods=['GET'])
def get_estadisticas():
    stats = {
        'total_propiedades': len(PROPERTIES),
        'total_consultas': len(CONSULTAS),
        'consultas_con_contacto': len([c for c in CONSULTAS if c.get('telefono')]),
        'barrios': list(set(p['barrio'] for p in PROPERTIES)),
        'tipos': list(set(p['tipo'] for p in PROPERTIES)),
        'ultima_actualizacion': datetime.now().isoformat()
    }
    return jsonify(stats)

# Servir archivos estáticos para el frontend
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)