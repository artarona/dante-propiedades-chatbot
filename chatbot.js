// chatbot.js - Lógica principal del chatbot unificado
class ChatbotPropiedades {
    constructor() {
        this.propiedades = [];
        this.estado = 'INICIO';
        this.filtroActual = null;
        this.config = CONFIG;
        this.historial = [];
    }

    async inicializar() {
        await this.cargarPropiedades();
        this.generarValoresFiltro();
        this.mostrarBienvenida();
        this.actualizarUI();
    }

    async cargarPropiedades() {
        try {
            const response = await fetch('propiedades.json');
            if (!response.ok) throw new Error('Error en la respuesta');
            
            this.propiedades = await response.json();
            console.log(`✅ ${this.propiedades.length} propiedades cargadas correctamente`);
            return true;
        } catch (error) {
            console.error('❌ Error cargando propiedades:', error);
            this.mostrarError(this.config.MENSAJES.ERROR_CARGA);
            return false;
        }
    }

    generarValoresFiltro() {
        if (this.propiedades.length === 0) return;
        
        this.config.VALORES_FILTRO = {
            tipo: [...new Set(this.propiedades.map(p => p.tipo))].filter(Boolean),
            barrio: [...new Set(this.propiedades.map(p => p.barrio))].filter(Boolean),
            operacion: [...new Set(this.propiedades.map(p => p.operacion))].filter(Boolean),
            ambientes: [...new Set(this.propiedades.map(p => p.ambientes))].sort((a, b) => a - b).filter(amb => amb > 0)
        };
    }

    mostrarBienvenida() {
        const mensaje = `
            <div class="message bot-message welcome-message">
                <div class="welcome-header">
                    <strong>${this.config.MENSAJES.BIENVENIDA}</strong>
                </div>
                <div class="welcome-content">
                    <p>${this.config.MENSAJES.INSTRUCCIONES}</p>
                    <div class="opciones-grid">
                        ${Object.entries(this.config.OPCIONES_PRINCIPALES).map(([numero, opcion]) => `
                            <div class="opcion-item">
                                <span class="opcion-numero">${numero}</span>
                                <span class="opcion-texto">${opcion.icon} ${opcion.texto}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="tip">
                        💡 <strong>Tip:</strong> También puedes usar los botones rápidos o escribir directamente lo que buscas.
                    </div>
                </div>
            </div>
        `;
        this.agregarMensaje(mensaje);
        this.estado = 'SELECCION_OPCION';
    }

    procesarMensaje(mensaje) {
        const texto = mensaje.trim();
        this.agregarMensajeUsuario(texto);
        this.historial.push({ tipo: 'usuario', mensaje: texto, timestamp: new Date() });

        setTimeout(() => {
            switch (this.estado) {
                case 'SELECCION_OPCION':
                    this.procesarSeleccionOpcion(texto);
                    break;
                case 'SELECCION_VALOR':
                    this.procesarSeleccionValor(texto);
                    break;
                case 'INGRESO_VALOR':
                    this.procesarIngresoValor(texto);
                    break;
                default:
                    this.procesarBusquedaDirecta(texto);
            }
        }, this.config.UI.timing.delayMensaje);
    }

    procesarSeleccionOpcion(numero) {
        const opcion = this.config.OPCIONES_PRINCIPALES[numero];
        
        if (!opcion) {
            this.procesarBusquedaDirecta(numero);
            return;
        }

        this.filtroActual = opcion.filtro;

        if (opcion.filtro === 'libre') {
            this.solicitarBusquedaLibre();
        } else if (opcion.filtro === 'todas') {
            this.mostrarTodasLasPropiedades();
        } else if (opcion.filtro === 'info') {
            this.mostrarInformacionSistema();
        } else {
            this.mostrarValoresFiltro();
        }
    }

    solicitarBusquedaLibre() {
        this.agregarMensajeBot(`${this.config.MENSAJES.INGRESO_VALOR} (puedes buscar por título, barrio, descripción, etc.)`);
        this.estado = 'INGRESO_VALOR';
    }

    mostrarValoresFiltro() {
        const valores = this.config.VALORES_FILTRO[this.filtroActual];
        
        if (!valores || valores.length === 0) {
            this.agregarMensajeBot("No hay valores disponibles para este filtro.");
            this.mostrarOpcionesPrincipales();
            return;
        }

        let mensaje = `<div class="message bot-message">
            <strong>Selecciona ${this.obtenerNombreFiltro(this.filtroActual)}:</strong><br><br>
            <div class="valores-grid">`;

        valores.forEach((valor, index) => {
            mensaje += `
                <div class="valor-item">
                    <span class="valor-numero">${index + 1}.</span>
                    <span class="valor-texto">${this.formatearValorFiltro(valor)}</span>
                </div>`;
        });

        mensaje += `</div><br>Escribe el número de tu selección:</div>`;
        this.agregarMensaje(mensaje);
        this.estado = 'SELECCION_VALOR';
    }

    procesarSeleccionValor(numero) {
        const valores = this.config.VALORES_FILTRO[this.filtroActual];
        const indice = parseInt(numero) - 1;
        
        if (indice >= 0 && indice < valores.length) {
            const valorSeleccionado = valores[indice];
            this.realizarBusqueda(this.filtroActual, valorSeleccionado);
        } else {
            this.agregarMensajeBot("❌ Selección inválida. Por favor, elige un número de la lista.");
        }
    }

    procesarIngresoValor(texto) {
        if (texto.trim()) {
            this.realizarBusqueda('libre', texto);
        } else {
            this.agregarMensajeBot("Por favor, ingresa un término de búsqueda.");
        }
    }

    procesarBusquedaDirecta(texto) {
        // Si el usuario escribe directamente, hacemos búsqueda libre
        this.realizarBusqueda('libre', texto);
    }

    realizarBusqueda(filtro, valor) {
        let propiedadesFiltradas = [];
        let terminoBusqueda = '';

        switch (filtro) {
            case 'tipo':
                propiedadesFiltradas = this.propiedades.filter(p => 
                    p.tipo && p.tipo.toLowerCase() === valor.toLowerCase());
                terminoBusqueda = `tipo "${valor}"`;
                break;
            case 'barrio':
                propiedadesFiltradas = this.propiedades.filter(p => 
                    p.barrio && p.barrio.toLowerCase() === valor.toLowerCase());
                terminoBusqueda = `barrio "${valor}"`;
                break;
            case 'operacion':
                propiedadesFiltradas = this.propiedades.filter(p => 
                    p.operacion && p.operacion.toLowerCase() === valor.toLowerCase());
                terminoBusqueda = `operación "${valor}"`;
                break;
            case 'ambientes':
                propiedadesFiltradas = this.propiedades.filter(p => 
                    p.ambientes === parseInt(valor));
                terminoBusqueda = `${valor} ambiente${valor != 1 ? 's' : ''}`;
                break;
            case 'precio':
                propiedadesFiltradas = this.propiedades.filter(p => 
                    p.precio > 0 && p.precio <= parseInt(valor));
                terminoBusqueda = `precio hasta ${valor}`;
                break;
            case 'libre':
                propiedadesFiltradas = this.busquedaLibre(valor);
                terminoBusqueda = `"${valor}"`;
                break;
            case 'todas':
                propiedadesFiltradas = this.propiedades;
                terminoBusqueda = "todas las propiedades";
                break;
        }

        this.mostrarResultados(propiedadesFiltradas, terminoBusqueda);
        this.historial.push({ 
            tipo: 'busqueda', 
            filtro: filtro, 
            valor: valor, 
            resultados: propiedadesFiltradas.length,
            timestamp: new Date() 
        });
    }

    busquedaLibre(termino) {
        const terminoLower = termino.toLowerCase();
        return this.propiedades.filter(prop => 
            (prop.titulo && prop.titulo.toLowerCase().includes(terminoLower)) ||
            (prop.barrio && prop.barrio.toLowerCase().includes(terminoLower)) ||
            (prop.descripcion && prop.descripcion.toLowerCase().includes(terminoLower)) ||
            (prop.tipo && prop.tipo.toLowerCase().includes(terminoLower)) ||
            (prop.operacion && prop.operacion.toLowerCase().includes(terminoLower)) ||
            (prop.direccion && prop.direccion.toLowerCase().includes(terminoLower))
        );
    }

    mostrarTodasLasPropiedades() {
        this.mostrarResultados(this.propiedades, "todas las propiedades");
    }

    mostrarInformacionSistema() {
        const info = `
            <div class="message bot-message info-message">
                <strong>ℹ️ Información del Sistema</strong>
                <div class="info-details">
                    <p><strong>Propiedades en base de datos:</strong> ${this.propiedades.length}</p>
                    <p><strong>Tipos disponibles:</strong> ${this.config.VALORES_FILTRO.tipo.join(', ')}</p>
                    <p><strong>Barrios disponibles:</strong> ${this.config.VALORES_FILTRO.barrio.join(', ')}</p>
                    <p><strong>Operaciones:</strong> ${this.config.VALORES_FILTRO.operacion.join(', ')}</p>
                    <p><strong>Última búsqueda:</strong> ${this.historial.filter(h => h.tipo === 'busqueda').length} realizadas</p>
                </div>
            </div>
        `;
        this.agregarMensaje(info);
        setTimeout(() => this.mostrarOpcionesPrincipales(), 2000);
    }

    mostrarResultados(propiedades, termino) {
        if (propiedades.length === 0) {
            this.agregarMensajeBot(this.config.MENSAJES.SIN_RESULTADOS);
        } else {
            const mensajeResultados = this.config.MENSAJES.RESULTADOS.replace('{count}', propiedades.length);
            this.agregarMensajeBot(`<strong>${mensajeResultados}</strong> (${termino})`);

            propiedades.forEach((prop, index) => {
                setTimeout(() => {
                    this.mostrarPropiedad(prop);
                }, index * 100);
            });
        }

        setTimeout(() => this.mostrarOpcionesPrincipales(), 1000);
    }

    mostrarPropiedad(prop) {
        const tarjeta = this.crearTarjetaPropiedad(prop);
        this.agregarMensaje(tarjeta);
    }

    crearTarjetaPropiedad(prop) {
        const precioFormateado = this.formatearPrecio(prop);
        const imagenes = prop.fotos && prop.fotos.length > 0 ? 
            prop.fotos.slice(0, 3).map(foto => 
                `<img src="${foto}" alt="Imagen de ${prop.titulo}" class="property-image" loading="lazy" onerror="this.style.display='none'">`
            ).join('') : '';

        return `
        <div class="message bot-message property-message">
            <div class="property-card">
                <div class="property-header">
                    <h3>${prop.titulo || 'Sin título'}</h3>
                    <span class="property-badge">${prop.operacion || 'N/A'}</span>
                </div>
                
                <div class="property-details">
                    <div class="detail-row">
                        <span class="detail-item">🏠 ${prop.tipo || 'N/A'}</span>
                        <span class="detail-item">📍 ${prop.barrio || 'N/A'}</span>
                        <span class="detail-item">🛏️ ${prop.ambientes || 0} amb.</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-item">📏 ${prop.metros_cuadrados || 'N/A'} m²</span>
                        <span class="detail-item">💰 ${precioFormateado}</span>
                    </div>
                </div>

                ${prop.descripcion ? `
                    <div class="property-description">
                        <p>${prop.descripcion}</p>
                    </div>
                ` : ''}

                ${imagenes ? `
                    <div class="property-images">
                        ${imagenes}
                    </div>
                ` : ''}

                <div class="property-footer">
                    <small>ID: ${prop.id_temporal || 'N/A'} | Cargado: ${new Date(prop.fecha_procesamiento).toLocaleDateString()}</small>
                </div>
            </div>
        </div>`;
    }

    formatearPrecio(prop) {
        if (!prop.precio || prop.precio === 0) return "Consultar precio";
        const moneda = prop.moneda_precio === 'USD' ? 'U$D' : '$';
        return `${moneda} ${prop.precio.toLocaleString()}`;
    }

    obtenerNombreFiltro(filtro) {
        const nombres = {
            'tipo': 'tipo de propiedad',
            'barrio': 'barrio',
            'operacion': 'operación',
            'ambientes': 'cantidad de ambientes',
            'precio': 'precio máximo'
        };
        return nombres[filtro] || filtro;
    }

    formatearValorFiltro(valor) {
        if (this.filtroActual === 'ambientes') {
            return `${valor} ambiente${valor !== 1 ? 's' : ''}`;
        }
        return valor.charAt(0).toUpperCase() + valor.slice(1);
    }

    agregarMensajeUsuario(mensaje) {
        this.agregarMensaje(`<div class="message user-message">${this.escapeHTML(mensaje)}</div>`);
    }

    agregarMensajeBot(mensaje) {
        this.agregarMensaje(`<div class="message bot-message">${mensaje}</div>`);
    }

    agregarMensaje(mensaje) {
        const chatMessages = document.getElementById('chatMessages');
        const mensajeDiv = document.createElement('div');
        mensajeDiv.innerHTML = mensaje;
        
        // Animación de entrada
        mensajeDiv.style.opacity = '0';
        mensajeDiv.style.transform = 'translateY(10px)';
        
        chatMessages.appendChild(mensajeDiv);
        
        // Animación
        setTimeout(() => {
            mensajeDiv.style.transition = `all ${this.config.UI.timing.animacionEntrada}s ease`;
            mensajeDiv.style.opacity = '1';
            mensajeDiv.style.transform = 'translateY(0)';
        }, 10);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    mostrarOpcionesPrincipales() {
        this.estado = 'SELECCION_OPCION';
        // No mostramos las opciones nuevamente para no saturar el chat
        // En su lugar, mostramos un mensaje sutil
        if (this.historial.filter(h => h.tipo === 'usuario').length > 2) {
            this.agregarMensajeBot(`¿Necesitas algo más? Escribe un número del 1 al 8 o tu búsqueda directa.`);
        }
    }

    reiniciarChat() {
        this.estado = 'INICIO';
        this.filtroActual = null;
        this.historial = [];
        document.getElementById('chatMessages').innerHTML = '';
        this.mostrarBienvenida();
        this.agregarMensajeBot(this.config.MENSAJES.REINICIAR);
    }

    actualizarUI() {
        // Actualizar contadores en la UI
        if (document.getElementById('propiedadesCount')) {
            document.getElementById('propiedadesCount').textContent = this.propiedades.length;
        }
        if (document.getElementById('lastUpdate')) {
            const ultimaProp = this.propiedades.reduce((latest, prop) => {
                const propDate = new Date(prop.fecha_procesamiento);
                return propDate > latest ? propDate : latest;
            }, new Date(0));
            document.getElementById('lastUpdate').textContent = ultimaProp.toLocaleDateString();
        }
    }
}