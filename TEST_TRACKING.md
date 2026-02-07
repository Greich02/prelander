# 🧪 TEST: TRACKING & EMAIL CAPTURE IMPLÉMENTÉ

**Date:** Février 7, 2026  
**Status:** ✅ IMPLÉMENTATION COMPLÈTE  

---

## 📋 Vue d'ensemble

Le système de tracking complet et la capture d'emails vers Google Sheets ont été implémentés sur tous les composants clés.

### ✅ Fichiers modifiés:
- `Hero.js` - Tracking HERO_VIEW + HERO_CTA_CLICK
- `QuizStepper.js` - Tracking QUIZ_START, QUIZ_QUESTION_ANSWERED, QUIZ_COMPLETED, QUIZ_ABANDONED
- `Results.js` - Tracking RESULTS_VIEW + RESULTS_CTA_CLICK avec scroll depth
- `bridge/page.js` - Tracking BRIDGE_VIEW + BRIDGE_CTA_CLICK
- `ExitPopup.js` - ✅ Déjà intégré: EMAIL_SUBMITTED → Google Sheets

---

## 🚀 COMMENT TESTER

### Test 1: Tracking HERO_VIEW

```
1. Ouvre le navigateur DevTools (F12)
2. Va dans Console
3. Visite http://localhost:3000
4. Recherche les logs: "HERO_VIEW"
5. Tu devrais voir:
   ✅ analytics.track("hero_view", {...})
   ✅ device: "desktop" ou "mobile"
   ✅ Timestamp
```

**Résultat attendu:**
```javascript
{
  event: "hero_view",
  device: "desktop",
  source: null,
  timestamp: "2026-02-07T10:30:00.000Z"
}
```

---

### Test 2: Tracking HERO_CTA_CLICK

```
1. Reste sur la page Hero
2. Clique sur le bouton "Start Your Assessment Now"
3. Regarde la Console
4. Cherche: "HERO_CTA_CLICK"
5. Tu devrais voir:
   ✅ timeOnHero: ~2000 (ms)
   ✅ spotsLeft: 47 (ou moins)
   ✅ timerRemaining: ~900 (secondes)
```

**Résultat attendu:**
```javascript
{
  event: "hero_cta_click",
  timeOnHero: 2543,
  spotsLeft: 46,
  timerRemaining: 898
}
```

---

### Test 3: Tracking QUIZ_START

```
1. Le quiz démarre automatiquement après le CTA Hero
2. Ouvre Console
3. Cherche: "QUIZ_START"
4. Tu devrais voir:
   ✅ autoStart: true
   ✅ timestamp: "2026-02-07T10:30:03.000Z"
```

**Résultat attendu:**
```javascript
{
  event: "quiz_start",
  autoStart: true,
  timestamp: "2026-02-07T10:30:03.000Z"
}
```

---

### Test 4: Tracking QUIZ_QUESTION_ANSWERED (x5)

```
1. Réponds à chaque question du quiz
2. Ouvre Console
3. Pour chaque réponse, cherche: "QUIZ_QUESTION_ANSWERED"
4. Tu devrais voir 5 événements (un par question)
```

**Résultat attendu (pour question 1):**
```javascript
{
  event: "quiz_question_answered",
  questionIndex: 0,
  selectedAnswer: "Deeply connected and energized",
  selectedValue: 4,
  timeSpentOnQuestion: 3000
}
```

**Pour question 2:**
```javascript
{
  event: "quiz_question_answered",
  questionIndex: 1,
  selectedAnswer: "Sometimes - I notice the gap",
  selectedValue: 3,
  timeSpentOnQuestion: 5200
}
```

Et ainsi de suite...

---

### Test 5: Tracking QUIZ_COMPLETED

```
1. Après répondre à la 5e question, le quiz envoie QUIZ_COMPLETED
2. Ouvre Console
3. Cherche: "QUIZ_COMPLETED"
4. Tu devrais voir:
   ✅ totalScore: 15 (exemple)
   ✅ scorePercentage: 75
   ✅ userPattern: "The Awakening Guardian"
   ✅ quizDuration: 25000 (ms)
   ✅ questionsAnswered: 5
```

**Résultat attendu:**
```javascript
{
  event: "quiz_completed",
  totalScore: 15,
  scorePercentage: 75,
  userPattern: "The Awakening Guardian",
  quizDuration: 25432,
  questionsAnswered: 5
}
```

---

### Test 6: Tracking RESULTS_VIEW

```
1. Après le quiz, tu es redirigé vers /results
2. Ouvre Console
3. Cherche: "RESULTS_VIEW"
4. Tu devrais voir:
   ✅ vitalityScore: 75
   ✅ userPattern: "The Awakening Guardian"
   ✅ timestamp: "2026-02-07T10:30:30.000Z"
```

**Résultat attendu:**
```javascript
{
  event: "results_view",
  vitalityScore: 75,
  userPattern: "The Awakening Guardian",
  timestamp: "2026-02-07T10:30:30.000Z"
}
```

---

### Test 7: Tracking RESULTS_CTA_CLICK

```
1. Sur la page Results, clique sur un bouton CTA
   - "See the Solution That Reverses This" (after_revelation)
   - "Get These 9 Compounds Now" (after_compounds)
   - "Start My Decalcification Journey" (after_testimonials)
   - "ACCESS MY PERSONALIZED GENESIS REVIVAL SUPPLY" (final)
2. Ouvre Console
3. Cherche: "RESULTS_CTA_CLICK"
4. Tu devrais voir:
   ✅ ctaPosition: "after_revelation" (ou autre)
   ✅ vitalityScore: 75
   ✅ userPattern: "The Awakening Guardian"
   ✅ timeOnResults: ~10000 (ms)
   ✅ scrollDepth: 45 (%)
```

**Résultat attendu:**
```javascript
{
  event: "results_cta_click",
  ctaPosition: "after_revelation",
  vitalityScore: 75,
  userPattern: "The Awakening Guardian",
  timeOnResults: 10234,
  scrollDepth: 45
}
```

---

### Test 8: Tracking BRIDGE_VIEW

```
1. Note: Bridge est sur une URL différente (/bridge)
2. Pour tester, il faut un lien depuis Results vers Bridge
3. Pour le moment, va directement à http://localhost:3000/bridge
4. Ouvre Console
5. Cherche: "BRIDGE_VIEW"
6. Tu devrais voir:
   ✅ referrer: "results_page"
   ✅ timestamp: "2026-02-07T10:30:45.000Z"
```

**Résultat attendu:**
```javascript
{
  event: "bridge_view",
  referrer: "results_page",
  timestamp: "2026-02-07T10:30:45.000Z"
}
```

---

### Test 9: Tracking BRIDGE_CTA_CLICK

```
1. Sur la page Bridge, clique sur le CTA "Check Out The VSL"
2. Ouvre Console
3. Cherche: "BRIDGE_CTA_CLICK"
4. Tu devrais voir:
   ✅ timeOnBridge: ~8000 (ms)
   ✅ scrollDepth: 60 (%)
   ✅ timestamp: "2026-02-07T10:30:50.000Z"
```

**Résultat attendu:**
```javascript
{
  event: "bridge_cta_click",
  timeOnBridge: 8234,
  scrollDepth: 60,
  timestamp: "2026-02-07T10:30:50.000Z"
}
```

---

### Test 10: Email Capture & Google Sheets Integration

```
⚠️  IMPORTANT: Requiert configuration Google Apps Script

1. CONFIGURE Google Apps Script (voir QUICK_START.md):
   - Crée un Google Sheet
   - Crée un Google Apps Script
   - Déploie comme Web App (Anyone access)
   - Copie l'URL de déploiement

2. CONFIGURE .env.local:
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/YOUR_ID/useweb

3. REDÉMARRE le serveur:
   npm run dev

4. TESTE la capture d'emails:
   a) Ouvre la page
   b) Clique sur le bouton "Close" de la page (pas le X)
      OU utilise "Back" button
      OU change de tab
   c) La popup d'exit devrait apparaître
   d) Rentre une adresse email test: test@example.com
   e) Clique "Send"
   f) Tu devrais voir:
      ✅ "Email saved to Google Sheets" dans Console
      ✅ Confirmation pendant 3 secondes

5. VÉRIFIE le Google Sheet:
   a) Ouvre ton Google Sheet
   b) Cherche une nouvelle ligne avec:
      - Timestamp: 2026-02-07 10:30:55
      - Email: test@example.com
      - Pattern: "The Awakening Guardian"
      - Score: 75
      - SessionID: session_1707294655000_abc123...
      - UserAgent: Mozilla/5.0...
```

**Résultat attendu dans Google Sheets:**
```
Timestamp              | Email            | Pattern                    | Score | SessionID          | UserAgent
2026-02-07 10:30:55  | test@example.com | The Awakening Guardian     | 75    | session_1707...    | Mozilla...
```

---

### Test 11: Exit Popup Tracking

```
1. Déclenche la popup d'exit (close tab, back button, etc.)
2. Ouvre Console
3. Cherche:
   ✅ "EXIT_POPUP_SHOWN" - Quand popup apparaît
   ✅ "EXIT_POPUP_EMAIL_SUBMITTED" - Quand email envoyé
   ✅ "EXIT_POPUP_DISMISSED" - Quand popup fermée

4. Tu devrais voir 3 événements distincts
```

**Résultats attendus:**
```javascript
// Event 1
{
  event: "exit_popup_shown",
  triggerType: "beforeunload",
  timeOnPage: 45,
  userContext: "browsing"
}

// Event 2 (si email soumis)
{
  event: "exit_popup_email_submitted",
  email: "test@example.com",
  userContext: "browsing"
}

// Event 3 (si popup fermée)
{
  event: "exit_popup_dismissed",
  userContext: "browsing",
  timeVisible: 25
}
```

---

## 📊 VÉRIFIER DANS LA CONSOLE

Chaque événement s'affiche en Console comme:
```
[Analytics] Event tracked: HERO_VIEW
{
  event: "hero_view",
  device: "desktop",
  source: null,
  timestamp: "2026-02-07T10:30:00.000Z",
  sessionId: "session_1707294600000_k9h2j",
  url: "http://localhost:3000/"
}
```

### Chercher les logs:
```javascript
// Dans Console:
// 1. Filtre par [Analytics]
// 2. Ou cherche "Event tracked:"
// 3. Ou cherche le nom de l'événement spécifique
```

---

## ✅ CHECKLIST DE SUCCÈS

Marque les tests réussis:

- [ ] Test 1: HERO_VIEW apparaît
- [ ] Test 2: HERO_CTA_CLICK apparaît avec données
- [ ] Test 3: QUIZ_START apparaît
- [ ] Test 4: QUIZ_QUESTION_ANSWERED (5 événements)
- [ ] Test 5: QUIZ_COMPLETED avec scores
- [ ] Test 6: RESULTS_VIEW apparaît
- [ ] Test 7: RESULTS_CTA_CLICK apparaît
- [ ] Test 8: BRIDGE_VIEW apparaît
- [ ] Test 9: BRIDGE_CTA_CLICK apparaît
- [ ] Test 10: Email arrive dans Google Sheets ⭐
- [ ] Test 11: Exit popup tracking fonctionne

---

## 🐛 TROUBLESHOOTING

### "Je ne vois pas les événements en Console"
```
1. Ouvre DevTools: F12
2. Va dans "Console" tab
3. Recharge la page: F5
4. Attends quelques secondes
5. Regarde pour "[Analytics]" logs
6. Si rien: cherche les erreurs rouges en Console
```

### "Google Sheets ne reçoit pas les emails"
```
1. Vérifie .env.local:
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=...
   
2. Redémarre le serveur:
   npm run dev
   
3. Copie l'URL webhook correctement (sans espace)

4. Teste l'URL webhook directement:
   - Ouvre Postman ou curl
   - POST à l'URL avec body:
     {"email": "test@test.com", "score": 75}
   
5. Regarde les logs Google Apps Script:
   - Tools → Script Editor
   - Execution log
```

### "Les événements ne s'envoient pas au backend"
```
Ceci est NORMAL pour la première phase.
Les événements sont actuellement:
1. Loggés en Console ✅
2. Sauvegardés en sessionStorage ✅
3. Envoyés à Google Sheets (ExitPopup) ✅
4. Pas encore envoyés au backend (optional)

Pour l'étape backend, voir docs/TRACKING_PLAN.md
```

---

## 📈 PROCHAINES ÉTAPES

### Phase 1 (Immédiat): ✅ TERMIN\u00c9
- Tracker tous les événements en Console
- Capturer les emails en Google Sheets
- Envoyer vers Google Sheets au départ

### Phase 2 (This Week):
- Créer dashboard Google Sheets avec formules
- Analyser les patterns de conversion
- A/B test le copy/design

### Phase 3 (Next Week):
- Ajouter backend API pour events forwarding
- Créer notifications temps-réel
- Alertes pour nouvelles leads

---

## 🎯 KEY METRICS À TRACKER

Une fois implémenté, tu peux mesurer:

| Métrique | Cible | Formule |
|----------|-------|---------|
| Quiz Start Rate | > 25% | COUNTIF(BRIDGE_VIEW, QUIZ_START) / COUNTIF(HERO_VIEW) |
| Quiz Completion | > 85% | COUNTIF(QUIZ_COMPLETED) / COUNTIF(QUIZ_START) |
| Avg Time Quiz | 1-3 min | AVERAGE(QUIZ_COMPLETED.quizDuration) / 1000 |
| Results View | 90%+ | COUNTIF(RESULTS_VIEW) / COUNTIF(QUIZ_COMPLETED) |
| Email Capture | > 15% | COUNTIF(EXIT_POPUP_EMAIL_SUBMITTED) / COUNTIF(EXIT_POPUP_SHOWN) |
| Avg Vitality Score | 55-75 | AVERAGE(RESULTS_VIEW.vitalityScore) |
| By Pattern %: Disconnected | 20-30% | COUNTIF(userPattern="Disconnected") / COUNTA(userPattern) |
| By Pattern %: Fluctuating | 30-40% | COUNTIF(userPattern="Fluctuating") / COUNTA(userPattern) |
| By Pattern %: Awakening | 30-40% | COUNTIF(userPattern="Awakening") / COUNTA(userPattern) |

---

**FÉLICITATIONS!** 🎉

Tu as maintenant:
✅ Tracking complet du funnel (Hero → Quiz → Results → Bridge)
✅ Capture d'emails fonctionnelle
✅ Système de logging avec session IDs
✅ Export vers Google Sheets
✅ Fondation pour data-driven optimization

Prochaine étape: **Configure Google Apps Script et teste la capture d'emails!**
