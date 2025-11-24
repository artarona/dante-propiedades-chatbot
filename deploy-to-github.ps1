# Script PowerShell para desplegar Dante Chatbot a GitHub
# Ejecutar: .\deploy-to-github.ps1

Write-Host "🚀 Iniciando despliegue automático de Dante Chatbot..." -ForegroundColor Cyan

# Configuración
$RepoName = "dante-chatbot"
$GitHubUser = git config user.name

if ([string]::IsNullOrEmpty($GitHubUser)) {
    $GitHubUser = Read-Host "📝 Ingresa tu nombre de usuario de GitHub"
}

Write-Host "Usuario de GitHub: $GitHubUser" -ForegroundColor Yellow
Write-Host "Nombre del repositorio: $RepoName" -ForegroundColor Yellow

# Verificar estructura del proyecto
if (-not (Test-Path "README.md") -and -not (Test-Path "backend") -and -not (Test-Path "frontend")) {
    Write-Host "❌ ERROR: No se detecta la estructura del proyecto." -ForegroundColor Red
    Write-Host "Ejecuta desde el directorio principal con la estructura:" -ForegroundColor Red
    Write-Host "  /backend"
    Write-Host "  /frontend" 
    Write-Host "  README.md"
    exit 1
}

# Verificar si Git está instalado
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ ERROR: Git no está instalado. Instala Git primero." -ForegroundColor Red
    exit 1
}

# Función para crear archivos si no existen
function Create-IfNotExists {
    param($Path, $Content)
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -Force | Out-Null
        if ($Content) {
            Set-Content -Path $Path -Value $Content
        }
        Write-Host "✅ Creado: $Path" -ForegroundColor Green
    }
}

# Crear archivos esenciales
Write-Host "📁 Verificando estructura de archivos..." -ForegroundColor Cyan

# Crear .gitignore
$GitignoreContent = @"
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
"@

Create-IfNotExists -Path ".gitignore" -Content $GitignoreContent

# Crear README.md si no existe
$ReadmeContent = @"
# Dante Propiedades - Chatbot Inmobiliario

Chatbot inteligente para gestión inmobiliaria con integración a WhatsApp.

## Despliegue Rapido

### Frontend (GitHub Pages)
El frontend se despliega automáticamente en GitHub Pages.

### Backend (Render)
1. Ve a [render.com](https://render.com)
2. Conecta este repositorio
3. Despliega como Web Service

## Estructura del Proyecto

\`\`\`
dante-chatbot/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── runtime.txt
│   └── render.yaml
├── frontend/
│   ├── index.html
│   └── assets/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
\`\`\`

## Desarrollo Local

\`\`\`bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend  
cd frontend
# Abrir index.html en navegador o usar servidor local
python -m http.server 8000
\`\`\`
"@

Create-IfNotExists -Path "README.md" -Content $ReadmeContent

# Verificar estructura de backend
Create-IfNotExists -Path "backend/requirements.txt" -Content @"
Flask==2.3.3
Flask-CORS==4.0.0
gunicorn==21.2.0
python-dotenv==1.0.0
"@

Create-IfNotExists -Path "backend/runtime.txt" -Content "python-3.11.0"

Create-IfNotExists -Path "backend/render.yaml" -Content @"
services:
  - type: web
    name: dante-chatbot-backend
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
"@

# Crear workflow de GitHub Actions (SIN EMOJIS para evitar problemas)
Write-Host "🔧 Configurando GitHub Actions..." -ForegroundColor Cyan
New-Item -Path ".github/workflows" -ItemType Directory -Force | Out-Null

$WorkflowContent = @"
name: Deploy Dante Chatbot

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        
    - name: Test Python syntax
      run: |
        python -m py_compile app.py
        echo 'Syntax check passed'

  deploy-frontend:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: List files
      run: |
        echo 'Project structure:'
        find . -type f -name '*.html' -o -name '*.py' -o -name '*.md' | head -20
        
    - name: Frontend ready
      run: |
        echo 'Frontend ready for GitHub Pages'
        echo 'Configure manually in Settings > Pages:'
        echo 'Source: Deploy from a branch'
        echo 'Branch: main' 
        echo 'Folder: /frontend'
"@

Create-IfNotExists -Path ".github/workflows/deploy.yml" -Content $WorkflowContent

# Inicializar Git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "🔄 Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    git branch -M main
}

# Verificar cambios sin commit
Write-Host "📝 Verificando cambios sin commit..." -ForegroundColor Cyan
try {
    $Changes = git status --porcelain
    if ($Changes) {
        Write-Host "📦 Hay cambios sin commit. Haciendo commit automático..." -ForegroundColor Yellow
        git add .
        git commit -m "Auto-commit: Despliegue automático $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
} catch {
    Write-Host "⚠️ Error verificando cambios Git: $_" -ForegroundColor Yellow
}

# Agregar todos los archivos
Write-Host "📤 Agregando archivos al repositorio..." -ForegroundColor Cyan
git add .

# Hacer commit inicial
try {
    git commit -m "🚀 Despliegue inicial: Dante Chatbot $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
} catch {
    Write-Host "ℹ️ No hay cambios para commit" -ForegroundColor Yellow
}

# Verificar repositorio remoto
Write-Host "🌐 Configurando repositorio remoto..." -ForegroundColor Cyan
$RemoteExists = $false
try {
    $RemoteUrl = git remote get-url origin
    $RemoteExists = $true
    Write-Host "✅ Repositorio remoto ya configurado: $RemoteUrl" -ForegroundColor Green
} catch {
    Write-Host "📡 No hay repositorio remoto configurado" -ForegroundColor Yellow
}

if (-not $RemoteExists) {
    # Intentar crear con GitHub CLI si está disponible
    try {
        gh --version | Out-Null
        Write-Host "🚀 Creando repositorio con GitHub CLI..." -ForegroundColor Cyan
        gh repo create $RepoName --public --description "Chatbot Inmobiliario Dante Propiedades" --push
        $RemoteExists = $true
    } catch {
        Write-Host "❌ GitHub CLI no disponible. Configuración manual requerida." -ForegroundColor Red
        Write-Host ""
        Write-Host "📝 INSTRUCCIONES MANUALES:" -ForegroundColor Yellow
        Write-Host "1. Ve a https://github.com/new" -ForegroundColor White
        Write-Host "2. Crea un repositorio llamado: $RepoName" -ForegroundColor White
        Write-Host "3. NO inicialices con README (ya tenemos uno)" -ForegroundColor White
        Write-Host "4. Ejecuta estos comandos:" -ForegroundColor White
        Write-Host ""
        Write-Host "   git remote add origin https://github.com/$GitHubUser/$RepoName.git" -ForegroundColor Cyan
        Write-Host "   git push -u origin main" -ForegroundColor Cyan
        Write-Host ""
        $Continue = Read-Host "Presiona Enter cuando hayas creado el repositorio en GitHub"
        
        # Configurar remote manualmente
        git remote add origin "https://github.com/$GitHubUser/$RepoName.git"
        $RemoteExists = $true
    }
}

# Push al repositorio
if ($RemoteExists) {
    Write-Host "📤 Subiendo código a GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host "✅ ¡Código subido exitosamente a GitHub!" -ForegroundColor Green
}

# Mostrar instrucciones finales
Write-Host ""
Write-Host "🎉 ¡Despliegue a GitHub completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. CONFIGURAR GITHUB PAGES:" -ForegroundColor White
Write-Host "   • Ve a: https://github.com/$GitHubUser/$RepoName/settings/pages" -ForegroundColor Cyan
Write-Host "   • Source: 'Deploy from a branch'" -ForegroundColor Cyan  
Write-Host "   • Branch: 'main' y carpeta '/frontend'" -ForegroundColor Cyan
Write-Host "   • Guarda los cambios" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. DEPLEGAR BACKEND EN RENDER:" -ForegroundColor White
Write-Host "   • Ve a: https://render.com" -ForegroundColor Cyan
Write-Host "   • Conecta tu repositorio GitHub" -ForegroundColor Cyan
Write-Host "   • Render detectará automáticamente la configuración" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. URLs FINALES:" -ForegroundColor White
Write-Host "   • Frontend: https://$GitHubUser.github.io/$RepoName" -ForegroundColor Cyan
Write-Host "   • Backend: https://[tu-app].onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 ¡Dante Chatbot está listo para producción!" -ForegroundColor Green