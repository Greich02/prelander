# 🧪 Email System Test Script (PowerShell)
# Utilisation: .\EMAIL_SYSTEM_TEST.ps1

Write-Host "🚀 Test du système d'email..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:3000"
$EMAIL_TEST = "test.prelander.$(Get-Date -UFormat %s)@example.com"

Write-Host "📧 Email de test: $EMAIL_TEST" -ForegroundColor Blue
Write-Host ""

# Test 1: Vérifier si le serveur est actif
Write-Host "1️⃣  Vérification du serveur..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $API_URL -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Serveur actif" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur non accessible. Lancez: npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Envoyer un email
Write-Host "2️⃣  Envoi d'un email de test..." -ForegroundColor Cyan

$body = @{
    email = $EMAIL_TEST
    userPattern = "The Scientist"
    vitalityScore = 82
    userContext = "completed"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/send-email" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing

    $data = $response.Content | ConvertFrom-Json
    Write-Host "Réponse: $($response.Content)" -ForegroundColor Gray
    Write-Host ""
    
    if ($data.success) {
        Write-Host "✅ Email envoyé avec succès!" -ForegroundColor Green
        Write-Host ""
        
        # Test 3: Récupérer les emails stockés
        Write-Host "3️⃣  Vérification des emails stockés..." -ForegroundColor Cyan
        $emailsResponse = Invoke-WebRequest -Uri "$API_URL/api/get-emails" `
            -UseBasicParsing
        $emailsData = $emailsResponse.Content | ConvertFrom-Json
        
        Write-Host "Nombre d'emails: $($emailsData.totalEmails)" -ForegroundColor Gray
        Write-Host "✅ Emails accessibles via l'API" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎉 Tous les tests réussis!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Prochaines étapes:" -ForegroundColor Yellow
        Write-Host "• Vérifier /data/emails.json"
        Write-Host "• Accéder au dashboard: $API_URL/admin"
        Write-Host "• Exporter en CSV depuis le dashboard"
    } else {
        Write-Host "❌ Erreur lors de l'envoi" -ForegroundColor Red
        Write-Host $data.message
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors de l'invocation" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "📊 Dashboard admin: $API_URL/admin" -ForegroundColor Cyan
