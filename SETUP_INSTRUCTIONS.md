# 🚀 NEXT STEPS: METTRE EN MARCHE LE SYSTÈME

**Status:** ✅ Tracking & Email Capture Implémentés  
**Date:** Février 7, 2026  

---

## ⚡ 3 ÉTAPES POUR ACTIVIER LE SYSTÈME

### STEP 1: Configure Google Apps Script (5 min)

```
1. Va sur google.com
2. Crée un nouveau Google Sheet:
   - Nom: "Prelander Leads"
   
3. Crée un Google Apps Script:
   - Tools → Script Editor
   
4. Copie ce code:

───────────────────────────────────────
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  const row = [
    new Date(),
    data.email || '',
    data.userPattern || '',
    data.vitalityScore || 0,
    data.sessionId || '',
    data.userAgent || '',
    data.referrer || ''
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Email saved'
  })).setMimeType(ContentService.MimeType.JSON);
}
───────────────────────────────────────

5. Sauvegarde et Déploie:
   - Deploy → New Deployment
   - Type: Web app
   - Execute as: (ton email)
   - Who has access: Anyone
   
6. Copie l'URL de déploiement:
   - Ressemble à:
   https://script.google.com/macros/d/abc123def456.../useweb
```

### STEP 2: Configure .env.local (2 min)

```bash
# File: .env.local (à la racine du projet)

NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/abc123def456.../useweb
```

**Important:**
- Remplace `abc123def456...` par ton URL réelle
- Pas d'espace avant/après
- Sauvegarde le fichier

### STEP 3: Redémarre et Teste (3 min)

```bash
# Terminal
npm run dev

# Attends le message:
# ✓ Ready in 2.3s
```

**Teste maintenant:**
```
1. Ouvre http://localhost:3000
2. Complète le quiz
3. Ferme la page (pour déclencher exit popup)
4. Rentre un email test: test@example.com
5. Clique "Send"
6. Regarde le Google Sheet
7. Tu devrais voir une nouvelle ligne! ✅
```

---

## 🎯 FULL USER FLOW (à tester)

```
┌─────────────────────────────────────────┐
│ 1. User visite http://localhost:3000    │
│    Event: HERO_VIEW                     │
│    Console: ✅ [Analytics] Event: hero_view
└─────────────────────────────────────────┘
         │
         │ Clique "Start Assessment"
         ↓
┌─────────────────────────────────────────┐
│ 2. Quiz démarre                         │
│    Event: QUIZ_START                    │
│    Console: ✅ [Analytics] Event: quiz_start
└─────────────────────────────────────────┘
         │
         │ Répond Q1
         ↓
┌─────────────────────────────────────────┐
│ 3. Question 1 répondue                  │
│    Event: QUIZ_QUESTION_ANSWERED        │
│    Question: 0, Answer: "Deeply connected"
└─────────────────────────────────────────┘
         │
         │ Répond Q2, Q3, Q4
         ↓
┌─────────────────────────────────────────┐
│ 4. Question 5 répondue                  │
│    Event: QUIZ_QUESTION_ANSWERED        │
│    Quiz complété → Score calculé        │
└─────────────────────────────────────────┘
         │
         │ Redirection automatique
         ↓
┌─────────────────────────────────────────┐
│ 5. Résultats page chargée               │
│    Event: RESULTS_VIEW                  │
│    Score: 75, Pattern: "Awakening"      │
└─────────────────────────────────────────┘
         │
         │ Scroll et clique CTA
         ↓
┌─────────────────────────────────────────┐
│ 6. CTA cliqué                           │
│    Event: RESULTS_CTA_CLICK             │
│    Position: "final", Scroll: 85%       │
└─────────────────────────────────────────┘
         │
         │ Clique "Close" ou "Back"
         ↓
┌─────────────────────────────────────────┐
│ 7. Exit popup déclenché                 │
│    Event: EXIT_POPUP_SHOWN              │
│    Trigger: "beforeunload"              │
└─────────────────────────────────────────┘
         │
         │ Rentre email + clique Send
         ↓
┌─────────────────────────────────────────┐
│ 8. Email soumis                         │
│    Event: EXIT_POPUP_EMAIL_SUBMITTED    │
│    ✅ Envoyé à Google Sheets            │
│    Google Sheet updated: email reçu!    │
└─────────────────────────────────────────┘
         │
         │ Popup se ferme
         ↓
┌─────────────────────────────────────────┐
│ 9. Confirmation affichée (3 sec)        │
│    Event: EXIT_POPUP_DISMISSED          │
│    Données: email, score, pattern       │
└─────────────────────────────────────────┘
```

---

## 📊 VérificationS EN TEMPS RÉEL

### Console (Browser DevTools)

Ouvre F12 → Console et tu devrais voir:

```javascript
// Lors du chargement Hero
[Analytics] Event tracked: HERO_VIEW
{event: 'hero_view', device: 'desktop', timestamp: '2026-02-07T...'}

// Quand tu cliques Start
[Analytics] Event tracked: HERO_CTA_CLICK
{event: 'hero_cta_click', timeOnHero: 2543, spotsLeft: 46, ...}

// Quand tu reponds à chaque question
[Analytics] Event tracked: QUIZ_QUESTION_ANSWERED
{event: 'quiz_question_answered', questionIndex: 0, selectedValue: 4, ...}

// À la fin
[Analytics] Event tracked: QUIZ_COMPLETED
{event: 'quiz_completed', scorePercentage: 75, userPattern: 'The Awakening Guardian', ...}

// Sur Results page
[Analytics] Event tracked: RESULTS_VIEW
{event: 'results_view', vitalityScore: 75, userPattern: 'The Awakening Guardian', ...}

// Quand tu cliques CTA
[Analytics] Event tracked: RESULTS_CTA_CLICK
{event: 'results_cta_click', ctaPosition: 'final', timeOnResults: 10234, ...}

// Exit popup
[Analytics] Event tracked: EXIT_POPUP_SHOWN
{event: 'exit_popup_shown', trigger_type: 'beforeunload', ...}

[Analytics] Event tracked: EXIT_POPUP_EMAIL_SUBMITTED
{event: 'exit_popup_email_submitted', email: 'test@example.com', ...}

✅ Email saved to Google Sheets
```

### Google Sheet

Ouvre ton Google Sheet et tu devrais voir:

```
Timestamp           | Email              | Pattern              | Score | SessionID
2026-02-07 10:30:55 | test@example.com  | The Awakening Guard. | 75    | session_1707...
```

---

## 🔧 TROUBLESHOOTING

### ❌ "Email n'arrive pas dans Google Sheets"

**Solution 1: Vérifier le webhook URL**
```bash
# .env.local
# Copie-colle la URL exactement comme donnée par Google

# Pas bon: https://script.google.com/... (avec espace)
# Bon:    https://script.google.com/...
```

**Solution 2: Redémarrer le serveur**
```bash
# Ferme npm run dev
Ctrl + C

# Redémarre
npm run dev
```

**Solution 3: Tester manuellement le webhook**
```javascript
// Dans Console du navigateur:
fetch('https://script.google.com/macros/d/YOUR_ID/useweb', {
  method: 'POST',
  body: JSON.stringify({
    email: 'test@test.com',
    userPattern: 'Test',
    vitalityScore: 50
  })
}).then(r => r.json()).then(d => console.log(d))

// Devrait retourner: {success: true, message: 'Email saved'}
```

### ❌ "Je ne vois pas les événements en Console"

**Solution:**
```javascript
// Cherche les logs avec filter:
// En haut de la Console, cherche: [Analytics]

// Ou tapez dans Console:
console.log('Test')  // Tu devrais voir ce message

// Si rien n'apparaît:
// 1. Recharge F5
// 2. Regarde pour les erreurs rouges
// 3. Vérifie que analytics.js existe: src/app/utils/analytics.js
```

### ❌ "Google Apps Script dit 'Not Found'"

**Solution:**
```
1. Va sur script.google.com
2. Trouve le script "Prelander"
3. Redéploie:
   - Deploy → Manage deployments
   - Clique sur l'URL du Web app
   - Copie le lien complet
   - Colle dans .env.local
```

---

## 📈 QUOI VÉRIFIER EN PRIORITÉ

### Week 1 Metrics

```
Jour 1:
□ Hero View Count: 10+
□ Quiz Start Rate: > 30%
□ Quiz Completion Rate: > 80%
□ Average Quiz Duration: 1-3 min
□ Pattern Distribution: See all 3 types
□ Email Capture: > 5 emails

Jour 2-3:
□ Score Distribution: 0-100 range
□ CTA Click Rate: > 30%
□ Exit Popup Show Rate: > 80%
□ Exit Popup Email Rate: > 10%

Jour 4-7:
□ Daily Trends: Consistent?
□ Drop-off points: Identifiés?
□ Best performing CTA: Position?
□ Email pattern: Awakening > Disconnected?
```

---

## 💡 INSIGHTS À CHERCHER

Une fois que tu as des données:

### Pattern Analysis
```
Q: Lequel pattern convertit le plus?
A: Vérifie dans Google Sheets:
   Pattern A: 10 emails / 30 views = 33% conversion
   Pattern B: 8 emails / 35 views = 23% conversion
   Pattern C: 7 emails / 25 views = 28% conversion
   
   → Pattern A convertit le plus!
   → Crée plus de contenu pour Pattern A
```

### Dropoff Analysis
```
Q: Où les gens abandonnent?
A: Vérifie les QUIZ_ABANDONED events:
   Q1 → Q2: 95% completion
   Q2 → Q3: 92% completion ← 8% dropoff
   Q3 → Q4: 88% completion
   Q4 → Q5: 85% completion
   
   → Q3 a un problème!
   → Réécris Q3 pour plus de clarté
```

### CTA Performance
```
Q: Quel CTA position performe le mieux?
A: Vérifie RESULTS_CTA_CLICK events:
   after_revelation: 15 clicks
   after_compounds: 22 clicks ← Winner!
   after_testimonials: 18 clicks
   final: 25 clicks ← Best!
   
   → Final CTA is best
   → Move final CTA higher (test)
```

---

## 🎯 PROCHAINES ÉTAPES (APRÈS TESTS)

### Cette semaine:
```
□ Collecte 50+ entrées de données
□ Analyse les patterns de conversion
□ Identifie les points faibles
□ A/B teste un changement mineur
```

### Semaine prochaine:
```
□ Crée un dashboard Google Sheets avec graphiques
□ Mets en place des alertes (nouvelle lead)
□ A/B teste les headlines
□ A/B teste les CTA buttons
```

### Mois 2:
```
□ Intègre avec ton système d'emailing
□ Crée une landing page de "Thank you"
□ Lance les ads (Facebook, Google, etc.)
□ Optimise la ROI des ads
```

---

## 📞 Support Rapide

Si tu as des problèmes:

1. **Consulte d'abord:** `TEST_TRACKING.md`
2. **Puis:** `IMPLEMENTATION_SUMMARY.md`
3. **Puis:** `docs/QUICK_START.md`
4. **Puis:** `docs/GOOGLE_SHEETS_SETUP.js`

---

## ✅ FINAL CHECKLIST

Avant d'utiliser en production:

- [ ] Google Apps Script créé & déployé
- [ ] Webhook URL copiée dans .env.local
- [ ] npm run dev redémarré
- [ ] Test complet du flow réussi
- [ ] Email reçu dans Google Sheet
- [ ] Console logs vérifiés
- [ ] Pas d'erreurs rouges

---

## 🎉 TU ES PRÊT!

**Maintenant tu as:**
✅ Tracking complet du funnel
✅ Capture d'emails automatique
✅ Export vers Google Sheets
✅ Session management
✅ Performance metrics
✅ Conversion analytics

**Prochaine étape:** Exécute les 3 étapes ci-dessus et teste! 🚀

---

**Questions?** Consulte la documentation ou les fichiers de test.
