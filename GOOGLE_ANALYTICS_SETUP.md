# 📊 Google Analytics Configuration Guide - Exit Popup Tracking

## 🎯 Objectif

Tracker tous les événements du popup de sortie (Exit Popup) dans Google Analytics pour mesurer:
- ✅ Quand le popup s'affiche
- ✅ Qui ferme sans remplir l'email
- ✅ Qui envoie leur email
- ✅ Taux de conversion

---

## 🚀 Setup Google Analytics (GA4)

### **Étape 1: Vérifier que GA4 est installé**

Dans votre `layout.js`, cherchez le code GA4:

```javascript
// Dans src/app/layout.js
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Si ce code **n'existe pas**:
1. Remplacez `G-XXXXXXXXXX` par votre ID Google Analytics
2. Ajoutez ce code dans le `<head>` de votre layout

---

### **Étape 2: Créer un événement personnalisé dans GA4**

Google Analytics reconnaît automatiquement le `window.gtag()` qu'on utilise,  
mais vous devez créer des **événements personnalisés** pour les tracker dans le dashboard.

**Accès:**
1. Allez sur [Google Analytics](https://analytics.google.com)
2. Sélectionnez votre propriété
3. Allez dans: **Admin** → **Custom Definitions** → **Custom Events**

---

## 📈 Événements à tracker

### **1. Popup Affichage**
```
Event Name: exit_popup_triggered
Paramètres:
  - trigger_type: "results_page_5s", "mouse_leave", "inactivity", etc.
  - time_on_page: (nombre de secondes)
  - user_context: "completed", "abandoned", "browsing"
  - page: "results", "home", etc.
```

**Quand?** Dès que le popup s'affiche

---

### **2. Popup Fermeture (sans email)**
```
Event Name: exit_popup_dismissed
Paramètres:
  - user_context: "completed", "abandoned", "browsing"
  - time_visible_sec: (nombre de secondes que le popup était visible)
  - popup_trigger: "close_button", "backdrop_click", etc.
```

**Quand?** Quand l'utilisateur clique sur X ou en dehors

---

### **3. Email Soumis (succès)**
```
Event Name: exit_popup_email_sent_success
Paramètres:
  - email: "jea***" (anonymisé)
  - user_pattern: "The Seeker", "The Scientist", etc.
  - vitality_score: 85 (de 0-100)
  - user_context: "completed"
  - popup_duration_sec: 25 (durée avant submission)
```

**Quand?** Quand l'email est envoyé avec succès

---

### **4. Email Erreur**
```
Event Name: exit_popup_email_sent_error
Paramètres:
  - error_message: "SMTP error", etc.
  - user_context: "completed"
```

**Quand?** Si l'envoi échoue

---

### **5. Exception Email**
```
Event Name: exit_popup_email_exception
Paramètres:
  - error: "Network error", etc.
  - user_context: "completed"
```

**Quand?** Si une exception se produit

---

## 🔧 Configuration dans GA4 Dashboard

### **Step 1: Aller à Events**
1. GA4 Dashboard
2. **Events** (dans le menu gauche)
3. Vous verrez tous les événements envoyés

### **Step 2: Créer un Custom Event si GA4 refuse**

Si vous ne voyez pas votre événement:

1. **Admin** → **Custom Definitions** → **Create Custom Event**
2. Entrez le **Event name** exactement:
   ```
   exit_popup_triggered
   exit_popup_dismissed
   exit_popup_email_sent_success
   exit_popup_email_sent_error
   exit_popup_email_exception
   ```
3. Cliquez "Create event"

### **Step 3: Ajouter des paramètres personnalisés**

Pour chaque paramètre (user_context, trigger_type, etc.):

1. **Admin** → **Custom Definitions** → **Create Custom Dimension**
2. Entrez le nom du paramètre:
   ```
   trigger_type
   time_on_page
   user_context
   page
   popup_duration_sec
   email
   user_pattern
   vitality_score
   error_message
   error
   ```
3. Scope: **Event**
4. Cliquez "Create"

---

## 📊 Dashboard & Rapports à créer

### **Dashboard 1: Exit Popup Performance**

**Créer un nouveau rapport:**
1. Google Analytics
2. **Exploration** (ou **Reports**)
3. **Create Report** → **Blank Report**
4. **Dimensions**: 
   - `trigger_type`
   - `user_context`
5. **Metrics**:
   - `Event count` (nombre de fois que le popup s'affiche)
   - `Conversion rate` (si vous créez une conversion)

**Résultat attendu:**
```
trigger_type       | user_context | Event Count
results_page_5s    | completed    | 145
mouse_leave        | browsing     | 89
inactivity         | abandoned    | 56
```

---

### **Dashboard 2: Email Conversion**

**Rapports à créer:**

1. **Taux de conversion (Email envoyé / Popup affiché)**
   ```
   (exit_popup_email_sent_success) / (exit_popup_triggered) × 100
   ```

2. **Taux d'abandon (Popup fermée sans email)**
   ```
   (exit_popup_dismissed) / (exit_popup_triggered) × 100
   ```

3. **Profils qui convertissent**
   ```
   Dimension: user_pattern
   Metric: exit_popup_email_sent_success
   Filter: user_context == "completed"
   ```

---

### **Dashboard 3: Vitality Score Analysis**

**Créer un rapport:**
```
Dimension: vitality_score (par range: 0-25, 26-50, 51-75, 76-100)
Metric: exit_popup_email_sent_success
```

**Question:** Quel score convertit le plus?

---

## 🔍 Déboguer le tracking

### **Tester si ga4 fonctionne:**

```javascript
// In browser console (F12)
window.gtag('event', 'test_event', {
  'test_param': 'test_value'
});
```

Vous devriez voir l'événement dans **Real-time** dans GA4.

### **Vérifier les événements en direct:**

1. GA4 Dashboard
2. **Realtime** (dans le menu)
3. Ouvrez le popup et soumettez un email
4. Vous devriez voir les événements s'afficher

---

## 📝 Conversion Setup (Optionnel)

Si vous voulez tracker "Email envoyé" comme **Conversion**:

1. **Admin** → **Conversions**
2. **Create Conversion**
3. Sélectionnez: `exit_popup_email_sent_success`
4. Nom: "Email Submission"
5. Save

**Résultat:**
- Vous verrez "Conversions" dans le rapport principal
- Meilleur pour l'attribution entre campagnes

---

## 📊 Requêtes Google Analytics utiles

### **Requête 1: Conversion Rate par Trigger**
```
SELECT
  trigger_type,
  COUNT(*) as popup_shown,
  SUM(IF(event_name = 'exit_popup_email_sent_success', 1, 0)) as emails_sent,
  ROUND(100 * SUM(IF(event_name = 'exit_popup_email_sent_success', 1, 0)) / COUNT(*), 2) as conversion_rate_pct
GROUP BY trigger_type
```

### **Requête 2: Top User Patterns**
```
SELECT
  user_pattern,
  COUNT(*) as conversions,
  AVG(CAST(vitality_score as INT64)) as avg_vitality
WHERE event_name = 'exit_popup_email_sent_success'
GROUP BY user_pattern
ORDER BY conversions DESC
```

---

## ✅ Checklist Setup

- [ ] GA4 est installé dans `layout.js`
- [ ] ID Google Analytics remplacé correctement
- [ ] Les événements s'affichent en **Real-time**
- [ ] Custom Events créés dans GA4 Admin
- [ ] Custom Dimensions créées pour les paramètres
- [ ] Dashboard "Exit Popup Performance" créé
- [ ] Dashboard "Email Conversion" créé
- [ ] Rapport "Vitality Score Analysis" créé
- [ ] Conversions définies (optionnel)

---

## 🎯 KPIs à suivre

```
1. Popup Display Rate = (popup affichages) / (visits)
2. Conversion Rate = (emails envoyés) / (popups affichées)
3. Abandonment Rate = (popups fermées) / (popups affichées)
4. Best Performer = user_pattern avec conversion_rate max
5. Best Trigger = trigger_type avec conversion_rate max
```

---

## 🔐 Note sur la Confidentialité

⚠️ Vous anonymisez l'email:
```javascript
email: email.split('@')[0].substring(0, 3) + '***'
// "jean@example.com" → "jea***"
```

Cela respecte la RGPD et les règles de confidentialité. ✅

---

## 🆘 Dépannage

| Problème | Solution |
|----------|----------|
| "Événements ne s'affichent pas" | Vérifier que GA4 ID est correct dans layout.js |
| "Real-time montre 0 événement" | Attendre 5-10 min après le trigger |
| "Paramètres ne s'affichent pas" | Créer Custom Dimensions |
| "Conversion n'apparaît pas" | Vérifier quelques minutes (latence GA4) |

---

## 📚 Resources

- [Google Analytics GA4 Docs](https://support.google.com/analytics/topic/9756039)
- [Custom Events in GA4](https://support.google.com/analytics/answer/9322258)
- [Custom Dimensions/Metrics](https://support.google.com/analytics/answer/10075209)

---

**Vous êtes maintenant prêt à tracker et optimiser votre popup!** 📊🚀
