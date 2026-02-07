# 🎯 QUICK START (5 MIN SETUP)

**Goal:** Activer le système de tracking + email capture  
**Time:** 5 minutes  
**Difficulty:** ⭐⭐ (Facile)

---

## STEP 1: Google Apps Script (2 min)

```
1. Va sur: https://script.google.com
2. "+ New project"
3. Copie ce code:

────────────────────────────────────────
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.email || '',
    data.userPattern || '',
    data.vitalityScore || 0,
    data.sessionId || '',
    data.userAgent || '',
    data.referrer || ''
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Email saved'
  })).setMimeType(ContentService.MimeType.JSON);
}
────────────────────────────────────────

4. Sauvegarde (Ctrl + S)
5. Deploy → New Deployment → Web app → Anyone
6. Copie l'URL obtenue
```

**Tu obtiens:** Une URL comme:
```
https://script.google.com/macros/d/abc123def456xyz.../useweb
```

---

## STEP 2: .env.local (1 min)

Crée un fichier `.env.local` à la racine de ton projet:

```bash
# File: c:\Users\user\Desktop\prelander\.env.local

NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/abc123def456xyz.../useweb
```

**⚠️ Important:** Remplace l'URL par celle de l'étape 1

---

## STEP 3: Redémarre (1 min)

```bash
# Ferme le serveur si déjà lancé (Ctrl + C)

# Relance
npm run dev

# Attends le message: ✓ Ready
```

---

## STEP 4: TEST (1 min)

```
1. Ouvre: http://localhost:3000
2. Complète le quiz rapidement
3. Ferme la page pour déclencher la popup
4. Rentre un email: test@example.com
5. Clique "Send"
6. Ouvre la console (F12)
7. Tu devrais voir: "✅ Email saved to Google Sheets"
8. Ouvre ton Google Sheet → Nouvelle ligne avec l'email!
```

---

## ✅ C'EST FAIT!

Ton système est maintenant actif:

✅ Tracking en temps réel  
✅ Email capture fonctionnelle  
✅ Google Sheets integration  
✅ Prêt pour la production  

---

## 📊 VOIR LES DONNÉES

### En Console (Maj + Maj)
Tous les événements s'affichent avec le préfixe `[Analytics]`

### Dans Google Sheet
Les emails arrivent automatiquement en temps réel

### Metrics clés:
```
Hero View Count
Quiz Start Rate
Quiz Completion Rate
Email Capture Rate
Average Vitality Score
User Patterns Distribution
```

---

## 🔍 SI QUELQUE CHOSE NE MARCHE PAS

### Email n'arrive pas?
```
1. Vérifie .env.local
2. Redémarre npm run dev
3. Regarde la Console pour les erreurs rouges
```

### Pas de logs en Console?
```
1. Recharge la page (F5)
2. Ouvre F12 → Console
3. Cherche "[Analytics]"
```

### Google Apps Script dit "Not Found"?
```
1. Vérifie l'URL dans .env.local
2. Copie-la exactement (pas d'espace)
3. Redémarre npm run dev
```

---

## 📈 PROCHAINES ÉTAPES

Après vérification que tout fonctionne:

1. **Lire:** `IMPLEMENTATION_SUMMARY.md` - Vue complète
2. **Tester:** `TEST_TRACKING.md` - Tests détaillés
3. **Analyser:** Google Sheets dashboard
4. **Optimiser:** A/B test des éléments

---

## 💡 PRO TIPS

**Voir tous les événements en Console:**
```javascript
// Dans console:
localStorage.getItem('analytics_events')
// Affiche tous les events loggés
```

**Tester le webhook manuellement:**
```javascript
// Dans console:
fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  body: JSON.stringify({
    email: 'test@test.com',
    userPattern: 'Test',
    vitalityScore: 50
  })
}).then(r => r.json()).then(d => console.log(d))
```

**Vider les données de test:**
```javascript
// Dans console:
localStorage.clear()
sessionStorage.clear()
// Puis recharge
```

---

## 🎯 RÉSULTAT FINAL

Après 5 minutes tu as:

✅ Système de tracking complet  
✅ Capture d'emails  
✅ Export en temps réel vers Google Sheets  
✅ Prêt à lancer les ads  
✅ Fondation pour optimization data-driven  

---

**Questions?** Voir les fichiers:
- `SETUP_INSTRUCTIONS.md` - Instructions détaillées
- `TEST_TRACKING.md` - Tests complets
- `IMPLEMENTATION_SUMMARY.md` - Vue d'ensemble technique

**C'est prêt!** 🚀
