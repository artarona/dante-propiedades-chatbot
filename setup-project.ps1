# Script de configuración rápida para Dante Chatbot en PowerShell
# Ejecutar: .\setup-project.ps1

Write-Host "🏠 Configurando Dante Chatbot..." -ForegroundColor Cyan

# Crear estructura de directorios
$Directories = @(
    "backend",
    "frontend/assets/css", 
    "frontend/assets/js",
    "frontend/assets/images",
    ".github/workflows"
)

foreach ($Dir in $Directories) {
    if (-not (Test-Path $Dir)) {
        New-Item -Path $Dir -ItemType Directory -Force | Out-Null
        Write-Host "✅ Creado directorio: $Dir" -ForegroundColor Green
    }
}

# Crear app.py básico si no existe
if (-not (Test-Path "backend/app.py")) {
    $AppContent = @'
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "🚀 Dante Chatbot Backend Running"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "dante-chatbot"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
'@
    Set-Content -Path "backend/app.py" -Value $AppContent
    Write-Host "✅ Creado: backend/app.py" -ForegroundColor Green
}

# Crear frontend básico si no existe  
if (-not (Test-Path "frontend/index.html")) {
    $FrontendContent = @'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dante Chatbot</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        code {
            background: rgba(0,0,0,0.3);
            padding: 5px 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏠 Dante Propiedades</h1>
        <p>Chatbot Inmobiliario Inteligente</p>
        <p>🚀 Frontend listo para GitHub Pages</p>
        <p>Ejecuta <code>.\deploy-to-github.ps1</code> para desplegar</p>
    </div>
</body>
</html>
'@
    Set-Content -Path "frontend/index.html" -Value $FrontendContent
    Write-Host "✅ Creado: frontend/index.html" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Estructura del proyecto creada" -ForegroundColor Green
Write-Host ""

# Mostrar estructura
Write-Host "📁 Estructura actual:" -ForegroundColor Cyan
Get-ChildItem -Recurse -File | Where-Object { 
    $_.Name -like "*.py" -or $_.Name -like "*.html" -or $_.Name -like "*.ps1" -or $_.Name -like "*.md" -or $_.Name -like "*.txt" -or $_.Name -like "*.yaml" -or $_.Name -like "*.yml" 
} | Select-Object -First 20 Name, Directory | Format-Table -AutoSize

Write-Host ""
Write-Host "📝 Ahora ejecuta: .\deploy-to-github.ps1" -ForegroundColor Yellow
Write-Host "   para desplegar automáticamente a GitHub" -ForegroundColor Yellow