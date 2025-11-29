const fs = require('fs').promises;
const path = require('path');

const propertiesFilePath = path.join(__dirname, '..', '..', 'propiedades.json');
let properties = [];

async function loadProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf8');
        properties = JSON.parse(data);
        console.log(`✅ ${properties.length} propiedades cargadas correctamente en el backend.`);
        return true;
    } catch (error) {
        console.error('❌ Error cargando propiedades en el backend:', error);
        return false;
    }
}

function getProperties() {
    return properties;
}

function searchProperties(filter, value) {
    if (properties.length === 0) {
        return [];
    }

    const valueStr = String(value).toLowerCase();

    switch (filter) {
        case 'tipo':
            return properties.filter(p => p.tipo && p.tipo.toLowerCase() === valueStr);
        case 'barrio':
            return properties.filter(p => p.barrio && p.barrio.toLowerCase() === valueStr);
        case 'operacion':
            return properties.filter(p => p.operacion && p.operacion.toLowerCase() === valueStr);
        case 'ambientes':
            const ambientes = parseInt(value, 10);
            return properties.filter(p => p.ambientes === ambientes);
        case 'precio':
             const precio = parseInt(value, 10);
            return properties.filter(p => p.precio > 0 && p.precio <= precio);
        case 'libre':
            return properties.filter(prop =>
                (prop.titulo && prop.titulo.toLowerCase().includes(valueStr)) ||
                (prop.barrio && prop.barrio.toLowerCase().includes(valueStr)) ||
                (prop.descripcion && prop.descripcion.toLowerCase().includes(valueStr)) ||
                (prop.tipo && prop.tipo.toLowerCase().includes(valueStr)) ||
                (prop.operacion && prop.operacion.toLowerCase().includes(valueStr))
            );
        case 'todas':
            return properties;
        default:
            return [];
    }
}

function getFilterValues() {
    if (properties.length === 0) {
        return {};
    }
    return {
        tipo: [...new Set(properties.map(p => p.tipo))].filter(Boolean),
        barrio: [...new Set(properties.map(p => p.barrio))].filter(Boolean),
        operacion: [...new Set(properties.map(p => p.operacion))].filter(Boolean),
        ambientes: [...new Set(properties.map(p => p.ambientes))].sort((a, b) => a - b).filter(amb => amb > 0)
    };
}


module.exports = {
    loadProperties,
    getProperties,
    searchProperties,
    getFilterValues,
};
