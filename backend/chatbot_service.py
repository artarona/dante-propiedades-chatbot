class ChatbotService:
    def __init__(self):
        self.user_sessions = {}
        self.property_service = PropertyService()
    
    def process_message(self, user_id, message):
        # Obtener o crear sesión del usuario
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = {
                'current_menu': 'principal',
                'search_filters': {},
                'interested_properties': []
            }
        
        session = self.user_sessions[user_id]
        
        # Procesar según el menú actual
        if message.lower() in ['hola', 'hi', 'hello', 'menu']:
            return self.show_welcome_menu()
        
        return self.process_menu_navigation(session, message)
    
    def show_welcome_menu(self):
        menu_text = """🏠 ¡Hola! Soy tu asistente inmobiliario de Dante Propiedades.

📋 **MENÚ PRINCIPAL:**

1️⃣ Buscar propiedad
2️⃣ Ver todas las propiedades  
3️⃣ Ayuda
4️⃣ **📊 Estadísticas guardadas** ⭐
5️⃣ Salir

💡 **Usa SOLO números para navegar**

Escribe el número de tu opción:"""
        return {'type': 'menu', 'content': menu_text}
    
    def process_menu_navigation(self, session, message):
        # Implementar lógica de navegación entre menús
        current_menu = session['current_menu']
        
        if current_menu == 'principal':
            return self.process_principal_menu(session, message)
        elif current_menu == 'busqueda':
            return self.process_search_menu(session, message)
        # ... otros menús
        
        return self.show_welcome_menu()
    
    def get_current_menu(self, user_id):
        if user_id in self.user_sessions:
            return self.user_sessions[user_id]['current_menu']
        return 'principal'