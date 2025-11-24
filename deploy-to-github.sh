#!/bin/bash

# Script para desplegar Dante Chatbot a GitHub automáticamente
# Ejecutar: bash deploy-to-github.sh

set -e  # Detener ejecución en caso de error

echo "🚀 Iniciando despliegue automático de Dante Chatbot..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "README.md" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "No se detecta la estructura del proyecto. Ejecuta desde el directorio principal."
    echo "Estructura esperada:"
    echo "  /backend"
    echo "  /frontend" 
    echo "  README.md"
    exit 1
fi

# Configuración
REPO_NAME="dante-chatbot"
GITHUB_USER=$(git config user.name)
if [ -z "$GITHUB_USER" ]; then
    read -p "📝 Ingresa tu nombre de usuario de GitHub: " GITHUB_USER
fi

print_status "Usuario de GitHub: $GITHUB_USER"
print_status "Nombre del repositorio: $REPO_NAME"

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Por favor instala Git primero."
    exit 1
fi

# Verificar si hay cambios sin commit
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Repositorio Git ya existe, verificando cambios..."
    if ! git diff-index --quiet HEAD --; then
        print_warning "Hay cambios sin commit. Haciendo commit automático..."
        git add .
        git commit -m "🚀 Auto-commit: Despliegue automático $(date '+%Y-%m-%d %H:%M:%S')"
    fi
else
    print_status "Inicializando nuevo repositorio Git..."
    git init
    git branch -M main
fi

# Crear archivos esenciales si no existen
print_status "Verificando estructura de archivos..."

# Crear .gitignore si no existe
if [ ! -f ".gitignore" ]; then
    print_status "Creando .gitignore..."
    cat > .gitignore << EOF
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt

# Environment variables
.env
.env.local

# Database
*.sqlite3
*.db
instance/

# Logs
*.log
logs/

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp
EOF
    print_success ".gitignore creado"
fi

# Crear README.md si no existe
if [ ! -f "README.md" ]; then
    print_status "Creando README.md..."
    cat > README.md << 'EOF'
# 🏠 Dante Propiedades - Chatbot Inmobiliario

Chatbot inteligente para gestión inmobiliaria con integración a WhatsApp.

## 🚀 Despliegue Rápido

### Frontend (GitHub Pages)
El frontend se despliega automáticamente en GitHub Pages.

### Backend (Render)
1. Ve a [render.com](https://render.com)
2. Conecta este repositorio
3. Despliega como Web Service

## 📁 Estructura del Proyecto
