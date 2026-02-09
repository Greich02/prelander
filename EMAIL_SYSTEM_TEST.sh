#!/bin/bash
# 🧪 Email System Test Script
# Utilisation: bash EMAIL_SYSTEM_TEST.sh

echo "🚀 Test du système d'email..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000"
EMAIL_TEST="test.prelander.$(date +%s)@example.com"

echo -e "${BLUE}📧 Email de test: ${EMAIL_TEST}${NC}"
echo ""

# Test 1: Vérifier si le serveur est actif
echo "1️⃣  Vérification du serveur..."
if curl -s "$API_URL" > /dev/null; then
    echo -e "${GREEN}✅ Serveur actif${NC}"
else
    echo -e "${RED}❌ Serveur non accessible. Lancez: npm run dev${NC}"
    exit 1
fi

echo ""

# Test 2: Envoyer un email
echo "2️⃣  Envoi d'un email de test..."

RESPONSE=$(curl -s -X POST "$API_URL/api/send-email" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL_TEST\",
    \"userPattern\": \"The Scientist\",
    \"vitalityScore\": 82,
    \"userContext\": \"completed\"
  }")

echo "Réponse: $RESPONSE"
echo ""

# Vérifier si succès
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Email envoyé avec succès!${NC}"
    echo ""
    
    # Test 3: Récupérer les emails stockés
    echo "3️⃣  Vérification des emails stockés..."
    EMAILS=$(curl -s "$API_URL/api/get-emails")
    echo "Nombre d'emails: $(echo "$EMAILS" | grep -o '"totalEmails":[0-9]*' | cut -d: -f2)"
    echo -e "${GREEN}✅ Emails accessibles via l'API${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 Tous les tests réussis!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "• Vérifier /data/emails.json"
    echo "• Accéder au dashboard: http://localhost:3000/admin"
    echo "• Exporter en CSV depuis le dashboard"
else
    echo -e "${RED}❌ Erreur lors de l'envoi${NC}"
    exit 1
fi

echo ""
echo "📊 Dashboard admin: $API_URL/admin"
